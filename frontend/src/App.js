import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, X, Plus, Minus, ArrowLeft, Clock, ChevronRight, AlertCircle } from 'lucide-react';

const CampusCravings = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderForm, setOrderForm] = useState({ name: '', room: '', phone: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // API Base URL - Change this to your backend URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  // Fetch all vendors
  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      setVendors(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching vendors:', err);
      // Fallback to dummy data if API fails
      setVendors(getDummyVendors());
    } finally {
      setLoading(false);
    }
  };

  // Fetch menu items for a specific vendor
  const fetchMenuItems = async (vendorId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/menu/vendor/${vendorId}`);
      if (!response.ok) throw new Error('Failed to fetch menu');
      const data = await response.json();
      
      // Group items by category
      const groupedMenu = data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {});

      // Convert to array format
      const menuCategories = Object.keys(groupedMenu).map(category => ({
        name: category,
        items: groupedMenu[category]
      }));

      setMenuItems(menuCategories);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching menu:', err);
      // Fallback to dummy data if API fails
      setMenuItems(getDummyMenu());
    } finally {
      setLoading(false);
    }
  };

  // Submit order to backend
  const submitOrder = async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to place order');
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error placing order:', err);
      throw err;
    }
  };

  const addToCart = (item, vendorName) => {
    const existingItem = cart.find(cartItem => cartItem._id === item._id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, vendor: vendorName }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item =>
      item._id === itemId
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item._id !== itemId));
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const deliveryFee = 20;
  const totalAmount = getCartTotal() + (cart.length > 0 ? deliveryFee : 0);

  const handleVendorClick = async (vendor) => {
    setSelectedVendor(vendor);
    setCurrentView('menu');
    await fetchMenuItems(vendor._id);
  };

  const handlePlaceOrder = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!orderForm.name || !orderForm.room || !orderForm.phone) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    // Prepare order data
    const orderData = {
      customerName: orderForm.name,
      roomNumber: orderForm.room,
      phoneNumber: orderForm.phone,
      items: cart.map(item => ({
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        vendor: item.vendor
      })),
      subtotal: getCartTotal(),
      deliveryFee: deliveryFee,
      totalAmount: totalAmount
    };

    try {
      await submitOrder(orderData);
      setIsOrderFormOpen(false);
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        setCart([]);
        setOrderForm({ name: '', room: '', phone: '' });
        setCurrentView('home');
        setLoading(false);
      }, 3000);
    } catch (err) {
      setLoading(false);
      alert('Failed to place order. Please try again.');
    }
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dummy data fallback functions
  const getDummyVendors = () => [
    {
      _id: '1',
      name: "Spice Route",
      description: "Authentic North Indian",
      timing: "10:00 AM - 10:00 PM",
      image: "🍛"
    },
    {
      _id: '2',
      name: "Aunty's Home Kitchen",
      description: "Homestyle Comfort Food",
      timing: "12:00 PM - 8:00 PM",
      image: "🏠"
    },
    {
      _id: '3',
      name: "Burger Hub",
      description: "Fast Food Paradise",
      timing: "11:00 AM - 11:00 PM",
      image: "🍔"
    },
    {
      _id: '4',
      name: "Dosa Corner",
      description: "South Indian Delights",
      timing: "7:00 AM - 9:00 PM",
      image: "🫓"
    }
  ];

  const getDummyMenu = () => [
    {
      name: "Starters",
      items: [
        { _id: '101', name: "Paneer Tikka", price: 120 },
        { _id: '102', name: "Samosa (2 pcs)", price: 40 }
      ]
    },
    {
      name: "Main Course",
      items: [
        { _id: '103', name: "Butter Chicken", price: 180 },
        { _id: '104', name: "Dal Makhani", price: 140 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {currentView === 'menu' && (
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Campus Cravings
            </h1>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 hover:bg-orange-100 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart className="w-6 h-6 text-orange-600" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-pulse">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Using demo data</p>
              <p className="text-yellow-700 text-sm">Backend API not connected. Start your backend server to see live data.</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        )}

        {!loading && currentView === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for restaurants or food items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all shadow-sm"
              />
            </div>

            {/* Vendors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  onClick={() => handleVendorClick(vendor)}
                  className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border-2 border-transparent hover:border-orange-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{vendor.image}</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{vendor.name}</h3>
                          <p className="text-gray-600 text-sm">{vendor.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm mt-3">
                        <Clock className="w-4 h-4" />
                        <span>{vendor.timing}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              ))}
            </div>

            {filteredVendors.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No vendors found matching your search</p>
              </div>
            )}
          </div>
        )}

        {!loading && currentView === 'menu' && selectedVendor && (
          <div className="space-y-6 animate-fadeIn">
            {/* Vendor Header */}
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedVendor.image}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedVendor.name}</h2>
                  <p className="text-gray-600">{selectedVendor.description}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedVendor.timing}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Categories */}
            {menuItems.length > 0 ? (
              menuItems.map((category, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-orange-200 pb-2">
                    {category.name}
                  </h3>
                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-4 rounded-xl hover:bg-orange-50 transition-colors"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-orange-600 font-bold mt-1">₹{item.price}</p>
                        </div>
                        <button
                          onClick={() => addToCart(item, selectedVendor.name)}
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 font-medium shadow-md"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500">No menu items available for this vendor</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn">
          <div className="absolute right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl animate-slideInRight overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item._id} className="bg-gray-50 rounded-xl p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-800">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.vendor}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <Minus className="w-4 h-4 text-orange-600" />
                            </button>
                            <span className="font-semibold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="p-1 hover:bg-gray-100 rounded-full"
                            >
                              <Plus className="w-4 h-4 text-orange-600" />
                            </button>
                          </div>
                          <p className="font-bold text-orange-600">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t-2 border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span>₹{getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Delivery Fee</span>
                      <span>₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                      <span>Total</span>
                      <span>₹{totalAmount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {isOrderFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Hostel Room Number</label>
                <input
                  type="text"
                  value={orderForm.room}
                  onChange={(e) => setOrderForm({ ...orderForm, room: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all"
                  placeholder="e.g., H-12, Room 304"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all"
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsOrderFormOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center animate-scaleIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
            <p className="text-gray-600">Your order has been placed. The vendor will contact you shortly.</p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideInRight { animation: slideInRight 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default CampusCravings;