import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../AuthContext';

const CategoryHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const categories = {
    Pets: [
      { path: '/adoption-events', label: 'Adoption Events' },
      { path: '/pet-doctors', label: 'Pet Doctors & Hospitals' },
      { path: '/pet-trainers', label: 'Pet Trainers' },
      { path: '/pet-care-services', label: 'Pet Care & Caretaker Services' },
      { path: '/pet-shops', label: 'Pet Shops & Products' },
      { path: '/pet-restaurants', label: 'Pet-Friendly Restaurants' },
      { path: '/health-records', label: 'Health & Vaccinations' },
      { path: '/pet-stories', label: 'Pet Stories' },
      { path: '/pet-gallery', label:'Pet Gallery' }
    ],
    Community: [
      { path: '/lost-found', label: 'Lost & Found Pets' },
      { path: '/report-abuse', label: 'Report Animal Abuse' },

      { path: '/community', label: 'Animal Lovers Community' },
      { path: '/awareness-campaigns', label: 'Awareness Campaigns' }
    ],
    Wildlife: [
      { path: '/wildlife-sanctuary', label: 'Wildlife Sanctuaries' },
      { path: '/endangered-species', label: 'Endangered Species Info' }
    ],
    'AI Assistant': [
      { path: '/ai-assistant/dog-breed', label: 'Dog Breed Identifier' },
      { path: '/ai-assistant/food-checker', label: 'Food Safety Checker' },
      { path: '/ai-assistant/language-translator', label: 'Pet Language Translator' },
      { path: '/ai-assistant/virtual-vet', label: 'AI Virtual Vet' }
    ],
    'News & Help': [
      { path: '/news', label: 'News & Updates' },
      { path: '/emergency-numbers', label: 'Emergency Rescue Numbers' }
    ]
  };

  const handleDropdownClick = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              PawCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {Object.entries(categories).map(([categoryName, items]) => (
              <div key={categoryName} className="relative">
                <button
                  onClick={() => handleDropdownClick(categoryName)}
                  className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <span>{categoryName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === categoryName ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === categoryName && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50">
                    {items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeDropdown}
                        className={`block px-4 py-3 text-sm transition-colors hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg ${
                          location.pathname === item.path ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-emerald-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="space-y-4">
              {Object.entries(categories).map(([categoryName, items]) => (
                <div key={categoryName}>
                  <button
                    onClick={() => handleDropdownClick(categoryName)}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded transition-colors"
                  >
                    <span>{categoryName}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === categoryName ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {activeDropdown === categoryName && (
                    <div className="mt-2 ml-4 space-y-1">
                      {items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => {
                            setIsMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                          className={`block px-4 py-2 text-sm rounded transition-colors ${
                            location.pathname === item.path 
                              ? 'text-emerald-600 bg-emerald-50' 
                              : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              <div className="border-t pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile ({user?.name})</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-emerald-600 hover:bg-gray-50 rounded"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center"
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
      
      {/* Overlay to close dropdown when clicking outside */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeDropdown}
        />
      )}
    </header>
  );
};

export default CategoryHeader;