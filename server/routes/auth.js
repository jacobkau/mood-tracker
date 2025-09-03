const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { protect } = require('../middleware/authMiddleware');
const { sendVerificationEmail } = require("../utils/emailService");

// Register new user
const crypto = require("crypto");

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

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered" });

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
    res.status(500).json({ error: err.message });
  }
});


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
    res.status(500).json({ error: err.message });
  }
});


router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  // lookup user and send email logic here
  res.json({ success: true, message: "Password reset email sent" });
});


// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user profile
router.delete('/profile', protect, async (req, res) => {
  try {
    // Get user from middleware
    const userId = req.user.id;
    
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
