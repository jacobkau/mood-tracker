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
    
    // Ensure subscription exists
    if (!user.subscription) {
      user.subscription = {
        plan: 'free',
        status: 'active',
        currentPeriodStart: new Date()
      };
      await user.save();
    }
    
    console.log('User subscription:', user.subscription);
    
    res.json({ 
      success: true, 
      subscription: user.subscription,
      user: {
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch subscription status' 
    });
  }
});

// Subscribe to a plan - FIXED
router.post('/subscribe', protect, async (req, res) => {
  try {
    let { planId } = req.body;
    
    console.log('Received planId:', planId);
    console.log('User ID:', req.user.id);
    
    // Define valid plans and their configurations
    const validPlans = {
      'free': { plan: 'free', status: 'active' },
      'pro': { plan: 'pro', status: 'active' },
      'premium': { plan: 'premium', status: 'active' }
    };
    
    // Map plan names to IDs
    const planMapping = {
      'free': 'free',
      'pro': 'pro', 
      'premium': 'premium',
      'basic': 'free',
      'professional': 'pro',
      'enterprise': 'premium'
    };
    
    // Check if the planId is a MongoDB ObjectId (24 hex chars)
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(planId);
    
    let mappedPlanId = planId;
    
    if (isMongoId) {
      try {
        // If it's a MongoDB ID, look up the plan
        const PricingPlan = require('../models/Pricing');
        const plan = await PricingPlan.findById(planId);
        
        if (!plan) {
          return res.status(400).json({ 
            success: false,
            error: 'Invalid plan ID - Plan not found in database' 
          });
        }
        
        // Map the plan name to the expected ID
        const planName = plan.name.toLowerCase();
        mappedPlanId = planMapping[planName] || planName;
      } catch (error) {
        console.error('Error looking up plan:', error);
        return res.status(400).json({ 
          success: false,
          error: 'Invalid plan ID' 
        });
      }
    } else {
      // Try direct mapping
      mappedPlanId = planMapping[planId] || planId;
    }
    
    console.log('Mapped planId:', mappedPlanId);
    
    // Check if the plan is valid
    if (!validPlans[mappedPlanId]) {
      return res.status(400).json({ 
        success: false,
        error: `Invalid plan ID: ${planId}. Valid plans are: free, pro, premium` 
      });
    }
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }
    
    // Calculate period end date
    const periodDays = mappedPlanId === 'premium' ? 365 : 30;
    const currentPeriodEnd = new Date();
    currentPeriodEnd.setDate(currentPeriodEnd.getDate() + periodDays);
    
    // Update subscription
    user.subscription = {
      plan: mappedPlanId,
      status: 'active',
      currentPeriodStart: new Date(),
      currentPeriodEnd: currentPeriodEnd,
      cancelledAt: null
    };
    
    await user.save();
    
    console.log(`User ${user.email} subscribed to ${mappedPlanId} plan`);
    console.log('Updated subscription:', user.subscription);
    
    // Return the updated user with subscription
    const updatedUser = await User.findById(req.user.id).select('subscription username email');
    
    res.json({ 
      success: true,
      message: `Subscribed to ${mappedPlanId} plan successfully`,
      subscription: updatedUser.subscription,
      user: {
        username: updatedUser.username,
        email: updatedUser.email
      }
    });
  } catch (error) {
    console.error('Subscribe error:', error);
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
    
    if (!user.subscription || user.subscription.plan === 'free') {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot cancel free plan' 
      });
    }
    
    user.subscription.status = 'cancelled';
    user.subscription.cancelledAt = new Date();
    
    await user.save();
    
    console.log(`User ${user.email} cancelled subscription`);
    
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

module.exports = router;
