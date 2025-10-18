import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Create the context
export const AppContext = createContext();

const API_URL = 'http://localhost:5000/api';

// 2. Create the Provider Component
const AppProvider = ({ children }) => {
  const [vendors, setVendors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState('Not Sent'); // 'Not Sent', 'Pending', 'Accepted', 'Declined'
  const [requestMessage, setRequestMessage] = useState('');

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendors`);
      if (!response.ok) throw new Error('Failed');
      const data = await response.json();
      setVendors(data);
    } catch (err) {
      setError(err.message);
      // Fallback data in case the server isn't running
      setVendors([
        { _id: '1', name: "Spice Route", description: "Authentic North Indian", timing: "10:00 AM - 10:00 PM", image: "🍛", notice: "Today's Special: Butter Chicken at 15% off!" },
        { _id: '2', name: "Aunty's Kitchen", description: "Homestyle Food", timing: "12:00 PM - 8:00 PM", image: "🏠", notice: "We are closed on Tuesdays. Pre-orders available." },
        { _id: '3', name: "Burger Hub", description: "Fast Food", timing: "11:00 AM - 11:00 PM", image: "🍔", notice: "Buy one get one free on all beef burgers." },
        { _id: '4', name: "Dosa Corner", description: "South Indian", timing: "7:00 AM - 9:00 PM", image: "🫓", notice: "Try our new Mysore Masala Dosa!" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitRequest = (message) => {
    if(!message.trim()) {
      alert("Please enter a request.");
      return;
    }
    console.log("Submitting request:", message);
    setRequestMessage(message);
    setRequestStatus('Pending');
  };

  // Simulate vendor action
  const handleVendorResponse = (response) => {
    if (response === 'accept') {
      setRequestStatus('Accepted');
    } else {
      setRequestStatus('Declined');
    }
  };
  
  const resetRequest = () => {
    setRequestStatus('Not Sent');
    setRequestMessage('');
  }


  // 3. Provide the state and functions to children
  return (
    <AppContext.Provider value={{
      vendors, searchQuery, setSearchQuery,
      loading, error, requestStatus, requestMessage,
      submitRequest, handleVendorResponse, resetRequest
    }}>
      {children}
    </AppContext.Provider>
  );
};

// 4. Create and export the custom hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined || context === null) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// 5. Export the provider as default
export default AppProvider;
