import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, MapPin, User, Phone, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface RegistrationProps {
  onBack: () => void;
}

const CaretakerRegistration: React.FC<RegistrationProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    experience: '',
    location: '',
    phone: '',
    services: [] as string[],
    description: '',
    profilePicture: ''
  });

  const services = ['Dog Walking', 'Pet Sitting', 'Feeding', 'Grooming', 'Training', 'Emergency Care'];



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCaretaker = {
      id: Date.now().toString(),
      ...formData,
      rating: 0,
      profilePicture: formData.profilePicture || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400'
    };

    const caretakers = JSON.parse(localStorage.getItem('caretakers') || '[]');
    caretakers.push(newCaretaker);
    localStorage.setItem('caretakers', JSON.stringify(caretakers));
    
    toast.success('Registration successful! You are now a registered caretaker.');
    onBack();
  };

  const toggleService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
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
        <div className="galaxy-content max-w-2xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <button
            onClick={onBack}
            className="flex items-center text-white hover:text-cyan-400 mb-6 transition-colors bg-gray-800 px-4 py-2 rounded-lg"
            style={{position: 'relative', zIndex: 2}}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Main
          </button>

          <div className="bg-white rounded-2xl shadow-xl p-8" style={{backgroundColor: '#ffffff', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)'}}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{color: '#2e3a59'}}>Register as Pet Caretaker</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your contact number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Your city or area"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                <textarea
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Describe your experience with pets..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Services Offered</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {services.map(service => (
                    <button
                      key={service}
                      type="button"
                      onClick={() => toggleService(service)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formData.services.includes(service)
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About You</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Tell pet owners about yourself and why they should choose you..."
                />
              </div>

              <button
                type="submit"
                className="w-full text-white py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                style={{background: 'linear-gradient(135deg, #8e24aa, #ba68c8)', fontWeight: 'bold', borderRadius: '10px'}}
              >
                Register as Caretaker
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaretakerRegistration;