import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { GiSplitCross } from "react-icons/gi";
import { TfiLayoutMenuV } from "react-icons/tfi";
import { useAuth } from "../Context/AuthContext";
import '../App.css'

const HIGHLIGHT_RECT_WIDTH = 120;
const HIGHLIGHT_RECT_HEIGHT = 44;

const Navbar = ({ darkMode, setDarkMode }) => {
  const navigator = useNavigate();
  const { logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const [highlightStyle, setHighlightStyle] = useState({ 
    left: 0, 
    width: 0, 
    opacity: 0,
    transform: 'scaleX(0)',
    transformOrigin: 'center'
  });
  const [isHovering, setIsHovering] = useState(false);
  
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const lastScrollY = useRef(window.scrollY);

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Typing", path: "/typing" },
    { label: "Contest", path: "/contest" },
    { label: "Learn", path: "/learn" },
    { label: "Contact", path: "/contact" },
    { label: "About", path: "/about" }
  ];

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Handle click outside to close dropdowns
  const handleClickOutside = (event) => {
    if (
      userOpen &&
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setUserOpen(false);
    }
  };

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setShowNavbar(true);
        lastScrollY.current = window.scrollY;
        return;
      }
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = window.scrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle moving highlight rectangle
  useEffect(() => {
    const updateHighlight = () => {
      if (!navRef.current) return;

      const activeLink = navRef.current.querySelector('.active-nav-link');
      
      if (activeLink && !isHovering) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const newLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (HIGHLIGHT_RECT_WIDTH / 2);
        
        setHighlightStyle({
          left: newLeft,
          width: HIGHLIGHT_RECT_WIDTH,
          opacity: 1,
          transform: 'scaleX(1)',
          transformOrigin: 'center'
        });
      } else if (!isHovering) {
        setHighlightStyle({ 
          left: 0, 
          width: 0, 
          opacity: 0,
          transform: 'scaleX(0)',
          transformOrigin: 'center'
        });
      }
    };

    updateHighlight();
    window.addEventListener('resize', updateHighlight);

    const observer = new MutationObserver(updateHighlight);
    if (navRef.current) {
      observer.observe(navRef.current, { attributes: true, subtree: true, childList: true });
    }

    return () => {
      window.removeEventListener('resize', updateHighlight);
      observer.disconnect();
    };
  }, [navigator, isHovering]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userOpen]);

  const handleNavItemHover = (e, isEntering) => {
    if (!navRef.current) return;

    setIsHovering(isEntering);

    if (isEntering) {
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = e.currentTarget.getBoundingClientRect();
      const newLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (HIGHLIGHT_RECT_WIDTH / 2);

      setHighlightStyle({
        left: newLeft,
        width: HIGHLIGHT_RECT_WIDTH,
        opacity: 1,
        transform: 'scaleX(1)',
        transformOrigin: 'center'
      });
    } else {
      // On mouse leave, revert to active link position
      const activeLink = navRef.current.querySelector('.active-nav-link');
      if (activeLink) {
        const navRect = navRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();
        const newLeft = linkRect.left - navRect.left + (linkRect.width / 2) - (HIGHLIGHT_RECT_WIDTH / 2);
        
        setHighlightStyle({
          left: newLeft,
          width: HIGHLIGHT_RECT_WIDTH,
          opacity: 1,
          transform: 'scaleX(1)',
          transformOrigin: 'center'
        });
      } else {
        setHighlightStyle({ 
          left: 0, 
          width: 0, 
          opacity: 0,
          transform: 'scaleX(0)',
          transformOrigin: 'center'
        });
      }
    }
  };



  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ease-in-out transform ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      } ${
        darkMode 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800/50 shadow-xl shadow-gray-900/20' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-xl shadow-gray-200/20'
      }`}
      style={{ willChange: 'transform' }}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div
          className={`flex items-center cursor-pointer group transition-all duration-300 transform hover:scale-105`}
          onClick={() => navigator("/")}
        >
          <img 
            src="./public/Images/Screenshot 2024-11-02 175013.png" 
            className="max-h-[3.5rem] transition-all duration-500 ease-in-out group-hover:rounded-2xl group-hover:shadow-lg group-hover:shadow-blue-500/30" 
            alt="Logo" 
          />
         
        </div>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center space-x-2 relative" ref={navRef}>
          {/* Moving Highlight Rectangle */}
          <div
            className={`absolute rounded-xl transition-all duration-500 ease-out z-10 ${
              darkMode 
                ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 shadow-lg shadow-blue-500/20 border border-blue-500/20' 
                : 'bg-gradient-to-r from-blue-500/25 to-purple-500/25 shadow-lg shadow-blue-500/15 border border-blue-500/15'
            }`}
            style={{
              left: highlightStyle.left,
              width: highlightStyle.width,
              opacity: highlightStyle.opacity,
              height: HIGHLIGHT_RECT_HEIGHT,
              top: '50%',
              transform: `translateY(-50%) ${highlightStyle.transform}`,
              transformOrigin: highlightStyle.transformOrigin,
              backdropFilter: 'blur(8px)',
            }}
          />

          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `relative text-lg font-medium transition-all duration-300 px-4 py-2 rounded-lg z-20 flex items-center justify-center min-h-[${HIGHLIGHT_RECT_HEIGHT}px] transform hover:scale-105 ${
                  darkMode 
                    ? `text-gray-300 hover:text-white ${isActive ? 'text-blue-400 active-nav-link font-semibold' : ''}` 
                    : `text-gray-600 hover:text-gray-900 ${isActive ? 'text-blue-600 active-nav-link font-semibold' : ''}`
                }`
              }
              onMouseEnter={(e) => handleNavItemHover(e, true)}
              onMouseLeave={(e) => handleNavItemHover(e, false)}
            >
              {item.label}
              {hoveredSection === item.label.toLowerCase() && (
                <div className={`absolute top-full mt-2 w-40 p-2 rounded-lg text-xs text-center z-30 transition-all duration-300 transform translate-y-2 ${
                  darkMode 
                    ? 'bg-gray-800/90 text-gray-200 border border-gray-700/50' 
                    : 'bg-white/90 text-gray-700 border border-gray-300/50'
                } backdrop-blur-md shadow-xl`}>
                  Discover {item.label}
                </div>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side controls */}
        <div className="flex items-center  justify-center gap-2 ">
          {/* Dark/Light Mode Toggle */}
          <div
         
            onClick={toggleDarkMode}

            className={`p-3 rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 active:scale-95 hover:rotate-12 ${
              darkMode
                ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 shadow-lg shadow-yellow-400/20 border border-yellow-400/30'
                : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 shadow-lg shadow-blue-500/20 border border-blue-500/30'
            } backdrop-blur-md`}
            aria-label="Toggle theme"
          >
            <div className="text-xl transition-transform duration-500">
              {darkMode ? '☀️' : '🌙'}
            </div>
          </div>

          {/* User Profile Section - Desktop */}
          <div className="hidden md:block relative">
            <div
              onClick={() => setUserOpen(!userOpen)}
              className="flex flex-col items-center cursor-pointer group transition-all duration-300 transform hover:scale-105"
            >
              <div className={`rounded-full h-12 w-12 flex items-center justify-center font-bold text-lg transition-all duration-300 group-hover:shadow-lg ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/30 group-hover:shadow-blue-500/50' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-blue-500/20 group-hover:shadow-blue-500/40'
              }`}>
                {localStorage.getItem("email")?.[0]?.toUpperCase() || "U"}
              </div>
              <p className={`text-xs mt-1 transition-colors duration-300 ${
                darkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {localStorage.getItem("email")?.split('@')[0] || 'User'}
              </p>
            </div>

            {/* User Dropdown */}
            {userOpen && (
              <div
                ref={menuRef}
                className={`absolute right-0 top-16 w-48 rounded-xl shadow-2xl p-4 z-50 transition-all duration-300 transform origin-top-right animate-scale-in ${
                  darkMode 
                    ? 'bg-gray-800/95 backdrop-blur-md text-gray-100 border border-gray-700/50 shadow-gray-900/50' 
                    : 'bg-white/95 backdrop-blur-md text-gray-900 border border-gray-200/50 shadow-gray-400/30'
                }`}
              >
                <div className="flex items-center mb-4 pb-3 border-b border-gray-700/30">
                  <div className={`rounded-full h-10 w-10 flex items-center justify-center font-bold mr-3 ${
                    darkMode ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                  } text-white`}>
                    {localStorage.getItem("email")?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                      {localStorage.getItem("email")?.split('@')[0] || "User"}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {localStorage.getItem("email") || "user@example.com"}
                    </p>
                  </div>
                </div>
                
                <ul className="space-y-1">
                  <li
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      darkMode ? 'hover:bg-gray-700/50 hover:text-blue-400' : 'hover:bg-gray-100/50 hover:text-blue-600'
                    }`}
                    onClick={() => navigator("/dashboard")}
                  >
                    📊 Dashboard
                  </li>
                  <li
                    className={`rounded-lg p-3 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      darkMode 
                        ? 'hover:bg-red-600/20 hover:text-red-400 text-red-300' 
                        : 'hover:bg-red-500/10 hover:text-red-600 text-red-500'
                    }`}
                    onClick={() => {
                      logout();
                      navigator("/login");
                    }}
                  >
                    🚪 Logout
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <div 
              onClick={toggleMenu} 
              className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                darkMode ? 'text-white hover:bg-gray-700/50' : 'text-black hover:bg-gray-100/50'
              }`}
            >
              <div className="transition-transform duration-300">
                {isOpen ? <GiSplitCross size={24} /> : <TfiLayoutMenuV size={24} />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`md:hidden transition-all duration-300 transform origin-top ${
            darkMode 
              ? 'bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50' 
              : 'bg-white/95 backdrop-blur-md border-t border-gray-200/50'
          }`}
        >
          <div className="p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-blue-500/20 hover:text-blue-400' 
                    : 'text-gray-700 hover:bg-blue-500/10 hover:text-blue-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile user section */}
            <div className={`border-t pt-4 mt-4 ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'}`}>
              <Link
                to="/dashboard"
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'text-gray-300 hover:bg-blue-500/20 hover:text-blue-400' 
                    : 'text-gray-700 hover:bg-blue-500/10 hover:text-blue-600'
                }`}
                onClick={() => setIsOpen(false)}
              >
                📊 Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigator("/login");
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                  darkMode 
                    ? 'text-red-300 hover:bg-red-600/20 hover:text-red-400' 
                    : 'text-red-500 hover:bg-red-500/10 hover:text-red-600'
                }`}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;