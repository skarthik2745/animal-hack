import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

// Modern Pet Theme CSS
const petThemeStyles = `
:root{
  --rose-600:#FF3B5E;
  --rose-400:#FF97B1;
  --sunset:#FF7A45;
}

.page-bg{
  position:fixed; inset:0; z-index:-1; pointer-events:none; overflow:hidden;
  background: linear-gradient(135deg, #FFFEF7 0%, #F5F5DC 50%, #FAF0E6 100%);
  background-image: 
    repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(218,165,32,0.05) 35px, rgba(218,165,32,0.05) 70px),
    url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23DAA520' fill-opacity='0.08'%3E%3Cpath d='M20 16c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z'/%3E%3Cpath d='M15 12c-1 0-1.5 0.5-1.5 1.5s0.5 1.5 1.5 1.5 1.5-0.5 1.5-1.5-0.5-1.5-1.5-1.5z'/%3E%3Cpath d='M25 12c-1 0-1.5 0.5-1.5 1.5s0.5 1.5 1.5 1.5 1.5-0.5 1.5-1.5-0.5-1.5-1.5-1.5z'/%3E%3Cpath d='M15 22c-1 0-1.5 0.5-1.5 1.5s0.5 1.5 1.5 1.5 1.5-0.5 1.5-1.5-0.5-1.5-1.5-1.5z'/%3E%3Cpath d='M25 22c-1 0-1.5 0.5-1.5 1.5s0.5 1.5 1.5 1.5 1.5-0.5 1.5-1.5-0.5-1.5-1.5-1.5z'/%3E%3C/g%3E%3C/svg%3E");
}

.page-bg::before{
  content:"";
  position:absolute; inset:0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255,182,193,0.3), transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(173,216,230,0.3), transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(221,160,221,0.2), transparent 50%);
  animation: floatBubbles 20s ease-in-out infinite;
}

.page-bg::after{
  content:"";
  position:absolute; inset:0;
  background-image: 
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFB6C1' fill-opacity='0.1'%3E%3Cpath d='M30 25c-2.5 0-4.5 2-4.5 4.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5z'/%3E%3Cpath d='M22 20c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z'/%3E%3Cpath d='M38 20c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z'/%3E%3Cpath d='M22 35c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z'/%3E%3Cpath d='M38 35c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5 2.5-1 2.5-2.5-1-2.5-2.5-2.5z'/%3E%3C/g%3E%3C/svg%3E");
  animation: pawFloat 25s linear infinite;
}

@keyframes floatBubbles{
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(120deg); }
  66% { transform: translateY(-10px) rotate(240deg); }
}

@keyframes pawFloat{
  0% { transform: translateX(0px) translateY(0px); }
  25% { transform: translateX(10px) translateY(-15px); }
  50% { transform: translateX(-5px) translateY(-25px); }
  75% { transform: translateX(-15px) translateY(-10px); }
  100% { transform: translateX(0px) translateY(0px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}

@media (prefers-reduced-motion: reduce){
  .page-bg::before, .page-bg::after { animation: none; }
  .animate-fadeIn { animation: none; }
}

.btn {
  display:inline-flex; align-items:center; gap:10px;
  border-radius:10px; padding:10px 16px; font-weight:600;
  transition: transform .16s ease, box-shadow .16s ease, background-color .16s ease;
  border: none; cursor: pointer; pointer-events: auto;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = petThemeStyles;
  document.head.appendChild(styleElement);
}

interface Restaurant {
  id: string;
  name: string;
  location: string;
  phone: string;
  email: string;
  description: string;
  facilities: string[];
  image: string;
}

const PetRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: '',
    email: '',
    description: '',
    facilities: [] as string[],
    image: ''
  });

  const facilities = [
    { name: 'Outdoor Seating', icon: '🌿' },
    { name: 'Pet Menu', icon: '🍽️' },
    { name: 'Pet Water Bowls', icon: '💧' },
    { name: 'Play Area', icon: '🐕' },
    { name: 'Live Music', icon: '🎶' },
    { name: 'Pet Treats', icon: '🦴' }
  ];

  useEffect(() => {
    
    const sampleData: Restaurant[] = [
      {
        id: '1',
        name: 'Paws & Plates Café',
        location: 'Chennai',
        phone: '+91 98765 43210',
        email: 'info@pawsplates.com',
        description: 'A cozy café where pets and owners enjoy delicious meals together',
        facilities: ['Outdoor Seating', 'Pet Menu'],
        image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '2',
        name: 'Woofy Bites Diner',
        location: 'Bangalore',
        phone: '+91 87654 32109',
        email: 'hello@woofybites.com',
        description: 'Family diner with special play area for furry friends',
        facilities: ['Play Area', 'Pet Water Bowls'],
        image: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '3',
        name: 'TailWag Bistro',
        location: 'Mumbai',
        phone: '+91 76543 21098',
        email: 'contact@tailwagbistro.com',
        description: 'Upscale bistro with live music and gourmet pet dishes',
        facilities: ['Outdoor Seating', 'Live Music', 'Pet Menu'],
        image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=600'
      },
      {
        id: '4',
        name: 'Furry Feast Hub',
        location: 'Delhi',
        phone: '+91 65432 10987',
        email: 'info@furryfeast.com',
        description: 'Complete dining experience with pet menu and play facilities',
        facilities: ['Pet Menu', 'Pet Water Bowls', 'Play Area'],
        image: 'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg?auto=compress&cs=tinysrgb&w=600'
      }
    ];

    const stored = JSON.parse(localStorage.getItem('petRestaurants') || '[]');
    if (stored.length === 0) {
      localStorage.setItem('petRestaurants', JSON.stringify(sampleData));
      setRestaurants(sampleData);
      setFilteredRestaurants(sampleData);
    } else {
      setRestaurants(stored);
      setFilteredRestaurants(stored);
    }

  }, []);

  useEffect(() => {
    let filtered = restaurants;

    if (searchQuery) {
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFacilities.length > 0) {
      filtered = filtered.filter(r =>
        selectedFacilities.every(f => r.facilities.includes(f))
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedFacilities, restaurants]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      ...formData,
      image: formData.image || 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600'
    };

    const updated = [...restaurants, newRestaurant];
    setRestaurants(updated);
    localStorage.setItem('petRestaurants', JSON.stringify(updated));
    
    setFormData({ name: '', location: '', phone: '', email: '', description: '', facilities: [], image: '' });
    setShowForm(false);
    toast.success('Restaurant registered successfully!');
  };

  const toggleFacility = (facility: string, isForm = false) => {
    if (isForm) {
      setFormData(prev => ({
        ...prev,
        facilities: prev.facilities.includes(facility)
          ? prev.facilities.filter(f => f !== facility)
          : [...prev.facilities, facility]
      }));
    } else {
      setSelectedFacilities(prev =>
        prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
      );
    }
  };

  const getFacilityIcon = (name: string) => {
    return facilities.find(f => f.name === name)?.icon || '🐾';
  };

  return (
    <>
      <style>{`
        .galaxy-container {
          background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        

        
        .galaxy-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
      
      <div className="galaxy-container">
        <div className="galaxy-content min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 animate-fadeIn" style={{ 
                background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 229, 255, 0.5)',
                fontWeight: 700,
                letterSpacing: '1px'
              }}>
                🐾 Pet-Friendly Restaurants
              </h1>
              <p className="text-xl max-w-3xl mx-auto mb-8 animate-fadeIn" style={{ 
                color: '#00cfff',
                textShadow: '0 0 15px rgba(0, 207, 255, 0.3)'
              }}>
            Discover restaurants where you and your furry friends are welcome!
          </p>
          
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
            style={{
              backgroundColor: '#FF3B5E',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              zIndex: 10,
              position: 'relative'
            }}
          >
            <Plus className="h-6 w-6" />
            Register Your Restaurant
          </button>
        </div>

        {/* Search & Filters */}
        <div className="rounded-2xl p-6 mb-8 relative z-10" style={{
          backgroundColor: '#ffffff',
          border: '1px solid #F2E9EB',
          boxShadow: '0 6px 18px rgba(43,43,43,0.08)',
          borderRadius: '16px'
        }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#B8860B' }} />
              <input
                type="text"
                placeholder="Search restaurants or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  border: '1.5px solid #F2E9EB',
                  backgroundColor: '#ffffff',
                  color: '#2B2B2B'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#DAA520';
                  e.target.style.boxShadow = '0 0 0 3px rgba(218, 165, 32, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#F2E9EB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {facilities.map(facility => (
                <button
                  key={facility.name}
                  onClick={() => toggleFacility(facility.name)}
                  className="btn-chip px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative z-10"
                  style={{
                    backgroundColor: selectedFacilities.includes(facility.name) ? '#FF97B1' : '#ffffff',
                    color: selectedFacilities.includes(facility.name) ? '#fff' : '#FF3B5E',
                    border: '1.5px solid #FF97B1',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!selectedFacilities.includes(facility.name)) {
                      e.currentTarget.style.backgroundColor = '#FF97B1';
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!selectedFacilities.includes(facility.name)) {
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.color = '#FF3B5E';
                    }
                  }}
                >
                  {facility.icon} {facility.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map(restaurant => (
            <div
              key={restaurant.id}
              className="overflow-hidden transition-all duration-300 transform hover:scale-102 relative z-10"
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #F2E9EB',
                boxShadow: '0 6px 18px rgba(43,43,43,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(255, 59, 94, 0.15), 0 6px 18px rgba(43,43,43,0.08)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 18px rgba(43,43,43,0.08)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2" style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#2B2B2B'
                }}>
                  {restaurant.name}
                </h3>
                
                <div className="flex items-center mb-3">
                  <MapPin className="h-4 w-4 mr-2" style={{ color: '#FF7A45' }} />
                  <span className="text-sm" style={{ color: '#6E6E6E' }}>{restaurant.location}</span>
                </div>

                <p className="text-sm mb-4" style={{ color: '#6E6E6E' }}>{restaurant.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {restaurant.facilities.map(facility => (
                      <span
                        key={facility}
                        className="inline-flex items-center px-2 py-1 text-xs rounded-full"
                        style={{
                          backgroundColor: 'rgba(255, 151, 177, 0.15)',
                          color: '#FF3B5E'
                        }}
                      >
                        {getFacilityIcon(facility)} {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => window.open(`tel:${restaurant.phone}`)}
                    className="btn btn-primary flex-1 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: '#FF3B5E',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5324F';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF3B5E';
                    }}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </button>
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.location)}`, '_blank')}
                    className="btn btn-accent flex-1 py-2 px-4 rounded-lg text-sm font-semibold flex items-center justify-center transition-all duration-200 transform hover:-translate-y-0.5"
                    style={{
                      backgroundColor: '#FF7A45',
                      color: '#111',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E6693D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FF7A45';
                    }}
                  >
                    <MapPin className="h-4 w-4 mr-1" />
                    Location
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16 relative z-10">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#2B2B2B' }}>No restaurants found</h3>
            <p style={{ color: '#6E6E6E' }}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Registration Form */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{
            backgroundColor: 'rgba(11,11,11,0.55)',
            zIndex: 1000
          }}>
            <div className="p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #F2E9EB',
              boxShadow: '0 6px 18px rgba(43,43,43,0.08)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ 
                  fontFamily: 'Poppins, sans-serif',
                  color: '#2B2B2B'
                }}>
                  Register Your Restaurant
                </h2>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#FF3B5E',
                    border: '1px solid #F2E9EB'
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="Restaurant Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                  
                  <input
                    type="text"
                    placeholder="Location"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                  
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                  
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Pet-Friendly Facilities</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {facilities.map(facility => (
                      <button
                        key={facility.name}
                        type="button"
                        onClick={() => toggleFacility(facility.name, true)}
                        className={`p-3 rounded-xl border-2 transition-all text-sm ${
                          formData.facilities.includes(facility.name)
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <div className="text-lg mb-1">{facility.icon}</div>
                        {facility.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Restaurant Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({...formData, image: event.target?.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600"
                    >
                      Choose Image
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 py-3 rounded-xl font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: '#FF3B5E',
                      color: '#fff',
                      border: 'none'
                    }}
                  >
                    Register Restaurant
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn btn-outline flex-1 py-3 rounded-xl font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#FF3B5E',
                      border: '1.5px solid #FF97B1'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        </div>
        </div>
      </div>
    </>
  );
};

export default PetRestaurants;