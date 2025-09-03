const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require('../middleware/authMiddleware');
const { sendVerificationEmail } = require("../utils/emailService");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require("crypto");

// IMAGE UPLOAD CONFIGURATION
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/profile-images/';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload profile image route
router.post('/upload-profile-image', protect, upload.single('profileImage'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const user = await User.findById(req.user.id);
    
    // Delete old profile image if exists
    if (user.profileImage && user.profileImage !== req.file.path) {
      const oldImagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Update user with new profile image path
    user.profileImage = req.file.path;
    await user.save();
    
    // Return user data without password
    const userResponse = await User.findById(req.user.id).select('-password');
    
    res.json({ 
      message: 'Profile image uploaded successfully',
      user: userResponse,
      profileImagePath: req.file.path
    });
  } catch (err) {
    console.error('Profile image upload error:', err);
    res.status(500).json({ error: 'Failed to upload profile image' });
  }
});

// Pick correct client URL dynamically
const getClientUrl = (req) => {
  const clientUrls = process.env.CLIENT_URLS.split(",");
  const origin = req.get("origin");

  if (origin && clientUrls.includes(origin)) {
    return origin;
  }

  // Default to first one (production)
  return clientUrls[0];
};

// Register user
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, address } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: "Email already registered" });
      } else {
        return res.status(400).json({ error: "Username already taken" });
      }
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    // 👇 dynamic client URL based on origin or fallback
    const verifyLink = `${getClientUrl(req)}/verify-email?token=${verificationToken}&email=${email}`;
    await sendVerificationEmail(email, verifyLink);

    res.status(201).json({ message: "User created. Please check your email to verify your account." });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Verify email
router.get("/verify-email", async (req, res) => {
  try {
    const { token, email } = req.query;

    const user = await User.findOne({
      email,
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });

  } catch (err) {
    console.error("Email verification error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Request password reset
router.post('/request-reset', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Send reset email (you'll need to implement this)
    const resetLink = `${getClientUrl(req)}/reset-password?token=${resetToken}`;
    // await sendPasswordResetEmail(email, resetLink);

    res.json({ success: true, message: "Password reset email sent" });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({ error: "Failed to process reset request" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');
    
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    
    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(401).json({ error: "Please verify your email before logging in" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    
    // Return user data without password
    const userResponse = await User.findById(user._id).select('-password');
    
    res.json({ 
      token, 
      user: userResponse,
      message: "Login successful" 
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, confirmPassword, profileImage, ...profileUpdates } = req.body;

    // If changing password, validate all password fields
    if (newPassword || currentPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: "All password fields are required to change password" });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
      }
      
      const user = await User.findById(userId).select('+password');
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      
      // Hash new password and add to updates
      profileUpdates.password = await bcrypt.hash(newPassword, 12);
    }

    // Handle profile image update if provided
    if (profileImage) {
      profileUpdates.profileImage = profileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: profileUpdates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (err) {
    console.error("Update profile error:", err);
    
    // Handle duplicate username/email errors
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res.status(400).json({ 
        error: `${field} already exists` 
      });
    }
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        error: errors.join(', ') 
      });
    }
    
    res.status(500).json({ 
      error: "Failed to update profile",
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
});

// Delete user profile
router.delete('/profile', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Delete profile image if exists
    if (user.profileImage) {
      const imagePath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ 
      success: true,
      message: "Account deleted successfully",
      deletedUserId: userId
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
