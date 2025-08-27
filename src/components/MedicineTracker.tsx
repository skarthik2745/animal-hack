import React, { useState, useEffect } from 'react';
import { Plus, Pill, Clock, Calendar, Edit, Trash2, X, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

interface Medicine {
  id: string;
  petId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  nextDose: string;
  notes: string;
}

interface Props {
  petId: string;
  onUpdateReminders: () => void;
}

const MedicineTracker: React.FC<Props> = ({ petId, onUpdateReminders }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  useEffect(() => {
    loadMedicines();
  }, [petId]);

  const loadMedicines = () => {
    const stored = JSON.parse(localStorage.getItem('medicines') || '[]');
    const petMedicines = stored.filter((m: Medicine) => m.petId === petId);
    setMedicines(petMedicines);
    onUpdateReminders();
  };

  const calculateNextDose = (startDate: string, frequency: string) => {
    const start = new Date(startDate);
    const now = new Date();
    
    let intervalHours = 24; // Default daily
    switch (frequency.toLowerCase()) {
      case 'twice daily': intervalHours = 12; break;
      case 'three times daily': intervalHours = 8; break;
      case 'four times daily': intervalHours = 6; break;
      case 'every 6 hours': intervalHours = 6; break;
      case 'every 8 hours': intervalHours = 8; break;
      case 'every 12 hours': intervalHours = 12; break;
      case 'weekly': intervalHours = 168; break;
    }
    
    let nextDose = new Date(start);
    while (nextDose <= now) {
      nextDose = new Date(nextDose.getTime() + intervalHours * 60 * 60 * 1000);
    }
    
    return nextDose.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nextDose = calculateNextDose(formData.startDate, formData.frequency);
    
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      petId,
      ...formData,
      nextDose
    };

    const allMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    allMedicines.push(newMedicine);
    localStorage.setItem('medicines', JSON.stringify(allMedicines));
    
    loadMedicines();
    setFormData({
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setShowAddForm(false);
    toast.success('Medicine added successfully!');
  };

  const deleteMedicine = (id: string) => {
    if (window.confirm('Delete this medicine?')) {
      const allMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
      const updated = allMedicines.filter((m: Medicine) => m.id !== id);
      localStorage.setItem('medicines', JSON.stringify(updated));
      loadMedicines();
      toast.success('Medicine deleted');
    }
  };

  const markDoseTaken = (medicine: Medicine) => {
    const nextDose = calculateNextDose(medicine.nextDose, medicine.frequency);
    
    const allMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    const updated = allMedicines.map((m: Medicine) => 
      m.id === medicine.id ? { ...m, nextDose } : m
    );
    localStorage.setItem('medicines', JSON.stringify(updated));
    loadMedicines();
    toast.success('Dose marked as taken!');
  };

  const getTimeUntil = (date: string) => {
    const target = new Date(date);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  const isDueSoon = (date: string) => {
    const target = new Date(date);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    return diff <= 2 * 60 * 60 * 1000; // Due within 2 hours
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">💊 Medicine Tracker</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Medicines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {medicines.map(medicine => (
          <div key={medicine.id} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            isOverdue(medicine.nextDose) ? 'border-red-500' :
            isDueSoon(medicine.nextDose) ? 'border-orange-500' : 'border-purple-500'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Pill className={`h-8 w-8 mr-3 ${
                  isOverdue(medicine.nextDose) ? 'text-red-500' :
                  isDueSoon(medicine.nextDose) ? 'text-orange-500' : 'text-purple-500'
                }`} />
                <div>
                  <h3 className="font-bold text-gray-900">{medicine.name}</h3>
                  <p className="text-sm text-gray-600">{medicine.dosage}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => deleteMedicine(medicine.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-sm">{medicine.frequency}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    {new Date(medicine.startDate).toLocaleDateString()} - {new Date(medicine.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            
            {medicine.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{medicine.notes}</p>
              </div>
            )}
            
            <div className={`p-3 rounded-lg mb-4 ${
              isOverdue(medicine.nextDose) ? 'bg-red-50' :
              isDueSoon(medicine.nextDose) ? 'bg-orange-50' : 'bg-purple-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Next Dose</p>
                  <p className="text-xs text-gray-600">
                    {new Date(medicine.nextDose).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${
                    isOverdue(medicine.nextDose) ? 'text-red-600' :
                    isDueSoon(medicine.nextDose) ? 'text-orange-600' : 'text-purple-600'
                  }`}>
                    {getTimeUntil(medicine.nextDose)}
                  </p>
                  {(isOverdue(medicine.nextDose) || isDueSoon(medicine.nextDose)) && (
                    <Bell className="h-4 w-4 text-red-500 animate-bounce inline" />
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => markDoseTaken(medicine)}
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                isOverdue(medicine.nextDose) ? 'bg-red-500 hover:bg-red-600' :
                isDueSoon(medicine.nextDose) ? 'bg-orange-500 hover:bg-orange-600' : 'bg-purple-500 hover:bg-purple-600'
              } text-white`}
            >
              Mark Dose as Taken
            </button>
          </div>
        ))}
      </div>

      {medicines.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No medicines tracked</h3>
          <p className="text-gray-600 mb-6">Add your pet's medicines to get automatic reminders</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
          >
            Add First Medicine
          </button>
        </div>
      )}

      {/* Add Medicine Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Medicine</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Medicine Name"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              
              <input
                type="text"
                placeholder="Dosage (e.g., 1 tablet, 5ml)"
                required
                value={formData.dosage}
                onChange={(e) => setFormData({...formData, dosage: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              
              <select
                required
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select Frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Four times daily">Four times daily</option>
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 8 hours">Every 8 hours</option>
                <option value="Every 12 hours">Every 12 hours</option>
                <option value="Weekly">Weekly</option>
              </select>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              
              <textarea
                placeholder="Notes (optional)"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors"
                >
                  Add Medicine
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineTracker;