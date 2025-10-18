const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
    required:true
  },
  shopName:{
    type: String,
    required: true,
  },
  address:{
    type: String,
  },
  description: {
    type: String,
  },
  vendorPic:{
    type: String,
  },
  timing: {
    type: String,
    required: true,
  },
  isServing:{
    type: Boolean,
    default: true,
  },
  orders:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Order",
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vendor', VendorSchema);