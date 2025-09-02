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
        maxNotesLength: 100
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
    const user = await User.findById(req.user.id).select('subscription');
    
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

// Subscribe to a plan
router.post('/subscribe', protect, async (req, res) => {
  try {
    const { planId } = req.body;
    
    const plans = {
      free: { plan: 'free', status: 'active' },
      pro: { plan: 'pro', status: 'active' },
      premium: { plan: 'premium', status: 'active' }
    };
    
    if (!plans[planId]) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid plan ID' 
      });
    }
    
    const user = await User.findById(req.user.id);
    user.subscription = {
      ...plans[planId],
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + (planId === 'premium' ? 365 : 30) * 24 * 60 * 60 * 1000)
    };
    
    await user.save();
    
    // In production, you would integrate with Stripe/PayPal here
    // and handle actual payment processing
    
    res.json({ 
      success: true,
      message: `Subscribed to ${planId} plan successfully`,
      subscription: user.subscription
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process subscription' 
    });
  }
});

// Cancel subscription
router.post('/cancel', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (user.subscription.plan === 'free') {
      return res.status(400).json({ 
        success: false,
        error: 'Cannot cancel free plan' 
      });
    }
    
    user.subscription.status = 'cancelled';
    user.subscription.cancelledAt = new Date();
    
    await user.save();
    
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
