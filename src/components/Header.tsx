import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPetsMenu, setShowPetsMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showWildlifeMenu, setShowWildlifeMenu] = useState(false);
  const [showNewsMenu, setShowNewsMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

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
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
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
            <div className="flex space-x-4 max-w-4xl overflow-x-auto">
              {navigationItems.slice(0, 8).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-emerald-600 ${
                    activeSection === item.id ? 'text-emerald-600' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="relative group">
                <button className="text-sm font-medium text-gray-700 hover:text-emerald-600 flex items-center">
                  More <ChevronDown className="h-4 w-4 ml-1" />
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {navigationItems.slice(8).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
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
                    <span className="text-sm font-medium">{currentUser?.name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  {showUserMenu && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveSection('login')}
                    className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setActiveSection('signup')}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Sign Up
                  </button>
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
          <div className="lg:hidden py-4 border-t bg-white">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium transition-colors hover:text-emerald-600 px-2 py-1 rounded ${
                    activeSection === item.id ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <div className="border-t pt-3 mt-3">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 px-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
                    </div>
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
                    <button
                      onClick={() => {
                        setActiveSection('login');
                        setIsMenuOpen(false);
                      }}
                      className="block text-left text-sm font-medium text-gray-700 hover:text-emerald-600 px-2 py-1"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setActiveSection('signup');
                        setIsMenuOpen(false);
                      }}
                      className="block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full text-center"
                    >
                      Sign Up
                    </button>
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