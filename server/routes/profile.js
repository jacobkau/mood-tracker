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
    const { 
      username, 
      firstName, 
      lastName, 
      phone, 
      address,
      currentPassword, 
      newPassword 
    } = req.body;
    
    const user = await User.findById(req.user.id);

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set a new password" });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Update user fields
    if (username !== undefined) user.username = username;
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    
    await user.save();
    
    // Return updated user data without password
    const updatedUser = await User.findById(req.user.id)
      .select("-password -__v");
      
    res.json({ 
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message });
  }
});

// @desc    Delete user profile
// @route   DELETE /api/profile
router.delete("/", protect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    
    // Properly structured response object
    res.status(200).json({ 
      success: true,
      message: "Account deleted successfully",
      redirect: "/"  
    });
  } catch (err) {
    console.error("Delete profile error:", err);
    res.status(500).json({ 
      error: "Failed to delete account",
      details: process.env.NODE_ENV === 'development' ? err.message : null,
      redirect: "/" 
    });
  }
});

module.exports = router;
