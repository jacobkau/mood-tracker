const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendReviewNotificationEmail, sendReviewResponseEmail } = require("../utils/emailService");

// Get all reviews (public - only approved)
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ status: "approved" })
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Review.countDocuments({ status: "approved" });

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get featured reviews
router.get("/featured", async (req, res) => {
  try {
    const reviews = await Review.find({ 
      status: "approved", 
      isFeatured: true 
    })
    .populate("user", "username profileImage")
    .sort({ createdAt: -1 })
    .limit(6);

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit a review (protected)
router.post("/", protect, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    // Check if user already submitted a review
    const existingReview = await Review.findOne({ user: req.user.id });
    if (existingReview) {
      return res.status(400).json({ error: "You have already submitted a review" });
    }

    const review = new Review({
      user: req.user.id,
      rating,
      title,
      comment
    });

    await review.save();

    // Populate user data for response
    await review.populate("user", "username email");

    // Send notification email to admin
    try {
      await sendReviewNotificationEmail(review);
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }

    res.status(201).json({
      message: "Review submitted successfully. It will be visible after approval.",
      review
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's review (protected)
router.get("/my-review", protect, async (req, res) => {
  try {
    const review = await Review.findOne({ user: req.user.id })
      .populate("user", "username profileImage");

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin routes
// Get all reviews for admin (with filters)
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    let filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { comment: { $regex: search, $options: "i" } }
      ];
    }

    const reviews = await Review.find(filter)
      .populate("user", "username email profileImage")
      .populate("adminResponse.respondedBy", "username")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update review status (admin)
router.put("/admin/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id).populate("user", "email username");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.status = status;
    await review.save();

    res.json({ message: `Review ${status} successfully`, review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin response to review
router.put("/admin/:id/response", protect, admin, async (req, res) => {
  try {
    const { message } = req.body;
    const review = await Review.findById(req.params.id).populate("user", "email username");

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.adminResponse = {
      message,
      respondedAt: new Date(),
      respondedBy: req.user.id
    };

    await review.save();

    // Send response email to user
    try {
      await sendReviewResponseEmail(review, message);
    } catch (emailError) {
      console.error("Failed to send response email:", emailError);
    }

    res.json({ message: "Response sent successfully", review });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle featured status (admin)
router.put("/admin/:id/featured", protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    review.isFeatured = !review.isFeatured;
    await review.save();

    res.json({ 
      message: `Review ${review.isFeatured ? "added to" : "removed from"} featured`, 
      review 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get review statistics (admin)
router.get("/admin/stats", protect, admin, async (req, res) => {
  
  try {
    const totalReviews = await Review.countDocuments();
    const approvedReviews = await Review.countDocuments({ status: "approved" });
    const pendingReviews = await Review.countDocuments({ status: "pending" });
    const rejectedReviews = await Review.countDocuments({ status: "rejected" });
    const featuredReviews = await Review.countDocuments({ isFeatured: true });

    const ratingDistribution = await Review.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalReviews,
      approvedReviews,
      pendingReviews,
      rejectedReviews,
      featuredReviews,
      ratingDistribution
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
