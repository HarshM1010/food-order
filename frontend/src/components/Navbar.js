import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';


const Navbar = () => {
  const { cart, user, logout } = useApp(); // assuming you store user info in context
  const navigate = useNavigate();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close dropdown if clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout(); // call your logout function from context
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto py-4 flex items-center justify-between">
        {/* Brand Name */}
        <button
          onClick={() => navigate('/')}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Campus Cravings
        </button>

        <div className="flex items-center gap-4">
          {/* Cart Button */}
          <button
            onClick={() => navigate('/cart')}
            className="relative p-3 hover:bg-orange-100 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ShoppingCart className="w-6 h-6 text-orange-600" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-3 hover:bg-orange-100 rounded-full transition-all duration-300 hover:scale-110"
            >
              <User className="w-6 h-6 text-orange-600" />
            </button>

            {menuOpen && (
              <div className="flex flex-col justify-center absolute left-0 mt-2 w-[15rem] h-[10rem] bg-gray-100 shadow-lg rounded-lg py-2 border border-gray-100 animate-fadeIn">
                <div className="px-4 py-2 border-b border-gray-300">
                  <p className="text-md text-gray-600">
                    <span className="font-semibold">Name:</span> {user?.name || 'Guest'}
                  </p>
                  <p className="text-md text-gray-600">
                    <span className="font-semibold">Role:</span> {user?.role || '—'}
                  </p>
                </div>
                {/* <button
                  onClick={() => navigate(user?.role === 'vendor' ? '/vendor-dashboard' : '/user-profile')}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-gray-700"
                >
                  View Profile
                </button> */}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-orange-50 text-red-600 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;