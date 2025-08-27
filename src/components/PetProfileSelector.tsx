import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age: string;
  photo: string;
}

interface Props {
  pets: Pet[];
  selectedPet: Pet | null;
  onSelectPet: (pet: Pet) => void;
  onAddPet: (pet: Pet) => void;
}

const PetProfileSelector: React.FC<Props> = ({ pets, selectedPet, onSelectPet, onAddPet }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPet, setNewPet] = useState({
    name: '',
    breed: '',
    age: '',
    photo: ''
  });

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    const pet: Pet = {
      id: Date.now().toString(),
      ...newPet,
      photo: newPet.photo || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'
    };
    onAddPet(pet);
    setNewPet({ name: '', breed: '', age: '', photo: '' });
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">🐾 My Pets</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Pet List */}
      <div className="space-y-3">
        {pets.map(pet => (
          <div
            key={pet.id}
            onClick={() => onSelectPet(pet)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              selectedPet?.id === pet.id
                ? 'bg-blue-50 border-2 border-blue-300 shadow-md'
                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                <p className="text-sm text-gray-600">{pet.breed}</p>
                <p className="text-xs text-gray-500">{pet.age}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Pet Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Add New Pet</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddPet} className="space-y-4">
              <input
                type="text"
                placeholder="Pet Name"
                required
                value={newPet.name}
                onChange={(e) => setNewPet({...newPet, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Breed"
                required
                value={newPet.breed}
                onChange={(e) => setNewPet({...newPet, breed: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Age (e.g., 2 years)"
                required
                value={newPet.age}
                onChange={(e) => setNewPet({...newPet, age: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                placeholder="Photo URL (optional)"
                value={newPet.photo}
                onChange={(e) => setNewPet({...newPet, photo: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Add Pet
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

export default PetProfileSelector;