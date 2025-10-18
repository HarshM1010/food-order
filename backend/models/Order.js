const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  vendor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true
  },
  orderMsg:{
    type: String,
    required:true,
  },
  isRejected:{
    type: Boolean,
    default: false,
  },
  isCompleted:{
    type: Boolean,
    default: false,
  },
  isCancelled:{
    type: Boolean,
    default: false,
  },
  review:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Review",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  timestamps: true
});

module.exports = mongoose.model('Order', OrderSchema);