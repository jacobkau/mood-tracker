const express = require('express');
const Guide = require('../models/Guide');
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all guides
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, status, page = 1, limit = 10 } = req.query;
    let query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (status) query.status = status;

    const guides = await Guide.find(query)
      .populate('author', 'username email')
      .populate('relatedGuides', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Guide.countDocuments(query);

    res.json({
      guides,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all guides (admin only)
router.get('/admin/guides', auth, adminAuth, async (req, res) => {
  try {
    const guides = await Guide.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get guides by category
router.get('/category/:category', async (req, res) => {
  try {
    const guides = await Guide.find({ 
      category: req.params.category, 
      status: 'published' 
    })
    .populate('author', 'username email')
    .sort({ createdAt: -1 });
    
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single guide by ID or slug
router.get('/:id', async (req, res) => {
  try {
    let guide;

    // Check if it's a valid ObjectId
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      guide = await Guide.findById(req.params.id)
        .populate('author', 'username email')
        .populate('relatedGuides', 'title slug');
    } else {
      guide = await Guide.findOne({ slug: req.params.id, status: 'published' })
        .populate('author', 'username email')
        .populate('relatedGuides', 'title slug');
    }

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    // Increment views
    guide.views += 1;
    await guide.save();

    res.json(guide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new guide (admin only)
router.post('/admin/guides', auth, adminAuth, async (req, res) => {
  try {
    const { title, content, excerpt, category, difficulty, featuredImage, tags, relatedGuides } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingGuide = await Guide.findOne({ slug });
    if (existingGuide) {
      return res.status(409).json({ error: 'Guide with this title already exists' });
    }

    const guide = new Guide({
      title,
      slug,
      content,
      excerpt,
      category: category || 'getting-started',
      difficulty: difficulty || 'beginner',
      featuredImage,
      tags: tags || [],
      relatedGuides: relatedGuides || [],
      author: req.user.id,
      readTime: Math.ceil(content.split(/\s+/).length / 200) // Estimate read time
    });

    await guide.save();
    await guide.populate('author', 'username email');

    res.status(201).json(guide);
  } catch (error) {
    console.error('Error creating guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update guide (admin only)
router.put('/admin/guides/:id', auth, adminAuth, async (req, res) => {
  try {
    const { title, content, excerpt, category, difficulty, featuredImage, tags, relatedGuides, status } = req.body;

    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    // Update fields
    if (title) guide.title = title;
    if (content) {
      guide.content = content;
      guide.readTime = Math.ceil(content.split(/\s+/).length / 200);
    }
    if (excerpt) guide.excerpt = excerpt;
    if (category) guide.category = category;
    if (difficulty) guide.difficulty = difficulty;
    if (featuredImage) guide.featuredImage = featuredImage;
    if (tags) guide.tags = tags;
    if (relatedGuides) guide.relatedGuides = relatedGuides;
    if (status) guide.status = status;

    guide.updatedAt = new Date();

    await guide.save();
    await guide.populate('author', 'username email')
               .populate('relatedGuides', 'title slug');

    res.json(guide);
  } catch (error) {
    console.error('Error updating guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete guide (admin only)
router.delete('/admin/guides/:id', auth, adminAuth, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    await Guide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update guide status (admin only)
router.patch('/admin/guides/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    guide.status = status;
    if (status === 'published' && !guide.publishedAt) {
      guide.publishedAt = new Date();
    }

    await guide.save();
    res.json({ status: guide.status });
  } catch (error) {
    console.error('Error updating guide status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Search guides
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const guides = await Guide.find({
      status: 'published',
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .populate('author', 'username email')
    .sort({ createdAt: -1 })
    .limit(10);

    res.json(guides);
  } catch (error) {
    console.error('Error searching guides:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
