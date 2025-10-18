import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Menu from './components/Menu';
import Cart from './components/Cart';

const App = () => {
  return (
    <Router>
      <AppProvider>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu/:vendorId" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
};

export default App;