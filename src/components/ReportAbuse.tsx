import React, { useState, useEffect } from 'react';
import { AlertTriangle, Phone, Mail, MapPin, Calendar, Clock, Camera, Upload, Shield, Users, CheckCircle, XCircle, Eye, MessageSquare, Share2, Navigation, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';



interface AbuseReport {
  id: string;
  location: string;
  date: string;
  time: string;
  description: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  anonymous: boolean;
  images: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'under_review' | 'action_taken';
  reporterId: string;
  createdAt: string;
}

const ReportAbuse: React.FC = () => {
  const { user } = useAuth();
  const [showReportForm, setShowReportForm] = useState(false);
  const [reports, setReports] = useState<AbuseReport[]>([]);
  const [formData, setFormData] = useState({
    location: '',
    date: '',
    time: '',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    anonymous: false,
    images: [] as string[],
    urgency: 'medium' as 'low' | 'medium' | 'high' | 'critical'
  });

  useEffect(() => {
    const savedReports = localStorage.getItem('abuseReports');
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    } else {
      const dummyReports: AbuseReport[] = [
        {
          id: '1',
          location: 'Anna Nagar, Chennai',
          date: '2025-01-20',
          time: '14:30',
          description: 'Dog being tied and beaten by owner near XYZ street. The animal appears malnourished and scared.',
          images: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'under_review',
          urgency: 'high',
          anonymous: false,
          reporterId: 'user1',
          createdAt: '2025-01-20T14:30:00Z'
        },
        {
          id: '2',
          location: 'JP Nagar, Bangalore',
          date: '2025-01-22',
          time: '09:15',
          description: 'Cat abandoned in a cardboard box near the park. Kitten appears very young and needs immediate care.',
          images: ['https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'action_taken',
          urgency: 'medium',
          anonymous: true,
          reporterId: 'anonymous',
          createdAt: '2025-01-22T09:15:00Z'
        },
        {
          id: '3',
          location: 'Marine Drive, Mumbai',
          date: '2025-01-18',
          time: '19:00',
          description: 'Street dogs being poisoned by local residents. Multiple animals found in distress.',
          images: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'under_review',
          urgency: 'critical',
          anonymous: false,
          reporterId: 'user2',
          createdAt: '2025-01-18T19:00:00Z'
        },
        {
          id: '4',
          location: 'Sector 18, Noida',
          date: '2025-01-15',
          time: '11:30',
          description: 'Birds trapped in illegal cages for sale. Poor living conditions and overcrowding observed.',
          images: ['https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'action_taken',
          urgency: 'high',
          anonymous: true,
          reporterId: 'anonymous',
          createdAt: '2025-01-15T11:30:00Z'
        },
        {
          id: '5',
          location: 'Koramangala, Bangalore',
          date: '2025-01-25',
          time: '16:45',
          description: 'Cattle being transported in overcrowded truck without proper ventilation or water.',
          images: ['https://images.pexels.com/photos/422218/pexels-photo-422218.jpeg?auto=compress&cs=tinysrgb&w=600'],
          status: 'pending',
          urgency: 'high',
          anonymous: false,
          reporterId: 'user3',
          createdAt: '2025-01-25T16:45:00Z'
        }
      ];
      setReports(dummyReports);
      localStorage.setItem('abuseReports', JSON.stringify(dummyReports));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
    if (!user && !formData.anonymous) {
      toast.error('Please login or choose anonymous reporting');
      return;
    }

    const newReport: AbuseReport = {
      id: Date.now().toString(),
      location: formData.location,
      date: formData.date,
      time: formData.time,
      description: formData.description,
      contactName: formData.anonymous ? undefined : formData.contactName || user?.name,
      contactPhone: formData.anonymous ? undefined : formData.contactPhone,
      contactEmail: formData.anonymous ? undefined : formData.contactEmail || user?.email,
      anonymous: formData.anonymous,
      images: formData.images,
      urgency: formData.urgency,
      status: 'pending',
      reporterId: formData.anonymous ? 'anonymous' : user?.id || 'guest',
      createdAt: new Date().toISOString()
    };
    
    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    localStorage.setItem('abuseReports', JSON.stringify(updatedReports));
    
    // Add to user's profile if not anonymous
    if (!formData.anonymous && user) {
      const userReports = JSON.parse(localStorage.getItem('userAbuseReports') || '[]');
      userReports.push(newReport);
      localStorage.setItem('userAbuseReports', JSON.stringify(userReports));
    }
    
    setFormData({
      location: '', date: '', time: '', description: '', contactName: '', contactPhone: '', contactEmail: '',
      anonymous: false, images: [], urgency: 'medium'
    });
    setShowReportForm(false);
    toast.success('Report submitted successfully. Authorities have been notified.');
  };

  const shareReport = (report: AbuseReport) => {
    const shareText = `🚨 ANIMAL ABUSE REPORT\n\n` +
      `Location: ${report.location}\n` +
      `Date: ${report.date} ${report.time}\n` +
      `Urgency: ${report.urgency.toUpperCase()}\n` +
      `Status: ${report.status.replace('_', ' ').toUpperCase()}\n\n` +
      `Description: ${report.description}\n\n` +
      `Help us spread awareness about animal welfare! 🐾\n` +
      `Report animal abuse: ${window.location.origin}/report-abuse`;

    if (navigator.share) {
      navigator.share({
        title: 'Animal Abuse Report',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Report details copied to clipboard!');
      }).catch(() => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="default">Pending</Badge>;
      case 'under_review': return <Badge variant="info">Under Review</Badge>;
      case 'action_taken': return <Badge variant="success">Action Taken ✅</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const helplines = [
    {
      id: '1',
      name: 'Animal Welfare Board of India',
      phone: '1800-123-4567',
      email: 'help@awbi.org',
      whatsapp: '+91-98765-43210',
      available24x7: true
    },
    {
      id: '2',
      name: 'PETA India',
      phone: '98765-43210',
      email: 'info@petaindia.org',
      whatsapp: '+91-98765-43210',
      available24x7: false
    },
    {
      id: '3',
      name: 'Blue Cross Animal Rescue',
      phone: '99887-66554',
      email: 'rescue@bluecross.org',
      whatsapp: '+91-99887-66554',
      available24x7: true
    },
    {
      id: '4',
      name: 'Wildlife SOS',
      phone: '98765-11111',
      email: 'help@wildlifesos.org',
      whatsapp: '+91-98765-11111',
      available24x7: true
    }
  ];



  return (
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
            Report Animal Abuse
          </h1>
          <p className="text-xl" style={{
            background: 'linear-gradient(135deg, #a0e7ff, #d4b3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(160, 231, 255, 0.4)'
          }}>
            Help protect animals by reporting abuse incidents and accessing emergency helplines
          </p>
        </div>

        {/* SOS Button */}
        <div className="text-center mb-8">
          <button 
            onClick={() => window.open('tel:1800-123-4567', '_self')}
            className="text-white px-8 py-4 text-xl font-bold rounded-lg transition-colors animate-pulse" style={{
              background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
              textShadow: '0 0 15px rgba(179, 136, 255, 0.4)'
            }}
          >
            🚨 URGENT SOS - Call Now
          </button>
        </div>

        {/* Emergency Helplines */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(179, 136, 255, 0.4)'
          }}>📞 Emergency Helplines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helplines.map((helpline) => (
              <div key={helpline.id} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-l-4 border-l-red-500 hover:shadow-xl transition-all duration-300">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm">{helpline.name}</h3>
                    {helpline.available24x7 && (
                      <Badge variant="success" className="text-xs">24/7</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-3 w-3 mr-2" />
                      <span className="text-xs">{helpline.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-1">
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white flex-1 text-xs py-2 px-3 flex items-center justify-center rounded transition-colors"
                      onClick={() => window.open(`tel:${helpline.phone}`, '_self')}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </button>
                    <button 
                      className="bg-teal-500 hover:bg-teal-600 text-white flex-1 text-xs py-2 px-3 flex items-center justify-center rounded transition-colors"
                      onClick={() => window.open(`https://wa.me/${helpline.whatsapp}`, '_blank')}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Button */}
        <div className="text-center mb-12">
          <button 
            onClick={() => setShowReportForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg flex items-center mx-auto rounded-lg transition-colors"
          >
            <AlertTriangle className="h-5 w-5 mr-2" />
            Report Abuse
          </button>
        </div>

        {/* Report Form Modal */}
        {showReportForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Report Animal Abuse</h3>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                      <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Anna Nagar, Chennai"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                      <select 
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                      <input 
                        type="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input 
                        type="time" 
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
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
                      placeholder="Describe the incident in detail..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Evidence (Photos/Videos)</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="evidence-upload"
                      />
                      <label htmlFor="evidence-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Click to upload evidence</p>
                        <p className="text-sm text-gray-500 mt-2">Photos, videos up to 10MB each</p>
                      </label>
                    </div>
                    
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        {formData.images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image}
                              alt={`Evidence ${index + 1}`}
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
                  
                  <div className="border-t pt-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        name="anonymous"
                        checked={formData.anonymous}
                        onChange={handleInputChange}
                        className="mr-2"
                        id="anonymous"
                      />
                      <label htmlFor="anonymous" className="text-sm text-gray-700">
                        Keep my identity private (Anonymous reporting)
                      </label>
                    </div>
                    
                    {!formData.anonymous && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                          <input 
                            type="text" 
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleInputChange}
                            placeholder={user?.name || 'Your name'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input 
                            type="tel" 
                            name="contactPhone"
                            value={formData.contactPhone}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input 
                            type="email" 
                            name="contactEmail"
                            value={formData.contactEmail}
                            onChange={handleInputChange}
                            placeholder={user?.email || 'your@email.com'}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-4">
                    <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                      Submit Report
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowReportForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Recent Reports */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(179, 136, 255, 0.4)'
          }}>📋 Recent Reports</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                <div className="relative h-48">
                  <img 
                    src={report.images[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                    alt="Report evidence"
                    className="w-full h-full object-cover"
                  />
                  <div className="report-image-overlay"></div>
                  <div className="absolute top-4 left-4">
                    {getStatusBadge(report.status)}
                  </div>
                  <div className={`absolute top-4 right-4 urgent-tag ${report.urgency === 'critical' || report.urgency === 'high' ? '' : 'bg-yellow-500'}`}>
                    {report.urgency.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{report.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-sm">{report.date} {report.time && `at ${report.time}`}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">{report.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">
                      {report.anonymous ? 'Anonymous Report' : `Report #${report.id}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const query = encodeURIComponent(report.location);
                        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                      }}
                      className="bg-teal-500 hover:bg-teal-600 text-white flex-1 p-2 text-center rounded transition-colors"
                      title="View Location"
                    >
                      <Navigation className="h-4 w-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => shareReport(report)}
                      className="bg-orange-500 hover:bg-orange-600 text-white flex-1 p-2 text-center rounded transition-colors"
                      title="Share Report"
                    >
                      <Share2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Educational Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📚 Know Your Rights & Responsibilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-l-4 border-l-blue-500">
              <div className="p-6 text-center">
                <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">🔍 Identify Abuse</h3>
                <p className="text-sm text-gray-600">
                  Look for signs like visible injuries, malnourishment, inadequate shelter, or aggressive treatment.
                </p>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-l-4 border-l-green-500">
              <div className="p-6 text-center">
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">⚡ Immediate Action</h3>
                <p className="text-sm text-gray-600">
                  Document evidence, ensure your safety, contact authorities, and provide first aid if trained.
                </p>
              </div>
            </div>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border-l-4 border-l-purple-500">
              <div className="p-6 text-center">
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">⚖️ Legal Rights</h3>
                <p className="text-sm text-gray-600">
                  Prevention of Cruelty to Animals Act, 1960 protects animals. Report violations to authorities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAbuse;