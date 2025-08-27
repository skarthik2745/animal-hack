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
    // Load chat sessions from localStorage
    const savedChats = localStorage.getItem('doctorChats');
    if (savedChats) {
      setChatSessions(JSON.parse(savedChats));
    }
    // Load dummy doctors
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

    // Load real hospitals
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
    // Handle openChat parameter when doctors are loaded
    const urlParams = new URLSearchParams(window.location.search);
    const openChatId = urlParams.get('openChat');
    if (openChatId && doctors.length > 0) {
      const doctor = doctors.find(d => d.id === openChatId);
      if (doctor) {
        openChat(doctor);
        // Clear the URL parameter
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
    setActiveTab('doctors'); // Ensure we're on the right tab
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

    // Simulate doctor response after 2 seconds
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Pet Doctors & Hospitals
          </h1>
          <p className="text-xl text-gray-600">
            Find qualified veterinarians and trusted animal hospitals near you
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'doctors'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Stethoscope className="h-4 w-4 inline mr-2" />
              Veterinary Doctors
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'hospitals'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Veterinary Hospitals
            </button>
          </div>
        </div>

        {/* Doctors Section */}
        {activeTab === 'doctors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Veterinary Doctors</h2>
              <Button onClick={() => setShowDoctorForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Register as Doctor
              </Button>
            </div>

            {/* Doctor Registration Form */}
            {showDoctorForm && (
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Doctor Registration</h3>
                <form onSubmit={handleDoctorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={doctorForm.specialization}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Years of Experience"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={doctorForm.phone}
                    onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                      className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Profile Picture
                    </label>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <Button type="submit">Register</Button>
                    <Button type="button" variant="outline" onClick={() => setShowDoctorForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Card key={doctor.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-4">
                        <img
                          src={doctor.profilePicture}
                          alt={doctor.name}
                          className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-emerald-100"
                          onClick={() => openImageViewer(doctor.profilePicture)}
                        />
                        {doctor.verified && (
                          <Badge variant="success" className="absolute -top-1 -right-1">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-emerald-600 font-medium mb-2">{doctor.specialization}</p>
                      <p className="text-gray-600 text-sm mb-2">Experience: {doctor.experience}</p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(doctor.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{doctor.rating}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{doctor.phone}</span>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col w-full space-y-2">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleCall(doctor.phone)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => openChat(doctor)}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => openAppointmentForm('doctor', doctor.id)}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Hospitals Section */}
        {activeTab === 'hospitals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Veterinary Hospitals</h2>
              <Button onClick={() => setShowHospitalForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Register Hospital
              </Button>
            </div>

            {/* Hospital Registration Form */}
            {showHospitalForm && (
              <Card className="p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">Hospital Registration</h3>
                <form onSubmit={handleHospitalSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Hospital Name"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, name: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Full Address"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, address: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={hospitalForm.phone}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, phone: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={hospitalForm.email}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, email: e.target.value })}
                    required
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="url"
                    placeholder="Website URL"
                    value={hospitalForm.website}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, website: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Services (comma separated)"
                    value={hospitalForm.services}
                    onChange={(e) => setHospitalForm({ ...hospitalForm, services: e.target.value })}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <div>
                    <Button type="button" variant="outline" onClick={getCurrentLocation} className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get GPS Location
                    </Button>
                    {location && (
                      <p className="text-sm text-green-600 mt-1">
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
                      className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Hospital Image
                    </label>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <Button type="submit">Register Hospital</Button>
                    <Button type="button" variant="outline" onClick={() => setShowHospitalForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Hospitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <Card key={hospital.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={hospital.image}
                      alt={hospital.name}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => openImageViewer(hospital.image)}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{hospital.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(hospital.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">{hospital.rating}</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 mt-0.5 text-emerald-600" />
                        <span className="text-sm">{hospital.address}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-6">
                        GPS: {hospital.latitude.toFixed(4)}, {hospital.longitude.toFixed(4)}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">{hospital.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <a
                          href={hospital.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hospital.services.slice(0, 3).map((service, index) => (
                        <Badge key={index} variant="info" size="sm">
                          {service}
                        </Badge>
                      ))}
                      {hospital.services.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{hospital.services.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleCall(hospital.phone)}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => openAppointmentForm('hospital', hospital.id)}
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Book Appointment
                        </Button>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => openGoogleMaps(hospital.latitude, hospital.longitude, hospital.name)}
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        {showChat && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center p-4 border-b bg-emerald-50 rounded-t-lg">
                <button
                  onClick={() => setShowChat(false)}
                  className="mr-3 text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <img
                  src={selectedDoctor.profilePicture}
                  alt={selectedDoctor.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedDoctor.name}</h3>
                  <p className="text-sm text-emerald-600">{selectedDoctor.specialization}</p>
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
                          ? 'bg-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.content}
                      <div className={`text-xs mt-1 ${
                        message.isFromUser ? 'text-emerald-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center text-gray-500 text-sm">
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
                    className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Booking Form */}
        {showAppointmentForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Book Appointment</h3>
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={appointmentForm.patientName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, patientName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Pet Name"
                  value={appointmentForm.petName}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, petName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={appointmentForm.petType}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, petType: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={appointmentForm.phone}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  placeholder="Reason for visit"
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">
                    Book Appointment
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAppointmentForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
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
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
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