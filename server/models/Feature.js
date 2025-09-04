const mongoose = require('mongoose');

const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  icon: {
    type: String,
    required: true
  },
  image: {
    url: String,
    alt: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'coming_soon'],
    default: 'active'
  },
  order: {
    type: Number,
    default: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Feature', featureSchema);
