const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 300
  },
  category: {
    type: String,
    required: true,
    enum: ['getting-started', 'tutorials', 'tips', 'troubleshooting', 'advanced']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  featuredImage: {
    url: String,
    alt: String
  },
  readTime: Number,
  views: {
    type: Number,
    default: 0
  },
  relatedGuides: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guide'
  }],
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

guideSchema.index({ slug: 1 }, { unique: true });
guideSchema.index({ category: 1 });
guideSchema.index({ difficulty: 1 });

module.exports = mongoose.model('Guide', guideSchema);
