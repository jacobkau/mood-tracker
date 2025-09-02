const mongoose = require('mongoose');

const newsletterSubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  preferences: {
    weeklyDigest: {
      type: Boolean,
      default: true
    },
    productUpdates: {
      type: Boolean,
      default: true
    },
    mentalHealthTips: {
      type: Boolean,
      default: true
    }
  }
});

// Index for better query performance
newsletterSubscriberSchema.index({ email: 1 });
newsletterSubscriberSchema.index({ active: 1 });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriberSchema);
