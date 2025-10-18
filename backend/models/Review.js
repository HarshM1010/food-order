const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  order:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Order",
    required:true
  },
  review:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Review', ReviewSchema);