const express = require('express');
const FAQ = require('../models/FAQ');
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Get all FAQs
router.get('/', async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = { status: 'active' };

    if (category) query.category = category;
    if (status) query.status = status;

    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all FAQs (admin only)
router.get('/admin/faqs', auth, adminAuth, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get FAQs by category
router.get('/category/:category', async (req, res) => {
  try {
    const faqs = await FAQ.find({ 
      category: req.params.category, 
      status: 'active' 
    }).sort({ order: 1 });
    
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs by category:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single FAQ
router.get('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new FAQ (admin only)
router.post('/admin/faqs', auth, adminAuth, async (req, res) => {
  try {
    const { question, answer, category, status, order, tags } = req.body;

    const faq = new FAQ({
      question,
      answer,
      category: category || 'general',
      status: status || 'active',
      order: order || 0,
      tags: tags || []
    });

    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update FAQ (admin only)
router.put('/admin/faqs/:id', auth, adminAuth, async (req, res) => {
  try {
    const { question, answer, category, status, order, tags } = req.body;

    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    // Update fields
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (status) faq.status = status;
    if (order !== undefined) faq.order = order;
    if (tags) faq.tags = tags;

    faq.updatedAt = new Date();

    await faq.save();
    res.json(faq);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete FAQ (admin only)
router.delete('/admin/faqs/:id', auth, adminAuth, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update FAQ helpfulness
router.post('/:id/helpful', async (req, res) => {
  try {
    const { helpful } = req.body; // true for yes, false for no
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    if (helpful) {
      faq.helpful.yes += 1;
    } else {
      faq.helpful.no += 1;
    }

    await faq.save();
    res.json({ helpful: faq.helpful });
  } catch (error) {
    console.error('Error updating FAQ helpfulness:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update FAQ order (admin only)
router.patch('/admin/faqs/:id/order', auth, adminAuth, async (req, res) => {
  try {
    const { order } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    faq.order = order;
    await faq.save();

    res.json({ order: faq.order });
  } catch (error) {
    console.error('Error updating FAQ order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update FAQ status (admin only)
router.patch('/admin/faqs/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    faq.status = status;
    await faq.save();

    res.json({ status: faq.status });
  } catch (error) {
    console.error('Error updating FAQ status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
