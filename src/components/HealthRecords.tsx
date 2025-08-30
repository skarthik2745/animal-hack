import React, { useState, useEffect } from 'react';
import { Plus, Upload, Calendar, Bell, Pill, Syringe, FileText, Clock, AlertCircle, Download, Edit, Trash2 } from 'lucide-react';
import PetProfileSelector from './PetProfileSelector';
import PrescriptionManager from './PrescriptionManager';
import MedicineTracker from './MedicineTracker';
import VaccinationRecords from './VaccinationRecords';
import OwnerDashboard from './OwnerDashboard';
import toast from 'react-hot-toast';

// Health Tracker Theme CSS
const healthTrackerStyles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

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



.section-card {
  background: rgba(0,0,0,0.7);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,229,255,0.3);
  backdrop-filter: blur(10px);
  margin-bottom: 24px;
}

.section-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0,229,255,0.2);
  border-color: rgba(0,229,255,0.5);
}

.dashboard-card {
  background: rgba(0,0,0,0.8);
  border: 2px solid #00e5ff;
  box-shadow: 0 0 20px rgba(0,229,255,0.3);
}

.prescriptions-card {
  background: rgba(0,0,0,0.8);
  border: 2px solid #b388ff;
  box-shadow: 0 0 20px rgba(179,136,255,0.3);
}

.medicines-card {
  background: rgba(0,0,0,0.8);
  border: 2px solid #39ff14;
  box-shadow: 0 0 20px rgba(57,255,20,0.3);
}

.vaccinations-card {
  background: rgba(0,0,0,0.8);
  border: 2px solid #ff6ec7;
  box-shadow: 0 0 20px rgba(255,110,199,0.3);
}

.gradient-text {
  background: linear-gradient(135deg, #00e5ff 0%, #b388ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 0 30px rgba(0,229,255,0.5);
}

.subtitle-text {
  color: #00cfff;
  font-family: 'Inter', sans-serif;
  text-shadow: 0 0 15px rgba(0,207,255,0.3);
}

.modern-btn {
  background: #00e5ff;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0,229,255,0.4);
}

.modern-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 25px rgba(0,229,255,0.6);
  background: #00cfff;
}

.reminder-badge {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  border-radius: 20px;
  padding: 10px 20px;
  color: white;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 6px 20px rgba(255,152,0,0.3);
}

@media (prefers-reduced-motion: reduce) {
  .health-bg::before, .health-bg::after { animation: none; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = healthTrackerStyles;
  document.head.appendChild(styleElement);
}

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  photo: string;
}

const HealthRecords: React.FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'prescriptions' | 'medicines' | 'vaccinations'>('dashboard');
  const [reminders, setReminders] = useState<any[]>([]);

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

  useEffect(() => {
    // Load sample pets
    const samplePets: Pet[] = [
      {
        id: '1',
        name: 'Max',
        breed: 'Golden Retriever',
        age: '3 years',
        photo: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      {
        id: '2',
        name: 'Luna',
        breed: 'Persian Cat',
        age: '2 years',
        photo: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=400'
      }
    ];

    const storedPets = JSON.parse(localStorage.getItem('healthPets') || '[]');
    if (storedPets.length === 0) {
      localStorage.setItem('healthPets', JSON.stringify(samplePets));
      setPets(samplePets);
      setSelectedPet(samplePets[0]);
    } else {
      setPets(storedPets);
      setSelectedPet(storedPets[0]);
    }

    // Load reminders
    loadReminders();
  }, []);

  const loadReminders = () => {
    const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const vaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
    
    const medicineReminders = medicines.filter((med: any) => {
      const nextDose = new Date(med.nextDose);
      const now = new Date();
      return nextDose <= new Date(now.getTime() + 24 * 60 * 60 * 1000); // Due within 24 hours
    });

    const vaccinationReminders = vaccinations.filter((vac: any) => {
      const dueDate = new Date(vac.nextDue);
      const now = new Date();
      return dueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Due within 7 days
    });

    setReminders([...medicineReminders, ...vaccinationReminders]);
  };

  return (
    <div className="galaxy-container">
      <div className="galaxy-stars"></div>
      <div className="galaxy-content">
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-6 gradient-text" style={{
            fontWeight: 700,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '1px'
          }}>
            Pet Health & Vaccination Tracker
          </h1>
          <p className="text-xl max-w-3xl mx-auto mb-6 subtitle-text" style={{
            fontWeight: 400,
            lineHeight: '1.6'
          }}>
            Complete health management for your beloved pets - track prescriptions, medicines, and vaccinations
          </p>
          <div className="w-40 h-1 mx-auto rounded-full mb-8" style={{
            background: 'linear-gradient(90deg, #1976D2, #00ACC1)'
          }}></div>
          
          {/* Reminder Bell */}
          {reminders.length > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="reminder-badge flex items-center">
                <Bell className="h-5 w-5 mr-2 animate-bounce" />
                <span>
                  {reminders.length} reminder{reminders.length > 1 ? 's' : ''} pending
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar - Pet Profiles */}
          <div className="lg:col-span-1">
            <PetProfileSelector
              pets={pets}
              selectedPet={selectedPet}
              onSelectPet={setSelectedPet}
              onAddPet={(newPet) => {
                const updatedPets = [...pets, newPet];
                setPets(updatedPets);
                localStorage.setItem('healthPets', JSON.stringify(updatedPets));
                setSelectedPet(newPet);
              }}
            />
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-3">
            {selectedPet && (
              <>
                {/* Tab Navigation */}
                <div className="section-card p-3 mb-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === 'dashboard'
                          ? 'text-white shadow-lg transform -translate-y-1'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        background: activeTab === 'dashboard' ? '#00e5ff' : 'transparent',
                        boxShadow: activeTab === 'dashboard' ? '0 0 20px rgba(0,229,255,0.5)' : 'none',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === 'prescriptions'
                          ? 'text-white shadow-lg transform -translate-y-1'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        background: activeTab === 'prescriptions' ? '#b388ff' : 'transparent',
                        boxShadow: activeTab === 'prescriptions' ? '0 0 20px rgba(179,136,255,0.5)' : 'none',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Prescriptions
                    </button>
                    <button
                      onClick={() => setActiveTab('medicines')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === 'medicines'
                          ? 'text-white shadow-lg transform -translate-y-1'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        background: activeTab === 'medicines' ? '#39ff14' : 'transparent',
                        boxShadow: activeTab === 'medicines' ? '0 0 20px rgba(57,255,20,0.5)' : 'none',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Medicines
                    </button>
                    <button
                      onClick={() => setActiveTab('vaccinations')}
                      className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                        activeTab === 'vaccinations'
                          ? 'text-white shadow-lg transform -translate-y-1'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      style={{
                        background: activeTab === 'vaccinations' ? '#ff6ec7' : 'transparent',
                        boxShadow: activeTab === 'vaccinations' ? '0 0 20px rgba(255,110,199,0.5)' : 'none',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Vaccinations
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className={`section-card ${activeTab}-card`}>
                  {activeTab === 'dashboard' && (
                    <OwnerDashboard petId={selectedPet.id} onLoadReminders={loadReminders} />
                  )}
                  {activeTab === 'prescriptions' && (
                    <PrescriptionManager petId={selectedPet.id} />
                  )}
                  {activeTab === 'medicines' && (
                    <MedicineTracker petId={selectedPet.id} onUpdateReminders={loadReminders} />
                  )}
                  {activeTab === 'vaccinations' && (
                    <VaccinationRecords petId={selectedPet.id} onUpdateReminders={loadReminders} />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;