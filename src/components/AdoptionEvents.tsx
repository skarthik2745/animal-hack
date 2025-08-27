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
    
    // Validate required fields
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Parse time from HTML5 time input (HH:MM format)
    let timeString = formData.time || '10:00';
    
    // Ensure time has seconds for ISO string
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
      statuses.push({ status: 'Free', variant: 'success' as const });
    }
    
    if (diffDays < 0) {
      statuses.push({ status: 'Closed', variant: 'secondary' as const });
    } else if (diffDays === 0) {
      statuses.push({ status: 'Open', variant: 'success' as const });
    } else if (diffDays <= 20) {
      statuses.push({ status: 'Coming Soon', variant: 'info' as const });
    } else {
      statuses.push({ status: 'Scheduled', variant: 'default' as const });
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
    const timeString = eventDate.toTimeString().slice(0, 5); // Get HH:MM format
    
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
    
    // Handle time format - if it's a simple time like "10:00", assume it's 24-hour format
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Animal Adoption Events
            </h1>
            <p className="text-xl text-gray-600">
              Find and host adoption events to help animals find their forever homes
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Host Event
            </Button>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          
          {showFilters && (
            <Card className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={filters.month}
                    onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animal Type</label>
                  <select
                    value={filters.species}
                    onChange={(e) => setFilters({ ...filters, species: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                  <select
                    value={filters.eventType}
                    onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      className="mr-2 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Free only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters({ ...filters, verifiedOnly: e.target.checked })}
                      className="mr-2 text-emerald-500 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">Verified NGOs</span>
                  </label>
                </div>
              </div>
            </Card>
          )}
        </div>

        {showCreateForm && (
          <Card className="p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Adoption Event</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                <input 
                  type="time" 
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input 
                  type="text" 
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter event location (e.g., Central Park, New York)"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Cost</label>
                <select 
                  name="isFree"
                  value={formData.isFree.toString()}
                  onChange={(e) => setFormData({...formData, isFree: e.target.value === 'true'})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="true">Free</option>
                  <option value="false">Paid</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows={4} 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Images (Optional)</label>
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
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer block"
                >
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload event images</p>
                  {formData.images.length > 0 && (
                    <p className="text-emerald-600 text-sm mt-2">{formData.images.length} image(s) uploaded</p>
                  )}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Event Poster (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'poster')}
                  className="hidden"
                  id="event-poster"
                />
                <label 
                  htmlFor="event-poster"
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-400 transition-colors cursor-pointer block"
                >
                  <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm">Click to upload event poster</p>
                  {formData.poster && (
                    <p className="text-emerald-600 text-sm mt-2">Poster uploaded</p>
                  )}
                </label>
              </div>
              <div className="md:col-span-2 flex space-x-4">
                <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                  Create Event
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Card>
        )}

        {/* Favorite Events Section */}
        {isAuthenticated && favorites.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Favorite Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.filter(event => favorites.includes(event.id)).map((event) => {
                const eventStatuses = getEventStatus(event.startDate, event.isFree);
                return (
                  <Card key={event.id} className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105" onClick={() => openEventModal(event)}>
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
                    <CardContent>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {event.organizer}</p>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter onClick={(e) => e.stopPropagation()} className="transition-all duration-300 ease-in-out">
                      <div className="space-y-2 w-full">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {eventStatuses.map((status, index) => (
                            <Badge key={index} variant={status.variant}>{status.status}</Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => toggleFavorite(event.id)}
                            className="text-red-500"
                          >
                            <Heart className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* My Events Section */}
        {isAuthenticated && user && events.filter(event => event.organizerId === user.id).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Organized Events</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events.filter(event => event.organizerId === user.id).map((event) => {
                const eventStatuses = getEventStatus(event.startDate, event.isFree);
                return (
                  <Card key={event.id} className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105" onClick={() => openEventModal(event)}>
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
                    <CardContent>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {event.organizer}</p>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter onClick={(e) => e.stopPropagation()} className="transition-all duration-300 ease-in-out">
                      <div className="space-y-2 w-full">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {eventStatuses.map((status, index) => (
                            <Badge key={index} variant={status.variant}>{status.status}</Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(event);
                            }}
                            className="flex-1 transition-all duration-300 ease-in-out"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(event.id);
                            }}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 transition-all duration-300 ease-in-out"
                          >
                            Delete
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            className="transition-all duration-300 ease-in-out"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            {(participations[event.id] || []).length}
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredEvents.map((event) => {
            const eventStatuses = getEventStatus(event.startDate, event.isFree);
            const hasComingSoon = eventStatuses.some(s => s.status === 'Coming Soon');
            return (
              <Card key={event.id} className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 ease-in-out transform hover:scale-105" onClick={() => openEventModal(event)}>
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
                <CardContent>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">by {event.organizer}</p>
                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.location.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">{event.attendees} attending</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter onClick={(e) => e.stopPropagation()} className="transition-all duration-300 ease-in-out">
                  <div className="space-y-2 w-full">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {eventStatuses.map((status, index) => (
                        <Badge key={index} variant={status.variant}>{status.status}</Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      {isAuthenticated && user && (participations[event.id] || []).includes(user.id) ? (
                        <>
                          <Button className="flex-1 bg-green-500 text-white" size="sm" disabled>
                            You are participating
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelParticipation(event.id);
                            }}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <Button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleParticipate(event.id);
                          }}
                          className="flex-1 transition-all duration-300 ease-in-out"
                          size="sm"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Processing...' : 'I want to participate'}
                        </Button>
                      )}
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event.id);
                        }}
                        className={favorites.includes(event.id) ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(event.id) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReminder(event.id);
                        }}
                        className="flex-1 transition-all duration-300 ease-in-out"
                      >
                        Set Reminder
                      </Button>
                      <div className="relative share-menu">
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowShareMenu(showShareMenu === event.id ? null : event.id);
                          }}
                        >
                          Share
                        </Button>
                        {showShareMenu === event.id && (
                          <div className="absolute bottom-full mb-2 right-0 bg-white border rounded-lg shadow-lg p-2 z-20 min-w-[160px]">
                            <div className="grid grid-cols-2 gap-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareEvent(event, 'whatsapp');
                                }} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                📱 WhatsApp
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareEvent(event, 'facebook');
                                }} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                📘 Facebook
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareEvent(event, 'twitter');
                                }} 
                                className="p-2 hover:bg-gray-100 rounded text-xs flex items-center gap-1"
                              >
                                🐦 Twitter
                              </button>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareEvent(event, 'email');
                                }} 
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
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out scale-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                  <button 
                    onClick={() => setShowEventModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                    <div className="space-y-3">
                      <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
                      <p><strong>Date:</strong> {formatDate(selectedEvent.startDate)}</p>
                      <p><strong>Location:</strong> {selectedEvent.location.address}</p>
                      <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                      <p><strong>Attendees:</strong> {selectedEvent.attendees}</p>
                      <p><strong>Description:</strong> {selectedEvent.description}</p>
                      <div className="mt-4">
                        <div className="bg-gray-100 rounded-lg p-4 text-center">
                          <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Location: {selectedEvent.location.address}</p>
                          <button 
                            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(selectedEvent.location.address)}`, '_blank')}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            View on Google Maps
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Event Images</h3>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out scale-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                  <button 
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEvent(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleUpdateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input 
                      type="time" 
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      rows={4} 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      Update Event
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingEvent(null);
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
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
  );
};

export default AdoptionEvents;