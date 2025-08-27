import React, { useState } from 'react';
import { Users, MapPin, Calendar, Plus, Star, Search } from 'lucide-react';

const WelfareClubs: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const clubs = [
    {
      id: 1,
      name: 'Downtown Pet Lovers Society',
      description: 'Monthly meetups for pet owners in the downtown area. We organize adoption drives, educational workshops, and social events.',
      members: 156,
      location: 'Downtown Community Center',
      meetingSchedule: 'Every 2nd Saturday, 2:00 PM',
      category: 'General',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
      activities: ['Adoption Events', 'Pet Training', 'Community Outreach', 'Educational Workshops'],
      nextMeeting: '2025-01-25'
    },
    {
      id: 2,
      name: 'Wildlife Conservation Club',
      description: 'Dedicated to protecting local wildlife habitats and educating the community about conservation efforts.',
      members: 89,
      location: 'Nature Reserve Visitor Center',
      meetingSchedule: '1st and 3rd Sunday, 10:00 AM',
      category: 'Wildlife',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=600',
      activities: ['Habitat Restoration', 'Bird Watching', 'Clean-up Drives', 'Photography'],
      nextMeeting: '2025-01-21'
    },
    {
      id: 3,
      name: 'Senior Pet Care Network',
      description: 'Supporting senior pets and their elderly owners through care services and companionship programs.',
      members: 67,
      location: 'Senior Center East',
      meetingSchedule: 'Every Thursday, 3:00 PM',
      category: 'Senior Pets',
      rating: 4.7,
      image: 'https://images.pexels.com/photos/1931367/pexels-photo-1931367.jpeg?auto=compress&cs=tinysrgb&w=600',
      activities: ['Pet Sitting', 'Vet Visits Support', 'Social Activities', 'Emergency Care'],
      nextMeeting: '2025-01-23'
    },
    {
      id: 4,
      name: 'Cat Rescue Volunteers',
      description: 'Volunteer group focused on cat rescue, TNR programs, and finding homes for stray and feral cats.',
      members: 134,
      location: 'Various Locations',
      meetingSchedule: '2nd Wednesday, 7:00 PM',
      category: 'Cats',
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600',
      activities: ['TNR Programs', 'Foster Care', 'Adoption Events', 'Fundraising'],
      nextMeeting: '2025-01-22'
    },
    {
      id: 5,
      name: 'Dog Training Enthusiasts',
      description: 'Group of dog training enthusiasts sharing techniques, organizing training sessions, and supporting new pet owners.',
      members: 203,
      location: 'City Dog Park',
      meetingSchedule: 'Every Saturday, 9:00 AM',
      category: 'Dogs',
      rating: 4.6,
      image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
      activities: ['Group Training', 'Behavioral Workshops', 'Puppy Socialization', 'Competitions'],
      nextMeeting: '2025-01-18'
    },
    {
      id: 6,
      name: 'Emergency Animal Response Team',
      description: 'Volunteer first responders for animal emergencies, natural disasters, and rescue operations.',
      members: 45,
      location: 'Emergency Services Building',
      meetingSchedule: '1st Monday, 6:00 PM',
      category: 'Emergency',
      rating: 4.8,
      image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=600',
      activities: ['Emergency Response', 'Disaster Relief', 'Training Drills', 'First Aid'],
      nextMeeting: '2025-02-03'
    }
  ];

  const filteredClubs = clubs.filter(club => 
    club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    club.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Animal Welfare Clubs
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with local communities passionate about animal welfare, conservation, and pet care
          </p>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Club
          </button>
        </div>

        {/* Create Club Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Club</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Club Name</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option>General</option>
                    <option>Dogs</option>
                    <option>Cats</option>
                    <option>Wildlife</option>
                    <option>Emergency</option>
                    <option>Senior Pets</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Location</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Schedule</label>
                  <input type="text" placeholder="e.g., Every Saturday, 2:00 PM" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={4} placeholder="Describe your club's mission, activities, and goals..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"></textarea>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                  Create Club
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredClubs.map((club) => (
            <div key={club.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="relative h-48">
                <img 
                  src={club.image} 
                  alt={club.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {club.category}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
                  {club.rating}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                <p className="text-gray-700 mb-4 line-clamp-3">{club.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{club.members} members</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{club.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{club.meetingSchedule}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Activities</h4>
                  <div className="flex flex-wrap gap-2">
                    {club.activities.slice(0, 3).map((activity, index) => (
                      <span 
                        key={index}
                        className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs"
                      >
                        {activity}
                      </span>
                    ))}
                    {club.activities.length > 3 && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        +{club.activities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-gray-900">Next Meeting</p>
                  <p className="text-sm text-gray-600">{club.nextMeeting}</p>
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium">
                    Join Club
                  </button>
                  <button className="border border-teal-500 text-teal-600 py-2 px-4 rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">No clubs found matching your search.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelfareClubs;