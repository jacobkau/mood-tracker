const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    console.log("Registration request received:", req.body); // Log incoming data
    
    const { username, password } = req.body;
    
    // Validate input
    if (!username || !password) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ error: "All fields are required" });
    }

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
      password: hashedPassword 
    });

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

module.exports = { register, login };