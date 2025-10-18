const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchVendors = async () => {
  const response = await fetch(`${API_URL}/vendors`);
  if (!response.ok) throw new Error('Failed to fetch vendors');
  return response.json();
};

export const fetchMenuItems = async (vendorId) => {
  const response = await fetch(`${API_URL}/menu/vendor/${vendorId}`);
  if (!response.ok) throw new Error('Failed to fetch menu');
  return response.json();
};

export const submitOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error('Failed to place order');
  return response.json();
};

export const getDummyVendors = () => [
  { _id: '1', name: "Spice Route", description: "Authentic North Indian", timing: "10:00 AM - 10:00 PM", image: "🍛" },
  { _id: '2', name: "Aunty's Kitchen", description: "Homestyle Food", timing: "12:00 PM - 8:00 PM", image: "🏠" },
  { _id: '3', name: "Burger Hub", description: "Fast Food Paradise", timing: "11:00 AM - 11:00 PM", image: "🍔" },
  { _id: '4', name: "Dosa Corner", description: "South Indian Delights", timing: "7:00 AM - 9:00 PM", image: "🫓" }
];

export const getDummyMenu = () => [
  {
    name: "Starters",
    items: [
      { _id: '101', name: "Paneer Tikka", price: 120 },
      { _id: '102', name: "Samosa (2 pcs)", price: 40 },
      { _id: '103', name: "Spring Rolls", price: 80 }
    ]
  },
  {
    name: "Main Course",
    items: [
      { _id: '104', name: "Butter Chicken", price: 180 },
      { _id: '105', name: "Dal Makhani", price: 140 },
      { _id: '106', name: "Biryani", price: 200 }
    ]
  },
  {
    name: "Beverages",
    items: [
      { _id: '107', name: "Cold Coffee", price: 60 },
      { _id: '108', name: "Fresh Juice", price: 50 }
    ]
  }
];