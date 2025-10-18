import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchVendors, submitOrder, getDummyVendors } from '../utils/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [cart, setCart] = useState([]);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderForm, setOrderForm] = useState({ name: '', room: '', phone: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVendors();
      setVendors(data);
    } catch (err) {
      setError(err.message);
      setVendors(getDummyVendors());
      console.error('Using dummy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item, vendorName) => {
    const existing = cart.find(i => i._id === item._id);
    if (existing) {
      setCart(cart.map(i => 
        i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1, vendor: vendorName }]);
    }
  };

  const updateQuantity = (id, change) => {
    setCart(
      cart
        .map(i => i._id === id ? { ...i, quantity: Math.max(0, i.quantity + change) } : i)
        .filter(i => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(i => i._id !== id));
  };

  const getCartTotal = () => {
    return cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  };

  const handleConfirmOrder = async () => {
    if (!orderForm.name || !orderForm.room || !orderForm.phone) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    const deliveryFee = 20;
    
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
      totalAmount: getCartTotal() + deliveryFee
    };

    try {
      await submitOrder(orderData);
      setIsOrderFormOpen(false);
      setOrderPlaced(true);
      
      setTimeout(() => {
        setOrderPlaced(false);
        setCart([]);
        setOrderForm({ name: '', room: '', phone: '' });
      }, 3000);
    } catch (err) {
      alert('Failed to place order. Please try again.');
      console.error('Order error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    vendors,
    cart,
    searchQuery,
    setSearchQuery,
    orderForm,
    setOrderForm,
    orderPlaced,
    loading,
    error,
    isOrderFormOpen,
    setIsOrderFormOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    handleConfirmOrder
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};