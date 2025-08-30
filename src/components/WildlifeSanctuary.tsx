import React, { useState, useEffect } from 'react';
import { Search, Filter, Heart, Share2, MapPin, Globe, Clock, DollarSign, Users, Camera, Video, Hash, Send, Bookmark, MessageCircle, MoreVertical, Plus, Eye, Star, Map, Bell, Home, Compass, User, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

interface Sanctuary {
  id: string;
  name: string;
  location: string;
  country: string;
  region: string;
  area: string;
  type: string;
  species: string[];
  timings: string;
  entryFee: string;
  website: string;
  coordinates: { lat: number; lng: number };
  image: string;
  description: string;
}

interface WildlifePost {
  id: string;
  sanctuaryId: string;
  sanctuaryName: string;
  sanctuaryAvatar: string;
  content: string;
  media: string;
  mediaType: 'image' | 'video';
  hashtags: string[];
  location: string;
  timestamp: string;
  likes: string[];
  comments: Comment[];
  saves: string[];
  isStory: boolean;
  storyExpiry?: string;
}

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

interface SanctuaryProfile {
  id: string;
  name: string;
  location: string;
  avatar: string;
  about: string;
  followers: string[];
  posts: WildlifePost[];
  verified: boolean;
}

const WildlifeSanctuary: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'explorer' | 'stories'>('explorer');
  const [sanctuaries, setSanctuaries] = useState<Sanctuary[]>([]);
  const [posts, setPosts] = useState<WildlifePost[]>([]);
  const [profiles, setProfiles] = useState<SanctuaryProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [regionSuggestions, setRegionSuggestions] = useState<string[]>([]);
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [apiCache, setApiCache] = useState<{[key: string]: Sanctuary[]}>({});
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<WildlifePost | null>(null);
  const [wildlifeAccount, setWildlifeAccount] = useState<SanctuaryProfile | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showCommentInput, setShowCommentInput] = useState<string | null>(null);
  const [viewingStory, setViewingStory] = useState<WildlifePost | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [storyProgress, setStoryProgress] = useState(0);
  const [showStoryComment, setShowStoryComment] = useState(false);
  const [storyComment, setStoryComment] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [accountForm, setAccountForm] = useState({
    name: '',
    type: 'Wildlife Sanctuary',
    location: '',
    about: '',
    website: '',
    avatar: ''
  });
  const [newPost, setNewPost] = useState({
    content: '',
    media: '',
    mediaType: 'image' as 'image' | 'video',
    hashtags: '',
    location: '',
    isStory: false
  });

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Bulgaria',
    'Cambodia', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Czech Republic',
    'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
    'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg', 'Madagascar', 'Malaysia',
    'Mexico', 'Mongolia', 'Morocco', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand', 'Norway', 'Pakistan',
    'Peru', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia',
    'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Tanzania', 'Thailand',
    'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Venezuela',
    'Vietnam', 'Zambia', 'Zimbabwe'
  ];
  const sanctuaryTypes = [
    'National Park', 'Tiger Reserve', 'Bird Sanctuary', 'Marine Reserve', 'Wildlife Sanctuary', 'Biosphere Reserve',
    'Nature Reserve', 'Game Reserve', 'Conservation Area', 'Protected Area', 'World Heritage Site', 'Ramsar Site',
    'Elephant Reserve', 'Rhino Sanctuary', 'Primate Sanctuary', 'Wetland Reserve', 'Forest Reserve', 'Marine Park'
  ];

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('sanctuaryFavorites') || '[]');
    const savedFollowing = JSON.parse(localStorage.getItem('wildlifeFollowing') || '[]');
    const savedPosts = JSON.parse(localStorage.getItem('wildlifePosts') || '[]');
    const savedProfiles = JSON.parse(localStorage.getItem('wildlifeProfiles') || '[]');
    const savedAccount = JSON.parse(localStorage.getItem('wildlifeAccount') || 'null');
    
    setFavorites(savedFavorites);
    setFollowing(savedFollowing);
    setPosts(savedPosts.length > 0 ? savedPosts : dummyPosts);
    setProfiles(savedProfiles.length > 0 ? savedProfiles : dummyProfiles);
    setWildlifeAccount(savedAccount);
    
    if (savedPosts.length === 0) {
      localStorage.setItem('wildlifePosts', JSON.stringify(dummyPosts));
    }
    if (savedProfiles.length === 0) {
      localStorage.setItem('wildlifeProfiles', JSON.stringify(dummyProfiles));
    }
  }, []);

  const dummyProfiles: SanctuaryProfile[] = [
    {
      id: 'bandipur',
      name: 'Bandipur National Park',
      location: 'Karnataka, India',
      avatar: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400',
      about: 'Premier tiger reserve in South India, home to diverse wildlife including tigers, elephants, and leopards.',
      followers: ['user1', 'user2'],
      posts: [],
      verified: true
    },
    {
      id: 'kaziranga',
      name: 'Kaziranga National Park',
      location: 'Assam, India',
      avatar: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=400',
      about: 'UNESCO World Heritage Site famous for one-horned rhinoceros and diverse bird species.',
      followers: ['user1'],
      posts: [],
      verified: true
    }
  ];

  const dummyPosts: WildlifePost[] = [
    {
      id: '1',
      sanctuaryId: 'bandipur',
      sanctuaryName: 'Bandipur National Park',
      sanctuaryAvatar: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'Exciting news! A new tiger cub was spotted with its mother during our morning patrol. This brings our tiger count to 173! 🐅',
      media: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=600',
      mediaType: 'image',
      hashtags: ['TigerConservation', 'WildlifeIndia', 'BandipurTigers'],
      location: 'Bandipur National Park, Karnataka',
      timestamp: '2025-01-15T08:30:00',
      likes: ['user1', 'user2', 'user3'],
      comments: [
        {
          id: 'c1',
          userId: 'user1',
          userName: 'Wildlife Lover',
          userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'Amazing! Great work on conservation efforts! 🙌',
          timestamp: '2025-01-15T09:00:00'
        },
        {
          id: 'c2',
          userId: 'user2',
          userName: 'Nature Explorer',
          userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'This is incredible! How old is the cub?',
          timestamp: '2025-01-15T10:15:00'
        }
      ],
      saves: ['user1', 'user4'],
      isStory: false
    },
    {
      id: '2',
      sanctuaryId: 'kaziranga',
      sanctuaryName: 'Kaziranga National Park',
      sanctuaryAvatar: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'Successful anti-poaching operation completed. Our rhino population remains safe thanks to dedicated forest guards. 🦏',
      media: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg?auto=compress&cs=tinysrgb&w=600',
      mediaType: 'image',
      hashtags: ['RhinoConservation', 'AntiPoaching', 'KazirangaRhinos'],
      location: 'Kaziranga National Park, Assam',
      timestamp: '2025-01-14T16:45:00',
      likes: ['user2', 'user5'],
      comments: [
        {
          id: 'c3',
          userId: 'user5',
          userName: 'Conservation Hero',
          userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'Thank you for protecting these magnificent creatures! 💪',
          timestamp: '2025-01-14T17:00:00'
        }
      ],
      saves: ['user2'],
      isStory: false
    },
    {
      id: '3',
      sanctuaryId: 'ranthambore',
      sanctuaryName: 'Ranthambore National Park',
      sanctuaryAvatar: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'Watch our majestic tigress Machli\'s legacy continue! Her descendants roam these ancient forests with pride. 🐯',
      media: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      mediaType: 'video',
      hashtags: ['RanthamboreRoyalty', 'TigerDynasty', 'WildlifeHeritage'],
      location: 'Ranthambore National Park, Rajasthan',
      timestamp: '2025-01-13T14:20:00',
      likes: ['user1', 'user3', 'user4', 'user6'],
      comments: [
        {
          id: 'c4',
          userId: 'user6',
          userName: 'Tiger Enthusiast',
          userAvatar: 'https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'Machli was truly the queen of Ranthambore! Beautiful video 👑',
          timestamp: '2025-01-13T15:30:00'
        }
      ],
      saves: ['user3', 'user6'],
      isStory: false
    },
    {
      id: '4',
      sanctuaryId: 'periyar',
      sanctuaryName: 'Periyar Elephant Sanctuary',
      sanctuaryAvatar: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'Morning bath time for our gentle giants! 🐘 These rescued elephants are living their best life in our sanctuary.',
      media: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=600',
      mediaType: 'image',
      hashtags: ['ElephantRescue', 'GentleGiants', 'PeriyarSanctuary'],
      location: 'Periyar Wildlife Sanctuary, Kerala',
      timestamp: '2025-01-12T07:45:00',
      likes: ['user2', 'user4', 'user7'],
      comments: [
        {
          id: 'c5',
          userId: 'user7',
          userName: 'Elephant Lover',
          userAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'They look so happy and healthy! Thank you for your amazing work 🙏',
          timestamp: '2025-01-12T08:00:00'
        }
      ],
      saves: ['user4'],
      isStory: false
    },
    {
      id: '5',
      sanctuaryId: 'amazon',
      sanctuaryName: 'Amazon Rainforest Conservancy',
      sanctuaryAvatar: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'Incredible biodiversity captured in 4K! Over 400 bird species call this section of rainforest home. 🦜🌿',
      media: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      mediaType: 'video',
      hashtags: ['AmazonBiodiversity', 'RainforestConservation', 'BirdWatching'],
      location: 'Amazon Rainforest, Brazil',
      timestamp: '2025-01-11T12:30:00',
      likes: ['user1', 'user5', 'user8', 'user9'],
      comments: [
        {
          id: 'c6',
          userId: 'user8',
          userName: 'Rainforest Guardian',
          userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'The sounds of the rainforest are so peaceful! Nature\'s symphony 🎵',
          timestamp: '2025-01-11T13:00:00'
        },
        {
          id: 'c7',
          userId: 'user9',
          userName: 'Eco Warrior',
          userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'We must protect these precious ecosystems for future generations! 🌍',
          timestamp: '2025-01-11T14:15:00'
        }
      ],
      saves: ['user5', 'user8'],
      isStory: false
    },
    {
      id: '6',
      sanctuaryId: 'sundarbans',
      sanctuaryName: 'Sundarbans Tiger Reserve',
      sanctuaryAvatar: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=400',
      content: 'Swimming tigers of Sundarbans! These magnificent cats are excellent swimmers, adapting perfectly to mangrove life. 🐅🌊',
      media: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=600',
      mediaType: 'image',
      hashtags: ['SundarbansTigers', 'MangroveEcosystem', 'SwimmingTigers'],
      location: 'Sundarbans National Park, West Bengal',
      timestamp: '2025-01-10T16:00:00',
      likes: ['user3', 'user6', 'user10'],
      comments: [
        {
          id: 'c8',
          userId: 'user10',
          userName: 'Mangrove Explorer',
          userAvatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400',
          content: 'Absolutely fascinating! I had no idea tigers could swim so well 🏊‍♂️',
          timestamp: '2025-01-10T16:30:00'
        }
      ],
      saves: ['user6', 'user10'],
      isStory: false
    }
  ];

  const fetchSanctuaries = async () => {
    setLoading(true);
    
    // Create cache key
    const cacheKey = `${selectedCountry}-${selectedRegion}-${selectedType}`;
    
    // Check cache first
    if (apiCache[cacheKey]) {
      setSanctuaries(apiCache[cacheKey]);
      setLoading(false);
      return;
    }

    try {
      const locationFilter = selectedCountry ? 
        (selectedRegion ? `in ${selectedRegion}, ${selectedCountry}` : `in ${selectedCountry}`) : 
        'worldwide';
      
      const typeFilter = selectedType ? `of type "${selectedType}"` : '';
      
      const prompt = `List 12 real wildlife sanctuaries ${locationFilter} ${typeFilter}. For each sanctuary, provide ONLY a valid JSON object with these exact fields:
      {
        "name": "exact sanctuary name",
        "location": "city/area, state/region, country",
        "country": "country name",
        "region": "state/province/region",
        "area": "number only (sq km)",
        "type": "sanctuary type",
        "species": ["animal1", "animal2", "animal3"],
        "timings": "opening hours",
        "entryFee": "fee information",
        "website": "official website URL or 'Not available'",
        "coordinates": {"lat": number, "lng": number},
        "description": "brief description"
      }
      
      Return ONLY a valid JSON array of these objects, no markdown, no explanations, no extra text.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeGrdNlhxR_7UrxU0Lqyb8kUNo7-6uKIk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 4000
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        let responseText = data.candidates[0].content.parts[0].text.trim();
        
        // Clean up response text
        responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        try {
          const sanctuaryData = JSON.parse(responseText);
          
          if (Array.isArray(sanctuaryData) && sanctuaryData.length > 0) {
            const processedSanctuaries = sanctuaryData.map((sanctuary: any, index: number) => ({
              ...sanctuary,
              id: `sanctuary_${Date.now()}_${index}`,
              species: Array.isArray(sanctuary.species) ? sanctuary.species : [],
              area: sanctuary.area?.toString() || '0'
            }));
            
            // Cache the results
            setApiCache(prev => ({ ...prev, [cacheKey]: processedSanctuaries }));
            setSanctuaries(processedSanctuaries);
          } else {
            setSanctuaries([]);
          }
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError, 'Response:', responseText);
          setSanctuaries([]);
        }
      } else {
        setSanctuaries([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setSanctuaries([]);
    }
    setLoading(false);
  };

  const fetchRegionSuggestions = async (query: string) => {
    if (query.length < 2) {
      setRegionSuggestions([]);
      return;
    }

    try {
      const prompt = `List 8 real regions/states/provinces that match "${query}" ${selectedCountry ? `in ${selectedCountry}` : 'worldwide'}. Return only region names, one per line, no explanations.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeGrdNlhxR_7UrxU0Lqyb8kUNo7-6uKIk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 200
          }
        })
      });

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        const suggestions = data.candidates[0].content.parts[0].text
          .split('\n')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0)
          .slice(0, 8);
        
        setRegionSuggestions(suggestions);
      }
    } catch (error) {
      console.error('Region suggestions error:', error);
    }
  };

  useEffect(() => {
    fetchSanctuaries();
  }, [selectedCountry, selectedRegion, selectedType]);

  // Generate animated stars
  useEffect(() => {
    const createStars = () => {
      const container = document.querySelector('.starry-background');
      if (!container) return;
      
      container.innerHTML = '';
      
      for (let i = 0; i < 2500; i++) {
        const star = document.createElement('div');
        const size = Math.random();
        if (size > 0.9) {
          star.className = 'star large';
        } else if (size > 0.7) {
          star.className = 'star medium';
        } else {
          star.className = 'star';
        }
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(star);
      }
    };
    
    createStars();
    
    const interval = setInterval(createStars, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (sanctuaryId: string) => {
    const newFavorites = favorites.includes(sanctuaryId)
      ? favorites.filter(id => id !== sanctuaryId)
      : [...favorites, sanctuaryId];
    setFavorites(newFavorites);
    localStorage.setItem('sanctuaryFavorites', JSON.stringify(newFavorites));
  };

  const toggleFollow = (profileId: string) => {
    const newFollowing = following.includes(profileId)
      ? following.filter(id => id !== profileId)
      : [...following, profileId];
    setFollowing(newFollowing);
    localStorage.setItem('wildlifeFollowing', JSON.stringify(newFollowing));
  };

  const shareContent = (content: string, type: 'sanctuary' | 'post') => {
    const shareText = type === 'sanctuary' 
      ? `Check out ${content} wildlife sanctuary! 🌿\n\nExplore amazing wildlife and conservation efforts.\n\n${window.location.origin}/wildlife-sanctuary`
      : `Amazing wildlife update: "${content}"\n\nSee more wildlife stories at ${window.location.origin}/wildlife-sanctuary`;

    if (navigator.share) {
      navigator.share({
        title: type === 'sanctuary' ? `${content} Wildlife Sanctuary` : 'Wildlife Update',
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

  const likePost = (postId: string) => {
    if (!wildlifeAccount) {
      toast.error('Please create an account to like posts');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(wildlifeAccount.id)
          ? post.likes.filter(id => id !== wildlifeAccount.id)
          : [...post.likes, wildlifeAccount.id];
        return { ...post, likes };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
  };

  const savePost = (postId: string) => {
    if (!wildlifeAccount) {
      toast.error('Please create an account to save posts');
      return;
    }

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const saves = post.saves.includes(wildlifeAccount.id)
          ? post.saves.filter(id => id !== wildlifeAccount.id)
          : [...post.saves, wildlifeAccount.id];
        return { ...post, saves };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
  };

  const createAccount = () => {
    if (!accountForm.name.trim()) {
      toast.error('Please enter sanctuary name');
      return;
    }

    const account: SanctuaryProfile = {
      id: Date.now().toString(),
      name: accountForm.name,
      location: accountForm.location,
      avatar: accountForm.avatar || 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=400',
      about: accountForm.about,
      followers: [],
      posts: [],
      verified: true
    };

    setWildlifeAccount(account);
    localStorage.setItem('wildlifeAccount', JSON.stringify(account));
    setAccountForm({ name: '', type: 'Wildlife Sanctuary', location: '', about: '', website: '', avatar: '' });
    setShowCreateAccount(false);
    toast.success('Wildlife account created successfully!');
  };

  const editPost = (post: WildlifePost) => {
    setSelectedPost(post);
    setNewPost({
      content: post.content,
      media: post.media,
      mediaType: post.mediaType,
      hashtags: post.hashtags.join(', '),
      location: post.location,
      isStory: post.isStory
    });
    setShowEditPost(true);
  };

  const updatePost = () => {
    if (!selectedPost) return;

    const updatedPosts = posts.map(post => {
      if (post.id === selectedPost.id) {
        return {
          ...post,
          content: newPost.content,
          hashtags: newPost.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
          location: newPost.location
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
    setShowEditPost(false);
    setSelectedPost(null);
    setNewPost({ content: '', media: '', mediaType: 'image', hashtags: '', location: '', isStory: false });
    toast.success('Post updated successfully!');
  };

  const deletePost = (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
      toast.success('Post deleted successfully!');
    }
  };

  const createPost = () => {
    if (!wildlifeAccount) {
      toast.error('Please create a wildlife account first');
      return;
    }

    if (!newPost.content.trim()) {
      toast.error('Please add a caption');
      return;
    }

    if (!newPost.media) {
      toast.error('Please add an image or video');
      return;
    }

    const post: WildlifePost = {
      id: Date.now().toString(),
      sanctuaryId: wildlifeAccount.id,
      sanctuaryName: wildlifeAccount.name,
      sanctuaryAvatar: wildlifeAccount.avatar,
      content: newPost.content,
      media: newPost.media,
      mediaType: newPost.mediaType,
      hashtags: newPost.hashtags.split(',').map(tag => tag.trim()).filter(tag => tag),
      location: newPost.location,
      timestamp: new Date().toISOString(),
      likes: [],
      comments: [],
      saves: [],
      isStory: newPost.isStory,
      storyExpiry: newPost.isStory ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined
    };

    const updatedPosts = [post, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
    
    setNewPost({ content: '', media: '', mediaType: 'image', hashtags: '', location: '', isStory: false });
    setShowCreatePost(false);
    toast.success('Post created successfully!');
  };

  const addComment = (postId: string) => {
    if (!wildlifeAccount) {
      toast.error('Please create an account to comment');
      return;
    }
    
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      userId: wildlifeAccount.id,
      userName: wildlifeAccount.name,
      userAvatar: wildlifeAccount.avatar,
      content: newComment.trim(),
      timestamp: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        return { ...post, comments: [...post.comments, comment] };
      }
      return post;
    });

    setPosts(updatedPosts);
    localStorage.setItem('wildlifePosts', JSON.stringify(updatedPosts));
    setNewComment('');
    setShowCommentInput(null);
    
    if (storyComment) {
      setStoryComment('');
    }
  };

  const filteredSanctuaries = sanctuaries.filter(sanctuary => {
    const matchesSearch = !searchTerm || 
      sanctuary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sanctuary.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'area') return parseInt(b.area) - parseInt(a.area);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch && !post.isStory;
  });

  const stories = posts.filter(post => post.isStory && post.storyExpiry && new Date(post.storyExpiry) > new Date());

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');
        
        .wildlife-container {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .starry-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 0;
        }
        
        .wildlife-container > * {
          position: relative;
          z-index: 1;
        }
        
        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
          width: 1px;
          height: 1px;
          box-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
          animation: twinkle 2s infinite;
        }
        
        .star.medium {
          width: 2px;
          height: 2px;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.9);
          animation: twinkle 2.5s infinite;
        }
        
        .star.large {
          width: 3px;
          height: 3px;
          box-shadow: 0 0 6px rgba(255, 255, 255, 1);
          animation: twinkle 3s infinite;
        }
        
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.2;
            transform: scale(0.8);
          }
          25% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.2);
          }
          75% {
            opacity: 0.6;
            transform: scale(1);
          }
        }
        
        .wildlife-heading {
          font-family: 'Poppins', sans-serif;
          font-weight: 900;
          font-size: 3.5rem;
          text-align: center;
          background: linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #4ecdc4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
          margin-bottom: 1rem;
          position: relative;
          z-index: 2;
          letter-spacing: 1px;
        }
        
        .wildlife-subtext {
          font-family: 'Poppins', sans-serif;
          font-size: 1.25rem;
          color: #e0e6ed;
          text-align: center;
          max-width: 48rem;
          margin: 0 auto 2rem;
          line-height: 1.6;
          position: relative;
          z-index: 2;
          font-weight: 700;
        }
        
        .search-btn {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .search-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
          background: linear-gradient(135deg, #ee5a24 0%, #d63031 100%);
        }
        
        .website-btn {
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-family: 'Poppins', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
        }
        
        .website-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 25px rgba(0, 184, 148, 0.4);
          background: linear-gradient(135deg, #00a085 0%, #00896b 100%);
        }
        
        .location-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #ffd700;
          border-radius: 12px;
          color: #ffd700;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
        
        .location-btn:hover {
          background: #ffd700;
          color: #1a1a2e;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
        }
        
        .favorite-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #ff6b6b;
          border-radius: 12px;
          color: #ff6b6b;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
        
        .favorite-btn:hover {
          background: #ff6b6b;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
        }
        
        .favorite-btn.active {
          background: #ff6b6b;
          color: white;
        }
        
        .share-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid #4ecdc4;
          border-radius: 12px;
          color: #4ecdc4;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(10px);
        }
        
        .share-btn:hover {
          background: #4ecdc4;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(78, 205, 196, 0.3);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .star { animation: none; }
        }
      `}</style>
      
      <div className="wildlife-container pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="starry-background"></div>
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="wildlife-heading">
            🌿 Wildlife Sanctuaries
          </h1>
          <p className="wildlife-subtext">
            Explore wildlife sanctuaries worldwide and follow their conservation stories
          </p>
        </div>

        {/* Section Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg">
            <button
              onClick={() => setActiveSection('explorer')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'explorer'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              🏞 Sanctuaries Explorer
            </button>
            <button
              onClick={() => setActiveSection('stories')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                activeSection === 'stories'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              📸 Wildlife Stories
            </button>
          </div>
        </div>

        {activeSection === 'explorer' ? (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search sanctuaries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedRegion('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Type region/state..."
                    value={selectedRegion}
                    onChange={(e) => {
                      setSelectedRegion(e.target.value);
                      fetchRegionSuggestions(e.target.value);
                      setShowRegionSuggestions(true);
                    }}
                    onFocus={() => setShowRegionSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowRegionSuggestions(false), 200)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {showRegionSuggestions && regionSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                      {regionSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedRegion(suggestion);
                            setShowRegionSuggestions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">All Types</option>
                  {sanctuaryTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="area">Sort by Area</option>
                </select>
              </div>
            </div>

            {/* Sanctuaries Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Fetching real sanctuary data...</p>
              </div>
            ) : filteredSanctuaries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                <div className="text-6xl mb-4">🏞️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No sanctuaries found in this region
                </h3>
                <p className="text-gray-600 mb-4">
                  Try searching for a different region or nearby area.
                  {selectedCountry && ` Consider exploring other regions in ${selectedCountry}.`}
                </p>
                <Button
                  onClick={() => {
                    setSelectedCountry('');
                    setSelectedRegion('');
                    setSelectedType('');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSanctuaries.map((sanctuary) => (
                  <Card key={sanctuary.id} className="hover:shadow-lg transition-shadow border border-gray-200 rounded-xl">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{sanctuary.name}</h3>
                          <Badge variant="info" className="mb-3">{sanctuary.type}</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleFavorite(sanctuary.id)}
                            className={`favorite-btn p-2 ${
                              favorites.includes(sanctuary.id) ? 'active' : ''
                            }`}
                          >
                            <Heart className="h-4 w-4" fill={favorites.includes(sanctuary.id) ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={() => shareContent(sanctuary.name, 'sanctuary')}
                            className="share-btn p-2"
                          >
                            <Share2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{sanctuary.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-4 w-4 mr-2" />
                          <span className="text-sm">{sanctuary.area} sq km</span>
                        </div>
                        {sanctuary.timings && sanctuary.timings !== 'Not available' && (
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="text-sm">{sanctuary.timings}</span>
                          </div>
                        )}
                        {sanctuary.entryFee && sanctuary.entryFee !== 'Not available' && (
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span className="text-sm">{sanctuary.entryFee}</span>
                          </div>
                        )}
                      </div>

                      {sanctuary.species && sanctuary.species.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Notable Species:</h4>
                          <div className="flex flex-wrap gap-1">
                            {sanctuary.species.slice(0, 4).map((species, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {species}
                              </Badge>
                            ))}
                            {sanctuary.species.length > 4 && (
                              <Badge variant="secondary" className="text-xs">
                                +{sanctuary.species.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        {sanctuary.website && sanctuary.website !== 'Not available' ? (
                          <button
                            onClick={() => window.open(sanctuary.website.startsWith('http') ? sanctuary.website : `https://${sanctuary.website}`, '_blank')}
                            className="website-btn flex-1 px-4 py-2 text-sm"
                          >
                            Visit Website
                          </button>
                        ) : (
                          <button
                            onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(sanctuary.name + ' official website')}`, '_blank')}
                            className="search-btn flex-1 px-4 py-2 text-sm"
                          >
                            Search Online
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const query = sanctuary.coordinates?.lat && sanctuary.coordinates?.lng 
                              ? `${sanctuary.coordinates.lat},${sanctuary.coordinates.lng}`
                              : encodeURIComponent(sanctuary.name + ' ' + sanctuary.location);
                            window.open(`https://maps.google.com/?q=${query}`, '_blank');
                          }}
                          className="location-btn p-2"
                        >
                          <Map className="h-4 w-4" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Instagram-style Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40 mb-6">
              <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold text-gray-900">🌿 Wildlife Stories</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search sanctuaries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 w-64"
                    />
                  </div>
                  <button className="p-2 text-gray-600 hover:text-emerald-600">
                    <Bell className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => setShowCreatePost(true)}
                    className="p-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowProfile(true)}
                    className="p-2 text-gray-600 hover:text-emerald-600"
                  >
                    <User className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Stories Section */}
            <div className="mb-8">

              {/* Stories Bar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {/* Add Story Button */}
                  <div className="flex-shrink-0 text-center">
                    <button
                      onClick={() => {
                        setNewPost({ ...newPost, isStory: true });
                        setShowCreatePost(true);
                      }}
                      className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-emerald-500 transition-colors"
                    >
                      <Plus className="h-6 w-6 text-gray-400" />
                    </button>
                    <p className="text-xs text-center mt-1 w-16 truncate text-gray-600">Your Story</p>
                  </div>
                  
                  {/* Stories */}
                  {stories.map((story, index) => (
                    <div key={story.id} className="flex-shrink-0 text-center cursor-pointer" onClick={() => {
                      setViewingStory(story);
                      setCurrentStoryIndex(index);
                      setStoryProgress(0);
                    }}>
                      <div className="w-16 h-16 rounded-full border-4 border-emerald-500 p-1 hover:border-emerald-600 transition-colors">
                        <img
                          src={story.sanctuaryAvatar}
                          alt={story.sanctuaryName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <p className="text-xs text-center mt-1 w-16 truncate text-gray-700">{story.sanctuaryName}</p>
                    </div>
                  ))}
                </div>
              </div>



              {/* Posts Feed */}
              <div className="space-y-8">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Post Header */}
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={post.sanctuaryAvatar}
                          alt={post.sanctuaryName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900">{post.sanctuaryName}</h4>
                            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            <Badge variant="success" className="text-xs px-2 py-0.5">✓</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{post.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleFollow(post.sanctuaryId)}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            following.includes(post.sanctuaryId)
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {following.includes(post.sanctuaryId) ? 'Following' : 'Follow'}
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Media */}
                    <div className="relative bg-black">
                      {post.mediaType === 'image' ? (
                        <img
                          src={post.media}
                          alt="Post content"
                          className="w-full h-96 object-contain"
                        />
                      ) : (
                        <video
                          src={post.media}
                          className="w-full h-96 object-contain"
                          controls
                        />
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-6">
                          <button
                            onClick={() => likePost(post.id)}
                            className={`flex items-center space-x-2 transition-colors ${
                              wildlifeAccount && post.likes.includes(wildlifeAccount.id) ? 'text-red-500' : 'text-gray-700 hover:text-gray-900'
                            }`}
                          >
                            <Heart 
                              className="h-6 w-6" 
                              fill={wildlifeAccount && post.likes.includes(wildlifeAccount.id) ? 'currentColor' : 'none'}
                              strokeWidth={wildlifeAccount && post.likes.includes(wildlifeAccount.id) ? 0 : 2}
                            />
                          </button>
                          <button 
                            onClick={() => setShowCommentInput(showCommentInput === post.id ? null : post.id)}
                            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            <MessageCircle className="h-6 w-6" strokeWidth={2} />
                          </button>
                          <button
                            onClick={() => shareContent(post.content, 'post')}
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            <Share2 className="h-6 w-6" strokeWidth={2} />
                          </button>
                        </div>
                        <button
                          onClick={() => savePost(post.id)}
                          className={`transition-colors ${
                            wildlifeAccount && post.saves.includes(wildlifeAccount.id) ? 'text-gray-900' : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <Bookmark 
                            className="h-6 w-6" 
                            fill={wildlifeAccount && post.saves.includes(wildlifeAccount.id) ? 'currentColor' : 'none'}
                            strokeWidth={wildlifeAccount && post.saves.includes(wildlifeAccount.id) ? 0 : 2}
                          />
                        </button>
                      </div>

                      {/* Likes Count */}
                      {post.likes.length > 0 && (
                        <p className="font-semibold text-sm text-gray-900 mb-2">
                          {post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}
                        </p>
                      )}

                      {/* Post Content */}
                      <div className="mb-3">
                        <p className="text-gray-900 text-sm">
                          <span className="font-semibold">{post.sanctuaryName}</span> {post.content}
                        </p>
                        {post.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {post.hashtags.map((tag, index) => (
                              <span key={index} className="text-emerald-600 text-sm hover:underline cursor-pointer">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Comments */}
                      {post.comments.length > 0 && (
                        <div className="space-y-2 mb-3">
                          {post.comments.slice(0, 2).map((comment) => (
                            <div key={comment.id} className="text-sm">
                              <span className="font-semibold text-gray-900">{comment.userName}</span>
                              <span className="text-gray-700 ml-2">{comment.content}</span>
                            </div>
                          ))}
                          {post.comments.length > 2 && (
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                              View all {post.comments.length} comments
                            </button>
                          )}
                        </div>
                      )}

                      {/* Timestamp */}
                      <p className="text-gray-400 text-xs uppercase tracking-wide">
                        {new Date(post.timestamp).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        }).toUpperCase()}
                      </p>

                      {/* Add Comment - Only show when comment icon is clicked */}
                      {showCommentInput === post.id && (
                        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                          <img
                            src={wildlifeAccount?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt="Your avatar"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addComment(post.id)}
                            className="flex-1 text-sm border-none outline-none bg-transparent placeholder-gray-500"
                            autoFocus
                          />
                          <button 
                            onClick={() => addComment(post.id)}
                            className="text-emerald-600 text-sm font-semibold hover:text-emerald-700"
                            disabled={!newComment.trim()}
                          >
                            Post
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Wildlife Post</h3>
                <button
                  onClick={() => setShowCreatePost(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ×
                </button>
              </div>

              {!wildlifeAccount ? (
                <div className="text-center py-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Create Account Required</h4>
                  <p className="text-gray-600 mb-4">You need to create a wildlife sanctuary account to post content.</p>
                  <Button 
                    onClick={() => {
                      setShowCreatePost(false);
                      setShowCreateAccount(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Create Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setNewPost({ ...newPost, isStory: false })}
                      className={`flex-1 py-2 px-4 rounded-lg ${!newPost.isStory ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                    >
                      Post
                    </button>
                    <button
                      onClick={() => setNewPost({ ...newPost, isStory: true })}
                      className={`flex-1 py-2 px-4 rounded-lg ${newPost.isStory ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                    >
                      Story (24h)
                    </button>
                  </div>

                  <textarea
                    placeholder="Share your wildlife conservation story..."
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Media Type</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setNewPost({ ...newPost, mediaType: 'image' })}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${newPost.mediaType === 'image' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                      >
                        <Camera className="h-4 w-4" />
                        <span>Image</span>
                      </button>
                      <button
                        onClick={() => setNewPost({ ...newPost, mediaType: 'video' })}
                        className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${newPost.mediaType === 'video' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                      >
                        <Video className="h-4 w-4" />
                        <span>Video</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload {newPost.mediaType === 'image' ? 'Image' : 'Video'}</label>
                    <input
                      type="file"
                      accept={newPost.mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            setNewPost({ ...newPost, media: event.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                    {newPost.media && (
                      <div className="mt-2">
                        {newPost.mediaType === 'image' ? (
                          <img src={newPost.media} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                        ) : (
                          <video src={newPost.media} className="w-full h-32 object-cover rounded-lg" controls />
                        )}
                      </div>
                    )}
                  </div>

                  <input
                    type="text"
                    placeholder="Add hashtags (comma separated)"
                    value={newPost.hashtags}
                    onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />

                  <input
                    type="text"
                    placeholder="Location"
                    value={newPost.location}
                    onChange={(e) => setNewPost({ ...newPost, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />

                  <div className="flex space-x-3">
                    <Button 
                      onClick={createPost} 
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                      disabled={!newPost.content.trim() || !newPost.media}
                    >
                      Share {newPost.isStory ? 'Story' : 'Post'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreatePost(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Navigation (Instagram-style) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
              <div className="max-w-4xl mx-auto px-6 py-3">
                <div className="flex items-center justify-around">
                  <button className="p-2 text-emerald-600">
                    <Home className="h-6 w-6" strokeWidth={2} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Search className="h-6 w-6" strokeWidth={2} />
                  </button>
                  <button 
                    onClick={() => setShowCreatePost(true)}
                    className="p-2 text-gray-600 hover:text-gray-900"
                  >
                    <Plus className="h-6 w-6" strokeWidth={2} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <Heart className="h-6 w-6" strokeWidth={2} />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <User className="h-6 w-6" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom padding for fixed navigation */}
            <div className="h-20"></div>
          </div>
        )}

        {/* Story Viewer Modal */}
        {viewingStory && (
          <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
            <div className="relative w-full h-full max-w-lg mx-auto">
              {/* Progress Bar */}
              <div className="absolute top-4 left-4 right-4 z-20">
                <div className="flex space-x-1">
                  {stories.map((_, index) => (
                    <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className={`h-full bg-white transition-all duration-300 ${
                          index < currentStoryIndex ? 'w-full' : 
                          index === currentStoryIndex ? `w-[${storyProgress}%]` : 'w-0'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => {
                  setViewingStory(null);
                  setShowStoryComment(false);
                  setStoryComment('');
                }}
                className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ×
              </button>

              {/* Navigation Areas */}
              <button
                onClick={() => {
                  if (currentStoryIndex > 0) {
                    const prevStory = stories[currentStoryIndex - 1];
                    setViewingStory(prevStory);
                    setCurrentStoryIndex(currentStoryIndex - 1);
                    setStoryProgress(0);
                  }
                }}
                className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
              />
              <button
                onClick={() => {
                  if (currentStoryIndex < stories.length - 1) {
                    const nextStory = stories[currentStoryIndex + 1];
                    setViewingStory(nextStory);
                    setCurrentStoryIndex(currentStoryIndex + 1);
                    setStoryProgress(0);
                  } else {
                    setViewingStory(null);
                  }
                }}
                className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
              />

              {/* Story Content */}
              <div className="relative w-full h-full flex flex-col">
                {/* Header */}
                <div className="absolute top-16 left-4 right-4 z-20">
                  <div className="flex items-center space-x-3">
                    <img
                      src={viewingStory.sanctuaryAvatar}
                      alt={viewingStory.sanctuaryName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white"
                    />
                    <div>
                      <h4 className="font-semibold text-white text-sm">{viewingStory.sanctuaryName}</h4>
                      <p className="text-gray-300 text-xs">{new Date(viewingStory.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-20">
                  {viewingStory.mediaType === 'image' ? (
                    <img
                      src={viewingStory.media}
                      alt="Story content"
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  ) : (
                    <video
                      src={viewingStory.media}
                      className="max-w-full max-h-full object-contain rounded-lg"
                      controls
                      autoPlay
                    />
                  )}
                </div>

                {/* Caption */}
                {viewingStory.content && (
                  <div className="absolute bottom-20 left-4 right-4 z-20">
                    <div className="bg-black/50 rounded-lg p-3">
                      <p className="text-white text-sm">{viewingStory.content}</p>
                    </div>
                  </div>
                )}

                {/* Controls */}
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          likePost(viewingStory.id);
                          // Update the viewing story state to reflect the like
                          const updatedStory = { ...viewingStory };
                          if (wildlifeAccount) {
                            if (updatedStory.likes.includes(wildlifeAccount.id)) {
                              updatedStory.likes = updatedStory.likes.filter(id => id !== wildlifeAccount.id);
                            } else {
                              updatedStory.likes = [...updatedStory.likes, wildlifeAccount.id];
                            }
                            setViewingStory(updatedStory);
                          }
                        }}
                        className={`p-2 rounded-full transition-colors ${
                          wildlifeAccount && viewingStory.likes.includes(wildlifeAccount.id) 
                            ? 'text-red-500' : 'text-white hover:text-red-400'
                        }`}
                      >
                        <Heart className="h-6 w-6" fill={wildlifeAccount && viewingStory.likes.includes(wildlifeAccount.id) ? 'currentColor' : 'none'} />
                      </button>
                      <button
                        onClick={() => setShowStoryComment(!showStoryComment)}
                        className="p-2 text-white hover:text-gray-300 transition-colors"
                      >
                        <MessageCircle className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => shareContent(viewingStory.content, 'post')}
                        className="p-2 text-white hover:text-gray-300 transition-colors"
                      >
                        <Send className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="text-white text-sm">
                      {viewingStory.likes.length} {viewingStory.likes.length === 1 ? 'like' : 'likes'}
                    </div>
                  </div>

                  {/* Comment Input */}
                  {showStoryComment && (
                    <div className="mt-3 flex items-center space-x-2">
                      <img
                        src={wildlifeAccount?.avatar || 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt="Your avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <input
                        type="text"
                        placeholder="Reply to story..."
                        value={storyComment}
                        onChange={(e) => setStoryComment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && storyComment.trim()) {
                            addComment(viewingStory.id);
                            setStoryComment('');
                            setShowStoryComment(false);
                          }
                        }}
                        className="flex-1 bg-white/20 text-white placeholder-gray-300 px-3 py-2 rounded-full border border-white/30 focus:outline-none focus:border-white/50"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          if (storyComment.trim()) {
                            setNewComment(storyComment);
                            addComment(viewingStory.id);
                            setStoryComment('');
                            setShowStoryComment(false);
                          }
                        }}
                        className="text-emerald-400 font-semibold px-3 py-2"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Create Account Modal */}
        {showCreateAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-md w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Create Wildlife Account</h3>
                <button onClick={() => setShowCreateAccount(false)} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Sanctuary/Organization Name"
                  value={accountForm.name}
                  onChange={(e) => setAccountForm({...accountForm, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setAccountForm({...accountForm, avatar: event.target?.result as string});
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  {accountForm.avatar && (
                    <div className="mt-2">
                      <img src={accountForm.avatar} alt="Profile preview" className="w-16 h-16 rounded-full object-cover" />
                    </div>
                  )}
                </div>
                
                <select
                  value={accountForm.type}
                  onChange={(e) => setAccountForm({...accountForm, type: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Wildlife Sanctuary">Wildlife Sanctuary</option>
                  <option value="National Park">National Park</option>
                  <option value="Biosphere Reserve">Biosphere Reserve</option>
                  <option value="Zoo">Zoo</option>
                  <option value="NGO">Conservation NGO</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Location"
                  value={accountForm.location}
                  onChange={(e) => setAccountForm({...accountForm, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                
                <textarea
                  placeholder="About your organization..."
                  value={accountForm.about}
                  onChange={(e) => setAccountForm({...accountForm, about: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                
                <div className="flex space-x-3">
                  <Button onClick={createAccount} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Create Account
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateAccount(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile Modal */}
        {showProfile && wildlifeAccount && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Wildlife Stories Profile</h2>
                <button onClick={() => setShowProfile(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  ×
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-6">
                    <img src={wildlifeAccount.avatar} alt={wildlifeAccount.name} className="w-20 h-20 rounded-full object-cover" />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{wildlifeAccount.name}</h3>
                      <p className="text-gray-600">{wildlifeAccount.location}</p>
                      <p className="text-sm text-gray-500 mt-2">{wildlifeAccount.about}</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowEditProfile(true)}
                    variant="outline"
                    className="px-4 py-2"
                  >
                    Edit Profile
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{posts.filter(p => p.sanctuaryId === wildlifeAccount.id).length}</div>
                    <div className="text-gray-600">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{wildlifeAccount.followers.length}</div>
                    <div className="text-gray-600">Followers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{following.length}</div>
                    <div className="text-gray-600">Following</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.filter(post => post.sanctuaryId === wildlifeAccount.id).map(post => (
                  <div key={post.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="relative">
                      {post.mediaType === 'image' ? (
                        <img src={post.media} alt="Post" className="w-full h-48 object-cover" />
                      ) : (
                        <video src={post.media} className="w-full h-48 object-cover" />
                      )}
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <button onClick={() => editPost(post)} className="p-1 bg-white rounded-full shadow hover:bg-gray-100">
                          <Edit className="h-4 w-4 text-gray-600" />
                        </button>
                        <button onClick={() => deletePost(post.id)} className="p-1 bg-white rounded-full shadow hover:bg-red-50">
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{post.likes.length} likes</span>
                        <span>{post.comments.length} comments</span>
                        <span>{post.saves.length} saves</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Post Modal */}
        {(showCreatePost || showEditPost) && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <button onClick={() => { setShowCreatePost(false); setShowEditPost(false); }} className="text-gray-600">Cancel</button>
                <h3 className="text-lg font-semibold text-gray-900">{showEditPost ? 'Edit Post' : 'New Post'}</h3>
                <button onClick={showEditPost ? updatePost : createPost} className="text-emerald-600 font-semibold" disabled={!newPost.content.trim()}>
                  {showEditPost ? 'Update' : 'Share'}
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 space-y-4">
                {!showEditPost && (
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button onClick={() => setNewPost({ ...newPost, isStory: false })} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${!newPost.isStory ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>Post</button>
                    <button onClick={() => setNewPost({ ...newPost, isStory: true })} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${newPost.isStory ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}>Story (24h)</button>
                  </div>
                )}
                
                <div className="flex items-center space-x-3">
                  <img src={wildlifeAccount?.avatar} alt="Account" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{wildlifeAccount?.name}</h4>
                    <p className="text-sm text-gray-500">{wildlifeAccount?.location}</p>
                  </div>
                </div>
                
                <textarea placeholder="Write a caption..." value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} rows={4} className="w-full resize-none border-none outline-none text-gray-900 placeholder-gray-500" />
                
                {!showEditPost && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-900 font-medium">Add media</span>
                      <div className="flex space-x-2">
                        <button onClick={() => setNewPost({ ...newPost, mediaType: 'image' })} className={`p-2 rounded-lg ${newPost.mediaType === 'image' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}><Camera className="h-5 w-5" /></button>
                        <button onClick={() => setNewPost({ ...newPost, mediaType: 'video' })} className={`p-2 rounded-lg ${newPost.mediaType === 'video' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}><Video className="h-5 w-5" /></button>
                      </div>
                    </div>
                    <input type="file" accept={newPost.mediaType === 'image' ? 'image/*' : 'video/*'} onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (event) => setNewPost({ ...newPost, media: event.target?.result as string }); reader.readAsDataURL(file); } }} className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg" />
                    {newPost.media && (
                      <div className="mt-4">
                        {newPost.mediaType === 'image' ? <img src={newPost.media} alt="Preview" className="w-full h-48 object-cover rounded-lg" /> : <video src={newPost.media} className="w-full h-48 object-cover rounded-lg" controls />}
                      </div>
                    )}
                  </div>
                )}
                
                <input type="text" placeholder="Add hashtags (e.g., #WildlifeConservation)" value={newPost.hashtags} onChange={(e) => setNewPost({ ...newPost, hashtags: e.target.value })} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <input type="text" placeholder="Add location" value={newPost.location} onChange={(e) => setNewPost({ ...newPost, location: e.target.value })} className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Profile Modal */}
        {showEditProfile && wildlifeAccount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="flex items-center space-x-4">
                    <img src={wildlifeAccount.avatar} alt="Current avatar" className="w-16 h-16 rounded-full object-cover" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const updatedAccount = { ...wildlifeAccount, avatar: event.target?.result as string };
                            setWildlifeAccount(updatedAccount);
                            localStorage.setItem('wildlifeAccount', JSON.stringify(updatedAccount));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Sanctuary Name"
                  value={wildlifeAccount.name}
                  onChange={(e) => {
                    const updatedAccount = { ...wildlifeAccount, name: e.target.value };
                    setWildlifeAccount(updatedAccount);
                    localStorage.setItem('wildlifeAccount', JSON.stringify(updatedAccount));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={wildlifeAccount.location}
                  onChange={(e) => {
                    const updatedAccount = { ...wildlifeAccount, location: e.target.value };
                    setWildlifeAccount(updatedAccount);
                    localStorage.setItem('wildlifeAccount', JSON.stringify(updatedAccount));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />

                <textarea
                  placeholder="About your sanctuary..."
                  value={wildlifeAccount.about}
                  onChange={(e) => {
                    const updatedAccount = { ...wildlifeAccount, about: e.target.value };
                    setWildlifeAccount(updatedAccount);
                    localStorage.setItem('wildlifeAccount', JSON.stringify(updatedAccount));
                  }}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />

                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      setShowEditProfile(false);
                      toast.success('Profile updated successfully!');
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
};

export default WildlifeSanctuary;