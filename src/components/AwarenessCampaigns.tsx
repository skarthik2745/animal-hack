import React, { useState } from 'react';
import { Megaphone, Users, Calendar, Target, Plus, Heart } from 'lucide-react';

const AwarenessCampaigns: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const campaigns = [
    {
      id: 1,
      title: 'Save the Stray Cats Initiative',
      description: 'Community-driven campaign to help stray cats through TNR (Trap-Neuter-Return) programs',
      organizer: 'City Animal Welfare Group',
      participants: 1247,
      goal: 2000,
      progress: 62,
      endDate: '2025-03-15',
      image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Animal Welfare',
      status: 'active'
    },
    {
      id: 2,
      title: 'Wildlife Corridor Protection',
      description: 'Protecting natural wildlife corridors from urban development and habitat destruction',
      organizer: 'Green Earth Foundation',
      participants: 2156,
      goal: 3000,
      progress: 72,
      endDate: '2025-04-20',
      image: 'https://images.pexels.com/photos/1670732/pexels-photo-1670732.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Conservation',
      status: 'active'
    },
    {
      id: 3,
      title: 'Puppy Mill Awareness Month',
      description: 'Educating the public about puppy mills and promoting ethical pet adoption',
      organizer: 'Responsible Pet Ownership Alliance',
      participants: 892,
      goal: 1500,
      progress: 59,
      endDate: '2025-02-28',
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Education',
      status: 'active'
    },
    {
      id: 4,
      title: 'Senior Pets Adoption Drive',
      description: 'Successfully increased senior pet adoptions by 45% through community outreach',
      organizer: 'Golden Years Pet Rescue',
      participants: 567,
      goal: 500,
      progress: 100,
      endDate: '2024-12-31',
      image: 'https://images.pexels.com/photos/1931367/pexels-photo-1931367.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'Adoption',
      status: 'completed'
    }
  ];

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  const completedCampaigns = campaigns.filter(c => c.status === 'completed');

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Animal Awareness Campaigns
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join powerful community-driven campaigns to raise awareness and create positive change for animals
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-0">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'active' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active Campaigns ({activeCampaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({completedCampaigns.length})
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Campaign
          </button>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title</label>
                  <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option>Animal Welfare</option>
                    <option>Conservation</option>
                    <option>Education</option>
                    <option>Adoption</option>
                    <option>Rescue</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Participant Goal</label>
                  <input type="number" placeholder="e.g., 1000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows={4} placeholder="Describe your campaign goals, activities, and impact..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
              </div>
              <div className="flex space-x-4">
                <button type="submit" className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  Launch Campaign
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

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(activeTab === 'active' ? activeCampaigns : completedCampaigns).map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="relative h-48">
                <img 
                  src={campaign.image} 
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {campaign.category}
                </div>
                {campaign.status === 'completed' && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Completed
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{campaign.title}</h3>
                <p className="text-gray-600 text-sm mb-4">by {campaign.organizer}</p>
                
                <p className="text-gray-700 mb-4 line-clamp-3">{campaign.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{campaign.participants.toLocaleString()} / {campaign.goal.toLocaleString()} participants</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${campaign.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{campaign.progress}% complete</span>
                    <span>Ends {campaign.endDate}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="text-sm">{campaign.participants.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className="text-sm">{campaign.endDate}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {campaign.status === 'active' ? (
                      <button className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition-colors text-sm font-medium">
                        Join Campaign
                      </button>
                    ) : (
                      <button className="bg-gray-100 text-gray-600 py-2 px-4 rounded-lg text-sm font-medium">
                        View Results
                      </button>
                    )}
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AwarenessCampaigns;