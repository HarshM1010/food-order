import React from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    orderForm,
    setOrderForm,
    handleConfirmOrder,
    loading,
    orderPlaced,
    isOrderFormOpen,
    setIsOrderFormOpen
  } = useApp();

  const deliveryFee = 20;
  const totalAmount = getCartTotal() + (cart.length > 0 ? deliveryFee : 0);

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-2">Add items from the menu to get started</p>
            <button
              onClick={() => navigate('/')}
              className="items-center px-3 mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Back to home page
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
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
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white rounded-full px-2 py-1 shadow-sm">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Minus className="w-4 h-4 text-orange-600" />
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4 text-orange-600" />
                      </button>
                    </div>
                    <p className="font-bold text-orange-600">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
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

            {/* Place Order Button */}
            <button
              onClick={() => setIsOrderFormOpen(true)}
              className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Place Order
            </button>
          </>
        )}
      </div>

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
                  onClick={() => setIsOrderFormOpen(false)}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmOrder}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Confirm Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {orderPlaced && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl text-center animate-scaleIn">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
            <p className="text-gray-600">Your order has been placed successfully. The vendor will contact you shortly.</p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Cart;