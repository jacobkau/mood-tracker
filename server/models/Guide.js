const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  time: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Getting Started', 'Analytics', 'Advanced', 'Therapy', 'Productivity', 'Relationships']
  },
  order: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  steps: [{
    title: String,
    content: String,
    imageUrl: String
  }],
  prerequisites: [{
    type: String
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['article', 'video', 'tool', 'book']
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
guideSchema.index({ published: 1, level: 1, category: 1 });
guideSchema.index({ featured: 1, published: 1 });

module.exports = mongoose.model('Guide', guideSchema);
