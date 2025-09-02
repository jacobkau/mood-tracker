// routes/subscription.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get subscription plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        features: ['Basic mood tracking', '7-day history', 'Standard charts', 'Email support'],
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 4.99,
        period: 'month',
        features: ['Unlimited mood tracking', '90-day history', 'Advanced analytics', 'Custom reminders', 'Data export', 'Priority support'],
        popular: true
      },
      {
        id: 'premium',
        name: 'Premium',
        price: 49.99,
        period: 'year',
        features: ['Everything in Pro', '365-day history', 'Trend predictions', 'Personalized insights', 'Therapist sharing', '24/7 support'],
        popular: false
      }
    ];
    
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create subscription (simplified - would integrate with Stripe in production)
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { planId } = req.body;
    
    // Update user's subscription
    const user = await User.findById(req.user.id);
    user.subscription = {
      plan: planId,
      status: 'active',
      startedAt: new Date()
    };
    
    await user.save();
    
    res.json({ 
      message: `Subscribed to ${planId} plan successfully`,
      subscription: user.subscription
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
