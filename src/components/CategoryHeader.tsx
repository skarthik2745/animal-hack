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
    <header className="sticky top-0 z-50" style={{
      background: 'linear-gradient(90deg, #1e3a8a, #3b82f6, #06b6d4)',
      fontFamily: 'Poppins, sans-serif',
      fontWeight: '500',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
    }}>
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-teal-600">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              PawCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300"
              style={{
                color: location.pathname === '/' ? '#14b8a6' : '#ffffff',
                fontWeight: location.pathname === '/' ? '600' : '500'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38bdf8';
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.fontWeight = '700';
                e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                e.currentTarget.style.transition = 'all 0.3s ease';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = location.pathname === '/' ? '#14b8a6' : '#ffffff';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.fontWeight = location.pathname === '/' ? '600' : '500';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transition = 'all 0.3s ease';
              }}
            >
              Home
            </Link>
            {Object.entries(categories).map(([categoryName, items]) => (
              <div key={categoryName} className="relative">
                <button
                  onClick={() => handleDropdownClick(categoryName)}
                  className="flex items-center space-x-1 text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#38bdf8';
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.fontWeight = '700';
                    e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                    e.currentTarget.style.transition = 'all 0.3s ease';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = location.pathname.includes(categoryName.toLowerCase()) ? '#14b8a6' : '#ffffff';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.fontWeight = location.pathname.includes(categoryName.toLowerCase()) ? '600' : '500';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transition = 'all 0.3s ease';
                  }}
                  style={{
                    color: location.pathname.includes(categoryName.toLowerCase()) ? '#14b8a6' : '#ffffff',
                    fontWeight: location.pathname.includes(categoryName.toLowerCase()) ? '600' : '500'
                  }}
                >
                  <span>{categoryName}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === categoryName ? 'rotate-180' : ''}`} />
                </button>
                
                {activeDropdown === categoryName && (
                  <div className="absolute top-full left-0 mt-2 w-64 rounded-xl z-50" style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0px 12px 32px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    {items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={closeDropdown}
                        className={`block px-4 py-3 text-sm transition-all duration-300 first:rounded-t-xl last:rounded-b-xl ${
                          location.pathname === item.path ? 'font-semibold' : ''
                        }`}
                        style={{
                          color: location.pathname === item.path ? '#14b8a6' : '#ffffff',
                          fontWeight: location.pathname === item.path ? '600' : '500'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#1e293b';
                          e.currentTarget.style.color = '#38bdf8';
                          e.currentTarget.style.fontWeight = '600';
                          e.currentTarget.style.boxShadow = '0 0 8px #38bdf8';
                          e.currentTarget.style.transition = 'all 0.3s ease';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = location.pathname === item.path ? '#14b8a6' : '#ffffff';
                          e.currentTarget.style.fontWeight = location.pathname === item.path ? '600' : '500';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transition = 'all 0.3s ease';
                        }}
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
                  className="flex items-center space-x-2 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  style={{
                    color: location.pathname === '/profile' ? '#14b8a6' : '#ffffff',
                    fontWeight: location.pathname === '/profile' ? '600' : '500'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#38bdf8';
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.fontWeight = '700';
                    e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                    e.currentTarget.style.transition = 'all 0.4s ease';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = location.pathname === '/profile' ? '#14b8a6' : '#ffffff';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.fontWeight = location.pathname === '/profile' ? '600' : '500';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transition = 'all 0.4s ease';
                  }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-600">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-white">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-white px-4 py-2 rounded-lg transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#ff6b6b';
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.fontWeight = '700';
                    e.currentTarget.style.boxShadow = '0 0 12px #ff6b6b';
                    e.currentTarget.style.transition = 'all 0.3s ease';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.fontWeight = '500';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transition = 'all 0.3s ease';
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300"
                  style={{ color: '#00ff88' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#38bdf8';
                    e.currentTarget.style.background = '#1e293b';
                    e.currentTarget.style.fontWeight = '700';
                    e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                    e.currentTarget.style.transition = 'all 0.3s ease';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#00ff88';
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.fontWeight = '500';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transition = 'all 0.3s ease';
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
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
              className="p-3 text-white rounded-lg transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#38bdf8';
                e.currentTarget.style.background = '#1e293b';
                e.currentTarget.style.fontWeight = '700';
                e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                e.currentTarget.style.transition = 'all 0.3s ease';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.fontWeight = '500';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transition = 'all 0.3s ease';
              }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-600" style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(8px)'
          }}>
            <nav className="space-y-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300"
                style={{
                  color: location.pathname === '/' ? '#14b8a6' : '#ffffff',
                  fontWeight: location.pathname === '/' ? '600' : '500'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#38bdf8';
                  e.currentTarget.style.background = '#1e293b';
                  e.currentTarget.style.fontWeight = '700';
                  e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                  e.currentTarget.style.transition = 'all 0.3s ease';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = location.pathname === '/' ? '#14b8a6' : '#ffffff';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.fontWeight = location.pathname === '/' ? '600' : '500';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transition = 'all 0.3s ease';
                }}
              >
                Home
              </Link>
              {Object.entries(categories).map(([categoryName, items]) => (
                <div key={categoryName}>
                  <button
                    onClick={() => handleDropdownClick(categoryName)}
                    className="flex items-center justify-between w-full px-4 py-3 text-sm font-medium text-white rounded-lg transition-all duration-300"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#38bdf8';
                      e.currentTarget.style.background = '#1e293b';
                      e.currentTarget.style.fontWeight = '700';
                      e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                      e.currentTarget.style.transition = 'all 0.3s ease';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#ffffff';
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.fontWeight = '500';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transition = 'all 0.3s ease';
                    }}
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
                          className={`block px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                            location.pathname === item.path 
                              ? 'font-semibold' 
                              : ''
                          }`}
                          style={{
                            color: location.pathname === item.path ? '#14b8a6' : '#ffffff',
                            fontWeight: location.pathname === item.path ? '600' : '500'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#1e293b';
                            e.currentTarget.style.color = '#38bdf8';
                            e.currentTarget.style.fontWeight = '600';
                            e.currentTarget.style.boxShadow = '0 0 8px #38bdf8';
                            e.currentTarget.style.transition = 'all 0.3s ease';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = location.pathname === item.path ? '#14b8a6' : '#ffffff';
                            e.currentTarget.style.fontWeight = location.pathname === item.path ? '600' : '500';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transition = 'all 0.3s ease';
                          }}
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
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-white rounded-lg transition-all duration-300"
                      style={{
                        color: location.pathname === '/profile' ? '#14b8a6' : '#ffffff',
                        fontWeight: location.pathname === '/profile' ? '600' : '500'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#38bdf8';
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.fontWeight = '700';
                        e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                        e.currentTarget.style.transition = 'all 0.4s ease';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = location.pathname === '/profile' ? '#14b8a6' : '#ffffff';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.fontWeight = location.pathname === '/profile' ? '600' : '500';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transition = 'all 0.4s ease';
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span className="font-bold text-white">Profile ({user?.name})</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-3 text-sm text-white rounded-lg w-full text-left transition-all duration-300"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#ff6b6b';
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.fontWeight = '700';
                        e.currentTarget.style.boxShadow = '0 0 12px #ff6b6b';
                        e.currentTarget.style.transition = 'all 0.3s ease';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#ffffff';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.fontWeight = '500';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transition = 'all 0.3s ease';
                      }}
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
                      className="block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300"
                      style={{ color: '#00ff88' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#38bdf8';
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.fontWeight = '700';
                        e.currentTarget.style.boxShadow = '0 0 12px #38bdf8, 0 0 20px #14b8a6';
                        e.currentTarget.style.transition = 'all 0.3s ease';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#00ff88';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.fontWeight = '500';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transition = 'all 0.3s ease';
                      }}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium text-center transition-all duration-200"
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