import React, { useState, useEffect, useRef } from 'react';
import { Camera, Heart, MessageCircle, Share, Plus, X, Send, UserPlus, UserMinus, Grid, Users, Bell, Search, Upload, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import { useDatabase } from '../hooks/useDatabase';
import ChatScreen from './ChatScreen';
import toast from 'react-hot-toast';

interface PetProfile {
  id: string;
  petName: string;
  breed: string;
  age: string;
  ownerName: string;
  profilePhoto: string;
  followers: string[];
  following: string[];
  bio?: string;
}

interface Post {
  id: string;
  petId: string;
  petName: string;
  profilePhoto: string;
  type: 'image' | 'video';
  content: string;
  caption: string;
  likes: string[];
  comments: Comment[];
  shares: number;
  timestamp: Date;
}

interface Story {
  id: string;
  petId: string;
  petName: string;
  profilePhoto: string;
  type: 'image' | 'video';
  content: string;
  text?: string;
  timestamp: Date;
  viewed: boolean;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  type: 'text' | 'image' | 'file' | 'audio';
  status: 'sent' | 'delivered' | 'read';
}

const PetStories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feed' | 'community' | 'profile'>('feed');
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [chatPartner, setChatPartner] = useState<any>(null);
  const [newComment, setNewComment] = useState('');
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPostViewer, setShowPostViewer] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [showFollowersList, setShowFollowersList] = useState(false);
  const [showFollowingList, setShowFollowingList] = useState(false);
  const [listProfile, setListProfile] = useState<any>(null);
  
  const { user, isAuthenticated } = useAuth();
  const [profiles, setProfiles] = useState<PetProfile[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  const [profileForm, setProfileForm] = useState({
    petName: '',
    breed: '',
    age: '',
    ownerName: '',
    profilePhoto: '',
    bio: ''
  });

  const [postForm, setPostForm] = useState({
    type: 'image' as 'image' | 'video',
    content: '',
    caption: ''
  });

  const [storyForm, setStoryForm] = useState({
    type: 'image' as 'image' | 'video',
    content: '',
    text: ''
  });

  useEffect(() => {
    loadDummyData();
    loadUserData();
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const dummyNotifications = [
      {
        type: 'follow',
        message: 'Bruno started following you',
        time: '2 hours ago'
      },
      {
        type: 'like',
        message: 'Luna liked your post',
        time: '4 hours ago'
      },
      {
        type: 'comment',
        message: 'Charlie commented on your post: "So cute! 😍"',
        time: '1 day ago'
      },
      {
        type: 'message',
        message: 'New message from Bella',
        time: '2 days ago'
      }
    ];
    setNotifications(dummyNotifications);
  };

  const loadDummyData = () => {
    const dummyProfiles: PetProfile[] = [
      {
        id: '1',
        petName: 'Bruno',
        breed: 'Golden Retriever',
        age: '3 years',
        ownerName: 'Sarah Johnson',
        profilePhoto: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        followers: ['user1', 'user2', 'user3'],
        following: ['2', '3'],
        bio: 'Adventure loving golden boy 🐕 Beach walks & treats!'
      },
      {
        id: '2',
        petName: 'Luna',
        breed: 'Persian Cat',
        age: '2 years',
        ownerName: 'Mike Chen',
        profilePhoto: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
        followers: ['user1', 'user4'],
        following: ['1', '4'],
        bio: 'Princess Luna 👑 Loves naps and fancy food'
      },
      {
        id: '3',
        petName: 'Charlie',
        breed: 'Cockatiel',
        age: '1 year',
        ownerName: 'Emma Wilson',
        profilePhoto: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
        followers: ['user2', 'user3'],
        following: ['1'],
        bio: 'Singing sensation 🎵 Loves millet and mirrors'
      },
      {
        id: '4',
        petName: 'Bella',
        breed: 'French Bulldog',
        age: '4 years',
        ownerName: 'David Brown',
        profilePhoto: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=400',
        followers: ['user1', 'user2', 'user4'],
        following: ['2'],
        bio: 'Snoring queen 😴 Loves belly rubs and snacks'
      },
      {
        id: '5',
        petName: 'Max',
        breed: 'Holland Lop Rabbit',
        age: '6 months',
        ownerName: 'Lisa Garcia',
        profilePhoto: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400',
        followers: ['user3'],
        following: ['1', '3'],
        bio: 'Hoppy little guy 🐰 Carrot enthusiast'
      }
    ];

    const dummyPosts: Post[] = [
      {
        id: '1',
        petId: '1',
        petName: 'Bruno',
        profilePhoto: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'image',
        content: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
        caption: 'Bruno enjoying his morning walk 🐾 #GoldenRetriever #MorningWalk',
        likes: ['user1', 'user2'],
        comments: [
          { id: '1', userId: 'user1', username: 'Sarah', content: 'Such a good boy! 🥰', timestamp: new Date() }
        ],
        shares: 3,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        petId: '2',
        petName: 'Luna',
        profilePhoto: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'image',
        content: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=800',
        caption: 'Luna\'s first grooming day ✨ She looks like a princess! #PersianCat #Grooming',
        likes: ['user1', 'user3', 'user4'],
        comments: [
          { id: '2', userId: 'user3', username: 'Emma', content: 'So fluffy! 😍', timestamp: new Date() }
        ],
        shares: 5,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: '3',
        petId: '3',
        petName: 'Charlie',
        profilePhoto: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'video',
        content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
        caption: 'Charlie singing his favorite song 🎵 #Cockatiel #Singing #BirdLife',
        likes: ['user2'],
        comments: [],
        shares: 2,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      },
      {
        id: '4',
        petId: '4',
        petName: 'Bella',
        profilePhoto: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'image',
        content: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=800',
        caption: 'Bella\'s afternoon nap session 😴 Living her best life! #FrenchBulldog #NapTime',
        likes: ['user1', 'user2', 'user3'],
        comments: [
          { id: '3', userId: 'user1', username: 'Sarah', content: 'Goals! 😂', timestamp: new Date() }
        ],
        shares: 1,
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000)
      },
      {
        id: '5',
        petId: '5',
        petName: 'Max',
        profilePhoto: 'https://images.pexels.com/photos/326012/pexels-photo-326012.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'image',
        content: 'https://images.pexels.com/photos/372166/pexels-photo-372166.jpeg?auto=compress&cs=tinysrgb&w=800',
        caption: 'Max discovered the carrot garden! 🥕 Pure happiness #Rabbit #Carrots #Garden',
        likes: ['user3', 'user4'],
        comments: [],
        shares: 4,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];

    const dummyStories: Story[] = [
      {
        id: '1',
        petId: '1',
        petName: 'Bruno',
        profilePhoto: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'image',
        content: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        viewed: false
      },
      {
        id: '2',
        petId: '2',
        petName: 'Luna',
        profilePhoto: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'video',
        content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        viewed: false
      },
      {
        id: '3',
        petId: '4',
        petName: 'Bella',
        profilePhoto: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=400',
        type: 'image',
        content: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=800',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        viewed: false
      }
    ];

    setProfiles(dummyProfiles);
    setPosts(dummyPosts);
    setStories(dummyStories);
  };

  const loadUserData = () => {
    const savedProfiles = localStorage.getItem('petProfiles');
    const savedPosts = localStorage.getItem('petPosts');
    const savedStories = localStorage.getItem('petStories');
    
    if (savedProfiles) {
      const userProfiles = JSON.parse(savedProfiles);
      setProfiles(prev => [...prev, ...userProfiles]);
    }
    if (savedPosts) {
      const userPosts = JSON.parse(savedPosts);
      setPosts(prev => [...prev, ...userPosts]);
    }
    if (savedStories) {
      const userStories = JSON.parse(savedStories);
      setStories(prev => [...prev, ...userStories]);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to create a pet profile');
      return;
    }

    const newProfile: PetProfile = {
      id: Date.now().toString(),
      petName: profileForm.petName,
      breed: profileForm.breed,
      age: profileForm.age,
      ownerName: profileForm.ownerName,
      profilePhoto: profileForm.profilePhoto || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
      followers: [],
      following: [],
      bio: profileForm.bio
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    
    const userProfiles = JSON.parse(localStorage.getItem('petProfiles') || '[]');
    userProfiles.push(newProfile);
    localStorage.setItem('petProfiles', JSON.stringify(userProfiles));

    setProfileForm({ petName: '', breed: '', age: '', ownerName: '', profilePhoto: '', bio: '' });
    setShowCreateProfile(false);
    toast.success('Pet profile created successfully!');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !selectedProfile) {
      toast.error('Please select a pet profile first');
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      petId: selectedProfile.id,
      petName: selectedProfile.petName,
      profilePhoto: selectedProfile.profilePhoto,
      ...postForm,
      likes: [],
      comments: [],
      shares: 0,
      timestamp: new Date()
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    
    const userPosts = JSON.parse(localStorage.getItem('petPosts') || '[]');
    userPosts.push(newPost);
    localStorage.setItem('petPosts', JSON.stringify(userPosts));

    setPostForm({ type: 'image', content: '', caption: '' });
    setShowCreatePost(false);
    toast.success('Post created successfully!');
  };

  const handleCreateStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !selectedProfile) {
      toast.error('Please select a pet profile first');
      return;
    }

    const newStory: Story = {
      id: Date.now().toString(),
      petId: selectedProfile.id,
      petName: selectedProfile.petName,
      profilePhoto: selectedProfile.profilePhoto,
      ...storyForm,
      timestamp: new Date(),
      viewed: false
    };

    const updatedStories = [newStory, ...stories];
    setStories(updatedStories);
    
    const userStories = JSON.parse(localStorage.getItem('petStories') || '[]');
    userStories.push(newStory);
    localStorage.setItem('petStories', JSON.stringify(userStories));

    setStoryForm({ type: 'image', content: '', text: '' });
    setShowCreateStory(false);
    toast.success('Story created successfully!');
  };

  const handleLike = (postId: string) => {
    if (!isAuthenticated || !user) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.likes.includes(user.id);
        const updatedPost = {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== user.id)
            : [...post.likes, user.id]
        };
        
        // Add notification for like
        if (!isLiked && post.petId !== user.id) {
          const newNotification = {
            type: 'like',
            message: `${user.name} liked your post`,
            time: 'Just now'
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
        
        return updatedPost;
      }
      return post;
    }));
  };

  const handleComment = (postId: string) => {
    if (!newComment.trim() || !isAuthenticated || !user) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.name,
      content: newComment.trim(),
      timestamp: new Date()
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        // Add notification for comment
        if (post.petId !== user.id) {
          const newNotification = {
            type: 'comment',
            message: `${user.name} commented on your post: "${newComment.trim()}"`,
            time: 'Just now'
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
        
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    }));

    setNewComment('');
    setCommentingOn(null);
  };

  const handleFollow = (profileId: string) => {
    if (!isAuthenticated || !user) return;

    setProfiles(prev => prev.map(profile => {
      if (profile.id === profileId) {
        const isFollowing = profile.followers.includes(user.id);
        
        // Add notification for new follower
        if (!isFollowing) {
          const newNotification = {
            type: 'follow',
            message: `${user.name} started following ${profile.petName}`,
            time: 'Just now'
          };
          setNotifications(prev => [newNotification, ...prev]);
        }
        
        return {
          ...profile,
          followers: isFollowing 
            ? profile.followers.filter(id => id !== user.id)
            : [...profile.followers, user.id]
        };
      }
      return profile;
    }));
  };

  const handleShare = (post: Post) => {
    const shareUrl = `${window.location.origin}/pet-stories/post/${post.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${post.petName}'s Post`,
        text: post.caption,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Post link copied to clipboard!');
    }

    setPosts(prev => prev.map(p => 
      p.id === post.id ? { ...p, shares: p.shares + 1 } : p
    ));
  };

  const openPostViewer = (post: Post) => {
    setSelectedPost(post);
    setShowPostViewer(true);
  };

  const openFollowersList = (profile: PetProfile) => {
    setListProfile(profile);
    setShowFollowersList(true);
  };

  const openFollowingList = (profile: PetProfile) => {
    setListProfile(profile);
    setShowFollowingList(true);
  };

  const openStoryViewer = (storyIndex: number) => {
    setCurrentStoryIndex(storyIndex);
    setShowStoryViewer(true);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      setShowStoryViewer(false);
    }
  };

  const openChat = (profile: PetProfile) => {
    if (!isAuthenticated) {
      toast.error('Please log in to send messages');
      return;
    }
    
    // Add notification for new message
    const newNotification = {
      type: 'message',
      message: `New message from ${profile.petName}`,
      time: 'Just now'
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    setChatPartner(profile);
    setShowChat(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'post' | 'story') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (type === 'profile') {
          setProfileForm({ ...profileForm, profilePhoto: imageUrl });
        } else if (type === 'post') {
          setPostForm({ ...postForm, content: imageUrl });
        } else if (type === 'story') {
          setStoryForm({ ...storyForm, content: imageUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const getFollowedPosts = () => {
    if (!user || !selectedProfile) return [];
    const followingIds = selectedProfile.following;
    return posts.filter(post => followingIds.includes(post.petId));
  };

  const filteredProfiles = profiles.filter(profile => 
    profile.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    profile.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentStory = stories[currentStoryIndex];

  return (
    <>
      <style>{`
        .galaxy-container {
          background: linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .galaxy-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
      
      <div className="galaxy-container">
        <div className="galaxy-content min-h-screen py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-black mb-4" style={{
                background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(0, 229, 255, 0.5)'
              }}>Pet Stories</h1>
              <p className="text-xl md:text-2xl font-medium mb-6" style={{
                color: '#00cfff',
                textShadow: '0 0 15px rgba(0, 207, 255, 0.3)'
              }}>Share your pet's adventures and connect with fellow pet lovers</p>
              <div className="flex items-center justify-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search pets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="relative">
                  <Button onClick={() => setShowNotifications(!showNotifications)} variant="outline" size="sm">
                    <Bell className="h-4 w-4" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </Button>
              
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="divide-y">
                    {notifications.length > 0 ? notifications.map((notification, index) => (
                      <div key={index} className="p-4 hover:bg-gray-50">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            {notification.type === 'follow' && <Users className="h-5 w-5 text-blue-500" />}
                            {notification.type === 'like' && <Heart className="h-5 w-5 text-red-500" />}
                            {notification.type === 'comment' && <MessageCircle className="h-5 w-5 text-green-500" />}
                            {notification.type === 'message' && <Send className="h-5 w-5 text-purple-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
                <div className="flex space-x-2">
                  <Button onClick={() => setShowCreateStory(true)} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Story
                  </Button>
                  <Button onClick={() => setShowCreateProfile(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </div>
              </div>
            </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab('feed')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'feed' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Feed
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'community' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'profile' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profiles
            </button>
          </div>
        </div>

        {/* Stories */}
        {(activeTab === 'feed' || activeTab === 'community') && (
          <div className="mb-8">
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {stories.map((story, index) => (
                <div
                  key={story.id}
                  onClick={() => openStoryViewer(index)}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <div className={`w-16 h-16 rounded-full p-0.5 ${story.viewed ? 'bg-gray-300' : 'bg-gradient-to-r from-pink-500 to-orange-500'}`}>
                    <img
                      src={story.profilePhoto}
                      alt={story.petName}
                      className="w-full h-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <p className="text-xs text-center mt-1 truncate w-16">{story.petName}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* My Pet Profiles Section */}
            {!selectedProfile && (
              <Card className="p-4 bg-white/95 backdrop-blur-sm border border-white/20">
                <h3 className="text-lg font-semibold mb-4">My Pet Profiles</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profiles.filter(p => JSON.parse(localStorage.getItem('petProfiles') || '[]').some((up: any) => up.id === p.id)).map(profile => (
                    <div key={profile.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <img
                        src={profile.profilePhoto}
                        alt={profile.petName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{profile.petName}</h4>
                        <p className="text-sm text-gray-600">{profile.breed}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          onClick={() => {
                            setSelectedProfile(profile);
                            setShowCreatePost(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Post
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedProfile(profile);
                            setShowCreateStory(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          Story
                        </Button>
                        <Button
                          onClick={() => setSelectedProfile(profile)}
                          size="sm"
                        >
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                  {profiles.filter(p => JSON.parse(localStorage.getItem('petProfiles') || '[]').some((up: any) => up.id === p.id)).length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <p>No pet profiles yet. Create your first pet profile to start posting!</p>
                      <Button onClick={() => setShowCreateProfile(true)} className="mt-2">
                        Create Pet Profile
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {selectedProfile && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedProfile.profilePhoto}
                      alt={selectedProfile.petName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{selectedProfile.petName}</h3>
                      <p className="text-sm text-gray-600">{selectedProfile.breed}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => setSelectedProfile(null)} variant="outline" size="sm">
                      Back to Feed
                    </Button>
                    <Button onClick={() => setShowCreatePost(true)} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      New Post
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {selectedProfile ? (
              // Show posts from selected profile only
              posts.filter(post => post.petId === selectedProfile.id).length > 0 ? (
                posts.filter(post => post.petId === selectedProfile.id).map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.profilePhoto}
                          alt={post.petName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{post.petName}</h4>
                          <p className="text-sm text-gray-600">
                            {new Date(post.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {post.type === 'image' ? (
                      <img
                        src={post.content}
                        alt="Post content"
                        className="w-full h-96 object-cover cursor-pointer"
                        onClick={() => openPostViewer(post)}
                      />
                    ) : (
                      <video
                        ref={el => { if (el) videoRefs.current[post.id] = el; }}
                        src={post.content}
                        className="w-full h-96 object-cover cursor-pointer"
                        controls
                        onClick={() => openPostViewer(post)}
                      />
                    )}

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 ${
                              user && post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-600'
                            }`}
                          >
                            <Heart className={`h-5 w-5 ${user && post.likes.includes(user.id) ? 'fill-current' : ''}`} />
                            <span>{post.likes.length}</span>
                          </button>
                          <button
                            onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                            className="flex items-center space-x-1 text-gray-600"
                          >
                            <MessageCircle className="h-5 w-5" />
                            <span>{post.comments.length}</span>
                          </button>
                          <button 
                            onClick={() => handleShare(post)}
                            className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                          >
                            <Share className="h-5 w-5" />
                            <span>{post.shares}</span>
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-900 mb-2">{post.caption}</p>

                      {post.comments.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="text-sm">
                              <span className="font-semibold">{comment.username}</span>{' '}
                              <span className="text-gray-700">{comment.content}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {commentingOn === post.id && (
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          />
                          <Button onClick={() => handleComment(post.id)} size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No posts from {selectedProfile.petName} yet!</p>
                </Card>
              )
            ) : (
              // Show followed posts when no profile selected
              getFollowedPosts().length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No posts from followed accounts yet!</p>
                  <Button onClick={() => setActiveTab('community')}>
                    Explore Community
                  </Button>
                </Card>
              ) : (
                getFollowedPosts().map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.profilePhoto}
                        alt={post.petName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold">{post.petName}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        const profile = profiles.find(p => p.id === post.petId);
                        if (profile) openChat(profile);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Message
                    </Button>
                  </div>

                  {post.type === 'image' ? (
                    <img
                      src={post.content}
                      alt="Post content"
                      className="w-full h-96 object-cover"
                    />
                  ) : (
                    <video
                      ref={el => { if (el) videoRefs.current[post.id] = el; }}
                      src={post.content}
                      className="w-full h-96 object-cover"
                      controls
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-1 ${
                            user && post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-600'
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${user && post.likes.includes(user.id) ? 'fill-current' : ''}`} />
                          <span>{post.likes.length}</span>
                        </button>
                        <button
                          onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                          className="flex items-center space-x-1 text-gray-600"
                        >
                          <MessageCircle className="h-5 w-5" />
                          <span>{post.comments.length}</span>
                        </button>
                        <button 
                          onClick={() => handleShare(post)}
                          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                        >
                          <Share className="h-5 w-5" />
                          <span>{post.shares}</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-900 mb-2">{post.caption}</p>

                    {post.comments.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {post.comments.map((comment) => (
                          <div key={comment.id} className="text-sm">
                            <span className="font-semibold">{comment.username}</span>{' '}
                            <span className="text-gray-700">{comment.content}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {commentingOn === post.id && (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                        />
                        <Button onClick={() => handleComment(post.id)} size="sm">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
                ))
              )
            )}
          </div>
        )}

        {/* Community Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={post.profilePhoto}
                      alt={post.petName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{post.petName}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(post.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleFollow(post.petId)}
                      variant="outline"
                      size="sm"
                    >
                      {user && profiles.find(p => p.id === post.petId)?.followers.includes(user.id) ? (
                        <><UserMinus className="h-4 w-4 mr-1" />Unfollow</>
                      ) : (
                        <><UserPlus className="h-4 w-4 mr-1" />Follow</>
                      )}
                    </Button>
                    <Button
                      onClick={() => {
                        const profile = profiles.find(p => p.id === post.petId);
                        if (profile) openChat(profile);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Message
                    </Button>
                  </div>
                </div>

                {post.type === 'image' ? (
                  <img
                    src={post.content}
                    alt="Post content"
                    className="w-full h-96 object-cover cursor-pointer"
                    onClick={() => openPostViewer(post)}
                  />
                ) : (
                  <video
                    ref={el => { if (el) videoRefs.current[post.id] = el; }}
                    src={post.content}
                    className="w-full h-96 object-cover cursor-pointer"
                    controls
                    onClick={() => openPostViewer(post)}
                  />
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-1 ${
                          user && post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-600'
                        }`}
                      >
                        <Heart className={`h-5 w-5 ${user && post.likes.includes(user.id) ? 'fill-current' : ''}`} />
                        <span>{post.likes.length}</span>
                      </button>
                      <button
                        onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)}
                        className="flex items-center space-x-1 text-gray-600"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span>{post.comments.length}</span>
                      </button>
                      <button 
                        onClick={() => handleShare(post)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                      >
                        <Share className="h-5 w-5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-900 mb-2">{post.caption}</p>

                  {post.comments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="text-sm">
                          <span className="font-semibold">{comment.username}</span>{' '}
                          <span className="text-gray-700">{comment.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {commentingOn === post.id && (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                      />
                      <Button onClick={() => handleComment(post.id)} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="overflow-hidden">
                <div className="p-6 text-center">
                  <img
                    src={profile.profilePhoto}
                    alt={profile.petName}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-emerald-100"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.petName}</h3>
                  <p className="text-gray-600 mb-2">{profile.breed} • {profile.age}</p>
                  <p className="text-sm text-gray-500 mb-4">Owner: {profile.ownerName}</p>
                  {profile.bio && (
                    <p className="text-sm text-gray-700 mb-4">{profile.bio}</p>
                  )}
                  
                  <div className="flex justify-center space-x-4 mb-4">
                    <div className="text-center">
                      <p className="font-semibold">{posts.filter(p => p.petId === profile.id).length}</p>
                      <p className="text-xs text-gray-600">Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{profile.followers.length}</p>
                      <p className="text-xs text-gray-600">Followers</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold">{profile.following.length}</p>
                      <p className="text-xs text-gray-600">Following</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleFollow(profile.id)}
                      size="sm"
                      className="flex-1"
                    >
                      {user && profile.followers.includes(user.id) ? (
                        <><UserMinus className="h-4 w-4 mr-1" />Unfollow</>
                      ) : (
                        <><UserPlus className="h-4 w-4 mr-1" />Follow</>
                      )}
                    </Button>
                    <Button
                      onClick={() => openChat(profile)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Message
                    </Button>
                  </div>

                  <div className="flex space-x-2 mt-2">
                    <Button
                      onClick={() => openFollowersList(profile)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Followers
                    </Button>
                    <Button
                      onClick={() => openFollowingList(profile)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Following
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedProfile(profile);
                      setActiveTab('feed');
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                  >
                    <Grid className="h-4 w-4 mr-2" />
                    View Posts
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Create Profile Modal */}
        {showCreateProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Create Pet Profile</h3>
              <form onSubmit={handleCreateProfile} className="space-y-4">
                <input
                  type="text"
                  placeholder="Pet Name"
                  value={profileForm.petName}
                  onChange={(e) => setProfileForm({ ...profileForm, petName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Breed"
                  value={profileForm.breed}
                  onChange={(e) => setProfileForm({ ...profileForm, breed: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Age"
                  value={profileForm.age}
                  onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="text"
                  placeholder="Owner Name"
                  value={profileForm.ownerName}
                  onChange={(e) => setProfileForm({ ...profileForm, ownerName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <textarea
                  placeholder="Bio (optional)"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profile')}
                    className="hidden"
                    id="profile-photo"
                  />
                  <label
                    htmlFor="profile-photo"
                    className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Profile Photo
                  </label>
                  {profileForm.profilePhoto && (
                    <img
                      src={profileForm.profilePhoto}
                      alt="Preview"
                      className="w-20 h-20 rounded-full object-cover mx-auto mt-2"
                    />
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">Create Profile</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateProfile(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Story Modal */}
        {showCreateStory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Create Story</h3>
              <form onSubmit={handleCreateStory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post story as</label>
                  <select 
                    value={selectedProfile?.id || ''}
                    onChange={(e) => {
                      const profile = profiles.find(p => p.id === e.target.value);
                      setSelectedProfile(profile || null);
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select a pet profile</option>
                    {profiles.filter(p => JSON.parse(localStorage.getItem('petProfiles') || '[]').some((up: any) => up.id === p.id)).map(profile => (
                      <option key={profile.id} value={profile.id}>{profile.petName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setStoryForm({ ...storyForm, type: 'image' })}
                    className={`flex-1 py-2 px-4 rounded-lg ${storyForm.type === 'image' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setStoryForm({ ...storyForm, type: 'video' })}
                    className={`flex-1 py-2 px-4 rounded-lg ${storyForm.type === 'video' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                  >
                    Video
                  </button>
                </div>
                <div>
                  <input
                    type="file"
                    accept={storyForm.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => handleFileUpload(e, 'story')}
                    className="hidden"
                    id="story-content"
                  />
                  <label
                    htmlFor="story-content"
                    className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {storyForm.type}
                  </label>
                  {storyForm.content && (
                    <div className="mt-2">
                      {storyForm.type === 'image' ? (
                        <img src={storyForm.content} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <video src={storyForm.content} className="w-full h-32 object-cover rounded-lg" controls />
                      )}
                    </div>
                  )}
                </div>
                <textarea
                  placeholder="Add text to your story (optional)..."
                  value={storyForm.text}
                  onChange={(e) => setStoryForm({ ...storyForm, text: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">Share Story</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateStory(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Create New Post</h3>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Post as</label>
                  <select 
                    value={selectedProfile?.id || ''}
                    onChange={(e) => {
                      const profile = profiles.find(p => p.id === e.target.value);
                      setSelectedProfile(profile || null);
                    }}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select a pet profile</option>
                    {profiles.filter(p => JSON.parse(localStorage.getItem('petProfiles') || '[]').some((up: any) => up.id === p.id)).map(profile => (
                      <option key={profile.id} value={profile.id}>{profile.petName}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setPostForm({ ...postForm, type: 'image' })}
                    className={`flex-1 py-2 px-4 rounded-lg ${postForm.type === 'image' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostForm({ ...postForm, type: 'video' })}
                    className={`flex-1 py-2 px-4 rounded-lg ${postForm.type === 'video' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                  >
                    Video
                  </button>
                </div>
                <div>
                  <input
                    type="file"
                    accept={postForm.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => handleFileUpload(e, 'post')}
                    className="hidden"
                    id="post-content"
                  />
                  <label
                    htmlFor="post-content"
                    className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload {postForm.type}
                  </label>
                  {postForm.content && (
                    <div className="mt-2">
                      {postForm.type === 'image' ? (
                        <img src={postForm.content} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <video src={postForm.content} className="w-full h-32 object-cover rounded-lg" controls />
                      )}
                    </div>
                  )}
                </div>
                <textarea
                  placeholder="Write a caption..."
                  value={postForm.caption}
                  onChange={(e) => setPostForm({ ...postForm, caption: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">Share Post</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreatePost(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Story Viewer */}
        {showStoryViewer && currentStory && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <button
              onClick={() => setShowStoryViewer(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            
            <div className="relative w-full max-w-md h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                {currentStory.type === 'image' ? (
                  <img
                    src={currentStory.content}
                    alt="Story"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <video
                    src={currentStory.content}
                    className="max-w-full max-h-full object-contain"
                    autoPlay
                    onEnded={nextStory}
                  />
                )}
              </div>
              
              <div className="absolute top-4 left-4 flex items-center space-x-3 text-white">
                <img
                  src={currentStory.profilePhoto}
                  alt={currentStory.petName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{currentStory.petName}</p>
                  <p className="text-sm opacity-75">
                    {new Date(currentStory.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              
              {currentStory.text && (
                <div className="absolute bottom-20 left-4 right-4 text-white">
                  <div className="bg-black/50 rounded-lg p-3">
                    <p className="text-sm">{currentStory.text}</p>
                  </div>
                </div>
              )}
              
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex space-x-1 mb-4">
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-1 rounded-full ${
                        index <= currentStoryIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
              >
                →
              </button>
            </div>
          </div>
        )}

        {/* Post Viewer Modal */}
        {showPostViewer && selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedPost.profilePhoto}
                    alt={selectedPost.petName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{selectedPost.petName}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedPost.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostViewer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {selectedPost.type === 'image' ? (
                <img
                  src={selectedPost.content}
                  alt="Post content"
                  className="w-full max-h-96 object-cover"
                />
              ) : (
                <video
                  src={selectedPost.content}
                  className="w-full max-h-96 object-cover"
                  controls
                />
              )}
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(selectedPost.id)}
                      className={`flex items-center space-x-1 ${user && selectedPost.likes.includes(user.id) ? 'text-red-500' : 'text-gray-600'}`}
                    >
                      <Heart className={`h-5 w-5 ${user && selectedPost.likes.includes(user.id) ? 'fill-current' : ''}`} />
                      <span>{selectedPost.likes.length}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-600">
                      <MessageCircle className="h-5 w-5" />
                      <span>{selectedPost.comments.length}</span>
                    </button>
                    <button 
                      onClick={() => handleShare(selectedPost)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
                    >
                      <Share className="h-5 w-5" />
                      <span>{selectedPost.shares}</span>
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-900 mb-4">{selectedPost.caption}</p>
                
                {selectedPost.comments.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {selectedPost.comments.map((comment) => (
                      <div key={comment.id} className="text-sm">
                        <span className="font-semibold">{comment.username}</span>{' '}
                        <span className="text-gray-700">{comment.content}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment(selectedPost.id)}
                  />
                  <Button onClick={() => handleComment(selectedPost.id)} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Followers List Modal */}
        {showFollowersList && listProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Followers</h3>
                <button
                  onClick={() => setShowFollowersList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {listProfile.followers.map((followerId) => {
                  const followerProfile = profiles.find(p => p.id === followerId);
                  return followerProfile ? (
                    <div key={followerId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={followerProfile.profilePhoto}
                          alt={followerProfile.petName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{followerProfile.petName}</p>
                          <p className="text-sm text-gray-600">{followerProfile.breed}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => openChat(followerProfile)}
                        variant="outline"
                        size="sm"
                      >
                        Message
                      </Button>
                    </div>
                  ) : null;
                })}
                {listProfile.followers.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No followers yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Following List Modal */}
        {showFollowingList && listProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Following</h3>
                <button
                  onClick={() => setShowFollowingList(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {listProfile.following.map((followingId) => {
                  const followingProfile = profiles.find(p => p.id === followingId);
                  return followingProfile ? (
                    <div key={followingId} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={followingProfile.profilePhoto}
                          alt={followingProfile.petName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{followingProfile.petName}</p>
                          <p className="text-sm text-gray-600">{followingProfile.breed}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => openChat(followingProfile)}
                        variant="outline"
                        size="sm"
                      >
                        Message
                      </Button>
                    </div>
                  ) : null;
                })}
                {listProfile.following.length === 0 && (
                  <p className="text-gray-500 text-center py-4">Not following anyone yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Chat Screen */}
        {showChat && chatPartner && (
          <ChatScreen
            session={{
              id: chatPartner.id,
              name: chatPartner.petName,
              image: chatPartner.profilePhoto,
              isOnline: Math.random() > 0.5,
              lastSeen: new Date(Date.now() - Math.random() * 3600000),
              messages: JSON.parse(localStorage.getItem('petStoriesChats') || '[]').find((s: any) => s.petId === chatPartner.id)?.messages || [],
              type: 'shop'
            }}
            onClose={() => {
              setShowChat(false);
              setChatPartner(null);
            }}
          />
        )}
        
        {/* Click outside to close notifications */}
        {showNotifications && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
        )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PetStories;