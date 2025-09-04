const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly']
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 300
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: 200
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: 500
  },
  keywords: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  template: {
    type: String,
    enum: ['default', 'home', 'about', 'contact', 'privacy', 'terms', 'custom'],
    default: 'default'
  },
  order: {
    type: Number,
    default: 0
  },
  featuredImage: {
    url: String,
    alt: String,
    caption: String
  },
  seo: {
    canonicalUrl: String,
    noIndex: { type: Boolean, default: false },
    noFollow: { type: Boolean, default: false }
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentPage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    default: null
  },
  isHomepage: {
    type: Boolean,
    default: false
  },
  showInNavigation: {
    type: Boolean,
    default: true
  },
  navigationLabel: {
    type: String,
    trim: true,
    maxlength: 50
  },
  customCss: String,
  customJs: String,
  accessLevel: {
    type: String,
    enum: ['public', 'private', 'members-only'],
    default: 'public'
  },
  views: {
    type: Number,
    default: 0
  },
  lastEditedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  publishedAt: Date,
  scheduledPublish: Date,
  scheduledUnpublish: Date,
  revisions: [{
    content: String,
    excerpt: String,
    metaTitle: String,
    metaDescription: String,
    editedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
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

// Indexes for better performance
pageSchema.index({ slug: 1 }, { unique: true });
pageSchema.index({ status: 1 });
pageSchema.index({ isHomepage: 1 });
pageSchema.index({ showInNavigation: 1 });
pageSchema.index({ parentPage: 1 });
pageSchema.index({ order: 1 });
pageSchema.index({ publishedAt: -1 });
pageSchema.index({ tags: 1 });

// Pre-save middleware to handle slug generation and homepage uniqueness
pageSchema.pre('save', async function(next) {
  // Generate slug from title if not provided
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Ensure only one homepage exists
  if (this.isHomepage) {
    try {
      await this.constructor.updateMany(
        { _id: { $ne: this._id }, isHomepage: true },
        { isHomepage: false }
      );
    } catch (error) {
      return next(error);
    }
  }

  // Set publishedAt date when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  this.updatedAt = Date.now();
  next();
});

// Static method to get navigation pages
pageSchema.statics.getNavigation = function() {
  return this.find({
    status: 'published',
    showInNavigation: true,
    accessLevel: 'public'
  })
  .select('title slug navigationLabel order parentPage')
  .sort({ order: 1, title: 1 })
  .lean();
};

// Static method to get page by slug with author info
pageSchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, status: 'published' })
    .populate('author', 'name email')
    .populate('lastEditedBy', 'name email');
};

// Instance method to increment views
pageSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to create revision
pageSchema.methods.createRevision = function(userId) {
  this.revisions.unshift({
    content: this.content,
    excerpt: this.excerpt,
    metaTitle: this.metaTitle,
    metaDescription: this.metaDescription,
    editedBy: userId
  });

  // Keep only last 10 revisions
  if (this.revisions.length > 10) {
    this.revisions = this.revisions.slice(0, 10);
  }

  return this.save();
};

// Virtual for full URL
pageSchema.virtual('url').get(function() {
  return this.slug === 'home' ? '/' : `/${this.slug}`;
});

// Virtual for reading time
pageSchema.virtual('readingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

module.exports = mongoose.model('Page', pageSchema);
