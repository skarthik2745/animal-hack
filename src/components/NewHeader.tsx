import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPetsMenu, setShowPetsMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showWildlifeMenu, setShowWildlifeMenu] = useState(false);
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
        setShowPetsMenu(false);
        setShowCommunityMenu(false);
        setShowWildlifeMenu(false);
        setShowNewsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuGroups = {
    pets: [
      { path: '/adoption-events', label: 'Adoption Events' },
      { path: '/pet-surrender', label: 'Surrender & Care' },
      { path: '/pet-doctors', label: 'Doctors & Hospitals' },
      { path: '/pet-trainers', label: 'Trainers' },
      { path: '/pet-shops', label: 'Shops & Products' },
      { path: '/health-records', label: 'Health & Vaccinations' },
      { path: '/pet-stories', label: 'Stories' }
    ],
    community: [
      { path: '/lost-found', label: 'Lost & Found' },
      { path: '/report-abuse', label: 'Report Abuse' },
      { path: '/welfare-clubs', label: 'Clubs' },
      { path: '/community', label: 'Animal Lovers Community' },
      { path: '/awareness-campaigns', label: 'Awareness Campaigns' }
    ],
    wildlife: [
      { path: '/wildlife-sanctuary', label: 'Sanctuaries' },
      { path: '/endangered-species', label: 'Endangered Species Info' }
    ],
    news: [
      { path: '/news', label: 'News' },
      { path: '/emergency-numbers', label: 'Emergency Rescue Numbers' }
    ]
  };

  return (
    <header ref={headerRef} className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              PawCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <div className="flex space-x-6">
              {/* Pets Menu */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setShowPetsMenu(true)}
                  onMouseLeave={() => setShowPetsMenu(false)}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 flex items-center"
                >
                  Pets <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {showPetsMenu && (
                  <div 
                    onMouseEnter={() => setShowPetsMenu(true)}
                    onMouseLeave={() => setShowPetsMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-[60]"
                  >
                    {menuGroups.pets.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => setShowPetsMenu(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Community Menu */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setShowCommunityMenu(true)}
                  onMouseLeave={() => setShowCommunityMenu(false)}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 flex items-center"
                >
                  Community <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {showCommunityMenu && (
                  <div 
                    onMouseEnter={() => setShowCommunityMenu(true)}
                    onMouseLeave={() => setShowCommunityMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-[60]"
                  >
                    {menuGroups.community.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => setShowCommunityMenu(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Wildlife Menu */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setShowWildlifeMenu(true)}
                  onMouseLeave={() => setShowWildlifeMenu(false)}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 flex items-center"
                >
                  Wildlife <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {showWildlifeMenu && (
                  <div 
                    onMouseEnter={() => setShowWildlifeMenu(true)}
                    onMouseLeave={() => setShowWildlifeMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-[60]"
                  >
                    {menuGroups.wildlife.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => setShowWildlifeMenu(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* News & Help Menu */}
              <div className="relative">
                <button 
                  onMouseEnter={() => setShowNewsMenu(true)}
                  onMouseLeave={() => setShowNewsMenu(false)}
                  className="text-sm font-medium text-gray-700 hover:text-emerald-600 flex items-center"
                >
                  News & Help <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                {showNewsMenu && (
                  <div 
                    onMouseEnter={() => setShowNewsMenu(true)}
                    onMouseLeave={() => setShowNewsMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border z-[60]"
                  >
                    {menuGroups.news.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg"
                        onClick={() => setShowNewsMenu(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-6 border-l border-gray-200 pl-6">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-[60]">
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                      >
                        <User className="h-4 w-4 mr-2" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {isAuthenticated && (
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            )}
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t bg-white/95 backdrop-blur-sm">
            <nav className="flex flex-col space-y-3">
              {Object.entries(menuGroups).map(([groupName, items]) => (
                <div key={groupName}>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 py-1">
                    {groupName}
                  </h3>
                  {items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block text-sm font-medium transition-colors hover:text-emerald-600 px-4 py-2 rounded ${
                        location.pathname === item.path ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ))}
              
              <div className="border-t pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center text-sm text-gray-700 hover:text-emerald-600 px-2 py-1"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-sm text-gray-700 hover:text-red-600 px-2 py-1"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block text-left text-sm font-medium text-gray-700 hover:text-emerald-600 px-2 py-1"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full text-center"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;