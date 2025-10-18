const mongoose = require("mongoose");

const NoticeSchema = new mongoose.Schema({
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Optional image URL (if vendor wants to attach one)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date, // Optional expiry date for notice
  },
});

module.exports = mongoose.model("Notice", NoticeSchema);
