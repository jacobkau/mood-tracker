const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Review = require("../models/Review");   
const Contact = require("../models/Contact"); 
const Page = require("../models/Page");       
const Email = require("../models/Email");    
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
router.get("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
router.put("/users/:id/role", protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/reviews', auth, adminAuth, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    
    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete review (admin)
router.delete('/reviews/:id', auth, adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review status (admin)
router.put('/reviews/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.status = status;
    await review.save();

    res.json({ status: review.status });
  } catch (error) {
    console.error('Error updating review status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle featured status (admin)
router.put('/reviews/:id/featured', auth, adminAuth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.isFeatured = !review.isFeatured;
    await review.save();

    res.json({ isFeatured: review.isFeatured });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add response to review (admin)
router.post('/reviews/:id/response', auth, adminAuth, async (req, res) => {
  try {
    const { message } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    review.response = {
      message,
      respondedBy: req.user.id,
      respondedAt: new Date()
    };

    await review.save();
    res.json({ message: 'Response added successfully' });
  } catch (error) {
    console.error('Error adding response:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;


// Contact messages
router.get('/contacts', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pages management
router.get('/pages', protect, admin, async (req, res) => {
  try {
    const pages = await Page.find().sort({ title: 1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Email history
router.get('/emails', protect, admin, async (req, res) => {
  try {
    const emails = await Email.find().sort({ sentAt: -1 }).limit(50);
    res.json(emails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk email
router.post('/emails/bulk', protect, admin, async (req, res) => {
  try {
    const { subject, content } = req.body;
    // Implementation for sending bulk emails
    res.json({ message: 'Bulk email sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Export data
router.get('/export/:type', protect, admin, async (req, res) => {
  try {
    const { type } = req.params;
    // Implementation for data export
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${type}-export.csv`);
    // Send CSV data
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Enhanced stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const totalReviews = await Review.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const emailsSent = await Email.countDocuments();

    res.json({
      totalUsers,
      adminUsers,
      regularUsers,
      totalReviews,
      pendingContacts,
      emailsSent
    });
  } catch (err) {
    console.error("Error in /api/admin/stats:", err);
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
