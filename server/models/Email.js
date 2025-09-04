const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  source: {
    type: String,
    enum: ['newsletter', 'contact', 'waitlist', 'beta', 'other'],
    default: 'newsletter'
  },
  name: {
    type: String,
    trim: true,
    maxlength: 100
  },
  subscribed: {
    type: Boolean,
    default: true
  },
  preferences: {
    newsletter: { type: Boolean, default: true },
    updates: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    location: {
      country: String,
      city: String,
      region: String
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  unsubscribedAt: Date,
  unsubscribeReason: String,
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

// Index for better query performance
emailSchema.index({ email: 1 }, { unique: true });
emailSchema.index({ source: 1 });
emailSchema.index({ subscribed: 1 });
emailSchema.index({ createdAt: -1 });
emailSchema.index({ tags: 1 });

// Static method to get subscription stats
emailSchema.statics.getSubscriptionStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$source',
        total: { $sum: 1 },
        subscribed: {
          $sum: { $cond: [{ $eq: ['$subscribed', true] }, 1, 0] }
        },
        unsubscribed: {
          $sum: { $cond: [{ $eq: ['$subscribed', false] }, 1, 0] }
        }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

// Static method to get growth stats
emailSchema.statics.getGrowthStats = function(days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
  ]);
};

// Instance method to unsubscribe
emailSchema.methods.unsubscribe = function(reason = 'User requested') {
  this.subscribed = false;
  this.unsubscribedAt = new Date();
  this.unsubscribeReason = reason;
  return this.save();
};

// Pre-save middleware to handle updates
emailSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for email status
emailSchema.virtual('status').get(function() {
  return this.subscribed ? 'subscribed' : 'unsubscribed';
});

module.exports = mongoose.model('Email', emailSchema);
