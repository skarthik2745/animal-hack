import React from 'react';
import { 
  Calendar, HandHeart, Stethoscope, Search, GraduationCap, 
  AlertTriangle, Megaphone, Users, MessageCircle, Camera, 
  Phone, FileText, Store, Trees, Info, Newspaper
} from 'lucide-react';

interface FeaturesGridProps {
  setActiveSection: (section: string) => void;
}

const FeaturesGrid: React.FC<FeaturesGridProps> = ({ setActiveSection }) => {
  const features = [
    {
      id: 'adoption',
      title: 'Adoption Events',
      description: 'Host and join animal adoption events in your community',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'surrender',
      title: 'Pet Surrender & Care',
      description: 'Safe pet surrender services with real-time care updates',
      icon: HandHeart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      id: 'doctors',
      title: 'Pet Doctors & Hospitals',
      description: 'Directory of verified veterinarians and animal hospitals',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'lost-found',
      title: 'Lost & Found Pets',
      description: 'Report missing pets and help reunite families',
      icon: Search,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    },
    {
      id: 'trainers',
      title: 'Pet Trainers',
      description: 'Find certified pet trainers with community ratings',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'report',
      title: 'Report Animal Abuse',
      description: 'Secure reporting system for animal welfare violations',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      id: 'campaigns',
      title: 'Awareness Campaigns',
      description: 'Create and participate in animal welfare campaigns',
      icon: Megaphone,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      id: 'clubs',
      title: 'Animal Welfare Clubs',
      description: 'Join local community clubs for animal lovers',
      icon: Users,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700'
    },
    {
      id: 'community',
      title: 'Community Discussions',
      description: 'Connect with fellow animal lovers in group discussions',
      icon: MessageCircle,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700'
    },
    {
      id: 'stories',
      title: 'Pet Stories',
      description: 'Share your pet stories and earn community badges',
      icon: Camera,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700'
    },
    {
      id: 'emergency',
      title: 'Emergency Rescue',
      description: 'Quick access to emergency animal rescue services',
      icon: Phone,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      id: 'health',
      title: 'Health Records',
      description: 'Track vaccination records and pet health reports',
      icon: FileText,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      id: 'shops',
      title: 'Pet Shops & Products',
      description: 'Browse pet food, accessories, and care products',
      icon: Store,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700'
    },
    {
      id: 'sanctuary',
      title: 'Wildlife Sanctuary',
      description: 'Explore real and virtual wildlife sanctuaries',
      icon: Trees,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'endangered',
      title: 'Endangered Species',
      description: 'Learn about endangered animals and conservation',
      icon: Info,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-50',
      textColor: 'text-slate-700'
    },
    {
      id: 'news',
      title: 'News & Updates',
      description: 'Stay informed with latest wildlife and pet news',
      icon: Newspaper,
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Comprehensive Animal Care Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to care for pets, protect wildlife, and build a stronger animal-loving community
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveSection(feature.id)}
                className={`${feature.bgColor} p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105 hover:-translate-y-1 border border-white/50`}
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent className="h-7 w-7 text-white" />
                </div>
                <h3 className={`text-lg font-bold ${feature.textColor} mb-3 group-hover:text-opacity-80 transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;