const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
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
    lowercase: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Mental Health', 'Wellness', 'Technology', 'Science', 'Relationships', 'Productivity', 'Therapy', 'Research']
  },
  readTime: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  metaDescription: {
    type: String,
    maxlength: 160
  }
}, {
  timestamps: true
});

// Generate slug from title before saving
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  next();
});

blogPostSchema.index({ published: 1, createdAt: -1 });
blogPostSchema.index({ category: 1, published: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
