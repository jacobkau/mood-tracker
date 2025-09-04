const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
const path = require('path');
const fs = require('fs');

// @desc    Get user profile
// @route   GET /api/profile
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -__v");
    
    // Convert profileImage to full URL if it's a local path
    if (user.profileImage && !user.profileImage.startsWith('http')) {
      user.profileImage = `${process.env.SERVER_BASE_URL || process.env.API_BASE_URL}/${user.profileImage}`;
    }
    
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
      profileImage,
      currentPassword, 
      newPassword,
      confirmPassword
    } = req.body;
    
    const user = await User.findById(req.user.id);

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: "Current password is required to set a new password" });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match" });
      }
      
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ error: "Username already taken" });
      }
      user.username = username;
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    
    // Handle profile image update
    if (profileImage !== undefined) {
      // If profileImage is empty string, user wants to remove the image
      if (profileImage === "") {
        // Delete old profile image file if exists
        if (user.profileImage && !user.profileImage.startsWith('http')) {
          const oldImagePath = path.join(__dirname, '..', user.profileImage);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        user.profileImage = null;
      } 
      // If profileImage is a string path (not a URL), update it
      else if (profileImage && !profileImage.startsWith('http')) {
        user.profileImage = profileImage;
      }
      // If it's a URL (from social login), keep it as is
    }
    
    await user.save();
    
    // Return updated user data without password
    const updatedUser = await User.findById(req.user.id)
      .select("-password -__v");
    
    // Convert profileImage to full URL if it's a local path
    if (updatedUser.profileImage && !updatedUser.profileImage.startsWith('http')) {
      updatedUser.profileImage = `${process.env.SERVER_BASE_URL || process.env.API_BASE_URL}/${updatedUser.profileImage}`;
    }
      
    res.json({ 
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Profile update error:", err);
    
    // Handle duplicate username errors
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }
    
    res.status(500).json({ error: err.message });
  }
});

// @desc    Delete user profile
// @route   DELETE /api/profile
router.delete("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Delete profile image if exists
    if (user.profileImage && !user.profileImage.startsWith('http')) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await User.findByIdAndDelete(req.user.id);
    
    res.status(200).json({ 
      success: true,
      message: "Account deleted successfully",
      deletedUserId: req.user.id
    });
  } catch (err) {
    console.error("Delete profile error:", err);
    res.status(500).json({ 
      error: "Failed to delete account",
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
});

module.exports = router;
