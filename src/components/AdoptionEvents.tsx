import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Heart, Upload, Image, Filter, Search, UserCheck } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

const AdoptionEvents: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateRange: '',
    month: '',
    city: '',
    species: '',
    eventType: '',
    freeOnly: false,
    verifiedOnly: false
  });
  const [showShareMenu, setShowShareMenu] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    mobile: '',
    isFree: true,
    images: [] as string[],
    poster: ''
  });
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [participations, setParticipations] = useState<{[eventId: string]: string[]}>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('event_favorites') || '[]');
    const storedParticipations = JSON.parse(localStorage.getItem('event_participations') || '{}');
    setFavorites(storedFavorites);
    setParticipations(storedParticipations);
    
    // Generate animated galaxy stars
    const createGalaxyStars = () => {
      const container = document.querySelector('.galaxy-stars');
      if (!container) return;
      
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'galaxy-star';
        
        const starType = Math.random();
        if (starType > 0.7) {
          star.classList.add('star-violet');
        } else if (starType > 0.4) {
          star.classList.add('star-blue');
        } else {
          star.classList.add('star-white');
        }
        
        const size = Math.random() * 8 + 4;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = '-20px';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = (Math.random() * 6 + 8) + 's';
        
        container.appendChild(star);
        
        setTimeout(() => {
          if (star.parentNode) {
            star.parentNode.removeChild(star);
          }
        }, 15000);
      }
    };
    
    createGalaxyStars();
    
    const interval = setInterval(createGalaxyStars, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showShareMenu && !(event.target as Element).closest('.share-menu')) {
        setShowShareMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'poster') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (type === 'images') {
          setFormData({ ...formData, images: [...formData.images, imageUrl] });
        } else {
          setFormData({ ...formData, poster: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !user) {
      toast.error('Please log in to create events');
      return;
    }
    
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    let timeString = formData.time || '10:00';
    
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      timeString = timeString + ':00';
    } else if (!timeString.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
      timeString = '10:00:00';
    }
    
    const eventDateTime = formData.date + 'T' + timeString;
    
    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      organizerId: user.id,
      organizer: user.name,
      startDate: new Date(eventDateTime).toISOString(),
      endDate: new Date(eventDateTime).toISOString(),
      location: { address: formData.location, lat: 40.7829, lng: -73.9654 },
      capacity: 50,
      attendees: 0,
      poster: formData.poster,
      gallery: formData.images,
      tags: [],
      isFree: formData.isFree,
      status: 'active' as 'active' | 'completed' | 'cancelled',
      createdAt: new Date().toISOString()
    };
    
    try {
      addEvent(newEvent);
      setFormData({ title: '', date: '', time: '', location: '', description: '', mobile: '', isFree: true, images: [], poster: '' });
      setShowCreateForm(false);
      toast.success('Event created successfully!');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    }
  };

  const handleParticipate = async (eventId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please log in to participate in events');
      return;
    }
    
    const currentParticipants = participations[eventId] || [];
    if (currentParticipants.includes(user.id)) {
      toast.info('You are already participating in this event');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedParticipations = {
        ...participations,
        [eventId]: [...currentParticipants, user.id]
      };
      
      setParticipations(updatedParticipations);
      localStorage.setItem('event_participations', JSON.stringify(updatedParticipations));
      
      const event = events.find(e => e.id === eventId);
      if (event) {
        updateEvent(eventId, { attendees: event.attendees + 1 });
      }
      
      toast.success('Participation confirmed!');
    } catch (error) {
      toast.error('Failed to register participation');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (eventId: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to mark favorites');
      return;
    }
    
    const newFavorites = favorites.includes(eventId)
      ? favorites.filter(id => id !== eventId)
      : [...favorites, eventId];
    
    setFavorites(newFavorites);
    localStorage.setItem('event_favorites', JSON.stringify(newFavorites));
    
    toast.success(favorites.includes(eventId) ? 'Removed from favorites' : 'Added to favorites');
  };

  const cancelParticipation = (eventId: string) => {
    if (window.confirm('Are you sure you want to cancel your participation?')) {
      const updatedParticipations = {
        ...participations,
        [eventId]: (participations[eventId] || []).filter(id => id !== user?.id)
      };
      
      setParticipations(updatedParticipations);
      localStorage.setItem('event_participations', JSON.stringify(updatedParticipations));
      
      const event = events.find(e => e.id === eventId);
      if (event && event.attendees > 0) {
        updateEvent(eventId, { attendees: event.attendees - 1 });
      }
      
      toast.success('Participation cancelled');
    }
  };

  const openEventModal = (event: Event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date TBD';
    }
  };

  const getEventStatus = (startDate: string, isFree: boolean) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const statuses = [];
    
    if (isFree) {
      statuses.push({ status: 'Free', color: '#5BCB5B' });
    }
    
    if (diffDays < 0) {
      statuses.push({ status: 'Closed', color: '#E74C3C' });
    } else if (diffDays === 0) {
      statuses.push({ status: 'Open', color: '#3DBDA7' });
    } else if (diffDays <= 20) {
      statuses.push({ status: 'Coming Soon', color: '#FF914D' });
    } else {
      statuses.push({ status: 'Scheduled', color: '#666666' });
    }
    
    return statuses;
  };

  const getCountdown = (startDate: string) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const diffTime = eventDate.getTime() - now.getTime();
    
    if (diffTime <= 0) return 'Event ended';
    
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    return `${hours} hours`;
  };

  const shareEvent = (event: Event, platform: string) => {
    setShowShareMenu(null);
    const url = window.location.href;
    const text = `Check out this adoption event: ${event.title}`;
    
    setTimeout(() => {
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'email':
          window.open(`mailto:?subject=${encodeURIComponent(event.title)}&body=${encodeURIComponent(text + ' ' + url)}`);
          break;
      }
    }, 100);
  };

  const setReminder = (eventId: string) => {
    try {
      const reminders = JSON.parse(localStorage.getItem('event_reminders') || '[]');
      if (!reminders.includes(eventId)) {
        reminders.push(eventId);
        localStorage.setItem('event_reminders', JSON.stringify(reminders));
        toast.success('Reminder set successfully!');
      } else {
        toast.info('Reminder already set for this event.');
      }
    } catch (error) {
      toast.error('Failed to set reminder');
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    const eventDate = new Date(event.startDate);
    const timeString = eventDate.toTimeString().slice(0, 5);
    
    setFormData({
      title: event.title,
      date: eventDate.toISOString().split('T')[0],
      time: timeString,
      location: event.location.address,
      description: event.description,
      mobile: '+1 (555) 123-4567',
      isFree: event.isFree,
      images: event.gallery || [],
      poster: event.poster || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    let timeString = formData.time;
    if (timeString && !timeString.includes('T') && timeString.match(/^\d{1,2}:\d{2}$/)) {
      timeString = timeString + ':00';
    }
    
    const eventDateTime = formData.date + 'T' + (timeString || '10:00:00');
    
    const updatedEvent: Event = {
      ...editingEvent,
      title: formData.title,
      description: formData.description,
      startDate: new Date(eventDateTime).toISOString(),
      endDate: new Date(eventDateTime).toISOString(),
      location: { ...editingEvent.location, address: formData.location },
      poster: formData.poster,
      gallery: formData.images,
      isFree: formData.isFree
    };
    
    try {
      updateEvent(editingEvent.id, updatedEvent);
      setShowEditModal(false);
      setEditingEvent(null);
      setFormData({ title: '', date: '', time: '', location: '', description: '', mobile: '', isFree: true, images: [], poster: '' });
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully!');
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = !filters.city || event.location.address.toLowerCase().includes(filters.city.toLowerCase());
    const matchesSpecies = !filters.species || event.tags.some(tag => tag.toLowerCase().includes(filters.species.toLowerCase()));
    const matchesFree = !filters.freeOnly || event.isFree;
    const matchesVerified = !filters.verifiedOnly || event.organizerId === '1';
    const matchesMonth = !filters.month || new Date(event.startDate).getMonth() + 1 === parseInt(filters.month);
    
    return matchesSearch && matchesCity && matchesSpecies && matchesFree && matchesVerified && matchesMonth;
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
        
        .galaxy-stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
        }
        
        .galaxy-star {
          position: absolute;
          border-radius: 50%;
          animation: floatDown linear infinite;
        }
        
        .star-white {
          background: white;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.6);
        }
        
        .star-blue {
          background: #87ceeb;
          box-shadow: 0 0 18px rgba(135, 206, 235, 0.9), 0 0 35px rgba(135, 206, 235, 0.7);
        }
        
        .star-violet {
          background: #dda0dd;
          box-shadow: 0 0 20px rgba(221, 160, 221, 0.9), 0 0 40px rgba(221, 160, 221, 0.6);
        }
        
        @keyframes floatDown {
          0% {
            transform: translateY(-50px) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) scale(1.5);
            opacity: 0;
          }
        }
        
        .galaxy-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
      
      <div className="galaxy-container">
        <div className="galaxy-stars"></div>
        
        <div className="galaxy-content min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ 
              background: 'linear-gradient(135deg, #00cfff, #ff6ec7)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 207, 255, 0.5)'
            }}>
              🐾 Animal Adoption Events
            </h1>
            <p className="text-xl" style={{ 
              color: '#b388ff',
              textShadow: '0 0 15px rgba(179, 136, 255, 0.3)'
            }}>
              Find and host adoption events to help animals find their forever homes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
              style={{ backgroundColor: '#FF914D', color: 'white' }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 rounded-xl font-medium transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center"
              style={{ backgroundColor: '#3DBDA7', color: 'white' }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Host Event
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
              style={{ border: '2px solid #E0E0E0', focusRingColor: '#3DBDA7' }}
            />
          </div>
          
          {showFilters && (
            <div className="bg-white rounded-2xl shadow-lg p-6" style={{ border: '1px solid #E0E0E0', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Month</label>
                  <select
                    value={filters.month}
                    onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0E0E0' }}
                  >
                    <option value="">All Months</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0E0E0' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Animal Type</label>
                  <select
                    value={filters.species}
                    onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0E0E0' }}
                  >
                    <option value="">All Animals</option>
                    <option value="dog">Dogs</option>
                    <option value="cat">Cats</option>
                    <option value="bird">Birds</option>
                    <option value="rabbit">Rabbits</option>
                    <option value="other">Others</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Event Type</label>
                  <select
                    value={filters.eventType}
                    onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0E0E0' }}
                  >
                    <option value="">All Events</option>
                    <option value="offline">Offline</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div className="space-y-2 pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.freeOnly}
                      onChange={(e) => setFilters({ ...filters, freeOnly: e.target.checked })}
                      className="mr-2"
                      style={{ accentColor: '#3DBDA7' }}
                    />
                    <span className="text-sm" style={{ color: '#333333' }}>Free only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                      className="mr-2"
                      style={{ accentColor: '#3DBDA7' }}
                    />
                    <span className="text-sm" style={{ color: '#333333' }}>Verified NGOs</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8" style={{ border: '1px solid #E0E0E0', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>Create New Adoption Event</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Event Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Time</label>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location (e.g., Central Park, New York)"
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Event Cost</label>
                <select 
                  name="isFree"
                  value={formData.isFree.toString()}
                  onChange={(e) => setFormData({...formData, isFree: e.target.value === 'true'})}
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                >
                  <option value="true">Free</option>
                  <option value="false">Paid</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Description</label>
                <textarea 
                  rows={4} 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0E0E0' }}
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Event Images (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleImageUpload(e, 'images')}
                  className="hidden"
                  id="event-images"
                />
                <label 
                  htmlFor="event-images"
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer block"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload event images</p>
                  {formData.images.length > 0 && (
                    <p className="text-sm mt-2" style={{ color: '#3DBDA7' }}>{formData.images.length} image(s) uploaded</p>
                  )}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Event Poster (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'poster')}
                  className="hidden"
                  id="event-poster"
                />
                <label 
                  htmlFor="event-poster"
                  className="border-2 border-dashed rounded-lg p-6 text-center hover:border-teal-400 transition-colors cursor-pointer block"
                  style={{ borderColor: '#E0E0E0' }}
                >
                  <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload event poster</p>
                  {formData.poster && (
                    <p className="text-sm mt-2" style={{ color: '#3DBDA7' }}>Poster uploaded</p>
                  )}
                </label>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button 
                  type="submit" 
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
                  style={{ backgroundColor: '#3DBDA7', color: 'white' }}
                >
                  Create Event
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out"
                  style={{ border: '2px solid #E0E0E0', color: '#333333' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Favorite Events Section */}
        {isAuthenticated && favorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>Your Favorite Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.filter(event => favorites.includes(event.id)).map((event) => {
                const eventStatuses = getEventStatus(event.startDate, event.isFree);
                return (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-2xl" 
                    onClick={() => openEventModal(event)}
                    style={{ borderRadius: '20px' }}
                  >
                    <div className="relative h-48">
                      <img 
                        src={event.gallery?.[0] || event.poster || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.gallery && event.gallery.length > 1 && (
                        <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                          <img 
                            src={event.gallery[1]} 
                            alt="Secondary"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>{event.title}</h3>
                      <p className="text-sm mb-2" style={{ color: '#666666' }}>by {event.organizer}</p>
                      <p className="text-sm mb-4" style={{ color: '#666666' }}>{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center" style={{ color: '#666666' }}>
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center" style={{ color: '#666666' }}>
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location.address}</span>
                        </div>
                        <div className="flex items-center" style={{ color: '#666666' }}>
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {eventStatuses.map((status, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.status}
                          </span>
                        ))}
                      </div>
                      
                      <div onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => toggleFavorite(event.id)}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                          style={{ backgroundColor: '#FF5C8D', color: 'white' }}
                        >
                          <Heart className="h-4 w-4 fill-current inline mr-1" />
                          Favorite
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* My Events Section */}
        {isAuthenticated && user && events.filter(event => event.organizerId === user.id).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#333333' }}>My Organized Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.filter(event => event.organizerId === user.id).map((event) => {
                const eventStatuses = getEventStatus(event.startDate, event.isFree);
                return (
                  <div 
                    key={event.id} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-2xl" 
                    onClick={() => openEventModal(event)}
                    style={{ borderRadius: '20px' }}
                  >
                    <div className="relative h-48">
                      <img 
                        src={event.gallery?.[0] || event.poster || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.gallery && event.gallery.length > 1 && (
                        <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                          <img 
                            src={event.gallery[1]} 
                            alt="Secondary"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>{event.title}</h3>
                      <p className="text-sm mb-2" style={{ color: '#666666' }}>by {event.organizer}</p>
                      <p className="text-sm mb-4" style={{ color: '#666666' }}>{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center" style={{ color: '#666666' }}>
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center" style={{ color: '#666666' }}>
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location.address}</span>
                        </div>
                        <div className="flex items-center" style={{ color: '#666666' }}>
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {eventStatuses.map((status, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: status.color }}
                          >
                            {status.status}
                          </span>
                        ))}
                      </div>
                      
                      <div onClick={(e) => e.stopPropagation()} className="flex space-x-2">
                        <button 
                          onClick={() => handleEditEvent(event)}
                          className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                          style={{ backgroundColor: '#3DBDA7', color: 'white' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteEvent(event.id)}
                          className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                          style={{ backgroundColor: '#E74C3C', color: 'white' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6" style={{ 
          color: '#39ff14',
          textShadow: '0 0 20px rgba(57, 255, 20, 0.4)'
        }}>All Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const eventStatuses = getEventStatus(event.startDate, event.isFree);
            const hasComingSoon = eventStatuses.some(s => s.status === 'Coming Soon');
            return (
              <div 
                key={event.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-102 hover:shadow-2xl" 
                onClick={() => openEventModal(event)}
                style={{ borderRadius: '20px' }}
              >
                <div className="relative h-48">
                  <img 
                    src={event.gallery?.[0] || event.poster || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.gallery && event.gallery.length > 1 && (
                    <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                      <img 
                        src={event.gallery[1]} 
                        alt="Secondary"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {hasComingSoon && (
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      Starts in: {getCountdown(event.startDate)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#333333' }}>{event.title}</h3>
                  <p className="text-sm mb-2" style={{ color: '#666666' }}>by {event.organizer}</p>
                  <p className="text-sm mb-4" style={{ color: '#666666' }}>{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center" style={{ color: '#666666' }}>
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center" style={{ color: '#666666' }}>
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location.address}</span>
                    </div>
                    <div className="flex items-center" style={{ color: '#666666' }}>
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.attendees} attending</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {eventStatuses.map((status, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: status.color }}
                      >
                        {status.status}
                      </span>
                    ))}
                  </div>
                  
                  <div onClick={(e) => e.stopPropagation()} className="space-y-3">
                    <div className="flex space-x-2">
                      {isAuthenticated && user && (participations[event.id] || []).includes(user.id) ? (
                        <>
                          <button 
                            className="flex-1 px-4 py-2 rounded-lg font-medium text-white"
                            style={{ backgroundColor: '#5BCB5B' }}
                            disabled
                          >
                            Participating
                          </button>
                          <button 
                            onClick={() => cancelParticipation(event.id)}
                            className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                            style={{ backgroundColor: '#E74C3C', color: 'white' }}
                            disabled={isLoading}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => handleParticipate(event.id)}
                          className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                          style={{ backgroundColor: '#3DBDA7', color: 'white' }}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'Participate'}
                        </button>
                      )}
                      <button 
                        onClick={() => toggleFavorite(event.id)}
                        className="px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                        style={{ backgroundColor: favorites.includes(event.id) ? '#FF5C8D' : '#E0E0E0', color: favorites.includes(event.id) ? 'white' : '#333333' }}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(event.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setReminder(event.id)}
                        className="flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                        style={{ backgroundColor: '#FF914D', color: 'white' }}
                      >
                        Set Reminder
                      </button>
                      <div className="relative share-menu">
                        <button 
                          onClick={() => setShowShareMenu(showShareMenu === event.id ? null : event.id)}
                          className="px-4 py-2 rounded-lg font-medium transition-all duration-200 ease-in-out"
                          style={{ backgroundColor: '#4D9CFF', color: 'white' }}
                        >
                          Share
                        </button>
                        {showShareMenu === event.id && (
                          <div className="absolute bottom-full mb-2 right-0 bg-white border rounded-lg shadow-lg p-2 z-20 min-w-[160px]" style={{ border: '1px solid #E0E0E0' }}>
                            <div className="grid grid-cols-2 gap-1">
                              <button 
                                onClick={() => shareEvent(event, 'whatsapp')} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                📱 WhatsApp
                              </button>
                              <button 
                                onClick={() => shareEvent(event, 'facebook')} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                📘 Facebook
                              </button>
                              <button 
                                onClick={() => shareEvent(event, 'twitter')} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                🐦 Twitter
                              </button>
                              <button 
                                onClick={() => shareEvent(event, 'email')} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                📧 Email
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2" style={{ color: '#333333' }}>No events found</h3>
            <p style={{ color: '#666666' }}>Try adjusting your search or filters</p>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-350">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-350 ease-out scale-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#333333' }}>{selectedEvent.title}</h2>
                  <button 
                    onClick={() => setShowEventModal(false)}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ backgroundColor: '#E0E0E0', color: '#333333' }}
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>Event Details</h3>
                    <div className="space-y-3">
                      <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
                      <p><strong>Date:</strong> {formatDate(selectedEvent.startDate)}</p>
                      <p><strong>Location:</strong> {selectedEvent.location.address}</p>
                      <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                      <p><strong>Attendees:</strong> {selectedEvent.attendees}</p>
                      <p><strong>Description:</strong> {selectedEvent.description}</p>
                      <div className="mt-4">
                        <div className="rounded-lg p-4 text-center" style={{ backgroundColor: '#F5F5F5' }}>
                          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Location: {selectedEvent.location.address}</p>
                          <button 
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location.address)}`, '_blank')}
                            className="mt-2 text-sm underline transition-colors duration-200"
                            style={{ color: '#3DBDA7' }}
                          >
                            View on Google Maps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: '#333333' }}>Event Images</h3>
                    <div className="space-y-4">
                      {selectedEvent.poster && (
                        <div>
                          <h4 className="font-medium mb-2">Event Poster</h4>
                          <img 
                            src={selectedEvent.poster} 
                            alt="Event Poster"
                            className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity duration-300"
                            onClick={() => {
                              setSelectedImage(selectedEvent.poster!);
                              setShowImageViewer(true);
                            }}
                          />
                        </div>
                      )}
                      
                      {selectedEvent.gallery && selectedEvent.gallery.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Gallery ({selectedEvent.gallery.length} images)</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {selectedEvent.gallery.map((image, index) => (
                              <img 
                                key={index}
                                src={image} 
                                alt={`Gallery ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all duration-300 hover:scale-105"
                                onClick={() => {
                                  setSelectedImage(image);
                                  setShowImageViewer(true);
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-350">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-350 ease-out scale-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: '#333333' }}>Edit Event</h2>
                  <button 
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEvent(null);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ backgroundColor: '#E0E0E0', color: '#333333' }}
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleUpdateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Event Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                      style={{ border: '2px solid #E0E0E0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                      style={{ border: '2px solid #E0E0E0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Time</label>
                    <input 
                      type="time" 
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                      style={{ border: '2px solid #E0E0E0' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Location</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                      style={{ border: '2px solid #E0E0E0' }}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Description</label>
                    <textarea 
                      rows={4} 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 rounded-lg transition-all duration-300 ease-in-out focus:ring-2 focus:border-transparent"
                      style={{ border: '2px solid #E0E0E0' }}
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button 
                      type="submit" 
                      className="px-6 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out transform hover:scale-105"
                      style={{ backgroundColor: '#3DBDA7', color: 'white' }}
                    >
                      Update Event
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingEvent(null);
                      }}
                      className="px-6 py-2 rounded-lg font-medium transition-all duration-300 ease-in-out"
                      style={{ border: '2px solid #E0E0E0', color: '#333333' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {showImageViewer && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70] p-4 transition-opacity duration-300">
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button 
                onClick={() => setShowImageViewer(false)}
                className="absolute top-8 right-8 text-white hover:text-gray-300 text-4xl z-[80] bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors duration-200"
              >
                ×
              </button>
              <img 
                src={selectedImage} 
                alt="Full size view"
                className="max-w-full max-h-full object-contain rounded-lg transition-transform duration-300 cursor-pointer"
                onClick={() => setShowImageViewer(false)}
              />
            </div>
          </div>
        )}
        </div>
        </div>
      </div>
    </>
  );
};

export default AdoptionEvents;