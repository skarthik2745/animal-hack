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

  // Generate animated galaxy stars
  useEffect(() => {
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

  return (
    <>
      <style>{`
        .galaxy-container {
          background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%) !important;
          min-height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
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
        <div className="galaxy-content">
          <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
        
              {/* Hero Section */}
              <div className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                  🐾 Pet Care & Caretaker Services
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
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
      </div>
    </>
  );
};

export default PetSurrender;