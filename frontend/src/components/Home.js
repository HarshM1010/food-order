import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home = () => {
  const { vendors, loading, error, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {error && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium">Using demo data</p>
            <p className="text-yellow-700 text-sm">
              Backend API not connected. Start your backend server to see live data.
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
        </div>
      ) : (
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
                onClick={() => navigate(`/menu/${vendor._id}`, { state: { vendor } })}
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

          {filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No vendors found matching your search</p>
            </div>
          )}
        </div>
      )}
    </main>
  );
};

export default Home;