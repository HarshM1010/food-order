import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare, 
  Info, 
  Edit3, 
  BookOpen 
} from 'lucide-react';
import { useApp } from './AppProvider'; // <-- FIXED IMPORT PATH
import toast from 'react-hot-toast'; 

const Menu = () => {
  const { requestStatus, submitRequest, handleVendorResponse, resetRequest } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor;

  const [customRequest, setCustomRequest] = useState('');
  const [comments, setComments] = useState([]);
  const [showVendorControls, setShowVendorControls] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0); // Scroll to top on component mount
    return () => {
      resetRequest();
    };
  }, [resetRequest]);

  useEffect(() => {
    // Mock comments data
    const mockComments = [
      { id: 1, user: 'AP', text: 'Loved the Butter Chicken! Will order again.' },
      { id: 2, user: 'SK', text: 'Delivery was a bit late, but the food was worth it.' },
      { id: 3, user: 'RJ', text: 'The Paneer Tikka was amazing. Best on campus!' },
      { id: 4, user: 'MV', text: 'Great portions and very tasty. Highly recommend.'}
    ];
    setComments(mockComments);

    // Simulate vendor response buttons appearing
    if (requestStatus === 'Pending') {
      const timer = setTimeout(() => setShowVendorControls(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShowVendorControls(false);
    }
  }, [vendor, requestStatus]);

  // Fallback UI if no vendor is passed in state
  if (!vendor) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
          <div className="text-center p-4">
            <p className="text-slate-600 mb-4 text-lg">Vendor not found. Please return home and select one.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-all shadow-md hover:shadow-lg"
            >
              Back to Home
            </button>
          </div>
      </div>
    );
  }

  // Handle sending the request
  const handleSendRequest = () => {
    if (!customRequest.trim()) {
      toast.error("Please enter your order first!");
      return;
    }
    submitRequest(customRequest);
    // Display success toast as requested
    toast.success('Your request has been sent to the vendor');
  };

  // Component to display the status of the custom request
  const StatusDisplay = () => {
    const baseClasses = "mt-5 p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-500 transform";
    const statusInfo = {
        'Pending': {
            className: "bg-yellow-50 border-2 border-yellow-200 text-yellow-900",
            icon: <AlertTriangle className="w-10 h-10 mb-3 text-yellow-500 animate-pulse" />,
            title: "Your request is pending...",
            vendorControls: (
                <div className={`transition-all duration-700 ease-in-out transform ${showVendorControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-sm text-yellow-800 mt-4 font-medium">Simulating vendor response:</p>
                    <div className="flex gap-4 mt-2">
                        <button onClick={() => handleVendorResponse('accept')} className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform hover:scale-105 text-sm font-semibold shadow-sm hover:shadow-md">Accept</button>
                        <button onClick={() => handleVendorResponse('reject')} className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-transform hover:scale-105 text-sm font-semibold shadow-sm hover:shadow-md">Decline</button>
                    </div>
                </div>
            )
        },
        'Accepted': {
            className: "bg-green-50 border-2 border-green-200 text-green-900",
            icon: <CheckCircle className="w-10 h-10 mb-3 text-green-500" />,
            title: "Your order has been accepted!",
        },
        'Declined': {
            className: "bg-red-50 border-2 border-red-200 text-red-900",
            icon: <XCircle className="w-10 h-10 mb-3 text-red-500" />,
            title: "Your order was declined.",
        },
    };

    const currentStatus = statusInfo[requestStatus];
    if (requestStatus === 'Not Sent' || !currentStatus) return null;

    return (
        <div className={`${baseClasses} ${currentStatus.className}`}>
            {currentStatus.icon}
            <p className="font-semibold text-lg">{currentStatus.title}</p>
            {currentStatus.vendorControls}
        </div>
    );
  };

  return (
    <main className={`bg-gray-50 min-h-screen transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header Section */}
        <div className="relative h-64 md:h-72">
            {/* Background Image */}
            <img 
                src={`https://placehold.co/1200x400/FFFBEB/F59E0B?text=${vendor.name.replace(/\s/g,'+')}`} 
                alt={`${vendor.name} banner`} 
                className="w-full h-full object-cover" 
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10"></div>
            
            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 p-2 bg-white/80 hover:bg-white text-slate-800 rounded-full transition-all backdrop-blur-sm shadow-md"
                aria-label="Back to home"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            
            {/* Vendor Info */}
            <div className="absolute bottom-0 left-0 p-6 flex items-center gap-5 w-full">
                <div className="w-24 h-24 md:w-32 md:h-32 text-6xl md:text-7xl bg-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white flex-shrink-0">
                    {vendor.image}
                </div>
                <div className="flex-1 text-white">
                    <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-shadow">{vendor.name}</h1>
                    <p className="text-md md:text-lg text-gray-200 mt-1 text-shadow-sm">{vendor.description}</p>
                </div>
            </div>
        </div>

        {/* Page Content Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              
              {/* Left Column (Main Content) */}
              <div className="lg:col-span-3 space-y-8">
                  
                  {/* --- MENU CARD (Re-added) --- */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border">
                       <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                           <BookOpen className="w-6 h-6 text-amber-500"/>
                           Menu
                        </h2>
                       <div className="aspect-w-16 aspect-h-9 bg-slate-100 rounded-xl flex items-center justify-center overflow-hidden">
                         <img src={`https://placehold.co/600x400/FFFBEB/F59E0B?text=Menu+for\\n${vendor.name.replace(/\s/g,'+')}`} alt={`${vendor.name} menu`} className="w-full h-full object-cover" />
                       </div>
                  </div>

                  {/* --- "Write Your Order" Card --- */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                        <Edit3 className="w-6 h-6 text-amber-500" />
                        Write Your Order
                    </h2>
                    <p className="text-slate-500 mb-5">Can't find an item? Type your custom request below.</p>

                    { requestStatus === 'Not Sent' ? (
                      <>
                        <textarea
                            value={customRequest}
                            onChange={(e) => setCustomRequest(e.target.value)}
                            placeholder="e.g., One large cheese pizza with extra olives..."
                            className="w-full h-28 p-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 focus:outline-none transition-all resize-none"
                        />
                        <button
                            onClick={handleSendRequest}
                            className="w-full mt-4 flex items-center justify-center gap-3 p-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all transform hover:scale-[1.02] disabled:bg-slate-300 disabled:scale-100 shadow-lg shadow-amber-500/30 disabled:shadow-none font-bold text-lg"
                            disabled={!customRequest.trim()}
                        >
                            <Send className="w-5 h-5" />
                            Send to Vendor
                        </button>
                      </>
                    ) : (
                        <p className="text-slate-700 p-4 bg-slate-100 rounded-xl text-center italic">Your request: "{customRequest}"</p>
                    )}
                    <StatusDisplay />
                  </div>
              </div>
              
              {/* Right Column (Sidebar) */}
              <div className="lg:col-span-2 space-y-8">
                  {/* Notice Board */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border">
                       <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <Info className="w-5 h-5 text-amber-500"/>
                         Notice Board
                       </h2>
                       <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                         <p className="text-amber-900">{vendor.notice || "No announcements at the moment."}</p>
                       </div>
                  </div>

                  {/* Recent Comments */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-amber-500"/> 
                      Recent Comments
                    </h2>
                    {comments.length > 0 ? (
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-600 flex-shrink-0 border-2 border-white ring-2 ring-amber-200">
                                        {comment.user}
                                    </div>
                                    <div className="flex-1 bg-slate-50 p-3 rounded-lg border-slate-200">
                                        <p className="text-slate-700 text-sm">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500">No recent comments.</p>
                    )}
                  </div>
              </div>
            </div>
        </div>
    </main>
  );
};

export default Menu;