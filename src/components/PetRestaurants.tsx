import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#FFF8F0' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            🐾 Pet-Friendly Restaurants
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover restaurants where you and your furry friends are welcome!
          </p>
          
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
          >
            <Plus className="h-6 w-6 mr-2" />
            Register Your Restaurant
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search restaurants or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {facilities.map(facility => (
                <button
                  key={facility.name}
                  onClick={() => toggleFacility(facility.name)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedFacilities.includes(facility.name)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
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
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {restaurant.name}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{restaurant.location}</span>
                </div>

                <p className="text-gray-700 text-sm mb-4">{restaurant.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {restaurant.facilities.map(facility => (
                      <span
                        key={facility}
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                      >
                        {getFacilityIcon(facility)} {facility}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => window.open(`tel:${restaurant.phone}`)}
                    className="flex-1 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                    style={{ backgroundColor: '#4CAF50' }}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Contact
                  </button>
                  <button
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(restaurant.location)}`, '_blank')}
                    className="flex-1 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                    style={{ backgroundColor: '#3F51B5' }}
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
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No restaurants found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Registration Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Register Your Restaurant
                </h2>
                <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
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
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600"
                  >
                    Register Restaurant
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50"
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
  );
};

export default PetRestaurants;