const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");

// @desc    Get user profile
// @route   GET /api/profile
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -__v");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/profile
router.put("/", protect, async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    // Verify current password if changing password
    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    if (username) user.username = username;
    
    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;