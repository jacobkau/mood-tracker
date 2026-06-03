const mongoose = require('mongoose');

const pricingPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    trim: true,
    maxlength: [100, 'Plan name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    monthly: {
      type: Number,
      required: [true, 'Monthly price is required'],
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    yearly: {
      type: Number,
      required: [true, 'Yearly price is required'],
      default: 0,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      maxlength: 3
    }
  },
  features: [{
    name: {
      type: String,
      required: true
    },
    included: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: ''
    }
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
    default: 0,
    min: 0
  },
  trialPeriod: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Add index for better query performance
pricingPlanSchema.index({ isActive: 1, order: 1 });
pricingPlanSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model('PricingPlan', pricingPlanSchema);
