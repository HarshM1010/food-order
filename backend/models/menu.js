const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  vendor:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Vendor",
    required:true
  },
  menuPic:{
    type: [String],
    required:true,
  },
});

module.exports = mongoose.model('menu',  MenuSchema);