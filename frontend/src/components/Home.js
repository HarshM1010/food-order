import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ChevronRight, 
  Search, 
  AlertCircle, 
  ShoppingBag, 
  Sparkles // Added for "Popular" section
} from 'lucide-react';
import { useApp } from './AppProvider';

const Home = () => {
  const { vendors, loading, error, searchQuery, setSearchQuery, resetRequest } = useApp();
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleVendorClick = (vendor) => {
    resetRequest();
    navigate(`/menu/${vendor._id}`, { state: { vendor } });
  }

  const filteredVendors = vendors.filter(vendor =>
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Take the first 4 vendors to feature as "Popular Picks"
  const popularVendors = vendors.slice(0, 4);

  return (
    <main className={`bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header Section */}
        <div className={`text-center mb-10 transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0'}`}>
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-800 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900">
              UniServe
            </h1>
            <p className="mt-4 text-lg text-slate-500 italic">"Good food, fast. The fuel for your brilliant ideas."</p>
        </div>

        {/* Search Bar */}
        <div className={`relative mb-12 transition-all duration-700 delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6 z-10" />
          <input
            type="text"
            placeholder="Search for restaurants, cuisines, or anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 rounded-2xl border-2 border-transparent bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 focus:outline-none transition-all duration-300 shadow-lg"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-lg flex items-start gap-3 shadow-md">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Could not connect to server</p>
              <p className="text-sm">Displaying demo data. Functionality may be limited.</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-500"></div>
          </div>
        )}

        {/* ----- NEW: Popular Picks Section ----- */}
        {!loading && popularVendors.length > 0 && (
          <div className={`mb-12 opacity-0 animate-fade-in-up`} style={{ animationDelay: `300ms` }}>
            <div className="flex items-center mb-5">
              <Sparkles className="w-6 h-6 text-amber-500 mr-2" />
              <h2 className="text-2xl font-bold text-slate-700">Popular Picks</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-4 -mb-4">
              {popularVendors.map((vendor) => (
                <div
                  key={vendor._id}
                  onClick={() => handleVendorClick(vendor)}
                  className="flex-shrink-0 w-64 bg-white rounded-3xl p-5 shadow-lg border-2 border-transparent hover:border-amber-400 transition-all duration-300 cursor-pointer group transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-4xl flex-shrink-0 shadow-inner">
                      {vendor.image}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 truncate">{vendor.name}</h3>
                      <p className="text-sm text-slate-500 truncate">{vendor.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----- All Restaurants Section ----- */}
        {!loading && (
          <div className={`opacity-0 animate-fade-in-up`} style={{ animationDelay: `4G00ms` }}>
            <h2 className="text-2xl font-bold text-slate-700 mb-6">
              Currently Serving Restaurants
            </h2>
            
            {filteredVendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredVendors.map((vendor, index) => (
                  <div
                    key={vendor._id}
                    onClick={() => handleVendorClick(vendor)}
                    className={`bg-white rounded-3xl p-6 shadow-lg border-2 border-transparent hover:border-amber-400 transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:shadow-2xl`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 flex items-center gap-5">
                        {/* --- IMPROVED CARD --- */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center text-5xl flex-shrink-0 shadow-inner transition-transform duration-300 group-hover:scale-110">
                          {vendor.image}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-slate-800">{vendor.name}</h3>
                          <p className="text-slate-600 mb-3">{vendor.description}</p>
                          <div className="flex items-center gap-2 text-slate-500 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{vendor.timing}</span>
                          </div>
                        </div>
                        {/* --- END IMPROVED CARD --- */}
                      </div>
                      <ChevronRight className="w-8 h-8 text-slate-300 self-center transition-all duration-300 group-hover:text-amber-500 group-hover:translate-x-1 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // "No Vendors Found" State
              <div className="text-center py-24">
                <ShoppingBag className="w-20 h-20 mx-auto text-slate-300 mb-5" />
                {/* --- THIS LINE IS NOW FIXED --- */}
                <p className="text-slate-600 text-2xl font-semibold">No vendors found</p>
                <p className="text-slate-400 mt-2">Maybe try a different search? Your next favorite meal is out there!</p>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
};

export default Home;