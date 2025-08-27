import React from 'react';
import { Upload, X } from 'lucide-react';

interface CaretakerFormProps {
  caretakerForm: {
    name: string;
    age: string;
    experience: string;
    phone: string;
    location: string;
    services: string[];
    availability: 'Available' | 'Busy';
    profilePicture: string;
    description: string;
    pricing: string;
  };
  setCaretakerForm: (form: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  handleServiceToggle: (service: string) => void;
}

const CaretakerRegistrationForm: React.FC<CaretakerFormProps> = ({
  caretakerForm,
  setCaretakerForm,
  onSubmit,
  onClose,
  handleServiceToggle
}) => {
  const availableServices = [
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
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Register as Pet Caretaker</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input 
              type="text" 
              value={caretakerForm.name}
              onChange={(e) => setCaretakerForm({...caretakerForm, name: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
            <input 
              type="number" 
              min="18"
              max="70"
              value={caretakerForm.age}
              onChange={(e) => setCaretakerForm({...caretakerForm, age: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <input 
              type="tel" 
              value={caretakerForm.phone}
              onChange={(e) => setCaretakerForm({...caretakerForm, phone: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
            <input 
              type="text" 
              value={caretakerForm.location}
              onChange={(e) => setCaretakerForm({...caretakerForm, location: e.target.value})}
              placeholder="e.g., Downtown, City Center"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Availability Status</label>
            <select 
              value={caretakerForm.availability}
              onChange={(e) => setCaretakerForm({...caretakerForm, availability: e.target.value as 'Available' | 'Busy'})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Range</label>
            <input 
              type="text" 
              value={caretakerForm.pricing}
              onChange={(e) => setCaretakerForm({...caretakerForm, pricing: e.target.value})}
              placeholder="e.g., $20-35/day"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience & Qualifications *</label>
          <textarea 
            rows={3} 
            value={caretakerForm.experience}
            onChange={(e) => setCaretakerForm({...caretakerForm, experience: e.target.value})}
            placeholder="Describe your experience with pets, certifications, etc."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.map((service) => (
              <label key={service} className="flex items-center p-3 border rounded-lg hover:bg-green-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={caretakerForm.services.includes(service)}
                  onChange={() => handleServiceToggle(service)}
                  className="mr-3 text-green-500 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">{service}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 text-sm">Click to upload your profile picture</p>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setCaretakerForm({...caretakerForm, profilePicture: event.target?.result as string});
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden" 
            />
          </div>
          {caretakerForm.profilePicture && (
            <div className="mt-3">
              <img src={caretakerForm.profilePicture} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" />
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About You *</label>
          <textarea 
            rows={4} 
            value={caretakerForm.description}
            onChange={(e) => setCaretakerForm({...caretakerForm, description: e.target.value})}
            placeholder="Tell pet owners about yourself, your approach to pet care, and why they should trust you..."
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex space-x-4">
          <button 
            type="submit" 
            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
          >
            Register as Caretaker
          </button>
          <button 
            type="button"
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaretakerRegistrationForm;