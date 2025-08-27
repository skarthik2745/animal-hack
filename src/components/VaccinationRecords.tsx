import React, { useState, useEffect } from 'react';
import { Plus, Syringe, Calendar, Clock, Edit, Trash2, X, CheckCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Vaccination {
  id: string;
  petId: string;
  name: string;
  dateTaken: string;
  nextDue: string;
  veterinarian: string;
  notes: string;
  status: 'completed' | 'due' | 'overdue';
}

interface Props {
  petId: string;
  onUpdateReminders: () => void;
}

const VaccinationRecords: React.FC<Props> = ({ petId, onUpdateReminders }) => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dateTaken: '',
    nextDue: '',
    veterinarian: '',
    notes: ''
  });

  useEffect(() => {
    loadVaccinations();
  }, [petId]);

  const loadVaccinations = () => {
    const stored = JSON.parse(localStorage.getItem('vaccinations') || '[]');
    const petVaccinations = stored.filter((v: Vaccination) => v.petId === petId);
    
    // Update status based on dates
    const updated = petVaccinations.map((v: Vaccination) => ({
      ...v,
      status: getVaccinationStatus(v.nextDue)
    }));
    
    setVaccinations(updated);
    onUpdateReminders();
  };

  const getVaccinationStatus = (nextDue: string): 'completed' | 'due' | 'overdue' => {
    const dueDate = new Date(nextDue);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 30) return 'due';
    return 'completed';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newVaccination: Vaccination = {
      id: Date.now().toString(),
      petId,
      ...formData,
      status: getVaccinationStatus(formData.nextDue)
    };

    const allVaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
    allVaccinations.push(newVaccination);
    localStorage.setItem('vaccinations', JSON.stringify(allVaccinations));
    
    loadVaccinations();
    setFormData({
      name: '',
      dateTaken: '',
      nextDue: '',
      veterinarian: '',
      notes: ''
    });
    setShowAddForm(false);
    toast.success('Vaccination record added successfully!');
  };

  const deleteVaccination = (id: string) => {
    if (window.confirm('Delete this vaccination record?')) {
      const allVaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
      const updated = allVaccinations.filter((v: Vaccination) => v.id !== id);
      localStorage.setItem('vaccinations', JSON.stringify(updated));
      loadVaccinations();
      toast.success('Vaccination record deleted');
    }
  };

  const markAsCompleted = (vaccination: Vaccination) => {
    const today = new Date().toISOString().split('T')[0];
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextDue = nextYear.toISOString().split('T')[0];
    
    const allVaccinations = JSON.parse(localStorage.getItem('vaccinations') || '[]');
    const updated = allVaccinations.map((v: Vaccination) => 
      v.id === vaccination.id ? { 
        ...v, 
        dateTaken: today, 
        nextDue,
        status: 'completed'
      } : v
    );
    localStorage.setItem('vaccinations', JSON.stringify(updated));
    loadVaccinations();
    toast.success('Vaccination marked as completed!');
  };

  const getTimeUntil = (date: string) => {
    const target = new Date(date);
    const now = new Date();
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 30) return `Due in ${diffDays} days`;
    return `${diffDays} days`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'due': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'due': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'overdue': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };

  // Sort vaccinations by status priority and date
  const sortedVaccinations = [...vaccinations].sort((a, b) => {
    const statusPriority = { overdue: 0, due: 1, completed: 2 };
    const aPriority = statusPriority[a.status as keyof typeof statusPriority];
    const bPriority = statusPriority[b.status as keyof typeof statusPriority];
    
    if (aPriority !== bPriority) return aPriority - bPriority;
    return new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime();
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">💉 Vaccination Records</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Vaccination
        </button>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Vaccination Timeline</h3>
        <div className="space-y-4">
          {sortedVaccinations.map((vaccination, index) => (
            <div key={vaccination.id} className="relative">
              {index < sortedVaccinations.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
              )}
              
              <div className={`flex items-start space-x-4 p-4 rounded-lg border ${getStatusColor(vaccination.status)}`}>
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(vaccination.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900">{vaccination.name}</h4>
                      <p className="text-sm text-gray-600">Dr. {vaccination.veterinarian}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <span>Given: {new Date(vaccination.dateTaken).toLocaleDateString()}</span>
                        <span>Next: {new Date(vaccination.nextDue).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className={`text-sm font-medium ${
                          vaccination.status === 'overdue' ? 'text-red-600' :
                          vaccination.status === 'due' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {getTimeUntil(vaccination.nextDue)}
                        </p>
                      </div>
                      
                      {vaccination.status !== 'completed' && (
                        <button
                          onClick={() => markAsCompleted(vaccination)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Mark Done
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteVaccination(vaccination.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {vaccination.notes && (
                    <div className="mt-3 p-3 bg-white/50 rounded-lg">
                      <p className="text-sm text-gray-700">{vaccination.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {vaccinations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">💉</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No vaccination records</h3>
          <p className="text-gray-600 mb-6">Start tracking your pet's vaccination schedule</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Add First Vaccination
          </button>
        </div>
      )}

      {/* Add Vaccination Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Vaccination</h3>
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
                placeholder="Vaccine Name (e.g., Rabies, DHPP)"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              
              <input
                type="text"
                placeholder="Veterinarian Name"
                required
                value={formData.veterinarian}
                onChange={(e) => setFormData({...formData, veterinarian: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Given</label>
                  <input
                    type="date"
                    required
                    value={formData.dateTaken}
                    onChange={(e) => setFormData({...formData, dateTaken: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.nextDue}
                    onChange={(e) => setFormData({...formData, nextDue: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
              
              <textarea
                placeholder="Notes (optional)"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
                >
                  Add Vaccination
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

export default VaccinationRecords;