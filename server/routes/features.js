const express = require('express');
const Feature = require('../models/Feature');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();

// Get all features
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const features = await Feature.find(query).sort({ order: 1, createdAt: -1 });
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all features (admin only)
router.get('/admin/features', auth, adminAuth, async (req, res) => {
  try {
    const features = await Feature.find().sort({ order: 1, createdAt: -1 });
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single feature
router.get('/:id', async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }
    res.json(feature);
  } catch (error) {
    console.error('Error fetching feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new feature (admin only)
router.post('/admin/features', auth, adminAuth, async (req, res) => {
  try {
    const { title, description, icon, image, status, order, isPremium, tags } = req.body;

    // Check if feature with same title exists
    const existingFeature = await Feature.findOne({ title });
    if (existingFeature) {
      return res.status(409).json({ error: 'Feature with this title already exists' });
    }

    const feature = new Feature({
      title,
      description,
      icon,
      image,
      status: status || 'active',
      order: order || 0,
      isPremium: isPremium || false,
      tags: tags || []
    });

    await feature.save();
    res.status(201).json(feature);
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update feature (admin only)
router.put('/admin/features/:id', auth, adminAuth, async (req, res) => {
  try {
    const { title, description, icon, image, status, order, isPremium, tags } = req.body;

    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    // Check for duplicate title (excluding current feature)
    if (title && title !== feature.title) {
      const existingFeature = await Feature.findOne({ title, _id: { $ne: req.params.id } });
      if (existingFeature) {
        return res.status(409).json({ error: 'Feature with this title already exists' });
      }
    }

    // Update fields
    if (title) feature.title = title;
    if (description) feature.description = description;
    if (icon) feature.icon = icon;
    if (image) feature.image = image;
    if (status) feature.status = status;
    if (order !== undefined) feature.order = order;
    if (isPremium !== undefined) feature.isPremium = isPremium;
    if (tags) feature.tags = tags;

    feature.updatedAt = new Date();

    await feature.save();
    res.json(feature);
  } catch (error) {
    console.error('Error updating feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete feature (admin only)
router.delete('/admin/features/:id', auth, adminAuth, async (req, res) => {
  try {
    const feature = await Feature.findById(req.params.id);
    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    await Feature.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update feature order (admin only)
router.patch('/admin/features/:id/order', auth, adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    const feature = await Feature.findById(req.params.id);

    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    feature.order = order;
    await feature.save();

    res.json({ order: feature.order });
  } catch (error) {
    console.error('Error updating feature order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update feature status (admin only)
router.patch('/admin/features/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const feature = await Feature.findById(req.params.id);

    if (!feature) {
      return res.status(404).json({ error: 'Feature not found' });
    }

    feature.status = status;
    await feature.save();

    res.json({ status: feature.status });
  } catch (error) {
    console.error('Error updating feature status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
