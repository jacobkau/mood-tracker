const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  approved: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  avatar: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
testimonialSchema.index({ approved: 1, featured: -1, rating: -1 });
testimonialSchema.index({ user: 1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
