const mongoose = require('mongoose');

const emailHistorySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: String,
  content: String,
  type: {
    type: String,
    enum: ['bulk', 'individual', 'newsletter', 'notification'],
    default: 'bulk'
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending'],
    default: 'pending'
  },
  error: String,
  sentAt: {
    type: Date,
    default: Date.now
  },
  recipientCount: Number
}, {
  timestamps: true
});

// No unique index on email field
emailHistorySchema.index({ email: 1 });
emailHistorySchema.index({ sentAt: -1 });
emailHistorySchema.index({ status: 1 });

module.exports = mongoose.model('EmailHistory', emailHistorySchema);
