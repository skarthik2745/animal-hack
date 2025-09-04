import React, { useState, useEffect } from 'react';
import { Users, Search, UserPlus, Heart, Shield, Clock } from 'lucide-react';
import CaretakerSearch from './CaretakerSearch';
import CaretakerRegistration from './CaretakerRegistration';
import CaretakerChat from './CaretakerChat';
import supabase from '../lib/supabase';

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

const PetCareServices: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'search' | 'register' | 'chat'>('main');
  const [selectedCaretaker, setSelectedCaretaker] = useState<Caretaker | null>(null);
  const [caretakers, setCaretakers] = useState<Caretaker[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch caretakers from Supabase
  const fetchCaretakers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('caretakers')
        .select(`
          id,
          experience,
          description,
          rating,
          services,
          hourly_rate,
          users!caretakers_user_id_fkey (
            name,
            phone,
            profile_picture,
            location
          )
        `);
      
      if (error) throw error;
      
      const formattedCaretakers: Caretaker[] = data?.map(item => ({
        id: item.id,
        name: item.users?.name || '',
        experience: item.experience || '',
        location: item.users?.location || '',
        rating: item.rating || 0,
        profilePicture: item.users?.profile_picture || '',
        phone: item.users?.phone || '',
        services: item.services || [],
        description: item.description || ''
      })) || [];
      
      setCaretakers(formattedCaretakers);
    } catch (error) {
      console.error('Error fetching caretakers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaretakers();
  }, []);



  const handleSelectCaretaker = (caretaker: Caretaker) => {
    setSelectedCaretaker(caretaker);
    setCurrentView('chat');
  };

  if (currentView === 'search') {
    return (
      <CaretakerSearch 
        onBack={() => setCurrentView('main')} 
        onSelectCaretaker={handleSelectCaretaker}
      />
    );
  }

  if (currentView === 'register') {
    return (
      <CaretakerRegistration onBack={() => setCurrentView('main')} />
    );
  }

  if (currentView === 'chat' && selectedCaretaker) {
    return (
      <div className="galaxy-container">
        <div className="galaxy-content">
          <CaretakerChat 
            caretaker={selectedCaretaker}
            onBack={() => setCurrentView('main')}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          .galaxy-container {
            background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%);
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            font-family: 'Poppins', sans-serif;
          }
          

          
          .galaxy-content {
            position: relative;
            z-index: 1;
          }
          

          
          .pet-care-heading {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 3.5rem;
            background: linear-gradient(135deg, #00e5ff, #b388ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: 0.5px;
            margin-bottom: 1rem;
            text-shadow: 0 0 30px rgba(0, 229, 255, 0.5);
          }
          
          .pet-care-subheading {
            font-family: 'Poppins', sans-serif;
            font-size: 1.3rem;
            color: #00e5ff;
            margin-bottom: 2rem;
            text-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
          }
          
          .register-button {
            background: linear-gradient(135deg, #43a047, #66bb6a) !important;
            color: white !important;
            font-weight: bold !important;
            border-radius: 10px;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(67, 160, 71, 0.3);
          }
          
          .register-button:hover {
            background: linear-gradient(135deg, #388e3c, #4caf50) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(67, 160, 71, 0.4);
          }
          
          .find-button {
            background: linear-gradient(135deg, #1e88e5, #42a5f5) !important;
            color: white !important;
            font-weight: bold !important;
            border-radius: 10px;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(30, 136, 229, 0.3);
          }
          
          .find-button:hover {
            background: linear-gradient(135deg, #1565c0, #1e88e5) !important;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(30, 136, 229, 0.4);
          }
          
          .feature-card {
            background: white;
            border: 1px solid #ddd;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            transform: scale(1.05);
            border-color: #42a5f5;
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          .stats-card {
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            border: 1px solid #ddd;
            transition: all 0.3s ease;
          }
          
          .stats-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          }
          
          @keyframes moveStripes {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-50px, -50px); }
          }
          
          .neon-section {
            position: relative;
            background: #1a1a2e;
          }
          
          .neon-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              repeating-linear-gradient(
                45deg,
                #ff00ff 0px,
                #ff00ff 3px,
                transparent 3px,
                transparent 50px
              ),
              repeating-linear-gradient(
                -45deg,
                #00ffff 0px,
                #00ffff 3px,
                transparent 3px,
                transparent 50px
              ),
              repeating-linear-gradient(
                90deg,
                #ffff00 0px,
                #ffff00 3px,
                transparent 3px,
                transparent 50px
              ),
              repeating-linear-gradient(
                0deg,
                #00ff00 0px,
                #00ff00 3px,
                transparent 3px,
                transparent 50px
              );
            animation: moveStripes 15s linear infinite;
            pointer-events: none;
          }
          
          .neon-overlay {
            position: relative;
            z-index: 1;
            background: rgba(255,255,255,0.85);
            border-radius: 15px;
            padding: 2rem;
          }
        `
      }} />
      
      <div className="galaxy-container">
        <div className="galaxy-stars"></div>
        <div className="galaxy-content">
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="pet-care-heading">
                  Pet Care & Caretaker Services 🐾
                </h1>
                <p className="pet-care-subheading max-w-4xl mx-auto">
                  Connect with trusted pet caretakers in your area or register to become a professional pet care provider. 
                  Ensuring your furry friends get the love and attention they deserve.
                </p>
              </div>

              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <button
                  onClick={() => setCurrentView('register')}
                  className="register-button px-8 py-4 text-lg font-bold flex items-center justify-center"
                >
                  <UserPlus className="mr-3 h-6 w-6" />
                  Register as Caretaker
                </button>
                <button
                  onClick={() => setCurrentView('search')}
                  className="find-button px-8 py-4 text-lg font-bold flex items-center justify-center"
                >
                  <Search className="mr-3 h-6 w-6" />
                  Find Caretaker
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="feature-card p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Caretakers</h3>
                  <p className="text-gray-600">All our caretakers are background-checked and verified for your pet's safety and security.</p>
                </div>
                
                <div className="feature-card p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">24/7 Availability</h3>
                  <p className="text-gray-600">Find caretakers available round the clock for emergency pet care and regular services.</p>
                </div>
                
                <div className="feature-card p-8 text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Loving Care</h3>
                  <p className="text-gray-600">Our caretakers provide personalized attention and genuine love for your beloved pets.</p>
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                <div className="stats-card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                  <div className="text-gray-600">Verified Caretakers</div>
                </div>
                <div className="stats-card p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">2,000+</div>
                  <div className="text-gray-600">Happy Pet Parents</div>
                </div>
                <div className="stats-card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">10,000+</div>
                  <div className="text-gray-600">Services Completed</div>
                </div>
                <div className="stats-card p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">4.9★</div>
                  <div className="text-gray-600">Average Rating</div>
                </div>
              </div>

              {/* Services Offered */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Services We Offer</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    '🐕 Dog Walking',
                    '🐾 Pet Boarding', 
                    '🥩 Feeding',
                    '💊 Medication',
                    '🛁 Grooming',
                    '🏠 House Sitting',
                    '🐱 Cat Care',
                    '🐰 Small Pet Care',
                    '🎾 Playing',
                    '🚨 Emergency Care'
                  ].map((service, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{service}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetCareServices;