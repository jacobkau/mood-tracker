const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const moodRoutes = require("./routes/mood");
const statsRoutes = require("./routes/stats"); 
const profileRoutes = require("./routes/profile"); 
const supportRoutes = require('./routes/support');
const contentRoutes = require('./routes/content');
const subscriptionRoutes = require('./routes/subscription');
const contactRoutes = require('./routes/contact');

dotenv.config();
const app = express();

// Configure CORS with multiple allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'https://mood-tracker-bice.vercel.app',
  'https://mood-tracker-git-main-jacobkaus-projects.vercel.app',
  'https://mood-tracker-cz20ej60u-jacobkaus-projects.vercel.app/',
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.path}`);
  next();
});

// Routes (keep the rest of your code the same)
app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/stats", statsRoutes); 
app.use("/api/profile", profileRoutes);
app.use('/api/contact', contactRoutes)
app.use("/api/support", supportRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/subscription", subscriptionRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Connected to DB: ${mongoose.connection.host}`);
  });
});
