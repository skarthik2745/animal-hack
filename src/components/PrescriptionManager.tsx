import React, { useState, useEffect } from 'react';
import { Plus, Upload, FileText, Download, Edit, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';



interface Prescription {
  id: string;
  petId: string;
  doctorName: string;
  date: string;
  notes: string;
  fileUrl: string;
  fileName: string;
  fileType: 'pdf' | 'image' | 'text';
}

interface Props {
  petId: string;
}

const PrescriptionManager: React.FC<Props> = ({ petId }) => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    date: '',
    notes: '',
    fileUrl: '',
    fileName: '',
    fileType: 'pdf' as 'pdf' | 'image' | 'text'
  });

  useEffect(() => {
    loadPrescriptions();
  }, [petId]);

  const loadPrescriptions = () => {
    const stored = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    setPrescriptions(stored.filter((p: Prescription) => p.petId === petId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPrescription: Prescription = {
      id: Date.now().toString(),
      petId,
      ...formData
    };

    const allPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    allPrescriptions.push(newPrescription);
    localStorage.setItem('prescriptions', JSON.stringify(allPrescriptions));
    
    loadPrescriptions();
    setFormData({
      doctorName: '',
      date: '',
      notes: '',
      fileUrl: '',
      fileName: '',
      fileType: 'pdf'
    });
    setShowAddForm(false);
    toast.success('Prescription added successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData({
        ...formData,
        fileUrl: event.target?.result as string,
        fileName: file.name,
        fileType: file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'pdf' : 'text'
      });
    };
    reader.readAsDataURL(file);
  };

  const deletePrescription = (id: string) => {
    if (window.confirm('Delete this prescription?')) {
      const allPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
      const updated = allPrescriptions.filter((p: Prescription) => p.id !== id);
      localStorage.setItem('prescriptions', JSON.stringify(updated));
      loadPrescriptions();
      toast.success('Prescription deleted');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      default: return '📝';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">📋 Prescription Storage</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Prescription
        </button>
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prescriptions.map(prescription => (
          <div key={prescription.id} className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="text-2xl mr-3">{getFileIcon(prescription.fileType)}</div>
                <div>
                  <h3 className="font-bold text-gray-900">Dr. {prescription.doctorName}</h3>
                  <p className="text-sm text-gray-600">{new Date(prescription.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                {prescription.fileUrl && (
                  <button
                    onClick={() => window.open(prescription.fileUrl, '_blank')}
                    className="text-blue-500 hover:text-blue-700 p-1"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deletePrescription(prescription.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {prescription.notes && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-700">{prescription.notes}</p>
              </div>
            )}
            
            {prescription.fileName && (
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="h-4 w-4 mr-2" />
                <span className="truncate">{prescription.fileName}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {prescriptions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-lg">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No prescriptions yet</h3>
          <p className="text-gray-600 mb-6">Start by adding your pet's first prescription</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Add First Prescription
          </button>
        </div>
      )}

      {/* Add Prescription Form */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{
          background: 'linear-gradient(135deg, rgba(0,188,212,0.6) 0%, rgba(156,39,176,0.6) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Prescription</h3>
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
                placeholder="Doctor's Name"
                required
                value={formData.doctorName}
                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              
              <textarea
                placeholder="Notes (optional)"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Prescription File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-2">Click to upload PDF, image, or document</p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 transition-colors"
                  >
                    Choose File
                  </label>
                  {formData.fileName && (
                    <p className="text-sm text-green-600 mt-2">✓ {formData.fileName}</p>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Save Prescription
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

export default PrescriptionManager;