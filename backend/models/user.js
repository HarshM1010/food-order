const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
  },
  accountType: {
    type: String,
    required: true,
    enum: ['Student', 'Vendor', 'Admin'],
    default: 'Student',
  },
  phoneNum:{
    type: String,
    required: true,
  },
  email:{
    type: String,
  },
  password:{
    type: String,
    required: true,
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

module.exports = mongoose.model('User', UserSchema);