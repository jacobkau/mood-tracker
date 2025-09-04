const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  name: {
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
  price: {
    monthly: {
      type: Number,
      required: true
    },
    yearly: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  features: [{
    name: String,
    included: Boolean,
    description: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  trialPeriod: {
    type: Number,
    default: 0
  },
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

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
