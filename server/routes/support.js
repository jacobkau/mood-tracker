const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const { protect } = require('../middleware/authMiddleware');
const { sendSupportEmail, sendSupportConfirmation } = require('../utils/emailService');

// Submit support request
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields are required' 
      });
    }

    const supportTicket = new SupportTicket({
      name,
      email,
      subject,
      message,
      status: 'open',
      priority: 'normal'
    });
    
    await supportTicket.save();
    
    // Try to send emails, but don't fail the request if they fail
    try {
      await sendSupportEmail({
        ticketId: supportTicket._id,
        name,
        email,
        subject,
        message
      });
    } catch (emailError) {
      console.warn('Support email failed:', emailError.message);
    }
    
    try {
      await sendSupportConfirmation({
        to: email,
        name,
        ticketId: supportTicket._id,
        subject
      });
    } catch (confirmationError) {
      console.warn('Confirmation email failed:', confirmationError.message);
    }
    
    res.status(201).json({ 
      success: true,
      message: 'Support request submitted successfully', 
      ticketId: supportTicket._id 
    });
  } catch (error) {
    console.error('Support request error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to submit support request. Please try again.' 
    });
  }
});

// Get user's support tickets (protected)
router.get('/tickets', protect, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ email: req.user.email })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({ success: true, tickets });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch support tickets' 
    });
  }
});

// Get specific support ticket (protected)
router.get('/tickets/:id', protect, async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      email: req.user.email
    });
    
    if (!ticket) {
      return res.status(404).json({ 
        success: false,
        error: 'Support ticket not found' 
      });
    }
    
    res.json({ success: true, ticket });
  } catch (error) {
    console.error('Get ticket error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch support ticket' 
    });
  }
});

module.exports = router;
