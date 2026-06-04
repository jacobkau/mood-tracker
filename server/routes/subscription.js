const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        description: 'Perfect for getting started with mood tracking',
        features: [
          'Basic mood tracking',
          '7-day history',
          'Standard charts',
          'Email support',
          'Basic analytics'
        ],
        popular: false,
        maxMoodEntries: 50,
        maxNotesLength: 100,
        period: 'month'
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 4.99,
        period: 'month',
        description: 'For those who want deeper insights',
        features: [
          'Unlimited mood tracking',
          '90-day history',
          'Advanced analytics',
          'Custom reminders',
          'Data export',
          'Priority support',
          'Trend analysis'
        ],
        popular: true,
        maxMoodEntries: Infinity,
        maxNotesLength: 500
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 49.99,
        period: 'year',
        description: 'Best value for committed users',
        features: [
          'Everything in Pro',
          '365-day history',
          'Trend predictions',
          'Personalized insights',
          'Therapist sharing',
          '24/7 support',
          'Custom reports',
          'Advanced patterns'
        ],
        popular: false,
        maxMoodEntries: Infinity,
        maxNotesLength: 1000
      }
    ];
    
    res.json({ success: true, plans });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscription plans' 
    });
  }
});

// Get user's subscription status
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('subscription username email');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Initialize subscription if it doesn't exist
    if (!user.subscription) {
      user.subscription = {
        plan: 'free',
        status: 'active',
        currentPeriodStart: new Date()
      };
      await user.save();
    }
    
    console.log(`Subscription status for ${user.email}:`, user.subscription);
    
    res.json({ 
      success: true, 
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscription status' 
    });
  }
});

// Subscribe to a plan - COMPLETELY REWRITTEN with better logging
router.post('/subscribe', protect, async (req, res) => {
  try {
    let { planId } = req.body;
    
    console.log('========================================');
    console.log('SUBSCRIPTION REQUEST RECEIVED');
    console.log('User ID:', req.user.id);
    console.log('Requested planId:', planId);
    console.log('Type of planId:', typeof planId);
    
    // Normalize the plan ID
    let normalizedPlanId = String(planId).toLowerCase().trim();
    
    // Map various plan identifiers to standard ones
    const planMapping = {
      'free': 'free',
      'pro': 'pro',
      'premium': 'premium',
      'basic': 'free',
      'professional': 'pro',
      'enterprise': 'premium',
      'standard': 'pro',
      'plus': 'pro',
      'ultimate': 'premium'
    };
    
    // Check if it's a MongoDB ObjectId
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(normalizedPlanId);
    
    if (isMongoId) {
      console.log('Detected MongoDB ObjectId');
      try {
        const PricingPlan = require('../models/Pricing');
        const plan = await PricingPlan.findById(normalizedPlanId);
        
        if (plan) {
          const planName = plan.name.toLowerCase();
          normalizedPlanId = planMapping[planName] || planName;
          console.log(`Mapped MongoDB ID to plan name: ${normalizedPlanId}`);
        } else {
          console.log('Plan not found in database, using default');
          normalizedPlanId = 'free';
        }
      } catch (error) {
        console.error('Error looking up plan:', error);
        normalizedPlanId = 'free';
      }
    } else if (planMapping[normalizedPlanId]) {
      normalizedPlanId = planMapping[normalizedPlanId];
      console.log(`Mapped plan ID to: ${normalizedPlanId}`);
    }
    
    // Validate final plan ID
    const validPlans = ['free', 'pro', 'premium'];
    if (!validPlans.includes(normalizedPlanId)) {
      console.log(`Invalid plan ID: ${normalizedPlanId}, defaulting to free`);
      normalizedPlanId = 'free';
    }
    
    console.log('Final plan ID to save:', normalizedPlanId);
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    console.log('Current user subscription before update:', user.subscription);
    
    // Calculate dates
    const now = new Date();
    const periodDays = normalizedPlanId === 'premium' ? 365 : 30;
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + periodDays);
    
    // Update subscription
    user.subscription = {
      plan: normalizedPlanId,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelledAt: null,
      updatedAt: now
    };
    
    // Save user
    await user.save();
    
    console.log('User subscription AFTER update:', user.subscription);
    console.log(`✅ SUCCESS: User ${user.email} subscribed to ${normalizedPlanId} plan`);
    console.log('========================================');
    
    // Return success
    res.json({ 
      success: true,
      message: `Successfully subscribed to ${normalizedPlanId} plan`,
      subscription: user.subscription,
      plan: normalizedPlanId
    });
    
  } catch (error) {
    console.error('❌ Subscribe error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process subscription: ' + error.message
    });
  }
});

// Test endpoint to directly update subscription (for debugging)
router.post('/test-update', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ['free', 'pro', 'premium'];
    
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const user = await User.findById(req.user.id);
    const now = new Date();
    const periodDays = plan === 'premium' ? 365 : 30;
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + periodDays);
    
    user.subscription = {
      plan: plan,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd
    };
    
    await user.save();
    
    res.json({ 
      success: true, 
      message: `Subscription updated to ${plan}`,
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    if (!user.subscription || user.subscription.plan === 'free') {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot cancel free plan' 
      });
    }
    
    user.subscription.status = 'cancelled';
    user.subscription.cancelledAt = new Date();
    
    await user.save();
    
    console.log(`User ${user.email} cancelled ${user.subscription.plan} plan`);
    
    res.json({ 
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to cancel subscription' 
    });
  }
});
// Add to subscribe.js for debugging
router.get('/debug/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      email: user.email,
      subscription: user.subscription,
      hasSubscriptionField: user.subscription !== undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user has access to a feature
router.get('/check-feature/:feature', protect, async (req, res) => {
  try {
    const { feature } = req.params;
    const user = await User.findById(req.user.id);
    
    const featureLimits = {
      maxMoodEntries: {
        free: 50,
        pro: Infinity,
        premium: Infinity
      },
      maxNotesLength: {
        free: 100,
        pro: 500,
        premium: 1000
      },
      dataExport: {
        free: false,
        pro: true,
        premium: true
      },
      customReminders: {
        free: false,
        pro: true,
        premium: true
      },
      advancedAnalytics: {
        free: false,
        pro: true,
        premium: true
      }
    };
    
    const plan = user.subscription?.plan || 'free';
    const hasAccess = featureLimits[feature]?.[plan] || false;
    
    res.json({ 
      success: true,
      hasAccess,
      plan,
      limit: featureLimits[feature]?.[plan]
    });
  } catch (error) {
    console.error('Check feature error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check feature access' 
    });
  }
});

module.exports = router;
