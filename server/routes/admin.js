const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Review = require("../models/Review");   
const Contact = require("../models/Contact"); 
const Page = require("../models/Page");       
const Email = require("../models/Email");
const EmailHistory = require("../models/EmailHistory");
const Blog = require('../models/Blog');
const Feature = require('../models/Feature');
const FAQ = require('../models/FAQ');
const PricingPlan = require('../models/Pricing');
const Guide = require('../models/Guide');
const { protect, admin } = require("../middleware/authMiddleware");

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
router.get("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Update user role (admin only)
// @route   PUT /api/admin/users/:id/role
router.put("/users/:id/role", protect, admin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password -__v");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/reviews', protect, admin, async (req, res) => {
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

// Delete review (admin)
router.delete('/reviews/:id', protect, admin, async (req, res) => {
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

// Update review status (admin)
router.put('/reviews/:id/status',  protect, admin, async (req, res) => {
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

// Toggle featured status (admin)
router.put('/reviews/:id/featured', protect, admin, async (req, res) => {
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

// Add response to review (admin)
router.post('/reviews/:id/response', protect, admin, async (req, res) => {
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


// Contact messages
router.get('/contacts', protect, admin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pages management
router.get('/pages', protect, admin, async (req, res) => {
  try {
    const pages = await Page.find().sort({ createdAt: -1 });
    res.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/pages', protect, admin, async (req, res) => {
  try {
    const { title, slug, content } = req.body;

    // Check if page with same slug exists
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return res.status(409).json({ error: 'Page with this slug already exists' });
    }

    const page = new Page({
      title,
      slug,
      content,
      author: req.user.id
    });

    await page.save();
    res.status(201).json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.put('/pages/:id/status', protect, admin, async (req, res) => {
  try {
    const { isPublished } = req.body;
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    page.isPublished = isPublished;
    await page.save();

    res.json({ isPublished: page.isPublished });
  } catch (error) {
    console.error('Error updating page status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/pages/:id', protect, admin, async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);
    
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    await Page.findByIdAndDelete(req.params.id);
    res.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting page:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Email history
router.get('/emails', protect, admin, async (req, res) => {
  try {
    const emails = await Email.find().sort({ createdAt: -1 });
    res.json(emails);
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk email
router.post('/emails/bulk', protect, admin, async (req, res) => {
  try {
    const { subject, content } = req.body;
    if (!subject || !content) {
      return res.status(400).json({ error: "Subject and content required" });
    }

    const subscribers = await User.find({ emailSubscribed: true }).select("email");
    
    // Create bulk email record in history
    const historyRecord = new EmailHistory({
      subject,
      content,
      type: 'bulk',
      status: 'processing',
      recipientCount: subscribers.length,
      sentBy: req.user.id
    });
    await historyRecord.save();

    const { transporter, hasEmailCredentials } = require("../utils/emailService");
    
    if (!hasEmailCredentials()) {
      await EmailHistory.findByIdAndUpdate(historyRecord._id, { 
        status: 'failed', 
        error: 'Email service not configured' 
      });
      return res.status(500).json({ error: "Email service not configured" });
    }

    // Process emails in batches to avoid overwhelming the server
    const batchSize = 10;
    let successfulSends = 0;
    let failedSends = 0;
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (subscriber) => {
        try {
          const mailOptions = {
            from: `Witty MoodTracker <${process.env.EMAIL_USER}>`,
            to: subscriber.email,
            subject: subject,
            html: content
          };
          
          await transporter.sendMail(mailOptions);
          successfulSends++;
          
          // Add to sent emails array
          await EmailHistory.findByIdAndUpdate(
            historyRecord._id,
            { 
              $push: { 
                sentEmails: {
                  email: subscriber.email,
                  status: 'sent',
                  sentAt: new Date()
                }
              }
            }
          );
          
        } catch (error) {
          console.error(`Failed to send email to ${subscriber.email}:`, error);
          failedSends++;
          
          // Add to failed emails array
          await EmailHistory.findByIdAndUpdate(
            historyRecord._id,
            { 
              $push: { 
                failedEmails: {
                  email: subscriber.email,
                  status: 'failed',
                  error: error.message,
                  failedAt: new Date()
                }
              }
            }
          );
        }
      });

      await Promise.all(batchPromises);
    }
    
    // Update history record status
    await EmailHistory.findByIdAndUpdate(historyRecord._id, { 
      status: 'completed', 
      successfulSends,
      failedSends,
      completedAt: new Date() 
    });

    res.json({ 
      message: "Bulk email sent successfully", 
      recipients: subscribers.length,
      successful: successfulSends,
      failed: failedSends,
      success: true,
      historyId: historyRecord._id
    });
  } catch (err) {
    console.error("Bulk email error:", err);
    
    // Update history record if it was created
    if (historyRecord && historyRecord._id) {
      await EmailHistory.findByIdAndUpdate(historyRecord._id, { 
        status: 'failed', 
        error: err.message 
      });
    }
    
    res.status(500).json({ error: err.message });
  }
});


// Blog management
router.get('/blogs',protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/blogs', protect, admin, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if blog with same slug exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(409).json({ error: 'Blog with this title already exists' });
    }

    const blog = new Blog({
      title,
      slug,
      content,
      category: category || 'news',
      author: req.user.id,
      readTime: Math.ceil(content.split(/\s+/).length / 200)
    });

    await blog.save();
    await blog.populate('author', 'username email');

    res.status(201).json(blog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Feature management
router.get('/features', protect, admin, async (req, res) => {
  try {
    const features = await Feature.find().sort({ order: 1, createdAt: -1 });
    res.json(features);
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/features',protect, admin, async (req, res) => {
  try {
    const { title, description, icon } = req.body;

    // Check if feature with same title exists
    const existingFeature = await Feature.findOne({ title });
    if (existingFeature) {
      return res.status(409).json({ error: 'Feature with this title already exists' });
    }

    const feature = new Feature({
      title,
      description,
      icon,
      status: 'active'
    });

    await feature.save();
    res.status(201).json(feature);
  } catch (error) {
    console.error('Error creating feature:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// FAQ management
router.get('/faqs', protect, admin, async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/faqs', protect, admin, async (req, res) => {
  try {
    const { question, answer, category } = req.body;

    const faq = new FAQ({
      question,
      answer,
      category: category || 'general',
      status: 'active'
    });

    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// ==================== PRICING MANAGEMENT ====================
// GET all pricing plans (admin)
router.get('/pricing', protect, admin, async (req, res) => {
  try {
    const pricingPlans = await PricingPlan.find().sort({ order: 1 });
    res.json(pricingPlans);
  } catch (error) {
    console.error('Error fetching pricing plans:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// CREATE pricing plan (admin) - COMPLETELY FIXED
router.post('/pricing', protect, admin, async (req, res) => {
  try {
    console.log('📦 [ADMIN] Received pricing data:', JSON.stringify(req.body, null, 2));
    
    let { name, description, price, monthlyPrice, yearlyPrice } = req.body;
    
    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Plan name is required' });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ error: 'Plan description is required' });
    }
    
    // Parse prices - handle multiple possible formats
    let finalMonthlyPrice = 0;
    let finalYearlyPrice = 0;
    
    // Format 1: { price: { monthly: 10, yearly: 100 } }
    if (price && typeof price === 'object') {
      if (price.monthly !== undefined && price.monthly !== null && price.monthly !== '') {
        finalMonthlyPrice = parseFloat(price.monthly);
        if (isNaN(finalMonthlyPrice)) finalMonthlyPrice = 0;
      }
      if (price.yearly !== undefined && price.yearly !== null && price.yearly !== '') {
        finalYearlyPrice = parseFloat(price.yearly);
        if (isNaN(finalYearlyPrice)) finalYearlyPrice = 0;
      }
    }
    // Format 2: { monthlyPrice: 10, yearlyPrice: 100 }
    else if (monthlyPrice !== undefined || yearlyPrice !== undefined) {
      if (monthlyPrice !== undefined && monthlyPrice !== null && monthlyPrice !== '') {
        finalMonthlyPrice = parseFloat(monthlyPrice);
        if (isNaN(finalMonthlyPrice)) finalMonthlyPrice = 0;
      }
      if (yearlyPrice !== undefined && yearlyPrice !== null && yearlyPrice !== '') {
        finalYearlyPrice = parseFloat(yearlyPrice);
        if (isNaN(finalYearlyPrice)) finalYearlyPrice = 0;
      }
    }
    
    // Ensure we have valid numbers (not NaN)
    if (isNaN(finalMonthlyPrice)) finalMonthlyPrice = 0;
    if (isNaN(finalYearlyPrice)) finalYearlyPrice = 0;
    
    // Set default prices if both are 0 (for free plan)
    if (finalMonthlyPrice === 0 && finalYearlyPrice === 0) {
      // This is fine for free plan
      console.log('Creating free plan');
    }
    
    console.log('💰 Processed prices:', { monthly: finalMonthlyPrice, yearly: finalYearlyPrice });
    
    // Check if plan with same name exists
    const existingPlan = await PricingPlan.findOne({ name: name.trim() });
    if (existingPlan) {
      return res.status(409).json({ error: 'Pricing plan with this name already exists' });
    }
    
    // Create the pricing plan
    const pricingPlan = new PricingPlan({
      name: name.trim(),
      description: description.trim(),
      price: {
        monthly: finalMonthlyPrice,
        yearly: finalYearlyPrice,
        currency: 'USD'
      },
      features: req.body.features || [],
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      isPopular: req.body.isPopular || false,
      order: req.body.order || 0,
      trialPeriod: req.body.trialPeriod || 0
    });
    
    await pricingPlan.save();
    console.log('✅ Pricing plan created successfully:', pricingPlan._id);
    res.status(201).json(pricingPlan);
    
  } catch (error) {
    console.error('❌ Error creating pricing plan:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// UPDATE pricing plan (admin)
router.put('/pricing/:id', protect, admin, async (req, res) => {
  try {
    const { name, description, price, monthlyPrice, yearlyPrice, features, isActive, isPopular, order, trialPeriod } = req.body;
    
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }
    
    // Update name if provided and not duplicate
    if (name && name.trim() !== pricingPlan.name) {
      const existingPlan = await PricingPlan.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
      if (existingPlan) {
        return res.status(409).json({ error: 'Pricing plan with this name already exists' });
      }
      pricingPlan.name = name.trim();
    }
    
    // Update description
    if (description) pricingPlan.description = description.trim();
    
    // Update prices - handle multiple formats
    if (price && typeof price === 'object') {
      if (price.monthly !== undefined) {
        const monthly = parseFloat(price.monthly);
        if (!isNaN(monthly)) pricingPlan.price.monthly = monthly;
      }
      if (price.yearly !== undefined) {
        const yearly = parseFloat(price.yearly);
        if (!isNaN(yearly)) pricingPlan.price.yearly = yearly;
      }
      if (price.currency) pricingPlan.price.currency = price.currency;
    }
    
    if (monthlyPrice !== undefined) {
      const monthly = parseFloat(monthlyPrice);
      if (!isNaN(monthly)) pricingPlan.price.monthly = monthly;
    }
    
    if (yearlyPrice !== undefined) {
      const yearly = parseFloat(yearlyPrice);
      if (!isNaN(yearly)) pricingPlan.price.yearly = yearly;
    }
    
    // Update features
    if (features && Array.isArray(features)) {
      pricingPlan.features = features;
    }
    
    // Update other fields
    if (isActive !== undefined) pricingPlan.isActive = isActive;
    if (isPopular !== undefined) pricingPlan.isPopular = isPopular;
    if (order !== undefined) pricingPlan.order = order;
    if (trialPeriod !== undefined) pricingPlan.trialPeriod = trialPeriod;
    
    pricingPlan.updatedAt = new Date();
    await pricingPlan.save();
    
    console.log('✅ Pricing plan updated successfully:', pricingPlan._id);
    res.json(pricingPlan);
    
  } catch (error) {
    console.error('Error updating pricing plan:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// DELETE pricing plan (admin)
router.delete('/pricing/:id', protect, admin, async (req, res) => {
  try {
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }
    
    await PricingPlan.findByIdAndDelete(req.params.id);
    console.log('✅ Pricing plan deleted successfully:', req.params.id);
    res.json({ message: 'Pricing plan deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting pricing plan:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle pricing plan active status (admin)
router.patch('/pricing/:id/toggle-active', protect, admin, async (req, res) => {
  try {
    console.log(`Toggling active status for plan: ${req.params.id}`);
    
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    pricingPlan.isActive = !pricingPlan.isActive;
    await pricingPlan.save();
    
    console.log(`Plan ${pricingPlan.name} is now ${pricingPlan.isActive ? 'active' : 'inactive'}`);
    res.json({ isActive: pricingPlan.isActive });
  } catch (error) {
    console.error('Error toggling plan status:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Toggle pricing plan popular status (admin)
router.patch('/pricing/:id/popular', protect, admin, async (req, res) => {
  try {
    console.log(`Toggling popular status for plan: ${req.params.id}`);
    
    const pricingPlan = await PricingPlan.findById(req.params.id);
    if (!pricingPlan) {
      return res.status(404).json({ error: 'Pricing plan not found' });
    }

    pricingPlan.isPopular = !pricingPlan.isPopular;
    await pricingPlan.save();
    
    console.log(`Plan ${pricingPlan.name} is now ${pricingPlan.isPopular ? 'popular' : 'not popular'}`);
    res.json({ isPopular: pricingPlan.isPopular });
  } catch (error) {
    console.error('Error toggling popular status:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Guide management routes for admin panel
router.get('/guides', protect, admin, async (req, res) => {
  try {
    const guides = await Guide.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/guides', protect, admin, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if guide with same slug exists
    const existingGuide = await Guide.findOne({ slug });
    if (existingGuide) {
      return res.status(409).json({ error: 'Guide with this title already exists' });
    }

    const guide = new Guide({
      title,
      slug,
      content,
      category: category || 'getting-started',
      author: req.user.id,
      readTime: Math.ceil(content.split(/\s+/).length / 200)
    });

    await guide.save();
    await guide.populate('author', 'username email');

    res.status(201).json(guide);
  } catch (error) {
    console.error('Error creating guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/guides/:id', protect, admin, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    Object.assign(guide, req.body);
    await guide.save();

    res.json(guide);
  } catch (error) {
    console.error('Error updating guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/guides/:id', protect, admin, async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    await Guide.findByIdAndDelete(req.params.id);
    res.json({ message: 'Guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/guides/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    guide.status = status;
    await guide.save();

    res.json({ status: guide.status });
  } catch (error) {
    console.error('Error updating guide status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Export data
router.get('/export/:type', protect, admin, async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = await User.find().select('-password');
        filename = 'users';
        break;
      case 'reviews':
        data = await Review.find().populate('user', 'username email');
        filename = 'reviews';
        break;
      case 'contacts':
        data = await Contact.find();
        filename = 'contacts';
        break;
      case 'pages':
        data = await Page.find();
        filename = 'pages';
        break;
      default:
        return res.status(400).json({ error: 'Invalid export type' });
    }

    // Convert to CSV (simplified)
    const csv = data.map(item => {
      return Object.values(item.toObject()).join(',');
    }).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-export.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalReviews,
      pendingContacts,
      emailsSent,
      totalBlogs,
      totalFeatures,
      totalFaqs,
      totalPricingPlans,
      totalGuides
    ] = await Promise.all([
      User.countDocuments(),
      Review.countDocuments(),
      Contact.countDocuments({ status: 'pending' }),
      Email.countDocuments(),
      Blog.countDocuments(),
      Feature.countDocuments(),
      FAQ.countDocuments(),
      PricingPlan.countDocuments(),
      Guide.countDocuments()
    ]);

    res.json({
      totalUsers,
      totalReviews,
      pendingContacts,
      emailsSent,
      totalBlogs,
      totalFeatures,
      totalFaqs,
      totalPricingPlans,
      totalGuides
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



module.exports = router;
