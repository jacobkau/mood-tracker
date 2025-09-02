const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
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
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  published: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Guide', guideSchema);
