// routes/support.js
const express = require('express');
const router = express.Router();
const Support = require('../models/Support');
const auth = require('../middleware/auth');

// Submit support request
router.post('/contact-support', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const supportRequest = new Support({
      name,
      email,
      subject,
      message,
      status: 'open'
    });
    
    await supportRequest.save();
    
    // Here you would typically send an email notification
    console.log('Support request received:', { name, email, subject });
    
    res.status(201).json({ 
      message: 'Support request submitted successfully', 
      requestId: supportRequest._id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's support requests (protected)
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await Support.find({ email: req.user.email })
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
