const mongoose = require('mongoose');

const emailHistorySchema = new mongoose.Schema({
  subject: String,
  content: String,
  type: {
    type: String,
    enum: ['bulk', 'individual', 'newsletter', 'notification'],
    default: 'bulk'
  },
  status: {
    type: String,
    enum: ['sent', 'failed', 'pending', 'processing', 'completed'],
    default: 'pending'
  },
  error: String,
  sentAt: {
    type: Date,
    default: Date.now
  },
  recipientCount: Number,
  successfulSends: {
    type: Number,
    default: 0
  },
  failedSends: {
    type: Number,
    default: 0
  },
  sentEmails: [{
    email: String,
    status: String,
    sentAt: Date
  }],
  failedEmails: [{
    email: String,
    status: String,
    error: String,
    failedAt: Date
  }],
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  completedAt: Date
}, {
  timestamps: true
});

// No unique index on email field
emailHistorySchema.index({ email: 1 });
emailHistorySchema.index({ sentAt: -1 });
emailHistorySchema.index({ status: 1 });

module.exports = mongoose.model('EmailHistory', emailHistorySchema);
