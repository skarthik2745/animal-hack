import React, { useState, useEffect } from 'react';
import { Megaphone, Users, Calendar, Target, Plus, Heart, Share2, Eye } from 'lucide-react';

const AwarenessCampaigns: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  // Generate animated galaxy stars
  useEffect(() => {
    const createGalaxyStars = () => {
      const container = document.querySelector('.galaxy-stars');
      if (!container) return;
      
      for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'galaxy-star';
        
        const starType = Math.random();
        if (starType > 0.7) {
          star.classList.add('star-violet');
        } else if (starType > 0.4) {
          star.classList.add('star-blue');
        } else {
          star.classList.add('star-white');
        }
        
        const size = Math.random() * 8 + 4;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = '-20px';
        star.style.animationDelay = Math.random() * 5 + 's';
        star.style.animationDuration = (Math.random() * 6 + 8) + 's';
        
        container.appendChild(star);
        
        setTimeout(() => {
          if (star.parentNode) {
            star.parentNode.removeChild(star);
          }
        }, 15000);
      }
    };
    
    createGalaxyStars();
    
    const interval = setInterval(createGalaxyStars, 1000);
    return () => clearInterval(interval);
  }, []);

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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

        .campaigns-container {
          background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .galaxy-stars {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
        }

        .galaxy-star {
          position: absolute;
          border-radius: 50%;
          animation: floatDown linear infinite;
        }

        .star-white {
          background: white;
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.9), 0 0 30px rgba(255, 255, 255, 0.6);
        }

        .star-blue {
          background: #87ceeb;
          box-shadow: 0 0 18px rgba(135, 206, 235, 0.9), 0 0 35px rgba(135, 206, 235, 0.7);
        }

        .star-violet {
          background: #dda0dd;
          box-shadow: 0 0 20px rgba(221, 160, 221, 0.9), 0 0 40px rgba(221, 160, 221, 0.6);
        }

        @keyframes floatDown {
          0% {
            transform: translateY(-50px) scale(0.5);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(calc(100vh + 100px)) scale(1.5);
            opacity: 0;
          }
        }

        .campaigns-heading {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 3.5rem;
          text-align: center;
          background: linear-gradient(135deg, #00cfff 0%, #9b5de5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 20px rgba(0, 207, 255, 0.5);
          filter: drop-shadow(0 0 10px rgba(155, 93, 229, 0.3));
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
          letter-spacing: 1px;
        }

        .campaigns-subtext {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #00f5d4 0%, #ff9e80 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          max-width: 48rem;
          margin: 0 auto 2rem;
          line-height: 1.6;
          position: relative;
          z-index: 2;
          font-weight: 600;
        }

        .modern-filter {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          border: 2px solid rgba(139, 92, 246, 0.2);
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
        }

        .create-campaign-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
          border: none;
          border-radius: 16px;
          color: white;
          font-weight: 700;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
          z-index: 2;
          box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
        }

        .create-campaign-btn:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 35px rgba(139, 92, 246, 0.5);
          background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
        }

        .join-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }

        .view-details-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-family: 'Montserrat', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .view-details-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
        }

        .heart-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #ec4899;
          border-radius: 12px;
          color: #ec4899;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .heart-btn:hover {
          background: #ec4899;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
        }

        .share-btn {
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #8b5cf6;
          border-radius: 12px;
          color: #8b5cf6;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }

        .share-btn:hover {
          background: #8b5cf6;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .campaign-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .campaign-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          background: rgba(255, 255, 255, 1);
        }

        .form-container {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          position: relative;
          z-index: 2;
        }

        .form-input {
          border-radius: 12px;
          border: 2px solid rgba(139, 92, 246, 0.2);
          background: rgba(255, 255, 255, 0.9);
          transition: all 0.3s ease;
          font-family: 'Montserrat', sans-serif;
        }

        .form-input:focus {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
          background: white;
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-circle { animation: none; }
        }
      `}</style>
      
      <div className="campaigns-container py-20 px-4 sm:px-6 lg:px-8">
        <div className="galaxy-stars"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="campaigns-heading">
              Animal Awareness Campaigns
            </h1>
            <p className="campaigns-subtext">
              Join powerful community-driven campaigns to raise awareness and create positive change for animals
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div className="flex modern-filter rounded-lg p-1 mb-4 sm:mb-0">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'active' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                    : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Active Campaigns ({activeCampaigns.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                  activeTab === 'completed' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105' 
                    : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Completed ({completedCampaigns.length})
              </button>
            </div>
            
            <button
              onClick={() => setShowCreateForm(true)}
              className="create-campaign-btn px-8 py-4 flex items-center"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Campaign
            </button>
          </div>

          {/* Create Campaign Form */}
          {showCreateForm && (
            <div className="form-container p-8 mb-8">
              <h3 className="text-2xl font-bold text-purple-800 mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>Create New Campaign</h3>
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
              <div key={campaign.id} className="campaign-card">
                <div className="relative h-48">
                  <img 
                    src={campaign.image} 
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {campaign.category}
                  </div>
                  {campaign.status === 'completed' && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                        <button className="join-btn py-2 px-4 text-sm">
                          Join Campaign
                        </button>
                      ) : (
                        <button className="view-details-btn py-2 px-4 text-sm flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </button>
                      )}
                      <button className="heart-btn p-2">
                        <Heart className="h-4 w-4" />
                      </button>
                      <button className="share-btn p-2">
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
    </>
  );
};

export default AwarenessCampaigns;