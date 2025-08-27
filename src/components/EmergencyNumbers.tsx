import React, { useState, useEffect } from 'react';
import { Phone, Clock, MapPin, AlertTriangle, Shield, Zap, Plus } from 'lucide-react';
import { emergencyContactsStorage } from '../storage';
import { EmergencyContact } from '../types';
import toast from 'react-hot-toast';

const EmergencyNumbers: React.FC = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: 'govt' as 'govt' | 'ngo' | 'private',
    services: [] as string[],
    location: '',
    available24x7: false
  });

  useEffect(() => {
    setContacts(emergencyContactsStorage.getAll());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      type: formData.type,
      services: formData.services,
      location: formData.location,
      available24x7: formData.available24x7,
      verified: false
    };
    const updatedContacts = emergencyContactsStorage.add(newContact);
    setContacts(updatedContacts);
    setFormData({ name: '', phone: '', type: 'govt', services: [], location: '', available24x7: false });
    setShowAddForm(false);
    toast.success('Emergency contact added successfully!');
  };
  const emergencyServices = [
    {
      category: 'Immediate Emergency',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      services: [
        {
          name: '24/7 Animal Emergency Hospital',
          phone: '(555) 911-PETS',
          shortPhone: '911-7387',
          address: '123 Emergency Blvd, Central City',
          hours: '24/7 Emergency Services',
          description: 'Critical care, trauma, surgery, poison control'
        },
        {
          name: 'Animal Poison Control Center',
          phone: '(555) POISON-1',
          shortPhone: '764-7661',
          address: 'Hotline Service',
          hours: '24/7 Hotline',
          description: 'Pet poisoning emergencies and toxic ingestion'
        }
      ]
    },
    {
      category: 'Animal Rescue & Control',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      services: [
        {
          name: 'City Animal Control Services',
          phone: '(555) 123-PETS',
          shortPhone: '123-7387',
          address: '456 Animal Control Way',
          hours: 'Mon-Sun 6:00 AM - 10:00 PM',
          description: 'Stray animals, wildlife encounters, rescue operations'
        },
        {
          name: 'Wildlife Rescue Hotline',
          phone: '(555) WILD-911',
          shortPhone: '945-3911',
          address: 'Mobile Response Team',
          hours: 'Daily 7:00 AM - 9:00 PM',
          description: 'Injured wildlife, bird rescues, habitat emergencies'
        },
        {
          name: 'Large Animal Emergency',
          phone: '(555) BIG-HELP',
          shortPhone: '244-4357',
          address: 'Farm Emergency Services',
          hours: '24/7 On-Call',
          description: 'Horse, livestock, and large animal emergencies'
        }
      ]
    },
    {
      category: 'After-Hours Veterinary',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      services: [
        {
          name: 'Night Owl Veterinary Clinic',
          phone: '(555) 678-9012',
          shortPhone: '678-9012',
          address: '789 Night Care Ave, Westside',
          hours: 'Mon-Fri 6:00 PM - 8:00 AM',
          description: 'After-hours routine care and urgent consultations'
        },
        {
          name: 'Weekend Pet Care Center',
          phone: '(555) 345-6789',
          shortPhone: '345-6789',
          address: '321 Weekend Blvd, Eastside',
          hours: 'Sat-Sun 8:00 AM - 8:00 PM',
          description: 'Weekend appointments and urgent care'
        }
      ]
    },
    {
      category: 'Specialized Emergency',
      icon: Phone,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      services: [
        {
          name: 'Pet Behavioral Crisis Line',
          phone: '(555) BEHAVE-1',
          shortPhone: '234-2831',
          address: 'Counseling Hotline',
          hours: 'Daily 9:00 AM - 9:00 PM',
          description: 'Aggressive behavior, anxiety attacks, behavioral emergencies'
        },
        {
          name: 'Exotic Pet Emergency',
          phone: '(555) EXOTIC-1',
          shortPhone: '396-8421',
          address: '987 Specialty Care Dr',
          hours: '24/7 On-Call Service',
          description: 'Birds, reptiles, small mammals, specialty pets'
        },
        {
          name: 'Pet Ambulance Service',
          phone: '(555) AMBU-PET',
          shortPhone: '262-8738',
          address: 'Mobile Emergency Transport',
          hours: '24/7 Transport Service',
          description: 'Emergency pet transportation to hospitals'
        }
      ]
    }
  ];

  const quickTips = [
    {
      title: 'Before You Call',
      tips: [
        'Stay calm and assess the situation',
        'Move your pet to safety if possible',
        'Have your pet\'s information ready',
        'Note symptoms and timeline'
      ]
    },
    {
      title: 'Information to Provide',
      tips: [
        'Pet\'s species, breed, age, and weight',
        'Current symptoms and duration',
        'Any known medical conditions',
        'Your location and contact number'
      ]
    },
    {
      title: 'First Aid Basics',
      tips: [
        'Apply pressure to bleeding wounds',
        'Keep airways clear',
        'Prevent shock with blankets',
        'Do NOT induce vomiting unless instructed'
      ]
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <Phone className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Emergency Rescue Numbers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Quick access to emergency services for animal attacks, rescue situations, and urgent veterinary care
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center mx-auto"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Emergency Contact
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add Emergency Contact</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as 'govt' | 'ngo' | 'private'})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="govt">Government</option>
                    <option value="ngo">NGO</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                  />
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.available24x7}
                  onChange={(e) => setFormData({...formData, available24x7: e.target.checked})}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Available 24/7</span>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Add Contact
                </button>
                <button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* User Added Contacts */}
        {contacts.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-green-800 mb-4">Your Emergency Contacts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.location}</p>
                  <a href={`tel:${contact.phone}`} className="text-blue-600 font-medium">{contact.phone}</a>
                  {contact.available24x7 && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">24/7</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Action Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Life-Threatening Emergency?</h3>
          </div>
          <p className="text-red-700 mb-4">
            If your pet or any animal is in immediate life-threatening danger, call the emergency number immediately.
          </p>
          <a 
            href="tel:555-911-7387" 
            className="inline-flex items-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call (555) 911-PETS Now
          </a>
        </div>

        {/* Emergency Services by Category */}
        <div className="space-y-8 mb-12">
          {emergencyServices.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div key={index} className={`${category.bgColor} border ${category.borderColor} rounded-xl p-6`}>
                <div className="flex items-center space-x-3 mb-6">
                  <IconComponent className={`h-6 w-6 ${category.color}`} />
                  <h2 className="text-2xl font-bold text-gray-900">{category.category}</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="bg-white rounded-lg p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 mr-2" />
                          <a 
                            href={`tel:${service.phone.replace(/[^\d]/g, '')}`}
                            className="font-medium hover:text-blue-600 transition-colors"
                          >
                            {service.phone}
                          </a>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="text-sm">{service.hours}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{service.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <a 
                          href={`tel:${service.phone.replace(/[^\d]/g, '')}`}
                          className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-center"
                        >
                          Call Now
                        </a>
                        <button className="border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Emergency Preparedness Tips */}
        <div className="bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Emergency Preparedness Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickTips.map((tipSection, index) => (
              <div key={index} className="bg-white rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{tipSection.title}</h3>
                <ul className="space-y-2">
                  {tipSection.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Save Section */}
        <div className="mt-8 text-center bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Save These Numbers</h3>
          <p className="text-gray-600 mb-4">
            Save these emergency numbers to your phone for quick access during emergencies.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Download Emergency Contact Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyNumbers;