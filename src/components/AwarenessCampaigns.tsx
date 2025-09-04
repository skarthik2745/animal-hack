import React, { useState, useEffect } from 'react';
import { Megaphone, Users, Calendar, Target, Plus, Heart, Share2, Eye } from 'lucide-react';

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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%)',
      backgroundAttachment: 'fixed',
      scrollBehavior: 'smooth'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(179, 136, 255, 0.5)'
          }}>
            Animal Awareness Campaigns
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join powerful community-driven campaigns to raise awareness and create positive change for animals
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex bg-white rounded-lg p-1 mb-4 sm:mb-0 shadow-sm border">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'active' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
              }`}
            >
              Active Campaigns ({activeCampaigns.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === 'completed' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
              }`}
            >
              Completed ({completedCampaigns.length})
            </button>
          </div>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg flex items-center transition-colors"
          >
            <Plus className="mr-2 h-5 w-5" />
            Create Campaign
          </button>
        </div>

        {/* Create Campaign Form */}
        {showCreateForm && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Campaign Title</label>
                    <input type="text" className="form-input w-full px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Category</label>
                    <select className="form-input w-full px-4 py-3">
                      <option>Animal Welfare</option>
                      <option>Conservation</option>
                      <option>Education</option>
                      <option>Adoption</option>
                      <option>Rescue</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Participant Goal</label>
                    <input type="number" placeholder="e.g., 1000" className="form-input w-full px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-purple-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>End Date</label>
                    <input type="date" className="form-input w-full px-4 py-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple-700 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Description</label>
                  <textarea rows={4} placeholder="Describe your campaign goals, activities, and impact..." className="form-input w-full px-4 py-3"></textarea>
                </div>
                <div className="flex space-x-4">
                  <button type="submit" className="create-campaign-btn px-8 py-3">
                    Launch Campaign
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-lg hover:bg-purple-50 transition-all duration-300 font-semibold"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
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
            <div key={campaign.id} className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img 
                    src={campaign.image} 
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                    {campaign.category}
                  </div>
                  {campaign.status === 'completed' && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Completed
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-purple-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{campaign.title}</h3>
                  <p className="text-purple-600 text-sm mb-4 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>by {campaign.organizer}</p>
                  
                  <p className="text-gray-700 mb-4 line-clamp-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>{campaign.description}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-purple-600 mb-2 font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span>Progress</span>
                      <span>{campaign.participants.toLocaleString()} / {campaign.goal.toLocaleString()} participants</span>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${campaign.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-purple-500 mt-1 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      <span>{campaign.progress}% complete</span>
                      <span>Ends {campaign.endDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-purple-600">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{campaign.participants.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>{campaign.endDate}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {campaign.status === 'active' ? (
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 text-sm rounded transition-colors">
                          Join Campaign
                        </button>
                      ) : (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 text-sm rounded flex items-center transition-colors">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                      )}
                      <button className="border border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white p-2 rounded transition-colors">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white p-2 rounded transition-colors">
                        <Share2 className="h-4 w-4" />
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