const express = require("express");
const router = express.Router();
const User = require("../models/User");
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


// Reviews management
router.get('/reviews', protect, admin, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (err) {
    console.error("Error in /api/admin/reviews:", err);
    res.status(500).json({ error: err.message });
  }
});


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
