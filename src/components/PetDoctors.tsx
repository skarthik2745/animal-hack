import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Globe, Plus, Upload, X, Stethoscope, Building2, Star, MessageCircle, Calendar, Send, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  phone: string;
  email: string;
  profilePicture: string;
  verified: boolean;
  rating: number;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
}

interface ChatSession {
  doctorId: string;
  doctorName: string;
  messages: Message[];
}

interface Appointment {
  id: string;
  doctorId?: string;
  hospitalId?: string;
  patientName: string;
  petName: string;
  petType: string;
  date: string;
  time: string;
  reason: string;
  phone: string;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  image: string;
  latitude: number;
  longitude: number;
  services: string[];
  rating: number;
}

const PetDoctors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'hospitals'>('doctors');
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentTarget, setAppointmentTarget] = useState<{type: 'doctor' | 'hospital', id: string} | null>(null);
  const { isAuthenticated, user } = useAuth();

  const [doctorForm, setDoctorForm] = useState({
    name: '',
    specialization: '',
    experience: '',
    phone: '',
    email: '',
    profilePicture: ''
  });

  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    image: '',
    services: ''
  });

  const [appointmentForm, setAppointmentForm] = useState({
    patientName: '',
    petName: '',
    petType: '',
    date: '',
    time: '',
    reason: '',
    phone: ''
  });

  useEffect(() => {
    const savedChats = localStorage.getItem('doctorChats');
    if (savedChats) {
      setChatSessions(JSON.parse(savedChats));
    }
    
    setDoctors([
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Small Animal Surgery',
        experience: '8 years',
        phone: '+1 (555) 123-4567',
        email: 'sarah.johnson@vetcare.com',
        profilePicture: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        verified: true,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Exotic Animal Medicine',
        experience: '12 years',
        phone: '+1 (555) 234-5678',
        email: 'michael.chen@vetcare.com',
        profilePicture: 'https://images.pexels.com/photos/6129967/pexels-photo-6129967.jpeg?auto=compress&cs=tinysrgb&w=400',
        verified: true,
        rating: 4.9
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Veterinary Dermatology',
        experience: '6 years',
        phone: '+1 (555) 345-6789',
        email: 'emily.rodriguez@vetcare.com',
        profilePicture: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=400',
        verified: true,
        rating: 4.7
      },
      {
        id: '4',
        name: 'Dr. James Wilson',
        specialization: 'Emergency & Critical Care',
        experience: '15 years',
        phone: '+1 (555) 456-7890',
        email: 'james.wilson@vetcare.com',
        profilePicture: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400',
        verified: true,
        rating: 5.0
      },
      {
        id: '5',
        name: 'Dr. Lisa Thompson',
        specialization: 'Veterinary Cardiology',
        experience: '10 years',
        phone: '+1 (555) 567-8901',
        email: 'lisa.thompson@vetcare.com',
        profilePicture: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=400',
        verified: true,
        rating: 4.6
      }
    ]);

    setHospitals([
      {
        id: '1',
        name: 'BluePearl Pet Hospital',
        address: '123 Main Street, New York, NY 10001',
        phone: '+1 (212) 555-0123',
        email: 'info@bluepearlvet.com',
        website: 'https://bluepearlvet.com',
        image: 'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=800',
        latitude: 40.7589,
        longitude: -73.9851,
        services: ['Emergency Care', 'Surgery', 'Diagnostics', 'Specialty Care'],
        rating: 4.7
      },
      {
        id: '2',
        name: 'VCA Animal Hospital',
        address: '456 Oak Avenue, Los Angeles, CA 90210',
        phone: '+1 (323) 555-0456',
        email: 'contact@vcahospitals.com',
        website: 'https://vcahospitals.com',
        image: 'https://images.pexels.com/photos/6235657/pexels-photo-6235657.jpeg?auto=compress&cs=tinysrgb&w=800',
        latitude: 34.0522,
        longitude: -118.2437,
        services: ['General Practice', 'Preventive Care', 'Dental Care', 'Grooming'],
        rating: 4.5
      },
      {
        id: '3',
        name: 'Animal Medical Center',
        address: '789 Pine Street, Chicago, IL 60601',
        phone: '+1 (312) 555-0789',
        email: 'info@amcny.org',
        website: 'https://amcny.org',
        image: 'https://images.pexels.com/photos/6816861/pexels-photo-6816861.jpeg?auto=compress&cs=tinysrgb&w=800',
        latitude: 41.8781,
        longitude: -87.6298,
        services: ['Oncology', 'Cardiology', 'Neurology', 'Ophthalmology'],
        rating: 4.9
      },
      {
        id: '4',
        name: 'Banfield Pet Hospital',
        address: '321 Elm Drive, Houston, TX 77001',
        phone: '+1 (713) 555-0321',
        email: 'support@banfield.com',
        website: 'https://banfield.com',
        image: 'https://images.pexels.com/photos/6235019/pexels-photo-6235019.jpeg?auto=compress&cs=tinysrgb&w=800',
        latitude: 29.7604,
        longitude: -95.3698,
        services: ['Wellness Plans', 'Vaccinations', 'Surgery', 'Pharmacy'],
        rating: 4.3
      },
      {
        id: '5',
        name: 'ASPCA Animal Hospital',
        address: '654 Maple Lane, Miami, FL 33101',
        phone: '+1 (305) 555-0654',
        email: 'info@aspca.org',
        website: 'https://aspca.org',
        image: 'https://images.pexels.com/photos/6816854/pexels-photo-6816854.jpeg?auto=compress&cs=tinysrgb&w=800',
        latitude: 25.7617,
        longitude: -80.1918,
        services: ['Spay/Neuter', 'Adoption Services', 'Emergency Care', 'Behavioral Training'],
        rating: 4.6
      }
    ]);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const openChatId = urlParams.get('openChat');
    if (openChatId && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === openChatId);
      if (doctor) {
        openChat(doctor);
        window.history.replaceState({}, '', '/pet-doctors');
      }
    }
  }, [doctors]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location captured successfully!');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'doctor' | 'hospital') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (type === 'doctor') {
          setDoctorForm({ ...doctorForm, profilePicture: imageUrl });
        } else {
          setHospitalForm({ ...hospitalForm, image: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to register as a doctor');
      return;
    }

    const newDoctor: Doctor = {
      id: Date.now().toString(),
      ...doctorForm,
      verified: false,
      rating: 0
    };

    setDoctors([...doctors, newDoctor]);
    setDoctorForm({ name: '', specialization: '', experience: '', phone: '', email: '', profilePicture: '' });
    setShowDoctorForm(false);
    toast.success('Doctor registration submitted for verification!');
  };

  const handleHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to register a hospital');
      return;
    }

    const newHospital: Hospital = {
      id: Date.now().toString(),
      ...hospitalForm,
      latitude: location?.lat || 0,
      longitude: location?.lng || 0,
      services: hospitalForm.services.split(',').map(s => s.trim()),
      rating: 0
    };

    setHospitals([...hospitals, newHospital]);
    setHospitalForm({ name: '', address: '', phone: '', email: '', website: '', image: '', services: '' });
    setShowHospitalForm(false);
    setLocation(null);
    toast.success('Hospital registration submitted successfully!');
  };

  const openImageViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const openChat = (doctor: Doctor) => {
    if (!isAuthenticated) {
      toast.error('Please log in to chat with doctors');
      return;
    }
    setSelectedDoctor(doctor);
    setShowChat(true);
    setActiveTab('doctors');
  };

  const sendMessage = () => {
    if (!chatMessage.trim() || !selectedDoctor || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedDoctor.id,
      content: chatMessage.trim(),
      timestamp: new Date(),
      isFromUser: true
    };

    const updatedSessions = [...chatSessions];
    const existingSessionIndex = updatedSessions.findIndex(s => s.doctorId === selectedDoctor.id);

    if (existingSessionIndex >= 0) {
      updatedSessions[existingSessionIndex].messages.push(newMessage);
    } else {
      updatedSessions.push({
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        messages: [newMessage]
      });
    }

    setChatSessions(updatedSessions);
    localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
    setChatMessage('');

    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedDoctor.id,
        receiverId: user.id,
        content: 'Thank you for your message. I will get back to you shortly.',
        timestamp: new Date(),
        isFromUser: false
      };

      const sessions = JSON.parse(localStorage.getItem('doctorChats') || '[]');
      const sessionIndex = sessions.findIndex((s: ChatSession) => s.doctorId === selectedDoctor.id);
      if (sessionIndex >= 0) {
        sessions[sessionIndex].messages.push(doctorResponse);
        setChatSessions(sessions);
        localStorage.setItem('doctorChats', JSON.stringify(sessions));
      }
    }, 2000);
  };

  const openAppointmentForm = (type: 'doctor' | 'hospital', id: string) => {
    if (!isAuthenticated) {
      toast.error('Please log in to book appointments');
      return;
    }
    setAppointmentTarget({ type, id });
    setShowAppointmentForm(true);
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentTarget) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...(appointmentTarget.type === 'doctor' ? { doctorId: appointmentTarget.id } : { hospitalId: appointmentTarget.id }),
      ...appointmentForm
    };

    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    existingAppointments.push(newAppointment);
    localStorage.setItem('appointments', JSON.stringify(existingAppointments));

    setAppointmentForm({
      patientName: '',
      petName: '',
      petType: '',
      date: '',
      time: '',
      reason: '',
      phone: ''
    });
    setShowAppointmentForm(false);
    setAppointmentTarget(null);
    toast.success('Appointment booked successfully!');
  };

  const openGoogleMaps = (latitude: number, longitude: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const getCurrentChatSession = () => {
    if (!selectedDoctor) return null;
    return chatSessions.find(s => s.doctorId === selectedDoctor.id);
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{ 
      background: 'linear-gradient(135deg, #E8F5E8 0%, #FFFFFF 100%)',
      backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%232ECC71" fill-opacity="0.03"%3E%3Cpath d="M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      backgroundSize: '60px 60px'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 
            className="text-4xl sm:text-5xl font-bold mb-4"
            style={{ 
              background: 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 8px rgba(0,0,0,0.15)',
              fontFamily: 'Poppins, sans-serif'
            }}
          >
            🐾 Pet Doctors & Hospitals
          </h1>
          <p className="text-xl" style={{ color: '#7F8C8D', fontFamily: 'Nunito, sans-serif' }}>
            Find qualified veterinarians and trusted animal hospitals near you
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-4 p-2 bg-white rounded-xl shadow-lg" style={{ border: '1px solid #F5F6FA' }}>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center transform hover:scale-105 ${
                activeTab === 'doctors' ? 'shadow-lg' : 'hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: activeTab === 'doctors' ? '#2ECC71' : 'white',
                color: activeTab === 'doctors' ? 'white' : '#2ECC71',
                border: activeTab === 'doctors' ? 'none' : '2px solid #2ECC71',
                borderRadius: '10px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'doctors') {
                  e.currentTarget.style.backgroundColor = '#2ECC71';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'doctors') {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#2ECC71';
                }
              }}
            >
              <span className="mr-2">🩺</span>
              Veterinary Doctors
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center transform hover:scale-105 ${
                activeTab === 'hospitals' ? 'shadow-lg' : 'hover:shadow-md'
              }`}
              style={{ 
                backgroundColor: activeTab === 'hospitals' ? '#3498DB' : 'white',
                color: activeTab === 'hospitals' ? 'white' : '#3498DB',
                border: activeTab === 'hospitals' ? 'none' : '2px solid #3498DB',
                borderRadius: '10px'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== 'hospitals') {
                  e.currentTarget.style.backgroundColor = '#3498DB';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'hospitals') {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = '#3498DB';
                }
              }}
            >
              <span className="mr-2">🏥</span>
              Veterinary Hospitals
            </button>
          </div>
        </div>

        {/* Doctors Section */}
        {activeTab === 'doctors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="text-3xl font-bold"
                style={{ 
                  background: 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Veterinary Doctors
              </h2>
              <button
                onClick={() => setShowDoctorForm(true)}
                className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(46, 204, 113, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Register as Doctor
              </button>
            </div>

            {/* Doctor Registration Form */}
            {showDoctorForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8" style={{ border: '1px solid #E0F2F1' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>Doctor Registration</h3>
                <form onSubmit={handleDoctorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="text"
                    placeholder="Years of Experience"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'doctor')}
                      className="hidden"
                      id="doctor-photo"
                    />
                    <label
                      htmlFor="doctor-photo"
                      className="flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-teal-400 transition-colors"
                      style={{ borderColor: '#E0F2F1' }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Profile Picture
                    </label>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button 
                      type="submit"
                      className="px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                      style={{ backgroundColor: '#00BFA6', color: 'white' }}
                    >
                      Register
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowDoctorForm(false)}
                      className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
                      style={{ border: '2px solid #E0F2F1', color: '#424242' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div 
                  key={doctor.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  style={{ border: '1px solid #E0F2F1' }}
                >
                  <div className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <img
                          src={doctor.profilePicture}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          style={{ border: '4px solid #2ECC71' }}
                          onClick={() => openImageViewer(doctor.profilePicture)}
                        />
                        {doctor.verified && (
                          <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            ✓
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#2C3E50', fontFamily: 'Poppins, sans-serif' }}>{doctor.name}</h3>
                      <p className="font-medium mb-2" style={{ color: '#2ECC71' }}>{doctor.specialization}</p>
                      <p className="text-sm mb-2" style={{ color: '#7F8C8D' }}>Experience: {doctor.experience}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(doctor.rating)
                                ? 'fill-current'
                                : ''
                            }`}
                            style={{ color: '#FFC107' }}
                          />
                        ))}
                        <span className="ml-2 text-sm" style={{ color: '#7F8C8D' }}>{doctor.rating}</span>
                      </div>
                      
                      <div className="flex items-center mb-4" style={{ color: '#7F8C8D' }}>
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{doctor.phone}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col w-full space-y-2">
                        <button 
                          className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          style={{ backgroundColor: '#27AE60', color: 'white', borderRadius: '10px' }}
                          onClick={() => handleCall(doctor.phone)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#229954';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#27AE60';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Phone className="h-4 w-4 mr-2 inline" />
                          Contact
                        </button>
                        <button 
                          className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          style={{ backgroundColor: '#2980B9', color: 'white', borderRadius: '10px' }}
                          onClick={() => openChat(doctor)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#21618C';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#2980B9';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2 inline" />
                          Message
                        </button>
                        <button 
                          className="w-full px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          style={{ backgroundColor: '#F1C40F', color: '#2C3E50', borderRadius: '10px' }}
                          onClick={() => openAppointmentForm('doctor', doctor.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F39C12';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F1C40F';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-2 inline" />
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hospitals Section */}
        {activeTab === 'hospitals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 
                className="text-3xl font-bold"
                style={{ 
                  background: 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  fontFamily: 'Poppins, sans-serif'
                }}
              >
                Veterinary Hospitals
              </h2>
              <button
                onClick={() => setShowHospitalForm(true)}
                className="px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg hover:shadow-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #2ECC71 0%, #3498DB 100%)',
                  border: 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                Register Hospital
              </button>
            </div>

            {/* Hospital Registration Form */}
            {showHospitalForm && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8" style={{ border: '1px solid #E0F2F1' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>Hospital Registration</h3>
                <form onSubmit={handleHospitalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="text"
                    placeholder="Full Address"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={hospitalForm.phone}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={hospitalForm.email}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                    required
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="url"
                    placeholder="Website URL"
                    value={hospitalForm.website}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, website: e.target.value })}
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <input
                    type="text"
                    placeholder="Services (comma separated)"
                    value={hospitalForm.services}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, services: e.target.value })}
                    className="px-4 py-3 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                  />
                  <div>
                    <button 
                      type="button" 
                      onClick={getCurrentLocation} 
                      className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center"
                      style={{ border: '2px solid #E0F2F1', color: '#424242' }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get GPS Location
                    </button>
                    {location && (
                      <p className="text-sm mt-1" style={{ color: '#00BFA6' }}>
                        Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'hospital')}
                      className="hidden"
                      id="hospital-photo"
                    />
                    <label
                      htmlFor="hospital-photo"
                      className="flex items-center justify-center px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer hover:border-teal-400 transition-colors w-full"
                      style={{ borderColor: '#E0F2F1' }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Hospital Image
                    </label>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button 
                      type="submit"
                      className="px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                      style={{ backgroundColor: '#00BFA6', color: 'white' }}
                    >
                      Register Hospital
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowHospitalForm(false)}
                      className="px-6 py-3 rounded-xl font-medium transition-all duration-300"
                      style={{ border: '2px solid #E0F2F1', color: '#424242' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Hospitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <div 
                  key={hospital.id} 
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl transform hover:scale-105"
                  style={{ border: '1px solid #E0F2F1' }}
                >
                  <div className="relative">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageViewer(hospital.image)}
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#2C3E50', fontFamily: 'Poppins, sans-serif' }}>{hospital.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(hospital.rating)
                              ? 'fill-current'
                              : ''
                          }`}
                          style={{ color: '#FFC107' }}
                        />
                      ))}
                      <span className="ml-2 text-sm" style={{ color: '#7F8C8D' }}>{hospital.rating}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start" style={{ color: '#7F8C8D' }}>
                        <MapPin className="h-4 w-4 mr-2 mt-0.5" style={{ color: '#2ECC71' }} />
                        <span className="text-sm">{hospital.address}</span>
                      </div>
                      <div className="text-xs ml-6" style={{ color: '#7F8C8D' }}>
                        GPS: {hospital.latitude.toFixed(4)}, {hospital.longitude.toFixed(4)}
                      </div>
                      <div className="flex items-center" style={{ color: '#7F8C8D' }}>
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{hospital.phone}</span>
                      </div>
                      <div className="flex items-center" style={{ color: '#7F8C8D' }}>
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={hospital.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm hover:underline"
                          style={{ color: '#2ECC71' }}
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hospital.services.slice(0, 3).map((service, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#F5F6FA', color: '#2ECC71' }}
                        >
                          {service}
                        </span>
                      ))}
                      {hospital.services.length > 3 && (
                        <span 
                          className="px-2 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: '#F5F6FA', color: '#7F8C8D' }}
                        >
                          +{hospital.services.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          style={{ backgroundColor: '#27AE60', color: 'white', borderRadius: '10px' }}
                          onClick={() => handleCall(hospital.phone)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#229954';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#27AE60';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Phone className="h-4 w-4 mr-1 inline" />
                          Contact
                        </button>
                        <button 
                          className="flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          style={{ backgroundColor: '#F1C40F', color: '#2C3E50', borderRadius: '10px' }}
                          onClick={() => openAppointmentForm('hospital', hospital.id)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#F39C12';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#F1C40F';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Calendar className="h-4 w-4 mr-1 inline" />
                          Book Appointment
                        </button>
                      </div>
                      <button 
                        className="w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                        style={{ backgroundColor: '#8E44AD', color: 'white', borderRadius: '10px' }}
                        onClick={() => openGoogleMaps(hospital.latitude, hospital.longitude, hospital.name)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#7D3C98';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#8E44AD';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <MapPin className="h-4 w-4 mr-2 inline" />
                        Location
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {showChat && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md h-[600px] flex flex-col shadow-2xl">
              {/* Chat Header */}
              <div className="flex items-center p-4 border-b rounded-t-2xl" style={{ backgroundColor: '#E0F2F1' }}>
                <button
                  onClick={() => setShowChat(false)}
                  className="mr-3 hover:bg-white rounded-full p-1 transition-colors"
                  style={{ color: '#616161' }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <img
                  src={selectedDoctor.profilePicture}
                  alt={selectedDoctor.name}
                  className="w-10 h-10 rounded-full mr-3"
                  style={{ border: '2px solid #00BFA6' }}
                />
                <div>
                  <h3 className="font-semibold" style={{ color: '#1A237E' }}>{selectedDoctor.name}</h3>
                  <p className="text-sm" style={{ color: '#00695C' }}>{selectedDoctor.specialization}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {getCurrentChatSession()?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        message.isFromUser
                          ? 'text-white'
                          : 'text-gray-900'
                      }`}
                      style={{
                        backgroundColor: message.isFromUser ? '#00BFA6' : '#F5F5F5'
                      }}
                    >
                      {message.content}
                      <div className={`text-xs mt-1 ${
                        message.isFromUser ? 'text-white opacity-75' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-sm" style={{ color: '#616161' }}>
                    Start a conversation with {selectedDoctor.name}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button 
                    onClick={sendMessage}
                    className="px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: '#00BFA6', color: 'white' }}
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Booking Form */}
        {showAppointmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-4" style={{ color: '#1A237E' }}>Book Appointment</h3>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={appointmentForm.patientName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                />
                <input
                  type="text"
                  placeholder="Pet Name"
                  value={appointmentForm.petName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, petName: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                />
                <select
                  value={appointmentForm.petType}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, petType: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                >
                  <option value="">Select Pet Type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Rabbit">Rabbit</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                />
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={appointmentForm.phone}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                />
                <textarea
                  placeholder="Reason for visit"
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl transition-all duration-300 focus:ring-2 focus:border-transparent"
                  style={{ border: '2px solid #E0F2F1', focusRingColor: '#00BFA6' }}
                />
                <div className="flex space-x-3">
                  <button 
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105"
                    style={{ 
                      background: 'linear-gradient(135deg, #00BFA6 0%, #00695C 100%)'
                    }}
                  >
                    Book Appointment
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAppointmentForm(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-300"
                    style={{ border: '2px solid #E0F2F1', color: '#424242' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {showImageViewer && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setShowImageViewer(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedImage}
                alt="Full view"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDoctors;