import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- SVG Logo Component ---
const LogoIcon = () => (
  <svg 
    fill="none" 
    height="32" 
    viewBox="0 0 48 48" 
    width="32" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <filter id="a" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="54" width="48" x="0" y="-3">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feBlend in="SourceGraphic" in2="BackgroundImageFix" mode="normal" result="shape"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="-3"/><feGaussianBlur stdDeviation="1.5"/>
      <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
      <feBlend in2="shape" mode="normal" result="effect1_innerShadow_3051_46883"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/><feGaussianBlur stdDeviation="1.5"/>
      <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"/>
      <feBlend in2="effect1_innerShadow_3051_46883" mode="normal" result="effect2_innerShadow_3051_46883"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feMorphology in="SourceAlpha" operator="erode" radius="1" result="effect3_innerShadow_3051_46883"/>
      <feOffset/>
      <feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.24 0"/>
      <feBlend in2="effect2_innerShadow_3051_46883" mode="normal" result="effect3_innerShadow_3051_46883"/>
    </filter>
    <filter id="b" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="46.6667" width="41.6667" x="3.16667" y="3.16667">
      <feFlood floodOpacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feMorphology in="SourceAlpha" operator="erode" radius="1.66667" result="effect1_dropShadow_3051_46883"/>
      <feOffset dy="2.5"/><feGaussianBlur stdDeviation="2.5"/>
      <feComposite in2="hardAlpha" operator="out"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0 0.141176 0 0 0 0.1 0"/>
      <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_3051_46883"/>
      <feBlend in="SourceGraphic" in2="effect1_dropShadow_3051_46883" mode="normal" result="shape"/>
    </filter>
    <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="24" x2="26" y1=".000001" y2="48">
      <stop offset="0" stopColor="#fff" stopOpacity="0"/>
      <stop offset="1" stopColor="#fff" stopOpacity=".12"/>
    </linearGradient>
    <linearGradient id="d" gradientUnits="userSpaceOnUse" x1="24.0011" x2="24.0011" y1="6.5" y2="41.5">
      <stop offset="0" stopColor="#fff" stopOpacity=".8"/>
      <stop offset="1" stopColor="#fff" stopOpacity=".5"/>
    </linearGradient>
    <linearGradient id="e" gradientUnits="userSpaceOnUse" x1="24" x2="24" y1="0" y2="48">
      <stop offset="0" stopColor="#fff" stopOpacity=".12"/>
      <stop offset="1" stopColor="#fff" stopOpacity="0"/>
    </linearGradient>
    <clipPath id="f"><rect height="48" rx="12" width="48"/></clipPath>
    <g filter="url(#a)">
      <g clipPath="url(#f)">
        <rect fill="#0A0D12" height="48" rx="12" width="48"/>
        <path d="m0 0h48v48h-48z" fill="url(#c)"/>
        <g filter="url(#b)">
          <path clipRule="evenodd" d="m24.9194 21.383 8.2495-8.2495-1.7677-1.7678-6.1157 6.1157v-10.9814h-2.5v10.9814l-6.1157-6.1157-1.7678 1.7678 8.2496 8.2495.8839.8839zm1.7662 1.7678 8.2496-8.2496 1.7678 1.7678-6.1157 6.1157h10.913v2.5h-10.913l6.1157 6.1157-1.7678 1.7677-8.2496-8.2495-.8838-.8839zm-13.5518 10.0173 8.2496-8.2495.8839-.8839-.8839-.8839-8.2496-8.2496-1.7678 1.7678 6.1157 6.1157h-10.97975v2.5h10.97975l-6.1157 6.1157zm10.0178-6.4817-8.2496 8.2495 1.7678 1.7678 6.1157-6.1157v10.912h2.5v-10.912l6.1157 6.1157 1.7677-1.7678-8.2495-8.2495-.8839-.8839z" fill="url(#d)" fillRule="evenodd"/>
        </g>
      </g>
      <rect height="46" rx="11" stroke="url(#e)" strokeWidth="2" width="46" x="1" y="1"/>
    </g>
  </svg>
);
// --- End SVG Logo Component ---


const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // --- Simulated Authentication ---
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const handleLogout = () => {
    console.log("User logged out");
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Brand/Logo */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity flex items-center gap-2"
        >
          <LogoIcon />
          UniServe
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {/* <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  About
                </Link>
              </li>
            </ul>
          </nav> */}

          {/* --- Desktop Auth Buttons --- */}
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/Signup')}
                className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full font-medium transition-colors text-sm shadow-sm"
              >
                Continue as vendor
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/Signup')}
              className="bg-blue-600 text-white px-5 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0 z-30 border-t border-gray-100">
          <nav className="flex flex-col p-4">
            <Link to="/" className="py-2 px-3 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/services" className="py-2 px-3 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link to="/about" className="py-2 px-3 rounded hover:bg-gray-100" onClick={() => setIsMenuOpen(false)}>About</Link>
            
            {/* --- Mobile Auth Buttons --- */}
            {isAuthenticated ? (
              <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col space-y-3">
                <button
                  onClick={() => {
                    navigate('/vendor');
                    setIsMenuOpen(false);
                  }}
                  className="bg-purple-600 text-white text-center px-3 py-2 rounded font-medium hover:bg-purple-700 transition-colors"
                >
                  Continue as vendor
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 text-center px-3 py-2 rounded font-medium hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                className="bg-blue-600 text-white text-center px-3 py-2 mt-3 rounded font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;