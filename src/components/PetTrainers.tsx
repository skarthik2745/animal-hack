import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, MessageCircle, Phone, Plus, X, Upload, Filter, SortAsc, Clock, DollarSign, Award, User } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import ChatScreen from './ChatScreen';
import toast from 'react-hot-toast';

interface Trainer {
  id: string;
  name: string;
  profilePicture: string;
  specialization: string[];
  experience: number;
  location: string;
  contactNumber: string;
  fees: string;
  availability: string;
  bio: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

interface TrainerChat {
  trainerId: string;
  trainerName: string;
  trainerImage: string;
  isOnline: boolean;
  lastSeen?: Date;
  messages: any[];
}

const PetTrainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [showRegistration, setShowRegistration] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showChat, setShowChat] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
  const { user, isAuthenticated } = useAuth();

  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    profilePicture: '',
    specialization: [] as string[],
    experience: '',
    location: '',
    contactNumber: '',
    fees: '',
    availability: '',
    bio: ''
  });

  const specializations = [
    'Obedience Training',
    'Agility Training',
    'Guard Dog Training',
    'Puppy Training',
    'Behavioral Training',
    'Service Dog Training',
    'Grooming Training',
    'Therapy Dog Training',
    'Competition Training',
    'Basic Commands'
  ];

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = () => {
    const dummyTrainers: Trainer[] = [
      {
        id: '1',
        name: 'Sarah Mitchell',
        profilePicture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialization: ['Obedience Training', 'Puppy Training'],
        experience: 8,
        location: 'New York, NY',
        contactNumber: '+1 (555) 123-4567',
        fees: '$50-80/session',
        availability: 'Mon-Fri 9AM-6PM',
        bio: 'Certified dog trainer with 8+ years of experience. Specializing in positive reinforcement techniques.',
        rating: 4.8,
        reviewCount: 127,
        isVerified: true
      },
      {
        id: '2',
        name: 'Mike Johnson',
        profilePicture: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialization: ['Agility Training', 'Competition Training'],
        experience: 12,
        location: 'Los Angeles, CA',
        contactNumber: '+1 (555) 234-5678',
        fees: '$75-120/session',
        availability: 'Tue-Sat 8AM-7PM',
        bio: 'Professional agility trainer. Helped over 200 dogs compete successfully in national competitions.',
        rating: 4.9,
        reviewCount: 89,
        isVerified: true
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        profilePicture: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialization: ['Behavioral Training', 'Therapy Dog Training'],
        experience: 6,
        location: 'Chicago, IL',
        contactNumber: '+1 (555) 345-6789',
        fees: '$60-90/session',
        availability: 'Mon-Thu 10AM-5PM',
        bio: 'Specialized in behavioral modification and therapy dog certification. Gentle approach with anxious pets.',
        rating: 4.7,
        reviewCount: 156,
        isVerified: true
      },
      {
        id: '4',
        name: 'David Chen',
        profilePicture: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        specialization: ['Guard Dog Training', 'Service Dog Training'],
        experience: 15,
        location: 'Houston, TX',
        contactNumber: '+1 (555) 456-7890',
        fees: '$100-150/session',
        availability: 'Mon-Sat 7AM-8PM',
        bio: 'Former K9 police trainer. Expert in protection and service dog training with military-grade techniques.',
        rating: 4.9,
        reviewCount: 203,
        isVerified: true
      }
    ];

    const savedTrainers = JSON.parse(localStorage.getItem('petTrainers') || '[]');
    setTrainers([...dummyTrainers, ...savedTrainers]);
  };

  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to register as a trainer');
      return;
    }

    const newTrainer: Trainer = {
      id: Date.now().toString(),
      name: registrationForm.name,
      profilePicture: registrationForm.profilePicture || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
      specialization: registrationForm.specialization,
      experience: parseInt(registrationForm.experience),
      location: registrationForm.location,
      contactNumber: registrationForm.contactNumber,
      fees: registrationForm.fees,
      availability: registrationForm.availability,
      bio: registrationForm.bio,
      rating: 5.0,
      reviewCount: 0,
      isVerified: false
    };

    const savedTrainers = JSON.parse(localStorage.getItem('petTrainers') || '[]');
    savedTrainers.push(newTrainer);
    localStorage.setItem('petTrainers', JSON.stringify(savedTrainers));

    setTrainers(prev => [...prev, newTrainer]);
    setRegistrationForm({
      name: '', profilePicture: '', specialization: [], experience: '', location: '',
      contactNumber: '', fees: '', availability: '', bio: ''
    });
    setShowRegistration(false);
    toast.success('Trainer registration successful!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRegistrationForm({ ...registrationForm, profilePicture: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSpecialization = (spec: string) => {
    setRegistrationForm(prev => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter(s => s !== spec)
        : [...prev.specialization, spec]
    }));
  };

  const openChat = (trainer: Trainer) => {
    if (!isAuthenticated) {
      toast.error('Please log in to chat with trainers');
      return;
    }

    setSelectedTrainer(trainer);
    setShowChat(true);

    // Initialize chat if not exists
    const existingChats = JSON.parse(localStorage.getItem('trainerChats') || '[]');
    const chatExists = existingChats.find((chat: TrainerChat) => chat.trainerId === trainer.id);
    
    if (!chatExists) {
      const newChat: TrainerChat = {
        trainerId: trainer.id,
        trainerName: trainer.name,
        trainerImage: trainer.profilePicture,
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        messages: []
      };
      existingChats.push(newChat);
      localStorage.setItem('trainerChats', JSON.stringify(existingChats));
    }
  };

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trainer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (trainer.specialization && trainer.specialization.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesSpecialization = !selectedSpecialization || 
                                 (trainer.specialization && trainer.specialization.includes(selectedSpecialization));
    
    return matchesSearch && matchesSpecialization;
  });

  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    switch (sortBy) {
      case 'experience':
        return b.experience - a.experience;
      case 'rating':
        return b.rating - a.rating;
      case 'fees':
        return parseInt(a.fees.replace(/\D/g, '')) - parseInt(b.fees.replace(/\D/g, ''));
      default:
        return a.name.localeCompare(b.name);
    }
  });

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
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{
            background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(0, 229, 255, 0.5)'
          }}>Pet Trainers</h1>
          <p className="text-xl md:text-2xl font-medium mb-6" style={{
            color: '#00cfff',
            textShadow: '0 0 15px rgba(0, 207, 255, 0.3)'
          }}>Find Certified Pet Trainers for your Furry Friends</p>
          <button
            onClick={() => setShowRegistration(true)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register as Trainer
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-lg border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search trainers, location, specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
              />
            </div>
            
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 shadow-sm"
              style={{ background: 'linear-gradient(to right, #f0fdfa, #faf5ff)' }}
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 shadow-sm"
              style={{ background: 'linear-gradient(to right, #f0fdfa, #faf5ff)' }}
            >
              <option value="name">Sort by Name</option>
              <option value="experience">Sort by Experience</option>
              <option value="rating">Sort by Rating</option>
              <option value="fees">Sort by Fees</option>
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              {filteredTrainers.length} trainer{filteredTrainers.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-3xl border-2 border-transparent hover:border-gradient-to-r hover:from-teal-300 hover:to-purple-300" style={{
              boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 0 0 1px rgba(20,184,166,0.1)',
              background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)'
            }}>
              <div className="relative">
                <img
                  src={trainer.profilePicture}
                  alt={trainer.name}
                  className="w-full h-48 object-cover"
                />
                {trainer.isVerified && (
                  <div className="absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-emerald-400 to-green-500 text-white text-xs font-medium rounded-full shadow-lg flex items-center animate-pulse">
                    <Award className="h-3 w-3 mr-1" />
                    Verified
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-transparent">{trainer.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-current" style={{ background: 'linear-gradient(45deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }} />
                    <span className="text-sm text-gray-600 ml-1">
                      {trainer.rating} ({trainer.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{trainer.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Award className="h-4 w-4 mr-2" />
                    <span className="text-sm">{trainer.experience} years experience</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span className="text-sm">{trainer.fees}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span className="text-sm">{trainer.availability}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialization && trainer.specialization.slice(0, 2).map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-gradient-to-r from-teal-100 to-purple-100 text-teal-800 text-xs font-medium rounded-full border border-teal-200">
                        {spec}
                      </span>
                    ))}
                    {trainer.specialization && trainer.specialization.length > 2 && (
                      <span className="px-2 py-1 bg-gradient-to-r from-teal-100 to-purple-100 text-teal-800 text-xs font-medium rounded-full border border-teal-200">
                        +{trainer.specialization.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{trainer.bio}</p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => openChat(trainer)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-sky-300 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </button>
                  <button
                    onClick={() => window.open(`tel:${trainer.contactNumber}`, '_self')}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-400 to-green-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-emerald-300 hover:to-green-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center group"
                  >
                    <Phone className="h-4 w-4 group-hover:animate-bounce" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrainers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No trainers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or register as a trainer!</p>
          </div>
        )}

        {/* Registration Modal */}
        {showRegistration && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent">Register as Pet Trainer</h2>
                  <button
                    onClick={() => setShowRegistration(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleRegistration} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trainer Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={registrationForm.name}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience (years) *
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={registrationForm.experience}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, experience: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        required
                        value={registrationForm.location}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, location: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={registrationForm.contactNumber}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, contactNumber: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fees/Charges *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., $50-80/session"
                        value={registrationForm.fees}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, fees: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability Schedule *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., Mon-Fri 9AM-6PM"
                        value={registrationForm.availability}
                        onChange={(e) => setRegistrationForm({ ...registrationForm, availability: e.target.value })}
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Training Specializations *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {specializations.map((spec) => (
                        <label key={spec} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={registrationForm.specialization.includes(spec)}
                            onChange={() => toggleSpecialization(spec)}
                            className="mr-2"
                          />
                          <span className="text-sm">{spec}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="profile-picture"
                    />
                    <label
                      htmlFor="profile-picture"
                      className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Profile Picture
                    </label>
                    {registrationForm.profilePicture && (
                      <img
                        src={registrationForm.profilePicture}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover mx-auto mt-2"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio/Introduction *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={registrationForm.bio}
                      onChange={(e) => setRegistrationForm({ ...registrationForm, bio: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      placeholder="Tell us about your training experience and approach..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Register as Trainer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRegistration(false)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Chat Screen */}
        {showChat && selectedTrainer && (
          <ChatScreen
            session={{
              id: selectedTrainer.id,
              name: selectedTrainer.name,
              image: selectedTrainer.profilePicture,
              isOnline: Math.random() > 0.5,
              lastSeen: new Date(Date.now() - Math.random() * 3600000),
              messages: JSON.parse(localStorage.getItem('trainerChats') || '[]').find((s: any) => s.trainerId === selectedTrainer.id)?.messages || [],
              type: 'trainer'
            }}
            onClose={() => {
              setShowChat(false);
              setSelectedTrainer(null);
            }}
          />
        )}
        </div>
        </div>
      </div>
    </>
  );
};

export default PetTrainers;