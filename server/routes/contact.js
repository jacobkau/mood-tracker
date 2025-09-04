const express = require('express');
const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/emailService');
const router = express.Router();

// @desc    Handle contact form submission
// @route   POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message, type = 'contact' } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    // Create contact record in database
    const contact = new Contact({
      name,
      email,
      message,
      type
    });

    await contact.save();

    // Send email notification
    const emailSent = await sendContactEmail({
      name,
      email,
      subject: type === 'contact' ? 'Contact Form Submission' : 'Partnership Inquiry',
      message,
      type
    });

    if (!emailSent) {
      console.warn('Email notification failed to send, but contact was saved to database');
    }

    res.status(200).json({ 
      message: 'Message sent successfully',
      contactId: contact._id 
    });
  } catch (err) {
    console.error('Contact form error:', err);
    
    // Handle duplicate submissions or validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Duplicate submission detected' });
    }
    
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

// @desc    Get all contacts (admin only)
// @route   GET /api/contact
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contact.countDocuments(query);

    res.json({
      contacts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// @desc    Update contact status (admin only)
// @route   PUT /api/contact/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact status updated', contact });
  } catch (err) {
    console.error('Error updating contact status:', err);
    res.status(500).json({ error: 'Failed to update contact status' });
  }
});

// @desc    Add response to contact (admin only)
// @route   POST /api/contact/:id/response
router.post('/:id/response', async (req, res) => {
  try {
    const { message } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        responded: true,
        response: {
          message,
          respondedAt: new Date()
        },
        status: 'replied'
      },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Response added successfully', contact });
  } catch (err) {
    console.error('Error adding response:', err);
    res.status(500).json({ error: 'Failed to add response' });
  }
});

module.exports = router;
