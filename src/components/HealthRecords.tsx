import React, { useState, useEffect } from 'react';
import { Plus, Upload, Calendar, Bell, Pill, Syringe, FileText, Clock, AlertCircle, Download, Edit, Trash2 } from 'lucide-react';
import PetProfileSelector from './PetProfileSelector';
import PrescriptionManager from './PrescriptionManager';
import MedicineTracker from './MedicineTracker';
import VaccinationRecords from './VaccinationRecords';
import OwnerDashboard from './OwnerDashboard';
import toast from 'react-hot-toast';

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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 Pet Health & Vaccination Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Complete health management for your beloved pets - track prescriptions, medicines, and vaccinations
          </p>
          
          {/* Reminder Bell */}
          {reminders.length > 0 && (
            <div className="mt-4 flex justify-center">
              <div className="relative">
                <Bell className="h-8 w-8 text-red-500 animate-bounce" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {reminders.length}
                </span>
              </div>
              <span className="ml-2 text-red-600 font-medium">
                {reminders.length} reminder{reminders.length > 1 ? 's' : ''} pending
              </span>
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
                <div className="bg-white rounded-xl shadow-sm p-2 mb-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        activeTab === 'dashboard'
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      📊 Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('prescriptions')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        activeTab === 'prescriptions'
                          ? 'bg-green-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      📋 Prescriptions
                    </button>
                    <button
                      onClick={() => setActiveTab('medicines')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        activeTab === 'medicines'
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      💊 Medicines
                    </button>
                    <button
                      onClick={() => setActiveTab('vaccinations')}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        activeTab === 'vaccinations'
                          ? 'bg-red-500 text-white shadow-md'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      💉 Vaccinations
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;