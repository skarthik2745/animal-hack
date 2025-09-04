import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Star, Phone, MessageCircle, Filter } from 'lucide-react';
import CaretakerRegistration from './CaretakerRegistration';
import CaretakerSearch from './CaretakerSearch';
import WhatsAppChat from './WhatsAppChat';
import toast from 'react-hot-toast';

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

const PetSurrender: React.FC = () => {
  const [activeView, setActiveView] = useState<'main' | 'register' | 'search'>('main');
  const [selectedCaretaker, setSelectedCaretaker] = useState<Caretaker | null>(null);
  const [showChat, setShowChat] = useState(false);



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
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6" style={{
                background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 229, 255, 0.5)'
              }}>
                🐾 Pet Care & Caretaker Services
              </h1>
              <p className="text-xl max-w-3xl mx-auto mb-12" style={{
                color: '#00cfff',
                textShadow: '0 0 15px rgba(0, 207, 255, 0.3)'
              }}>
                  Connect with trusted pet caretakers in your area or register to provide loving care for pets
                </p>
              </div>

              {/* Main View - Two Buttons */}
              {activeView === 'main' && (
                <div className="flex flex-col sm:flex-row gap-8 justify-center items-center max-w-2xl mx-auto">
                  <button
                    onClick={() => setActiveView('register')}
                    className="w-full sm:w-80 h-32 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center space-y-3"
                  >
                    <Plus className="h-10 w-10" />
                    <span className="text-xl font-bold">Register as Caretaker</span>
                    <span className="text-sm opacity-90">Start earning by caring for pets</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveView('search')}
                    className="w-full sm:w-80 h-32 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center space-y-3"
                  >
                    <Search className="h-10 w-10" />
                    <span className="text-xl font-bold">Find Caretaker</span>
                    <span className="text-sm opacity-90">Search trusted caretakers nearby</span>
                  </button>
                </div>
              )}

              {/* Registration View */}
              {activeView === 'register' && (
                <CaretakerRegistration onBack={() => setActiveView('main')} />
              )}

              {/* Search View */}
              {activeView === 'search' && (
                <CaretakerSearch 
                  onBack={() => setActiveView('main')}
                  onSelectCaretaker={(caretaker) => {
                    setSelectedCaretaker(caretaker);
                    setShowChat(true);
                  }}
                />
              )}

              {/* WhatsApp Chat */}
              {showChat && selectedCaretaker && (
                <WhatsAppChat
                  caretaker={selectedCaretaker}
                  onClose={() => {
                    setShowChat(false);
                    setSelectedCaretaker(null);
                  }}
                />
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PetSurrender;