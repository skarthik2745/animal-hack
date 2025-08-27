import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

const SimpleHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/adoption-events', label: 'Adoption Events' },
    { path: '/pet-surrender', label: 'Pet Surrender' },
    { path: '/pet-doctors', label: 'Pet Doctors' },
    { path: '/lost-found', label: 'Lost & Found' },
    { path: '/pet-trainers', label: 'Pet Trainers' },
    { path: '/report-abuse', label: 'Report Abuse' },
    { path: '/pet-shops', label: 'Pet Shops' },
    { path: '/health-records', label: 'Health Records' },
    { path: '/welfare-clubs', label: 'Welfare Clubs' },
    { path: '/community', label: 'Community' },
    { path: '/pet-stories', label: 'Pet Stories' },
    { path: '/awareness-campaigns', label: 'Campaigns' },
    { path: '/wildlife-sanctuary', label: 'Wildlife Sanctuary' },
    { path: '/endangered-species', label: 'Endangered Species' },
    { path: '/news', label: 'News' },
    { path: '/emergency-numbers', label: 'Emergency Numbers' }
  ];

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
            {navigationItems.slice(0, 6).map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === item.path ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* More Menu */}
            <div className="relative group">
              <button className="text-sm font-medium text-gray-700 hover:text-emerald-600 transition-colors">
                More
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {navigationItems.slice(6).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 text-sm transition-colors hover:bg-gray-50 hover:text-emerald-600 first:rounded-t-lg last:rounded-b-lg ${
                      location.pathname === item.path ? 'text-emerald-600 bg-emerald-50' : 'text-gray-700'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
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
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium rounded transition-colors ${
                    location.pathname === item.path 
                      ? 'text-emerald-600 bg-emerald-50' 
                      : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
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
    </header>
  );
};

export default SimpleHeader;