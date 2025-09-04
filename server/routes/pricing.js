const express = require('express');
const PricingPlan = require('../models/Pricing');
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all pricing plans
router.get('/', async (req, res) => {
  try {
    const pricingPlans = await PricingPlan.find({ isActive: true }).sort({ order: 1 });
    res.json(pricingPlans);
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all pricing plans (admin only)
router.get('/admin/pricing', protect, admin, async (req, res) => {
  try {
    const pricingPlans = await PricingPlan.find().sort({ order: 1 });
    res.json(pricingPlans);
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single pricing plan
router.get('/:id', async (req, res) => {
  try {
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }
    res.json(pricingPlan);
  } catch (error) {
    console.error('Error fetching pricing plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new pricing plan (admin only)
router.post('/admin/pricing', protect, admin, async (req, res) => {
  try {
    const { name, description, price, features, isActive, isPopular, order, trialPeriod } = req.body;

    // Check if plan with same name exists
    const existingPlan = await PricingPlan.findOne({ name });
    if (existingPlan) {
      return res.status(409).json({ error: 'Pricing plan with this name already exists' });
    }

    const pricingPlan = new PricingPlan({
      name,
      description,
      price: {
        monthly: price.monthly,
        yearly: price.yearly,
        currency: price.currency || 'USD'
      },
      features: features || [],
      isActive: isActive !== undefined ? isActive : true,
      isPopular: isPopular || false,
      order: order || 0,
      trialPeriod: trialPeriod || 0
    });

    await pricingPlan.save();
    res.status(201).json(pricingPlan);
  } catch (error) {
    console.error('Error creating pricing plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update pricing plan (admin only)
router.put('/admin/pricing/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, price, features, isActive, isPopular, order, trialPeriod } = req.body;

    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    // Check for duplicate name (excluding current plan)
    if (name && name !== pricingPlan.name) {
      const existingPlan = await PricingPlan.findOne({ name, _id: { $ne: req.params.id } });
      if (existingPlan) {
        return res.status(409).json({ error: 'Pricing plan with this name already exists' });
      }
    }

    // Update fields
    if (name) pricingPlan.name = name;
    if (description) pricingPlan.description = description;
    if (price) {
      if (price.monthly) pricingPlan.price.monthly = price.monthly;
      if (price.yearly) pricingPlan.price.yearly = price.yearly;
      if (price.currency) pricingPlan.price.currency = price.currency;
    }
    if (features) pricingPlan.features = features;
    if (isActive !== undefined) pricingPlan.isActive = isActive;
    if (isPopular !== undefined) pricingPlan.isPopular = isPopular;
    if (order !== undefined) pricingPlan.order = order;
    if (trialPeriod !== undefined) pricingPlan.trialPeriod = trialPeriod;

    pricingPlan.updatedAt = new Date();

    await pricingPlan.save();
    res.json(pricingPlan);
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete pricing plan (admin only)
router.delete('/admin/pricing/:id', protect, admin, async (req, res) => {
  try {
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    await PricingPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pricing plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle plan active status (admin only)
router.patch('/admin/pricing/:id/active', protect, admin, async (req, res) => {
  try {
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    pricingPlan.isActive = !pricingPlan.isActive;
    await pricingPlan.save();

    res.json({ isActive: pricingPlan.isActive });
  } catch (error) {
    console.error('Error toggling plan status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle popular status (admin only)
router.patch('/admin/pricing/:id/popular', protect, admin, async (req, res) => {
  try {
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    pricingPlan.isPopular = !pricingPlan.isPopular;
    await pricingPlan.save();

    res.json({ isPopular: pricingPlan.isPopular });
  } catch (error) {
    console.error('Error toggling popular status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update plan order (admin only)
router.patch('/admin/pricing/:id/order', protect, admin, async (req, res) => {
  try {
    const { order } = req.body;
    const pricingPlan = await PricingPlan.findById(req.params.id);

    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    pricingPlan.order = order;
    await pricingPlan.save();

    res.json({ order: pricingPlan.order });
  } catch (error) {
    console.error('Error updating plan order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
