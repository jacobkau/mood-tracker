// routes/content.js
const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const Guide = require('../models/Guide');

// Get all blog posts
router.get('/blog-posts', async (req, res) => {
  try {
    const { page = 1, limit = 6 } = req.query;
    const posts = await BlogPost.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await BlogPost.countDocuments({ published: true });
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single blog post
router.get('/blog-posts/:id', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      _id: req.params.id, 
      published: true 
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all guides
router.get('/guides', async (req, res) => {
  try {
    const guides = await Guide.find({ published: true })
      .sort({ order: 1, createdAt: -1 });
    
    res.json(guides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single guide
router.get('/guides/:id', async (req, res) => {
  try {
    const guide = await Guide.findOne({ 
      _id: req.params.id, 
      published: true 
    });
    
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    
    res.json(guide);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Newsletter subscription
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Here you would typically save to a newsletter collection
    // and integrate with your email service (Mailchimp, SendGrid, etc.)
    console.log('Newsletter subscription:', email);
    
    res.json({ message: 'Subscribed to newsletter successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
