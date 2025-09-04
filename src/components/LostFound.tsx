import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Award, Plus, Filter, Phone, MessageCircle, Camera, Upload, X, Clock, AlertTriangle, Navigation, Share2 } from 'lucide-react';
import { useAuth } from '../AuthContext';
import ChatScreen from './ChatScreen';
import toast from 'react-hot-toast';

interface LostFoundPost {
  id: string;
  type: 'lost' | 'found';
  petName: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  color: string;
  description: string;
  location: string;
  date: string;
  time: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  reward?: number;
  microchip?: string;
  images: string[];
  status: 'active' | 'resolved';
  userId: string;
  createdAt: string;
  urgent?: boolean;
}

const LostFound: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('lost');
  const [showReportForm, setShowReportForm] = useState(false);
  const [posts, setPosts] = useState<LostFoundPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<LostFoundPost | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [formData, setFormData] = useState({
    petName: '',
    species: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    color: '',
    date: '',
    time: '',
    location: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    reward: '',
    microchip: '',
    description: '',
    images: [] as string[]
  });

  useEffect(() => {
    const savedPosts = localStorage.getItem('lostFoundPosts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Initialize with dummy data
      const dummyPosts: LostFoundPost[] = [
        {
          id: '1',
          type: 'lost',
          petName: 'Buddy',
          species: 'Dog',
          breed: 'Labrador',
          age: '3 years',
          gender: 'Male',
          color: 'Golden with red collar',
          description: 'Very friendly, responds to name. Has a small scar on left ear.',
          location: 'Anna Nagar, Chennai',
          date: '2025-01-12',
          time: '18:30',
          contactName: 'Priya Sharma',
          contactPhone: '+91 98765 43210',
          contactEmail: 'priya@example.com',
          reward: 5000,
          microchip: 'Yes - 982000123456789',
          images: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user1',
          createdAt: '2025-01-12T18:30:00Z',
          urgent: true
        },
        {
          id: '2',
          type: 'lost',
          petName: 'Mittens',
          species: 'Cat',
          breed: 'Persian',
          age: '2 years',
          gender: 'Female',
          color: 'Grey with white paws',
          description: 'Indoor cat, very shy. No collar.',
          location: 'JP Nagar, Bangalore',
          date: '2025-01-10',
          time: '14:00',
          contactName: 'Raj Kumar',
          contactPhone: '+91 87654 32109',
          contactEmail: 'raj@example.com',
          reward: 2000,
          images: ['https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user2',
          createdAt: '2025-01-10T14:00:00Z'
        },
        {
          id: '3',
          type: 'found',
          petName: 'Unknown',
          species: 'Dog',
          breed: 'Mixed Breed',
          age: 'Adult',
          gender: 'Male',
          color: 'Brown and white',
          description: 'Found wandering near park. Very friendly, well-fed.',
          location: 'Marine Drive, Kochi',
          date: '2025-01-13',
          time: '09:00',
          contactName: 'Sarah Thomas',
          contactPhone: '+91 76543 21098',
          contactEmail: 'sarah@example.com',
          images: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user3',
          createdAt: '2025-01-13T09:00:00Z'
        },
        {
          id: '4',
          type: 'lost',
          petName: 'Sunny',
          species: 'Bird',
          breed: 'Parrot',
          age: '1 year',
          gender: 'Unknown',
          color: 'Green body, red beak',
          description: 'Flew away from balcony. Responds to name "Sunny". Very talkative.',
          location: 'Marine Drive, Kochi',
          date: '2025-01-14',
          time: '16:30',
          contactName: 'Arjun Nair',
          contactPhone: '+91 98765 12345',
          contactEmail: 'arjun@example.com',
          reward: 1500,
          images: ['https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user4',
          createdAt: '2025-01-14T16:30:00Z',
          urgent: true
        },
        {
          id: '5',
          type: 'lost',
          petName: 'Whiskers',
          species: 'Cat',
          breed: 'Siamese',
          age: '4 years',
          gender: 'Female',
          color: 'Cream with dark points, blue collar',
          description: 'Indoor cat, very scared of strangers. Has distinctive blue eyes.',
          location: 'Koramangala, Bangalore',
          date: '2025-01-11',
          time: '20:00',
          contactName: 'Meera Patel',
          contactPhone: '+91 87654 98765',
          contactEmail: 'meera@example.com',
          reward: 3000,
          microchip: 'Yes - 982000987654321',
          images: ['https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user5',
          createdAt: '2025-01-11T20:00:00Z'
        },
        {
          id: '6',
          type: 'found',
          petName: 'Unknown',
          species: 'Rabbit',
          breed: 'Holland Lop',
          age: 'Young',
          gender: 'Female',
          color: 'White with brown patches',
          description: 'Found in garden. Very calm, appears to be domesticated.',
          location: 'Banjara Hills, Hyderabad',
          date: '2025-01-12',
          time: '07:30',
          contactName: 'Vikram Singh',
          contactPhone: '+91 99887 76543',
          contactEmail: 'vikram@example.com',
          images: ['https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user6',
          createdAt: '2025-01-12T07:30:00Z'
        },
        {
          id: '7',
          type: 'lost',
          petName: 'Rocky',
          species: 'Dog',
          breed: 'German Shepherd',
          age: '5 years',
          gender: 'Male',
          color: 'Black and tan, red collar with tags',
          description: 'Large dog, very protective. Has a limp in left hind leg. Microchipped.',
          location: 'Sector 18, Noida',
          date: '2025-01-09',
          time: '19:45',
          contactName: 'Rohit Kumar',
          contactPhone: '+91 98765 54321',
          contactEmail: 'rohit@example.com',
          reward: 8000,
          microchip: 'Yes - 982000456789123',
          images: ['https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user7',
          createdAt: '2025-01-09T19:45:00Z'
        },
        {
          id: '8',
          type: 'found',
          petName: 'Unknown',
          species: 'Cat',
          breed: 'Tabby',
          age: 'Kitten',
          gender: 'Male',
          color: 'Orange tabby with white chest',
          description: 'Very young kitten, found alone. Needs immediate care.',
          location: 'Powai, Mumbai',
          date: '2025-01-14',
          time: '11:15',
          contactName: 'Priya Sharma',
          contactPhone: '+91 87654 32109',
          contactEmail: 'priya.s@example.com',
          images: ['https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'active',
          userId: 'user8',
          createdAt: '2025-01-14T11:15:00Z',
          urgent: true
        }
      ];
      setPosts(dummyPosts);
      localStorage.setItem('lostFoundPosts', JSON.stringify(dummyPosts));
    }
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesTab = post.type === activeTab;
    const matchesSearch = !searchTerm || 
      post.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || post.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesSpecies = !speciesFilter || post.species === speciesFilter;
    return matchesTab && matchesSearch && matchesLocation && matchesSpecies;
  });

  const lostPosts = posts.filter(post => post.type === 'lost');
  const foundPosts = posts.filter(post => post.type === 'found');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, imageUrl]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to submit a report');
      return;
    }

    const now = new Date();
    const reportDate = new Date(`${formData.date}T${formData.time}`);
    const isUrgent = activeTab === 'lost' && (now.getTime() - reportDate.getTime()) < 24 * 60 * 60 * 1000;

    const newPost: LostFoundPost = {
      id: Date.now().toString(),
      type: activeTab as 'lost' | 'found',
      petName: formData.petName || 'Unknown',
      species: formData.species,
      breed: formData.breed,
      age: formData.age,
      gender: formData.gender,
      color: formData.color,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      contactName: formData.contactName || user.name,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail || user.email,
      reward: formData.reward ? parseInt(formData.reward) : undefined,
      microchip: formData.microchip,
      images: formData.images.length > 0 ? formData.images : ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'],
      status: 'active',
      userId: user.id,
      createdAt: new Date().toISOString(),
      urgent: isUrgent
    };

    const updatedPosts = [...posts, newPost];
    setPosts(updatedPosts);
    localStorage.setItem('lostFoundPosts', JSON.stringify(updatedPosts));

    // Add to user's profile
    const userPosts = JSON.parse(localStorage.getItem('userLostFoundPosts') || '[]');
    userPosts.push(newPost);
    localStorage.setItem('userLostFoundPosts', JSON.stringify(userPosts));

    setFormData({
      petName: '', species: 'Dog', breed: '', age: '', gender: 'Male', color: '', date: '', time: '',
      location: '', contactName: '', contactPhone: '', contactEmail: '', reward: '', microchip: '', description: '', images: []
    });
    setShowReportForm(false);
    toast.success(`${activeTab === 'lost' ? 'Lost' : 'Found'} pet report submitted successfully!`);
  };

  const openChat = (post: LostFoundPost) => {
    setSelectedPost(post);
    setShowChat(true);
  };

  const sharePost = (post: LostFoundPost) => {
    const shareText = `${post.type === 'lost' ? '🚨 LOST PET' : '✅ FOUND PET'}: ${post.petName}\n\n` +
      `Species: ${post.species} - ${post.breed}\n` +
      `Age: ${post.age} | Gender: ${post.gender}\n` +
      `Color: ${post.color}\n` +
      `Location: ${post.location}\n` +
      `Date: ${post.date} ${post.time}\n` +
      `${post.reward ? `Reward: ₹${post.reward}\n` : ''}` +
      `Description: ${post.description}\n\n` +
      `Contact: ${post.contactName} - ${post.contactPhone}\n` +
      `Help reunite this pet with their family! 🐾`;

    if (navigator.share) {
      navigator.share({
        title: `${post.type === 'lost' ? 'Lost' : 'Found'} Pet: ${post.petName}`,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Pet details copied to clipboard!');
      }).catch(() => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      });
    }
  };

  const isRecent = (dateStr: string, timeStr: string) => {
    const postDate = new Date(`${dateStr}T${timeStr}`);
    const now = new Date();
    return (now.getTime() - postDate.getTime()) < 24 * 60 * 60 * 1000;
  };

  return (
    <>

      
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%)',
        backgroundAttachment: 'fixed'
      }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 20px rgba(179, 136, 255, 0.5)'
            }}>
              Lost & Found Pets 🐾
            </h1>
            <p className="text-xl" style={{
              background: 'linear-gradient(135deg, #a0e7ff, #d4b3ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 15px rgba(160, 231, 255, 0.4)'
            }}>
              Help reunite pets with their families through our community-powered network
            </p>
          </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search pets, breeds, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="">All Animals</option>
                <option value="Dog">Dogs</option>
                <option value="Cat">Cats</option>
                <option value="Bird">Birds</option>
                <option value="Rabbit">Rabbits</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setLocationFilter('');
                  setSpeciesFilter('');
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-0">
            <button
              onClick={() => setActiveTab('lost')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'lost' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lost Pets ({lostPosts.length})
            </button>
            <button
              onClick={() => setActiveTab('found')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'found' 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Found Pets ({foundPosts.length})
            </button>
          </div>
          
          <button
            onClick={() => setShowReportForm(true)}
            className={`px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center text-white ${
              activeTab === 'lost' 
                ? 'bg-gradient-to-r from-red-500 to-red-600' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}
          >
            <Plus className="mr-2 h-5 w-5" />
            Report {activeTab === 'lost' ? 'Lost' : 'Found'} Pet
          </button>
        </div>

        {showReportForm && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Report {activeTab === 'lost' ? 'Lost' : 'Found'} Pet
              </h3>
              <button
                onClick={() => setShowReportForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name {activeTab === 'found' && '(if known)'}</label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    placeholder={activeTab === 'found' ? 'Unknown' : 'Enter pet name'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species *</label>
                  <select
                    name="species"
                    value={formData.species}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleInputChange}
                    placeholder="e.g., Labrador, Persian, Mixed"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 2 years, Puppy, Adult"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color & Markings *</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Golden with white chest, Black collar"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'lost' ? 'Last Seen Date' : 'Found Date'} *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Anna Nagar, Chennai - Near Park"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    required
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                {activeTab === 'lost' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reward Amount (₹)</label>
                    <input
                      type="number"
                      name="reward"
                      value={formData.reward}
                      onChange={handleInputChange}
                      placeholder="Optional reward amount"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Microchip ID</label>
                  <input
                    type="text"
                    name="microchip"
                    value={formData.microchip}
                    onChange={handleInputChange}
                    placeholder="If microchipped"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  placeholder="Detailed description: behavior, distinguishing features, collar details, etc."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload photos or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB each</p>
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Pet photo ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                    activeTab === 'lost' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  Submit Report
                </button>
                <button 
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pet Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="relative h-48">
                <img 
                  src={post.images[0]} 
                  alt={post.petName}
                  className="w-full h-full object-cover"
                />
                {post.urgent && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    URGENT
                  </div>
                )}
                {post.reward && post.reward > 0 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    ₹{post.reward}
                  </div>
                )}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                  post.type === 'lost' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {post.type === 'lost' ? 'MISSING' : 'FOUND'}
                </div>
                {isRecent(post.date, post.time) && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Recent
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    {post.petName}
                  </h3>
                  <p className="text-gray-600">{post.species} • {post.breed} • {post.age} • {post.gender}</p>
                  <p className="text-sm text-gray-500">by {post.contactName}</p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                      {post.type === 'lost' ? 'Last seen:' : 'Found:'} {post.date} {post.time && `at ${post.time}`}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{post.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4 line-clamp-3">{post.description}</p>
                
                <div className="space-y-2">
                  <button 
                    onClick={() => openChat(post)}
                    className={`w-full py-2 px-4 rounded-lg transition-colors text-sm font-medium text-white ${
                      post.type === 'lost' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    <MessageCircle className="h-4 w-4 mr-1 inline" />
                    Chat with {post.type === 'lost' ? 'Owner' : 'Finder'}
                  </button>
                  <div className="flex space-x-2">
                    <a
                      href={`tel:${post.contactPhone}`}
                      className={`flex-1 p-2 rounded-lg transition-colors text-center text-white ${
                        post.type === 'lost' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
                      }`}
                      title="Call"
                    >
                      <Phone className="h-4 w-4 mx-auto" />
                    </a>
                    <button
                      onClick={() => {
                        const query = encodeURIComponent(post.location);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                      }}
                      className={`flex-1 p-2 rounded-lg transition-colors text-white ${
                        post.type === 'lost' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-teal-500 hover:bg-teal-600'
                      }`}
                      title="View Location"
                    >
                      <Navigation className="h-4 w-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => sharePost(post)}
                      className={`flex-1 p-2 rounded-lg transition-colors text-white ${
                        post.type === 'lost' ? 'bg-purple-500 hover:bg-purple-600' : 'bg-indigo-500 hover:bg-indigo-600'
                      }`}
                      title="Share Pet Details"
                    >
                      <Share2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No pets found</h3>
            <p className="text-gray-600">Try adjusting your search filters or be the first to report a {activeTab} pet.</p>
          </div>
        )}
        
        {/* Chat Screen */}
        {showChat && selectedPost && (
          <ChatScreen
            session={{
              id: selectedPost.id,
              name: selectedPost.contactName,
              image: selectedPost.images[0],
              isOnline: Math.random() > 0.5,
              lastSeen: new Date(),
              messages: (() => {
                const lostFoundChats = JSON.parse(localStorage.getItem('lostFoundChats') || '[]');
                const existingChat = lostFoundChats.find((chat: any) => chat.postId === selectedPost.id);
                return existingChat ? existingChat.messages : [];
              })(),
              type: 'shop'
            }}
            onClose={() => {
              setShowChat(false);
              setSelectedPost(null);
            }}
            showBackToProfile={false}
          />
        )}
      </div>
      </div>
    </>
  );
};

export default LostFound;