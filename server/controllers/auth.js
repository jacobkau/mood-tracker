const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    console.log("Registration request received:", req.body); // Log incoming data
    
    const { username, email, password } = req.body;

if (!username || !email || !password) {
  return res.status(400).json({ error: "All fields are required" });
}

const emailExists = await User.findOne({ email });
if (emailExists) {
  return res.status(409).json({ error: "Email already registered" });
}

    const verificationToken = crypto.randomBytes(32).toString("hex");
const verificationTokenExpires = Date.now() + 60 * 60 * 1000;

    console.log("Checking for existing user...");
    const userExists = await User.findOne({ username });
    if (userExists) {
      console.log("Username already exists:", username);
      return res.status(409).json({ error: "Username already exists" });
    }

    console.log("Creating new user...");
    const hashedPassword = await bcrypt.hash(password, 12);
   const user = await User.create({
  username,
  email,
  password: hashedPassword,
  verificationToken,
  verificationTokenExpires,
});

    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}&email=${email}`;
await sendVerificationEmail(email, verifyLink);

    console.log("User created successfully:", user._id);
    res.status(201).json({ 
      message: "User registered",
      id: user._id 
    });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ 
      error: "Registration failed",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: "Username and password are required" 
      });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ 
      token,
      user: { id: user._id, username: user.username }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ 
      error: "Server error during login",
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

const deleteProfile = async (req, res) => {
  try {
    // Get user ID from the authenticated request
    const userId = req.user.id;
    
    // Optional: Add password confirmation for extra security
    // const { password } = req.body;
    // const user = await User.findById(userId).select('+password');
    // if (!user) return res.status(404).json({ error: "User not found" });
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) return res.status(401).json({ error: "Invalid password" });

    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ 
      message: "Account deleted successfully",
      deletedUserId: userId
    });

  } catch (err) {
    console.error("Delete Profile Error:", err);
    res.status(500).json({ 
      error: "Failed to delete account",
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    const user = await User.findOne({
      email,
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully. You can now log in." });

  } catch (err) {
    res.status(500).json({ error: "Email verification failed" });
  }
};


module.exports = { register, login, deleteProfile, verifyEmail };
