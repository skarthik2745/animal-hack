import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, HandHeart, Stethoscope, Search, GraduationCap, 
  AlertTriangle, Megaphone, Users, MessageCircle, Camera, 
  Phone, FileText, Store, Trees, Info, Newspaper, Brain, Dog, Apple, Mic, Bot, Images
} from 'lucide-react';
import { 
  adoptionEventsStorage, petSurrenderStorage, petDoctorsStorage, 
  lostFoundStorage, petTrainersStorage, reportAbuseStorage,
  emergencyContactsStorage, healthRecordsStorage
} from './storage';

const Home: React.FC = () => {
  const [dataCounts, setDataCounts] = useState({
    events: 0,
    providers: 0,
    doctors: 0,
    lostFound: 0,
    trainers: 0,
    reports: 0,
    contacts: 0,
    records: 0
  });

  useEffect(() => {
    setDataCounts({
      events: adoptionEventsStorage.getAll().length,
      providers: petSurrenderStorage.getAll().length,
      doctors: petDoctorsStorage.getAll().length,
      lostFound: lostFoundStorage.getAll().length,
      trainers: petTrainersStorage.getAll().length,
      reports: reportAbuseStorage.getAll().length,
      contacts: emergencyContactsStorage.getAll().length,
      records: healthRecordsStorage.getAll().length
    });
  }, []);
  const getDataCount = (featureId: string) => {
    switch (featureId) {
      case 'adoption-events': return dataCounts.events;
      case 'pet-surrender': return dataCounts.providers;
      case 'pet-doctors': return dataCounts.doctors;
      case 'lost-found': return dataCounts.lostFound;
      case 'pet-trainers': return dataCounts.trainers;
      case 'report-abuse': return dataCounts.reports;
      case 'emergency-numbers': return dataCounts.contacts;
      case 'health-records': return dataCounts.records;
      default: return 0;
    }
  };

  const features = [
    {
      id: 'adoption-events',
      title: 'Adoption Events',
      description: 'Host and join animal adoption events in your community',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'pet-surrender',
      title: 'Pet Surrender & Care',
      description: 'Safe pet surrender services with real-time care updates',
      icon: HandHeart,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-700'
    },
    {
      id: 'pet-doctors',
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
      id: 'pet-trainers',
      title: 'Pet Trainers',
      description: 'Find certified pet trainers with community ratings',
      icon: GraduationCap,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'report-abuse',
      title: 'Report Animal Abuse',
      description: 'Secure reporting system for animal welfare violations',
      icon: AlertTriangle,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    },
    {
      id: 'awareness-campaigns',
      title: 'Awareness Campaigns',
      description: 'Create and participate in animal welfare campaigns',
      icon: Megaphone,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    },
    {
      id: 'welfare-clubs',
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
      id: 'pet-stories',
      title: 'Pet Stories',
      description: 'Share your pet stories and earn community badges',
      icon: Camera,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-700'
    },
    {
      id: 'pet-gallery',
      title: 'Pet Gallery',
      description: 'Upload and organize your precious pet memories',
      icon: Images,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'emergency-numbers',
      title: 'Emergency Rescue',
      description: 'Quick access to emergency animal rescue services',
      icon: Phone,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700'
    },
    {
      id: 'health-records',
      title: 'Health Records',
      description: 'Track vaccination records and pet health reports',
      icon: FileText,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    },
    {
      id: 'pet-shops',
      title: 'Pet Shops & Products',
      description: 'Browse pet food, accessories, and care products',
      icon: Store,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-50',
      textColor: 'text-violet-700'
    },
    {
      id: 'wildlife-sanctuary',
      title: 'Wildlife Sanctuary',
      description: 'Explore real and virtual wildlife sanctuaries',
      icon: Trees,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'endangered-species',
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
    },
    {
      id: 'ai-assistant/dog-breed',
      title: 'Dog Breed Identifier',
      description: 'AI-powered breed identification from photos',
      icon: Dog,
      color: 'from-blue-600 to-purple-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      id: 'ai-assistant/food-checker',
      title: 'Food Safety Checker',
      description: 'Check if foods are safe for your pets',
      icon: Apple,
      color: 'from-green-600 to-blue-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      id: 'ai-assistant/language-translator',
      title: 'Pet Language Translator',
      description: 'Fun AI translations of pet sounds',
      icon: Mic,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      id: 'ai-assistant/virtual-vet',
      title: 'AI Virtual Vet',
      description: '24/7 AI vet assistant & symptom checker',
      icon: Bot,
      color: 'from-blue-600 to-green-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connecting Hearts for
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Animal Welfare
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our community-driven platform dedicated to pet care, wildlife conservation, 
              and creating a better world for all animals through adoption, rescue, and awareness.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
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
                <Link
                  key={feature.id}
                  to={`/${feature.id}`}
                  className={`${feature.bgColor} p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 group hover:scale-105 hover:-translate-y-1 border border-white/50`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className={`text-lg font-bold ${feature.textColor} mb-3 group-hover:text-opacity-80 transition-colors`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-2">
                    {feature.description}
                  </p>
                  {getDataCount(feature.id) > 0 && (
                    <div className="text-xs text-gray-500 font-medium">
                      {getDataCount(feature.id)} items stored
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;