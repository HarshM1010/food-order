import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navbar = () => {
  const { cart } = useApp();
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          Campus Cravings
        </button>
        
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
      </div>
    </header>
  );
};

export default Navbar;