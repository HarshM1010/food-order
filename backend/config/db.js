const mongoose = require('mongoose');
const Vendor = require('./models/Vendor');
const MenuItem = require('./models/MenuItem');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Vendor.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('Cleared existing data');

    // Create vendors
    const vendor1 = await Vendor.create({
      name: "Spice Route",
      description: "Authentic North Indian",
      timing: "10:00 AM - 10:00 PM",
      image: "🍛"
    });

    const vendor2 = await Vendor.create({
      name: "Aunty's Home Kitchen",
      description: "Homestyle Comfort Food",
      timing: "12:00 PM - 8:00 PM",
      image: "🏠"
    });

    const vendor3 = await Vendor.create({
      name: "Burger Hub",
      description: "Fast Food Paradise",
      timing: "11:00 AM - 11:00 PM",
      image: "🍔"
    });

    const vendor4 = await Vendor.create({
      name: "Dosa Corner",
      description: "South Indian Delights",
      timing: "7:00 AM - 9:00 PM",
      image: "🫓"
    });

    console.log('Vendors created');

    // Create menu items for Spice Route
    await MenuItem.insertMany([
      { vendorId: vendor1._id, name: "Paneer Tikka", category: "Starters", price: 120 },
      { vendorId: vendor1._id, name: "Samosa (2 pcs)", category: "Starters", price: 40 },
      { vendorId: vendor1._id, name: "Spring Rolls", category: "Starters", price: 80 },
      { vendorId: vendor1._id, name: "Butter Chicken", category: "Main Course", price: 180 },
      { vendorId: vendor1._id, name: "Dal Makhani", category: "Main Course", price: 140 },
      { vendorId: vendor1._id, name: "Paneer Butter Masala", category: "Main Course", price: 160 },
      { vendorId: vendor1._id, name: "Lassi", category: "Beverages", price: 50 },
      { vendorId: vendor1._id, name: "Masala Chai", category: "Beverages", price: 20 }
    ]);

    // Create menu items for Aunty's Home Kitchen
    await MenuItem.insertMany([
      { vendorId: vendor2._id, name: "Special Veg Thali", category: "Thali", price: 100 },
      { vendorId: vendor2._id, name: "Non-Veg Thali", category: "Thali", price: 150 },
      { vendorId: vendor2._id, name: "Rajma Chawal", category: "Main Course", price: 80 },
      { vendorId: vendor2._id, name: "Chole Bhature", category: "Main Course", price: 90 },
      { vendorId: vendor2._id, name: "Aloo Paratha (2 pcs)", category: "Main Course", price: 60 },
      { vendorId: vendor2._id, name: "Nimbu Pani", category: "Beverages", price: 30 },
      { vendorId: vendor2._id, name: "Buttermilk", category: "Beverages", price: 25 }
    ]);

    // Create menu items for Burger Hub
    await MenuItem.insertMany([
      { vendorId: vendor3._id, name: "Classic Veg Burger", category: "Burgers", price: 80 },
      { vendorId: vendor3._id, name: "Chicken Burger", category: "Burgers", price: 120 },
      { vendorId: vendor3._id, name: "Paneer Burger", category: "Burgers", price: 100 },
      { vendorId: vendor3._id, name: "French Fries", category: "Sides", price: 60 },
      { vendorId: vendor3._id, name: "Onion Rings", category: "Sides", price: 70 },
      { vendorId: vendor3._id, name: "Cold Coffee", category: "Beverages", price: 80 },
      { vendorId: vendor3._id, name: "Soft Drink", category: "Beverages", price: 40 }
    ]);

    // Create menu items for Dosa Corner
    await MenuItem.insertMany([
      { vendorId: vendor4._id, name: "Plain Dosa", category: "Dosas", price: 50 },
      { vendorId: vendor4._id, name: "Masala Dosa", category: "Dosas", price: 70 },
      { vendorId: vendor4._id, name: "Paneer Dosa", category: "Dosas", price: 90 },
      { vendorId: vendor4._id, name: "Idli (3 pcs)", category: "Idli & Vada", price: 40 },
      { vendorId: vendor4._id, name: "Medu Vada (2 pcs)", category: "Idli & Vada", price: 50 },
      { vendorId: vendor4._id, name: "Filter Coffee", category: "Beverages", price: 30 },
      { vendorId: vendor4._id, name: "Sambhar", category: "Beverages", price: 20 }
    ]);

    console.log('Menu items created');
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();