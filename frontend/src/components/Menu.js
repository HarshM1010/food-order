import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fetchMenuItems, getDummyMenu } from '../utils/api';

const Menu = () => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { vendorId } = useParams();
  const vendor = location.state?.vendor;
  
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendor) {
      loadMenuItems(vendor._id);
    }
  }, [vendor]);

  const loadMenuItems = async (id) => {
    setLoading(true);
    try {
      const data = await fetchMenuItems(id);
      
      const groupedMenu = data.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
      }, {});

      setMenuItems(
        Object.keys(groupedMenu).map(category => ({
          name: category,
          items: groupedMenu[category]
        }))
      );
    } catch (err) {
      console.error('Error fetching menu:', err);
      setMenuItems(getDummyMenu());
    } finally {
      setLoading(false);
    }
  };

  if (!vendor) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">Please select a vendor from the home page</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          {/* Vendor Header */}
          <div className="flex items-center gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-md flex-1">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{vendor.image}</span>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{vendor.name}</h2>
                  <p className="text-gray-600">{vendor.description}</p>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{vendor.timing}</span>
                  </div>
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
                        onClick={() => addToCart(item, vendor.name)}
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
  );
};

export default Menu;