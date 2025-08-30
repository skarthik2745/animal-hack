import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, MessageCircle, Settings, Crown, Shield, User, Calendar, MapPin, Share2, Pin, Bell, Camera, Mic, Send, Paperclip, Image as ImageIcon, X, Filter, Heart, Reply, MoreVertical, Flag } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import ChatScreen from './ChatScreen';
import toast from 'react-hot-toast';

// Community Page Styles
const communityStyles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

.community-container {
  background: linear-gradient(135deg, #e6f3ff 0%, #f0f8ff 50%, #fff8f0 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.floating-animals {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.floating-animal {
  position: absolute;
  font-size: 24px;
  opacity: 0.7;
  animation: floatAnimals 15s linear infinite;
  user-select: none;
}

@keyframes floatAnimals {
  0% {
    transform: translateX(-50px) translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    transform: translateX(var(--end-x)) translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

.community-heading {
  font-family: 'Poppins', sans-serif;
  font-weight: 900;
  font-size: 3.5rem;
  text-align: center;
  background: linear-gradient(135deg, #14b8a6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 12px rgba(20, 184, 166, 0.3);
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
  letter-spacing: 2px;
  filter: drop-shadow(0 2px 4px rgba(20, 184, 166, 0.2));
}

.community-subtext {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem;
  color: #8b5cf6;
  text-align: center;
  max-width: 48rem;
  margin: 0 auto 2rem;
  line-height: 1.6;
  position: relative;
  z-index: 2;
  font-weight: 700;
}

.modern-search-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.modern-search-bar:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.search-input {
  border-radius: 16px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.search-input:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  background: white;
}

.filter-select {
  border-radius: 16px;
  border: 2px solid transparent;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
}

.filter-select:focus {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.1);
  background: white;
}

.gradient-btn-join {
  background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.gradient-btn-join:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4), 0 0 20px rgba(16, 185, 129, 0.3);
  background: linear-gradient(135deg, #059669 0%, #0891b2 100%);
}

.gradient-btn-share {
  background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(245, 158, 11, 0.3);
}

.gradient-btn-share:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.3);
  background: linear-gradient(135deg, #d97706 0%, #dc2626 100%);
}

.gradient-btn-create {
  background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
  border: none;
  border-radius: 25px;
  color: white;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.gradient-btn-create:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
  background: linear-gradient(135deg, #7c3aed 0%, #db2777 100%);
}

.community-card {
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

.community-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 1);
}

@media (prefers-reduced-motion: reduce) {
  .floating-animal { animation: none; }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = communityStyles;
  document.head.appendChild(styleElement);
}

interface Community {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  location?: string;
  memberCount: number;
  members: CommunityMember[];
  messages: CommunityMessage[];
  topics: Topic[];
  events: CommunityEvent[];
  privacy: 'public' | 'private';
  createdBy: string;
  createdAt: string;
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}

interface CommunityMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  timestamp: string | Date;
  topicId?: string;
  pinned?: boolean;
  reactions: { [emoji: string]: string[] };
  replies: CommunityMessage[];
}

interface Topic {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  messageCount: number;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  attendees: string[];
  maxAttendees?: number;
}

const Community: React.FC = () => {
  const { user } = useAuth();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [activeTab, setActiveTab] = useState('communities');
  const [newMessage, setNewMessage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Dog Lovers',
    location: '',
    privacy: 'public' as 'public' | 'private',
    logo: ''
  });

  // Generate floating animal emojis
  useEffect(() => {
    const createFloatingAnimals = () => {
      const container = document.querySelector('.floating-animals');
      if (!container) return;
      
      container.innerHTML = '';
      
      const animalEmojis = ['🐶', '🐱', '🐹', '🐰', '🦜', '🐢', '🐕', '🐈', '🐇', '🐦', '🦮', '🐕‍🦺', '🐓', '🐾'];
      
      for (let i = 0; i < 80; i++) {
        const animal = document.createElement('div');
        animal.className = 'floating-animal';
        animal.textContent = animalEmojis[Math.floor(Math.random() * animalEmojis.length)];
        animal.style.left = Math.random() * 100 + '%';
        animal.style.fontSize = (Math.random() * 10 + 20) + 'px';
        animal.style.animationDuration = (Math.random() * 10 + 10) + 's';
        animal.style.animationDelay = Math.random() * -15 + 's';
        animal.style.setProperty('--end-x', (Math.random() * 200 - 100) + 'px');
        container.appendChild(animal);
      }
    };
    
    createFloatingAnimals();
  }, []);

  useEffect(() => {
    const savedCommunities = localStorage.getItem('animalCommunities');
    if (savedCommunities) {
      const parsedCommunities = JSON.parse(savedCommunities);
      setCommunities(parsedCommunities);
      
      // Check if we need to open a specific community from profile
      const openCommunityId = localStorage.getItem('openCommunityId');
      if (openCommunityId && user) {
        const communityToOpen = parsedCommunities.find((c: Community) => c.id === openCommunityId);
        if (communityToOpen && communityToOpen.members.some((m: CommunityMember) => m.id === user.id)) {
          setSelectedCommunity(communityToOpen);
          setActiveTab('chat');
          setShowCommunityChat(true);
        }
        localStorage.removeItem('openCommunityId');
      }
    } else {
      const dummyCommunities: Community[] = [
        {
          id: '1',
          name: 'Dog Care Club',
          description: 'Everything about dog care, training, and health tips',
          logo: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
          category: 'Dog Lovers',
          location: 'Mumbai',
          memberCount: 1247,
          members: [
            { id: 'admin1', name: 'Sarah Johnson', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'admin', joinedAt: '2024-01-15' },
            { id: 'mod1', name: 'Mike Chen', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'moderator', joinedAt: '2024-02-01' },
            { id: 'user1', name: 'Emma Wilson', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'member', joinedAt: '2024-03-10' }
          ],
          messages: [
            {
              id: 'm1',
              senderId: 'admin1',
              senderName: 'Sarah Johnson',
              senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
              content: 'Welcome to Dog Care Club! Share your experiences and ask questions.',
              type: 'text',
              timestamp: '2025-01-15T10:00:00',
              pinned: true,
              reactions: { '❤️': ['user1', 'mod1'], '👍': ['user1'] },
              replies: []
            },
            {
              id: 'm2',
              senderId: 'user1',
              senderName: 'Emma Wilson',
              senderAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
              content: 'My golden retriever has been acting strange lately. Any advice?',
              type: 'text',
              timestamp: '2025-01-15T14:30:00',
              reactions: { '🤔': ['admin1'] },
              replies: [
                {
                  id: 'r1',
                  senderId: 'admin1',
                  senderName: 'Sarah Johnson',
                  senderAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
                  content: 'Can you describe the behavior? Has there been any change in diet or routine?',
                  type: 'text',
                  timestamp: '2025-01-15T14:35:00',
                  reactions: {},
                  replies: []
                }
              ]
            }
          ],
          topics: [
            { id: 't1', title: 'Best Dog Food Brands', description: 'Discuss and recommend quality dog food', createdBy: 'admin1', createdAt: '2025-01-10', messageCount: 23 },
            { id: 't2', title: 'Training Tips', description: 'Share training techniques and experiences', createdBy: 'mod1', createdAt: '2025-01-12', messageCount: 45 }
          ],
          events: [
            { id: 'e1', title: 'Dog Park Meetup', description: 'Monthly meetup at Central Park', date: '2025-02-15', location: 'Central Park, Mumbai', attendees: ['admin1', 'user1'], maxAttendees: 20 }
          ],
          privacy: 'public',
          createdBy: 'admin1',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'Street Rescue Volunteers',
          description: 'Coordinating street animal rescue operations and medical aid',
          logo: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
          category: 'Rescue & Welfare',
          location: 'Delhi',
          memberCount: 892,
          members: [
            { id: 'admin2', name: 'Dr. Priya Sharma', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'admin', joinedAt: '2024-01-20' }
          ],
          messages: [
            {
              id: 'm3',
              senderId: 'admin2',
              senderName: 'Dr. Priya Sharma',
              senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
              content: 'Urgent: Injured dog spotted near Connaught Place. Need volunteers!',
              type: 'text',
              timestamp: '2025-01-15T16:00:00',
              reactions: { '🚨': ['user2', 'user3'], '❤️': ['user2'] },
              replies: []
            }
          ],
          topics: [
            { id: 't3', title: 'Emergency Protocols', description: 'Standard procedures for rescue operations', createdBy: 'admin2', createdAt: '2025-01-08', messageCount: 12 }
          ],
          events: [
            { id: 'e2', title: 'Vaccination Drive', description: 'Free vaccination camp for street animals', date: '2025-02-20', location: 'Community Center, Delhi', attendees: ['admin2'], maxAttendees: 50 }
          ],
          privacy: 'public',
          createdBy: 'admin2',
          createdAt: '2024-01-20'
        },
        {
          id: '3',
          name: 'Cat Lovers Zone',
          description: 'For all cat enthusiasts - care tips, funny stories, and adoption',
          logo: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=400',
          category: 'Cat Lovers',
          location: 'Bangalore',
          memberCount: 756,
          members: [
            { id: 'admin3', name: 'Meera Patel', avatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400', role: 'admin', joinedAt: '2024-02-01' }
          ],
          messages: [
            {
              id: 'm4',
              senderId: 'admin3',
              senderName: 'Meera Patel',
              senderAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
              content: 'Share your cat photos! Let\'s see those adorable faces 😻',
              type: 'text',
              timestamp: '2025-01-14T12:00:00',
              reactions: { '😻': ['user4', 'user5'], '📸': ['user4'] },
              replies: []
            }
          ],
          topics: [
            { id: 't4', title: 'Cat Health & Nutrition', description: 'Discuss cat health, diet, and medical care', createdBy: 'admin3', createdAt: '2025-01-05', messageCount: 34 }
          ],
          events: [
            { id: 'e3', title: 'Cat Adoption Fair', description: 'Find your perfect feline companion', date: '2025-02-25', location: 'Pet Store, Bangalore', attendees: ['admin3'], maxAttendees: 30 }
          ],
          privacy: 'public',
          createdBy: 'admin3',
          createdAt: '2024-02-01'
        }
      ];
      setCommunities(dummyCommunities);
      localStorage.setItem('animalCommunities', JSON.stringify(dummyCommunities));
    }
  }, [user]);

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = !searchTerm || 
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || community.category === categoryFilter;
    const matchesLocation = !locationFilter || community.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const categories = ['Dog Lovers', 'Cat Lovers', 'Bird Enthusiasts', 'Rescue & Welfare', 'Wildlife Care', 'Pet Training', 'Veterinary Care'];

  const handleCreateCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to create a community');
      return;
    }

    const newCommunity: Community = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      logo: formData.logo || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      category: formData.category,
      location: formData.location,
      memberCount: 1,
      members: [{
        id: user.id,
        name: user.name,
        avatar: user.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
        role: 'admin',
        joinedAt: new Date().toISOString().split('T')[0]
      }],
      messages: [],
      topics: [],
      events: [],
      privacy: formData.privacy,
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    const updatedCommunities = [...communities, newCommunity];
    setCommunities(updatedCommunities);
    localStorage.setItem('animalCommunities', JSON.stringify(updatedCommunities));
    
    setFormData({ name: '', description: '', category: 'Dog Lovers', location: '', privacy: 'public', logo: '' });
    setShowCreateForm(false);
    toast.success('Community created successfully!');
  };

  const joinCommunity = (communityId: string) => {
    if (!user) {
      toast.error('Please login to join communities');
      return;
    }

    const updatedCommunities = communities.map(community => {
      if (community.id === communityId) {
        const isAlreadyMember = community.members.some(member => member.id === user.id);
        if (isAlreadyMember) {
          toast.info('You are already a member of this community');
          return community;
        }

        const newMember: CommunityMember = {
          id: user.id,
          name: user.name,
          avatar: user.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          role: 'member',
          joinedAt: new Date().toISOString().split('T')[0]
        };

        return {
          ...community,
          members: [...community.members, newMember],
          memberCount: community.memberCount + 1
        };
      }
      return community;
    });

    setCommunities(updatedCommunities);
    localStorage.setItem('animalCommunities', JSON.stringify(updatedCommunities));
    
    // Add to user's joined communities
    const userCommunities = JSON.parse(localStorage.getItem('userCommunities') || '[]');
    const communityToAdd = updatedCommunities.find(c => c.id === communityId);
    if (communityToAdd && !userCommunities.some((c: any) => c.id === communityId)) {
      userCommunities.push({
        id: communityToAdd.id,
        name: communityToAdd.name,
        logo: communityToAdd.logo,
        memberCount: communityToAdd.memberCount,
        lastActivity: new Date().toISOString()
      });
      localStorage.setItem('userCommunities', JSON.stringify(userCommunities));
    }
    
    toast.success('Joined community successfully!');
  };

  const openCommunityChat = (community: Community) => {
    if (!user) {
      toast.error('Please login to access community chat');
      return;
    }
    
    const isMember = community.members.some(member => member.id === user.id);
    if (!isMember) {
      toast.error('Please join the community first to access chat');
      return;
    }
    
    setSelectedCommunity(community);
    setActiveTab('chat');
    setShowCommunityChat(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCommunity || !user) return;

    const message: CommunityMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: newMessage.trim(),
      type: 'text',
      timestamp: new Date().toISOString(),
      reactions: {},
      replies: []
    };

    const updatedCommunities = communities.map(community => {
      if (community.id === selectedCommunity.id) {
        return {
          ...community,
          messages: [...community.messages, message]
        };
      }
      return community;
    });

    setCommunities(updatedCommunities);
    localStorage.setItem('animalCommunities', JSON.stringify(updatedCommunities));
    
    setSelectedCommunity({
      ...selectedCommunity,
      messages: [...selectedCommunity.messages, message]
    });
    
    setNewMessage('');
  };

  const addReaction = (messageId: string, emoji: string) => {
    if (!selectedCommunity || !user) return;

    const updatedCommunities = communities.map(community => {
      if (community.id === selectedCommunity.id) {
        const updatedMessages = community.messages.map(message => {
          if (message.id === messageId) {
            const reactions = { ...message.reactions };
            if (reactions[emoji]) {
              if (reactions[emoji].includes(user.id)) {
                reactions[emoji] = reactions[emoji].filter(id => id !== user.id);
                if (reactions[emoji].length === 0) {
                  delete reactions[emoji];
                }
              } else {
                reactions[emoji].push(user.id);
              }
            } else {
              reactions[emoji] = [user.id];
            }
            return { ...message, reactions };
          }
          return message;
        });
        return { ...community, messages: updatedMessages };
      }
      return community;
    });

    setCommunities(updatedCommunities);
    localStorage.setItem('animalCommunities', JSON.stringify(updatedCommunities));
    
    const updatedCommunity = updatedCommunities.find(c => c.id === selectedCommunity.id);
    if (updatedCommunity) {
      setSelectedCommunity(updatedCommunity);
    }
  };

  const shareContent = (content: string, type: 'community' | 'message' = 'community') => {
    const shareText = type === 'community' 
      ? `Join "${content}" community on Animal Welfare Platform! 🐾\n\nConnect with fellow animal lovers and share experiences.\n\n${window.location.origin}/community`
      : `Check out this message from our animal community: "${content}"\n\n${window.location.origin}/community`;

    if (navigator.share) {
      navigator.share({
        title: type === 'community' ? `Join ${content} Community` : 'Community Message',
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Content copied to clipboard!');
      }).catch(() => {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        window.open(whatsappUrl, '_blank');
      });
    }
  };

  return (
    <div className="community-container py-20 px-4 sm:px-6 lg:px-8">
      <div className="floating-animals"></div>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="community-heading">
            Animal Lovers Community
          </h1>
          <p className="community-subtext">
            Connect with fellow animal lovers, share experiences, and build a stronger community for animal welfare
          </p>
        </div>

        {/* Search and Filters */}
        <div className="modern-search-bar p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-teal-500 h-5 w-5" />
              <input
                type="text"
                placeholder="🔍 Search communities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input w-full pl-12 pr-4 py-3 text-gray-700 placeholder-gray-500"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select px-4 py-3 text-gray-700"
            >
              <option value="">🏷️ All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="📍 Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="filter-select px-4 py-3 text-gray-700 placeholder-gray-500"
            />
            <button onClick={() => setShowCreateForm(true)} className="gradient-btn-create px-6 py-3 flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Create Community
            </button>
          </div>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredCommunities.map((community) => (
            <div key={community.id} className="community-card">
              <div className="relative h-48">
                <img
                  src={community.logo}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant={community.privacy === 'public' ? 'success' : 'default'}>
                    {community.privacy}
                  </Badge>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{community.name}</h3>
                    <Badge variant="info" className="text-xs">{community.category}</Badge>
                  </div>
                  <button
                    onClick={() => shareContent(community.name, 'community')}
                    className="p-2 text-gray-400 hover:text-emerald-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{community.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span className="text-sm">{community.memberCount} members</span>
                  </div>
                  {community.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{community.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{community.messages.length} messages</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  {user && community.members.some(member => member.id === user.id) ? (
                    <button
                      onClick={() => openCommunityChat(community)}
                      className="gradient-btn-join flex-1 px-4 py-2 text-sm flex items-center justify-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Open Chat
                    </button>
                  ) : (
                    <button
                      onClick={() => joinCommunity(community.id)}
                      className="gradient-btn-join flex-1 px-4 py-2 text-sm flex items-center justify-center"
                    >
                      Join Community
                    </button>
                  )}
                  <button
                    onClick={() => shareContent(community.name, 'community')}
                    className="gradient-btn-share px-4 py-2 text-sm flex items-center justify-center"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Community Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Community</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleCreateCommunity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Community Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (Optional)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Privacy</label>
                  <select
                    value={formData.privacy}
                    onChange={(e) => setFormData({ ...formData, privacy: e.target.value as 'public' | 'private' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Community Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setFormData({ ...formData, logo: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label htmlFor="logo-upload" className="cursor-pointer">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo preview" className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <p className="text-gray-600 text-sm">Click to upload logo</p>
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Create Community
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Community Chat Modal */}
        {showCommunityChat && selectedCommunity && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            {/* Chat Header */}
            <div className="bg-emerald-600 text-white p-4 flex items-center shadow-lg">
              <button
                onClick={() => setShowCommunityChat(false)}
                className="mr-4 hover:bg-emerald-700 p-2 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <img
                src={selectedCommunity.logo}
                alt={selectedCommunity.name}
                className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{selectedCommunity.name}</h3>
                <p className="text-sm text-emerald-100">{selectedCommunity.memberCount} members</p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setActiveTab('members')}
                  className="p-2 hover:bg-emerald-700 rounded-full transition-colors"
                >
                  <Users className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setActiveTab('info')}
                  className="p-2 hover:bg-emerald-700 rounded-full transition-colors"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4">
              {selectedCommunity.messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <img
                    src={message.senderAvatar}
                    alt={message.senderName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900">{message.senderName}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.pinned && <Pin className="h-3 w-3 text-emerald-600" />}
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-sm">
                      <p className="text-gray-800">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex space-x-1">
                          {['❤️', '👍', '😂', '😮', '😢', '😡'].map(emoji => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
                              className="text-sm hover:bg-gray-100 px-1 py-0.5 rounded transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => shareContent(message.content, 'message')}
                            className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                          >
                            <Share2 className="h-3 w-3" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Flag className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      {Object.keys(message.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(message.reactions).map(([emoji, users]) => (
                            <button
                              key={emoji}
                              onClick={() => addReaction(message.id, emoji)}
                              className={`text-xs px-2 py-1 rounded-full transition-colors ${
                                users.includes(user?.id || '') 
                                  ? 'bg-emerald-100 text-emerald-700' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {emoji} {users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.replies.length > 0 && (
                      <div className="ml-4 mt-2 space-y-2">
                        {message.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-100 rounded-lg p-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-xs text-gray-700">{reply.senderName}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-800">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => shareContent(message.content, 'message')}
                      className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <Share2 className="h-3 w-3" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Flag className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t p-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                  <ImageIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <button 
                  onClick={sendMessage}
                  className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No communities found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search filters or create a new community.</p>
            <button onClick={() => setShowCreateForm(true)} className="gradient-btn-create px-8 py-3">
              Create Your First Community
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;