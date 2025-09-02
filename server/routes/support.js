const express = require('express');
const router = express.Router();
const SupportTicket = require('../models/SupportTicket');
const auth = require('../middleware/auth');
const { sendSupportEmail } = require('../utils/emailService');

// Submit support request
router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const supportTicket = new SupportTicket({
      name,
      email,
      subject,
      message,
      status: 'open',
      priority: 'normal'
    });
    
    await supportTicket.save();
    
    // Send email notification to support team
    await sendSupportEmail({
      ticketId: supportTicket._id,
      name,
      email,
      subject,
      message
    });
    
    // Send confirmation email to user
    await sendSupportEmail({
      to: email,
      subject: 'Support Request Received',
      template: 'support-confirmation',
      context: {
        name,
        ticketId: supportTicket._id,
        subject
      }
    });
    
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
router.get('/tickets', auth, async (req, res) => {
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
router.get('/tickets/:id', auth, async (req, res) => {
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
