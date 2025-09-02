const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const Guide = require('../models/Guide');
const Testimonial = require('../models/Testimonial');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// Get all published blog posts with pagination
router.get('/blog', async (req, res) => {
  try {
    const { page = 1, limit = 6, category = '' } = req.query;
    const query = { published: true };
    
    if (category) {
      query.category = new RegExp(category, 'i');
    }
    
    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-content -__v');
    
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch blog posts' 
    });
  }
});

// Get single blog post
router.get('/blog/:id', async (req, res) => {
  try {
    const post = await BlogPost.findOne({ 
      _id: req.params.id, 
      published: true 
    });
    
    if (!post) {
      return res.status(404).json({ 
        success: false,
        error: 'Blog post not found' 
      });
    }
    
    // Increment view count
    post.views = (post.views || 0) + 1;
    await post.save();
    
    res.json({ success: true, post });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch blog post' 
    });
  }
});

// Get all published guides
router.get('/guides', async (req, res) => {
  try {
    const guides = await Guide.find({ published: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    
    res.json({ success: true, guides });
  } catch (error) {
    console.error('Get guides error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch guides' 
    });
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
      return res.status(404).json({ 
        success: false,
        error: 'Guide not found' 
      });
    }
    
    res.json({ success: true, guide });
  } catch (error) {
    console.error('Get guide error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch guide' 
    });
  }
});

// Get published testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ approved: true })
      .sort({ featured: -1, createdAt: -1 })
      .select('-__v')
      .limit(20);
    
    res.json({ success: true, testimonials });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch testimonials' 
    });
  }
});

// Submit testimonial
router.post('/testimonials', async (req, res) => {
  try {
    const { name, role, content, rating } = req.body;
    
    const testimonial = new Testimonial({
      name,
      role,
      content,
      rating: Math.min(5, Math.max(1, rating)),
      approved: false,
      featured: false
    });
    
    await testimonial.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Testimonial submitted for review', 
      testimonialId: testimonial._id 
    });
  } catch (error) {
    console.error('Submit testimonial error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit testimonial' 
    });
  }
});

// Newsletter subscription
router.post('/newsletter', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false,
        error: 'Valid email address is required' 
      });
    }
    
    // Check if already subscribed
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      if (!existingSubscriber.active) {
        existingSubscriber.active = true;
        existingSubscriber.unsubscribedAt = null;
        await existingSubscriber.save();
      }
      return res.json({ 
        success: true,
        message: 'Subscribed to newsletter successfully' 
      });
    }
    
    const subscriber = new NewsletterSubscriber({
      email,
      active: true
    });
    
    await subscriber.save();
    
    try {
      // Send welcome email
      await sendNewsletterWelcome(email);
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
      // Continue even if email fails
    }
    
    res.json({ 
      success: true,
      message: 'Subscribed to newsletter successfully' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to subscribe to newsletter' 
    });
  }
});

module.exports = router;
