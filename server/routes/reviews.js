const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendReviewNotificationEmail, sendReviewResponseEmail } = require("../utils/emailService");
// Get all reviews (admin only)
router.get('/admin/reviews', protect, admin, async (req, res) => {
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

// Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'username email');
    
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new review
router.post('/', protect, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    // Check if user already reviewed
    const existingReview = await Review.findOne({ user: req.user.id });
    if (existingReview) {
      return res.status(409).json({ error: 'You have already submitted a review' });
    }

    const review = new Review({
      rating,
      title,
      comment,
      user: req.user.id
    });

    await review.save();
    await review.populate('user', 'username email');
    
    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update review status (admin only)
router.put('/admin/:id/status', protect, admin, async (req, res) => {
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

// Toggle featured status (admin only)
router.put('/admin/:id/featured', protect, admin, async (req, res) => {
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

// Delete review (admin only)
router.delete('/admin/:id', protect, admin, async (req, res) => {
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

// Add response to review (admin only)
router.post('/admin/:id/response', protect, admin, async (req, res) => {
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

// Get user's review
router.get('/user/me', protect, async (req, res) => {
  try {
    const review = await Review.findOne({ user: req.user.id })
      .populate('user', 'username email');
    
    res.json(review);
  } catch (error) {
    console.error('Error fetching user review:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get approved reviews for public display
router.get('/public/approved', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const reviews = await Review.find({ status: 'approved' })
      .populate('user', 'username')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments({ status: 'approved' });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching approved reviews:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
