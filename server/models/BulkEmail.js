const mongoose = require("mongoose");

const bulkEmailSchema = new mongoose.Schema({
  subject: String,
  content: String,
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BulkEmail", bulkEmailSchema);
