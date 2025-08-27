import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Star, Phone, MessageCircle, Filter } from 'lucide-react';

interface Caretaker {
  id: string;
  name: string;
  experience: string;
  location: string;
  rating: number;
  profilePicture: string;
  phone: string;
  services: string[];
  description: string;
}

interface SearchProps {
  onBack: () => void;
  onSelectCaretaker: (caretaker: Caretaker) => void;
}

const CaretakerSearch: React.FC<SearchProps> = ({ onBack, onSelectCaretaker }) => {
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    // Load sample caretakers
    const sampleCaretakers: Caretaker[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        experience: '5 years of professional pet care experience',
        location: 'Downtown, City Center',
        rating: 4.9,
        profilePicture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        phone: '+1 (555) 123-4567',
        services: ['Dog Walking', 'Pet Sitting', 'Feeding'],
        description: 'Passionate pet lover with years of experience caring for dogs and cats.'
      },
      {
        id: '2',
        name: 'Mike Chen',
        experience: '3 years specializing in large breed dogs',
        location: 'Westside, Green Valley',
        rating: 4.7,
        profilePicture: 'https://images.pexels.com/photos/5384445/pexels-photo-5384445.jpeg?auto=compress&cs=tinysrgb&w=400',
        phone: '+1 (555) 234-5678',
        services: ['Dog Walking', 'Training', 'Grooming'],
        description: 'Experienced with large dogs and behavioral training.'
      },
      {
        id: '3',
        name: 'Emma Rodriguez',
        experience: '4 years with cats and small pets',
        location: 'Eastside, Maple District',
        rating: 4.8,
        profilePicture: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
        phone: '+1 (555) 345-6789',
        services: ['Pet Sitting', 'Feeding', 'Emergency Care'],
        description: 'Gentle care for cats, rabbits, and other small pets.'
      }
    ];

    const stored = JSON.parse(localStorage.getItem('caretakers') || '[]');
    setCaretakers([...sampleCaretakers, ...stored]);
  }, []);

  const filteredCaretakers = caretakers.filter(caretaker => {
    const matchesSearch = caretaker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         caretaker.services.some(service => service.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLocation = !locationFilter || caretaker.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Main
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Find Pet Caretakers</h2>
        
        {/* Search Filters */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Caretakers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCaretakers.map(caretaker => (
            <div key={caretaker.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className="text-center mb-4">
                <img
                  src={caretaker.profilePicture}
                  alt={caretaker.name}
                  className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-4 border-blue-100"
                />
                <h3 className="text-xl font-bold text-gray-900">{caretaker.name}</h3>
                <div className="flex items-center justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.floor(caretaker.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">{caretaker.rating}</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">{caretaker.location}</span>
                </div>
                <p className="text-sm text-gray-700">{caretaker.experience}</p>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {caretaker.services.slice(0, 3).map(service => (
                    <span key={service} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                  {caretaker.services.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{caretaker.services.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{caretaker.description}</p>

              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`tel:${caretaker.phone}`)}
                  className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </button>
                <button
                  onClick={() => onSelectCaretaker(caretaker)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCaretakers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No caretakers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaretakerSearch;