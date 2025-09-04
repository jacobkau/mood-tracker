const express = require('express');
const Blog = require('../models/Blog');
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all blogs (admin only)
router.get('/admin/blogs',  protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single blog by ID
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'username email')
      .populate('comments.user', 'username');
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get blogs by status
router.get('/', async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.categories = category;

    const blogs = await Blog.find(query)
      .populate('author', 'username email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Blog.countDocuments(query);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new blog (admin only)
router.post('/admin/blogs',  protect, admin, async (req, res) => {
  try {
    const { title, content, excerpt, categories, tags, status, metaTitle, metaDescription } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(409).json({ error: 'Blog with this title already exists' });
    }

    const blog = new Blog({
      title,
      slug,
      content,
      excerpt,
      categories: categories || [],
      tags: tags || [],
      status: status || 'draft',
      metaTitle,
      metaDescription,
      author: req.user.id,
      readTime: Math.ceil(content.split(/\s+/).length / 200) // Estimate read time
    });

    await blog.save();
    await blog.populate('author', 'username email');

    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update blog (admin only)
router.put('/admin/blogs/:id',  protect, admin, async (req, res) => {
  try {
    const { title, content, excerpt, categories, tags, status, metaTitle, metaDescription } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Update fields
    if (title) blog.title = title;
    if (content) {
      blog.content = content;
      blog.readTime = Math.ceil(content.split(/\s+/).length / 200);
    }
    if (excerpt) blog.excerpt = excerpt;
    if (categories) blog.categories = categories;
    if (tags) blog.tags = tags;
    if (status) blog.status = status;
    if (metaTitle) blog.metaTitle = metaTitle;
    if (metaDescription) blog.metaDescription = metaDescription;

    blog.updatedAt = new Date();

    await blog.save();
    await blog.populate('author', 'username email');

    res.json(blog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete blog (admin only)
router.delete('/admin/blogs/:id',  protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle featured status (admin only)
router.patch('/admin/blogs/:id/featured',  protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();

    res.json({ isFeatured: blog.isFeatured });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add comment to blog
router.post('/:id/comments',  protect, async (req, res) => {
  try {
    const { content } = req.body;
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.comments.push({
      user: req.user.id,
      content
    });

    await blog.save();
    await blog.populate('comments.user', 'username');

    res.status(201).json(blog.comments[blog.comments.length - 1]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Like/unlike blog
router.post('/:id/like', protect, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      blog.likes.splice(likeIndex, 1);
    } else {
      blog.likes.push(req.user.id);
    }

    await blog.save();
    res.json({ likes: blog.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
