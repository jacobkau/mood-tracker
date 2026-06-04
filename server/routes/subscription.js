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

// Subscribe to a plan - COMPLETELY REWRITTEN
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    
    console.log('=== SUBSCRIPTION REQUEST ===');
    console.log('User ID:', req.user.id);
    console.log('Requested planId:', planId);
    
    // Validate planId
    const validPlans = ['free', 'pro', 'premium'];
    let selectedPlan = planId;
    
    // If it's a MongoDB ObjectId, map it to plan name
    if (planId && /^[0-9a-fA-F]{24}$/.test(planId)) {
      const planMapping = {
        // You'll need to add your actual MongoDB IDs here
        // '64f5a1b2c3d4e5f6a7b8c9d0': 'free',
        // '64f5a1b2c3d4e5f6a7b8c9d1': 'pro',
        // '64f5a1b2c3d4e5f6a7b8c9d2': 'premium'
      };
      selectedPlan = planMapping[planId] || 'free';
      console.log('Mapped MongoDB ID to plan:', selectedPlan);
    }
    
    // Validate plan
    if (!validPlans.includes(selectedPlan)) {
      return res.status(400).json({ 
        success: false,
        error: `Invalid plan. Valid plans are: ${validPlans.join(', ')}` 
      });
    }
    
    // Find user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Calculate subscription dates
    const now = new Date();
    const periodDays = selectedPlan === 'premium' ? 365 : 30;
    const periodEnd = new Date(now);
    periodEnd.setDate(periodEnd.getDate() + periodDays);
    
    // Update subscription
    user.subscription = {
      plan: selectedPlan,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      cancelledAt: null
    };
    
    // Save user
    await user.save();
    
    console.log(`✅ User ${user.email} subscribed to ${selectedPlan} plan`);
    console.log('Subscription data saved:', user.subscription);
    
    // Return updated subscription
    res.json({ 
      success: true,
      message: `Successfully subscribed to ${selectedPlan} plan`,
      subscription: user.subscription
    });
    
  } catch (error) {
    console.error('❌ Subscribe error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process subscription: ' + error.message
    });
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
