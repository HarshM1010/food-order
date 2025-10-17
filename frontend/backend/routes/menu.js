const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get menu items by vendor
router.get('/vendor/:vendorId', async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ 
      vendorId: req.params.vendorId,
      isAvailable: true 
    });
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create menu item
router.post('/', async (req, res) => {
  const menuItem = new MenuItem({
    vendorId: req.body.vendorId,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
  });

  try {
    const newMenuItem = await menuItem.save();
    res.status(201).json(newMenuItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;