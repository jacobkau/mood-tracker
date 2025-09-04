const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  type: {
    type: String,
    enum: ['contact', 'partnership'],
    default: 'contact'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved'],
    default: 'new'
  },
  responded: {
    type: Boolean,
    default: false
  },
  response: {
    message: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for better query performance
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, type: 1 });

// Static method to get contact statistics
contactSchema.statics.getStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$type',
        total: { $sum: 1 },
        new: {
          $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] }
        },
        replied: {
          $sum: { $cond: [{ $eq: ['$status', 'replied'] }, 1, 0] }
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Contact', contactSchema);
