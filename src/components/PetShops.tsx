import React, { useState, useEffect, useRef } from 'react';
import { Store, Plus, Search, Filter, ShoppingCart, Phone, MapPin, MessageCircle, Star, Heart, Eye, X, Send, Mic, Play, Pause, ArrowLeft, Smile, Check, CheckCheck, Copy, Trash, Upload, Package, CreditCard, Truck, Paperclip, Image, FileText, Download, Square } from 'lucide-react';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

interface Shop {
  id: string;
  name: string;
  ownerName: string;
  phone: string;
  email: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  image: string;
  description: string;
  website?: string;
  rating: number;
  verified: boolean;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  shopId: string;
  shopName: string;
  rating: number;
  inStock: boolean;
  variants: string[];
}

interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  variant: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  type: 'text' | 'image' | 'file' | 'audio';
  fileName?: string;
  fileSize?: string;
  duration?: string;
  status: 'sent' | 'delivered' | 'read';
  deleted?: boolean;
  deletedForEveryone?: boolean;
}

interface ChatSession {
  shopId: string;
  shopName: string;
  shopImage: string;
  isOnline: boolean;
  lastSeen?: Date;
  messages: Message[];
}

const PetShops: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'browse' | 'shops' | 'cart'>('browse');
  const [showShopForm, setShowShopForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Chat states
  const [showChat, setShowChat] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [showAudioPreview, setShowAudioPreview] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [showMessageOptions, setShowMessageOptions] = useState<string | null>(null);
  const [shopTyping, setShopTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const { isAuthenticated, user } = useAuth();

  const [shopForm, setShopForm] = useState({
    name: '',
    ownerName: '',
    phone: '',
    email: '',
    address: '',
    category: 'General Pet Supplies',
    image: '',
    description: '',
    website: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: 'Food',
    shopId: '',
    variants: ''
  });

  const categories = ['All', 'Food', 'Toys', 'Accessories', 'Care & Grooming', 'Medicines', 'Bedding'];
  const shopCategories = ['Food', 'Accessories', 'Toys', 'Grooming', 'Medicines', 'General Pet Supplies'];

  const emojis = {
    'Smileys & People': [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
      '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
      '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
      '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
      '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾'
    ],
    'Animals & Nature': [
      '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
      '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
      '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳'
    ],
    'Food & Drink': [
      '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
      '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈'
    ],
    'Activities': [
      '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
      '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺'
    ],
    'Objects': [
      '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
      '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋'
    ],
    'Hearts': [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️'
    ]
  };

  useEffect(() => {
    loadDummyData();
    loadChatSessions();
    loadCart();
    
    // Generate animated galaxy stars
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
    
    // Check for openChat URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const openChatId = urlParams.get('openChat');
    if (openChatId) {
      // Find the shop and open chat
      setTimeout(() => {
        const shop = shops.find(s => s.id === openChatId);
        if (shop) {
          openChat(shop);
        }
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Handle openChat parameter when shops are loaded
    const urlParams = new URLSearchParams(window.location.search);
    const openChatId = urlParams.get('openChat');
    if (openChatId && shops.length > 0) {
      const shop = shops.find(s => s.id === openChatId);
      if (shop) {
        openChat(shop);
        // Clear the URL parameter
        window.history.replaceState({}, '', '/pet-shops');
      }
    }
  }, [shops]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedShop?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadDummyData = () => {
    const dummyShops: Shop[] = [
      {
        id: '1',
        name: 'Paws & Claws Pet Store',
        ownerName: 'Sarah Johnson',
        phone: '+1 (555) 123-4567',
        email: 'sarah@pawsandclaws.com',
        address: '123 Pet Street, New York, NY 10001',
        latitude: 40.7589,
        longitude: -73.9851,
        category: 'General Pet Supplies',
        image: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Your one-stop shop for all pet needs. We offer quality products at affordable prices.',
        website: 'https://pawsandclaws.com',
        rating: 4.8,
        verified: true
      },
      {
        id: '2',
        name: 'Happy Tails Pet Food',
        ownerName: 'Michael Chen',
        phone: '+1 (555) 234-5678',
        email: 'mike@happytails.com',
        address: '456 Dog Avenue, Los Angeles, CA 90210',
        latitude: 34.0522,
        longitude: -118.2437,
        category: 'Food',
        image: 'https://images.pexels.com/photos/1458916/pexels-photo-1458916.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Premium pet food and nutrition specialists. Healthy pets, happy lives.',
        rating: 4.6,
        verified: true
      },
      {
        id: '3',
        name: 'Pet Paradise Toys',
        ownerName: 'Emily Rodriguez',
        phone: '+1 (555) 345-6789',
        email: 'emily@petparadise.com',
        address: '789 Play Street, Chicago, IL 60601',
        latitude: 41.8781,
        longitude: -87.6298,
        category: 'Toys',
        image: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Fun toys and accessories to keep your pets entertained and active.',
        rating: 4.7,
        verified: true
      },
      {
        id: '4',
        name: 'Grooming Galaxy',
        ownerName: 'David Wilson',
        phone: '+1 (555) 456-7890',
        email: 'david@groominggalaxy.com',
        address: '321 Spa Lane, Houston, TX 77001',
        latitude: 29.7604,
        longitude: -95.3698,
        category: 'Grooming',
        image: 'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Professional grooming supplies and services for your beloved pets.',
        rating: 4.9,
        verified: true
      },
      {
        id: '5',
        name: 'Pet Health Plus',
        ownerName: 'Lisa Thompson',
        phone: '+1 (555) 567-8901',
        email: 'lisa@pethealthplus.com',
        address: '654 Medicine Road, Miami, FL 33101',
        latitude: 25.7617,
        longitude: -80.1918,
        category: 'Medicines',
        image: 'https://images.pexels.com/photos/6235019/pexels-photo-6235019.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Trusted source for pet medications and health supplements.',
        rating: 4.5,
        verified: true
      },
      {
        id: '6',
        name: 'Cozy Pet Beds',
        ownerName: 'Robert Brown',
        phone: '+1 (555) 678-9012',
        email: 'robert@cozypetbeds.com',
        address: '987 Comfort Street, Seattle, WA 98101',
        latitude: 47.6062,
        longitude: -122.3321,
        category: 'Accessories',
        image: 'https://images.pexels.com/photos/6816854/pexels-photo-6816854.jpeg?auto=compress&cs=tinysrgb&w=800',
        description: 'Comfortable beds and accessories for your pet\'s perfect rest.',
        rating: 4.4,
        verified: true
      }
    ];

    const dummyProducts: Product[] = [
      // Food Products
      { id: '1', name: 'Premium Dog Food 15kg', price: 89.99, image: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'High-quality nutrition for adult dogs', category: 'Food', shopId: '2', shopName: 'Happy Tails Pet Food', rating: 4.7, inStock: true, variants: ['15kg', '10kg', '5kg'] },
      { id: '2', name: 'Cat Food Variety Pack', price: 34.99, image: 'https://images.pexels.com/photos/1741205/pexels-photo-1741205.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Delicious wet food variety for cats', category: 'Food', shopId: '2', shopName: 'Happy Tails Pet Food', rating: 4.5, inStock: true, variants: ['12 cans', '24 cans'] },
      { id: '3', name: 'Bird Seed Mix 2kg', price: 19.99, image: 'https://images.pexels.com/photos/1564506/pexels-photo-1564506.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Nutritious seed mix for all bird types', category: 'Food', shopId: '1', shopName: 'Paws & Claws Pet Store', rating: 4.3, inStock: true, variants: ['2kg', '5kg'] },
      
      // Toys
      { id: '4', name: 'Interactive Dog Puzzle', price: 24.99, image: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Mental stimulation toy for intelligent dogs', category: 'Toys', shopId: '3', shopName: 'Pet Paradise Toys', rating: 4.8, inStock: true, variants: ['Small', 'Medium', 'Large'] },
      { id: '5', name: 'Cat Feather Wand', price: 12.99, image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Interactive feather toy for cats', category: 'Toys', shopId: '3', shopName: 'Pet Paradise Toys', rating: 4.6, inStock: true, variants: ['Standard', 'Extended'] },
      { id: '6', name: 'Rope Chew Toy', price: 8.99, image: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Durable rope toy for heavy chewers', category: 'Toys', shopId: '1', shopName: 'Paws & Claws Pet Store', rating: 4.4, inStock: true, variants: ['Small', 'Large'] },
      
      // Accessories
      { id: '7', name: 'Leather Dog Collar', price: 29.99, image: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Premium leather collar with metal buckle', category: 'Accessories', shopId: '6', shopName: 'Cozy Pet Beds', rating: 4.7, inStock: true, variants: ['Small', 'Medium', 'Large'] },
      { id: '8', name: 'Cat Carrier Bag', price: 45.99, image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Comfortable and secure travel carrier', category: 'Accessories', shopId: '1', shopName: 'Paws & Claws Pet Store', rating: 4.5, inStock: true, variants: ['Small', 'Medium'] },
      
      // Care & Grooming
      { id: '9', name: 'Pet Shampoo Set', price: 22.99, image: 'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Gentle shampoo and conditioner set', category: 'Care & Grooming', shopId: '4', shopName: 'Grooming Galaxy', rating: 4.6, inStock: true, variants: ['250ml', '500ml'] },
      { id: '10', name: 'Nail Clippers', price: 15.99, image: 'https://images.pexels.com/photos/6235019/pexels-photo-6235019.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Professional grade nail clippers', category: 'Care & Grooming', shopId: '4', shopName: 'Grooming Galaxy', rating: 4.8, inStock: true, variants: ['Small', 'Large'] },
      
      // Medicines
      { id: '11', name: 'Flea & Tick Treatment', price: 39.99, image: 'https://images.pexels.com/photos/6235019/pexels-photo-6235019.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Monthly flea and tick prevention', category: 'Medicines', shopId: '5', shopName: 'Pet Health Plus', rating: 4.7, inStock: true, variants: ['Small Dogs', 'Large Dogs', 'Cats'] },
      { id: '12', name: 'Vitamin Supplements', price: 27.99, image: 'https://images.pexels.com/photos/6235233/pexels-photo-6235233.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Daily vitamin supplements for pets', category: 'Medicines', shopId: '5', shopName: 'Pet Health Plus', rating: 4.4, inStock: true, variants: ['60 tablets', '120 tablets'] },
      
      // Bedding
      { id: '13', name: 'Orthopedic Dog Bed', price: 79.99, image: 'https://images.pexels.com/photos/6816854/pexels-photo-6816854.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Memory foam bed for senior dogs', category: 'Bedding', shopId: '6', shopName: 'Cozy Pet Beds', rating: 4.9, inStock: true, variants: ['Small', 'Medium', 'Large', 'XL'] },
      { id: '14', name: 'Cat Sleeping Mat', price: 19.99, image: 'https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=400', description: 'Soft and washable sleeping mat', category: 'Bedding', shopId: '6', shopName: 'Cozy Pet Beds', rating: 4.3, inStock: true, variants: ['Small', 'Medium'] }
    ];

    setShops(dummyShops);
    setProducts(dummyProducts);
  };

  const loadChatSessions = () => {
    const savedChats = localStorage.getItem('shopChats');
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats);
      const enhancedChats = parsedChats.map((chat: any) => ({
        ...chat,
        shopImage: chat.shopImage || 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          type: msg.type || 'text',
          status: msg.status || 'delivered',
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChatSessions(enhancedChats);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('petShopCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('petShopCart', JSON.stringify(newCart));
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const openGoogleMaps = (latitude: number, longitude: number, name: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&query_place_id=${encodeURIComponent(name)}`;
    window.open(url, '_blank');
  };

  const openChat = (shop: Shop) => {
    if (!isAuthenticated) {
      toast.error('Please log in to chat with shops');
      return;
    }
    setSelectedShop(shop);
    setShowChat(true);
    setActiveTab('browse'); // Ensure we're on the right tab
  };

  const addToCart = (product: Product, variant: string = product.variants[0]) => {
    if (!isAuthenticated) {
      toast.error('Please log in to add items to cart');
      return;
    }

    const existingItem = cart.find(item => item.productId === product.id && item.variant === variant);
    let newCart;

    if (existingItem) {
      newCart = cart.map(item =>
        item.productId === product.id && item.variant === variant
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { productId: product.id, product, quantity: 1, variant }];
    }

    saveCart(newCart);
    toast.success('Added to cart!');
  };

  const removeFromCart = (productId: string, variant: string) => {
    const newCart = cart.filter(item => !(item.productId === productId && item.variant === variant));
    saveCart(newCart);
  };

  const updateCartQuantity = (productId: string, variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }

    const newCart = cart.map(item =>
      item.productId === productId && item.variant === variant
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.shopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Chat functions (similar to Profile component)
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedShop || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedShop.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromUser: true,
      type: 'text',
      status: 'sent'
    };

    const updatedSessions = [...chatSessions];
    const existingSessionIndex = updatedSessions.findIndex(s => s.shopId === selectedShop.id);

    if (existingSessionIndex >= 0) {
      updatedSessions[existingSessionIndex].messages.push(message);
    } else {
      updatedSessions.push({
        shopId: selectedShop.id,
        shopName: selectedShop.name,
        shopImage: selectedShop.image,
        isOnline: true,
        messages: [message]
      });
    }

    setChatSessions(updatedSessions);
    localStorage.setItem('shopChats', JSON.stringify(updatedSessions));
    setNewMessage('');

    // Simulate shop response
    setShopTyping(true);
    setTimeout(() => {
      setShopTyping(false);
      const shopResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedShop.id,
        receiverId: user.id,
        content: getRandomShopResponse(),
        timestamp: new Date(),
        isFromUser: false,
        type: 'text',
        status: 'delivered'
      };

      const finalSessions = JSON.parse(localStorage.getItem('shopChats') || '[]');
      const sessionIndex = finalSessions.findIndex((s: any) => s.shopId === selectedShop.id);
      if (sessionIndex >= 0) {
        finalSessions[sessionIndex].messages.push(shopResponse);
        setChatSessions(finalSessions);
        localStorage.setItem('shopChats', JSON.stringify(finalSessions));
      }
    }, 2000 + Math.random() * 3000);
  };

  const getRandomShopResponse = () => {
    const responses = [
      "Thank you for your interest! How can I help you today?",
      "We have that product in stock. Would you like more details?",
      "Great choice! That's one of our bestsellers.",
      "I can offer you a special discount on bulk orders.",
      "We also provide free delivery for orders over $50.",
      "Feel free to visit our store anytime during business hours!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !selectedShop || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: selectedShop.id,
        content: event.target?.result as string,
        timestamp: new Date(),
        isFromUser: true,
        type: type,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        status: 'sent'
      };

      const updatedSessions = [...chatSessions];
      const existingSessionIndex = updatedSessions.findIndex(s => s.shopId === selectedShop.id);

      if (existingSessionIndex >= 0) {
        updatedSessions[existingSessionIndex].messages.push(message);
      } else {
        updatedSessions.push({
          shopId: selectedShop.id,
          shopName: selectedShop.name,
          shopImage: selectedShop.image,
          isOnline: true,
          messages: [message]
        });
      }

      setChatSessions(updatedSessions);
      localStorage.setItem('shopChats', JSON.stringify(updatedSessions));
    };
    
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        if (recordingTime >= 1 && audioChunksRef.current.length > 0) {
          try {
            const mimeType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Audio = reader.result as string;
              setRecordedAudio(base64Audio);
              setPreviewDuration(recordingTime);
              setShowAudioPreview(true);
            };
            reader.onerror = () => {
              console.error('Failed to convert audio to base64');
            };
            reader.readAsDataURL(audioBlob);
          } catch (error) {
            console.error('Error processing recorded audio:', error);
          }
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      setMediaRecorder(recorder);
      recorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const sendAudioMessage = (audioData: string, duration: number) => {
    if (!selectedShop || !user || !audioData) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedShop.id,
      content: audioData,
      timestamp: new Date(),
      isFromUser: true,
      type: 'audio',
      duration: formatDuration(duration),
      status: 'sent'
    };

    const updatedSessions = [...chatSessions];
    const existingSessionIndex = updatedSessions.findIndex(s => s.shopId === selectedShop.id);

    if (existingSessionIndex >= 0) {
      updatedSessions[existingSessionIndex].messages.push(message);
    } else {
      updatedSessions.push({
        shopId: selectedShop.id,
        shopName: selectedShop.name,
        shopImage: selectedShop.image,
        isOnline: true,
        messages: [message]
      });
    }

    setChatSessions(updatedSessions);
    localStorage.setItem('shopChats', JSON.stringify(updatedSessions));
    
    setRecordedAudio(null);
    setShowAudioPreview(false);
    setRecordingTime(0);
    setPreviewDuration(0);
  };

  const cancelAudioMessage = () => {
    setRecordedAudio(null);
    setShowAudioPreview(false);
    setRecordingTime(0);
    setPreviewDuration(0);
  };

  const handleSendRecording = () => {
    if (recordedAudio && previewDuration > 0) {
      sendAudioMessage(recordedAudio, previewDuration);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playAudio = (messageId: string, audioData: string) => {
    if (playingAudio === messageId) {
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (e) {
          console.log('Audio pause error:', e);
        }
        setCurrentAudio(null);
      }
      setPlayingAudio(null);
      return;
    }

    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Audio stop error:', e);
      }
      setCurrentAudio(null);
    }

    if (!audioData || !audioData.startsWith('data:audio/')) {
      console.error('Invalid audio data');
      return;
    }

    try {
      const audio = new Audio();
      
      const handleCanPlay = () => {
        audio.play().then(() => {
          setPlayingAudio(messageId);
          setCurrentAudio(audio);
        }).catch((error) => {
          console.error('Play failed:', error);
          setPlayingAudio(null);
          setCurrentAudio(null);
        });
      };

      const handleEnded = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const handleError = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      audio.src = audioData;
      audio.load();
      
    } catch (error) {
      console.error('Audio creation error:', error);
      setPlayingAudio(null);
      setCurrentAudio(null);
    }
  };

  const deleteMessage = (messageId: string, forEveryone: boolean = false) => {
    if (!selectedShop) return;

    const updatedSessions = chatSessions.map(s => 
      s.shopId === selectedShop.id 
        ? {
            ...s, 
            messages: s.messages.map(m => 
              m.id === messageId 
                ? { ...m, deleted: true, deletedForEveryone: forEveryone }
                : m
            )
          }
        : s
    );

    setChatSessions(updatedSessions);
    localStorage.setItem('shopChats', JSON.stringify(updatedSessions));
    setShowMessageOptions(null);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowMessageOptions(null);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getCurrentChatSession = () => {
    if (!selectedShop) return null;
    return chatSessions.find(s => s.shopId === selectedShop.id);
  };

  const openImageViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageViewer(true);
  };

  const handleShopImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setShopForm({ ...shopForm, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to register a shop');
      return;
    }

    const newShop: Shop = {
      id: Date.now().toString(),
      ...shopForm,
      latitude: 40.7589 + (Math.random() - 0.5) * 0.1, // Random coordinates near NYC
      longitude: -73.9851 + (Math.random() - 0.5) * 0.1,
      rating: 0,
      verified: false
    };

    const updatedShops = [...shops, newShop];
    setShops(updatedShops);
    
    // Reset form
    setShopForm({
      name: '',
      ownerName: '',
      phone: '',
      email: '',
      address: '',
      category: 'General Pet Supplies',
      image: '',
      description: '',
      website: ''
    });
    
    setShowShopForm(false);
    toast.success('Shop registered successfully! Pending verification.');
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setProductForm({ ...productForm, image: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please log in to upload a product');
      return;
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productForm.name,
      price: parseFloat(productForm.price),
      image: productForm.image || 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: productForm.description,
      category: productForm.category,
      shopId: productForm.shopId || '1',
      shopName: shops.find(s => s.id === productForm.shopId)?.name || 'Your Shop',
      rating: 5.0,
      inStock: true,
      variants: productForm.variants.split(',').map(v => v.trim()).filter(v => v)
    };

    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    
    // Reset form
    setProductForm({
      name: '',
      price: '',
      image: '',
      description: '',
      category: 'Food',
      shopId: '',
      variants: ''
    });
    
    setShowProductForm(false);
    toast.success('Product uploaded successfully!');
  };

  return (
    <>
      <style>{`
        .galaxy-container {
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
        
        .galaxy-content {
          position: relative;
          z-index: 1;
        }
      `}</style>
      
      <div className="galaxy-container">
        <div className="galaxy-stars"></div>
        
        <div className="galaxy-content min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-black mb-4" style={{
            background: 'linear-gradient(135deg, #b388ff, #ff6ec7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(179, 136, 255, 0.5)'
          }}>
            Pet Shops & Products
          </h1>
          <p className="text-xl font-medium italic mb-2" style={{
            color: '#00cfff',
            textShadow: '0 0 15px rgba(0, 207, 255, 0.3)'
          }}>
            Discover amazing products and connect with local pet shops
          </p>
          <div className="w-32 h-1 mx-auto rounded-full" style={{
            background: 'linear-gradient(90deg, #14b8a6, #8b5cf6, #ec4899)'
          }}></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Browse Products
            </button>
            <button
              onClick={() => setActiveTab('shops')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'shops'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Store className="h-4 w-4 inline mr-2" />
              Pet Shops
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'cart'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ShoppingCart className="h-4 w-4 inline mr-2" />
              Cart ({cart.length})
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        {(activeTab === 'browse' || activeTab === 'shops') && (
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab === 'browse' ? 'products' : 'shops'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm transition-all duration-300 focus:shadow-lg"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(20, 184, 166, 0.1)' }}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-6 py-3 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium rounded-lg border-2 border-purple-200 hover:from-purple-200 hover:to-pink-200 hover:border-purple-300 transition-all duration-300 flex items-center shadow-sm hover:shadow-md"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
              {activeTab === 'browse' && (
                <button
                  onClick={() => setShowProductForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Product
                </button>
              )}
              {activeTab === 'shops' && (
                <button
                  onClick={() => setShowShopForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-teal-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Register Shop
                </button>
              )}
            </div>

            {showFilters && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 backdrop-blur-sm rounded-lg p-6 mb-4 shadow-lg border border-purple-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 bg-white shadow-sm hover:border-purple-300 transition-all duration-300"
                      style={{ background: 'linear-gradient(to right, #faf5ff, #fdf2f8)' }}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-2">Price Range</label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 bg-white shadow-sm hover:border-purple-300 transition-all duration-300"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 bg-white shadow-sm hover:border-purple-300 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="overflow-hidden bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl border-2 border-transparent hover:border-gradient-to-r hover:from-teal-300 hover:to-purple-300" style={{
                boxShadow: '0 10px 25px rgba(0,0,0,0.1), 0 0 0 1px rgba(20,184,166,0.1)',
                background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)'
              }}>
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => openImageViewer(product.image)}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${product.inStock ? 'bg-gradient-to-r from-emerald-400 to-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-emerald-600 mb-2">${product.price}</p>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-sm text-gray-500 mb-2">by {product.shopName}</p>
                  
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{product.rating}</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-lime-400 to-emerald-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-lime-300 hover:to-emerald-400 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </button>
                      <button className="flex-1 px-3 py-2 bg-gradient-to-r from-pink-400 to-orange-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-pink-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                        Buy Now
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const shop = shops.find(s => s.id === product.shopId);
                          if (shop) handleCall(shop.phone);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-sky-400 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-sky-300 hover:to-blue-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </button>
                      <button
                        onClick={() => {
                          const shop = shops.find(s => s.id === product.shopId);
                          if (shop) openChat(shop);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-purple-300 hover:to-purple-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </button>
                      <button
                        onClick={() => {
                          const shop = shops.find(s => s.id === product.shopId);
                          if (shop) openGoogleMaps(shop.latitude, shop.longitude, shop.name);
                        }}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:from-yellow-300 hover:to-yellow-500 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        Location
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Product Form */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent">Upload New Product</h3>
                  <button
                    onClick={() => setShowProductForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleProductSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        required
                        className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 bg-white shadow-sm"
                    >
                      {categories.filter(c => c !== 'All').map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop</label>
                    <select
                      value={productForm.shopId}
                      onChange={(e) => setProductForm({ ...productForm, shopId: e.target.value })}
                      required
                      className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 bg-white shadow-sm"
                    >
                      <option value="">Select a shop</option>
                      {shops.map(shop => (
                        <option key={shop.id} value={shop.id}>{shop.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="hidden"
                      id="product-image-upload"
                    />
                    <label
                      htmlFor="product-image-upload"
                      className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-teal-300 rounded-lg cursor-pointer hover:border-teal-400 transition-colors"
                    >
                      <Upload className="h-5 w-5 mr-2 text-teal-400" />
                      <span className="text-teal-600">
                        {productForm.image ? 'Change Product Image' : 'Upload Product Image'}
                      </span>
                    </label>
                    {productForm.image && (
                      <div className="mt-2">
                        <img
                          src={productForm.image}
                          alt="Product preview"
                          className="w-32 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      rows={3}
                      required
                      className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variants (comma-separated)</label>
                    <input
                      type="text"
                      value={productForm.variants}
                      onChange={(e) => setProductForm({ ...productForm, variants: e.target.value })}
                      placeholder="e.g., Small, Medium, Large"
                      className="w-full px-3 py-2 border-2 border-teal-200 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-teal-400 bg-white shadow-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Upload Product
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowProductForm(false)}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Shop Registration Form */}
        {showShopForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">Register Your Pet Shop</h3>
                  <button
                    onClick={() => setShowShopForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleShopSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Shop Name</label>
                      <input
                        type="text"
                        value={shopForm.name}
                        onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                      <input
                        type="text"
                        value={shopForm.ownerName}
                        onChange={(e) => setShopForm({ ...shopForm, ownerName: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={shopForm.phone}
                        onChange={(e) => setShopForm({ ...shopForm, phone: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={shopForm.email}
                        onChange={(e) => setShopForm({ ...shopForm, email: e.target.value })}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Address</label>
                    <input
                      type="text"
                      value={shopForm.address}
                      onChange={(e) => setShopForm({ ...shopForm, address: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={shopForm.category}
                      onChange={(e) => setShopForm({ ...shopForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    >
                      {shopCategories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Shop Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleShopImageUpload}
                      className="hidden"
                      id="shop-image-upload"
                    />
                    <label
                      htmlFor="shop-image-upload"
                      className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400 transition-colors"
                    >
                      <Upload className="h-5 w-5 mr-2 text-gray-400" />
                      <span className="text-gray-600">
                        {shopForm.image ? 'Change Shop Image' : 'Upload Shop Image'}
                      </span>
                    </label>
                    {shopForm.image && (
                      <div className="mt-2">
                        <img
                          src={shopForm.image}
                          alt="Shop preview"
                          className="w-32 h-24 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={shopForm.description}
                      onChange={(e) => setShopForm({ ...shopForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website (Optional)</label>
                    <input
                      type="url"
                      value={shopForm.website}
                      onChange={(e) => setShopForm({ ...shopForm, website: e.target.value })}
                      placeholder="https://yourshop.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <Button type="submit" className="flex-1">
                      Register Shop
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowShopForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Shops Tab */}
        {activeTab === 'shops' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShops.map((shop) => (
              <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={shop.image}
                    alt={shop.name}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => openImageViewer(shop.image)}
                  />
                  {shop.verified && (
                    <Badge variant="success" className="absolute top-2 right-2">
                      Verified
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{shop.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">Owner: {shop.ownerName}</p>
                  <Badge variant="info" size="sm" className="mb-3">{shop.category}</Badge>
                  
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(shop.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">{shop.rating}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{shop.description}</p>
                  <p className="text-xs text-gray-500 mb-4">{shop.address}</p>

                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleCall(shop.phone)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => openChat(shop)}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => openGoogleMaps(shop.latitude, shop.longitude, shop.name)}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      View Location
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="max-w-4xl mx-auto">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-4">Add some products to get started!</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl shadow-lg border border-purple-100">
                  {cart.map((item) => (
                    <div key={`${item.productId}-${item.variant}`} className="flex items-center p-4 border-b border-purple-100 last:border-b-0 bg-white/80 backdrop-blur-sm rounded-2xl mx-2 my-2 shadow-sm" style={{
                      background: 'linear-gradient(145deg, #ffffff 0%, #fefefe 100%)',
                      border: '1px solid rgba(168, 85, 247, 0.1)'
                    }}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg mr-4 border-2 border-purple-200"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-600">{item.product.shopName}</p>
                        <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                        <p className="text-lg font-bold text-emerald-600">${item.product.price}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variant, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center hover:from-purple-300 hover:to-pink-300 transition-all duration-300 text-purple-700 font-bold"
                        >
                          -
                        </button>
                        <span className="font-semibold text-purple-700 min-w-[2rem] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.variant, item.quantity + 1)}
                          className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 flex items-center justify-center hover:from-purple-300 hover:to-pink-300 transition-all duration-300 text-purple-700 font-bold"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.productId, item.variant)}
                          className="ml-4 p-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full hover:from-red-300 hover:to-pink-400 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-100">
                  <div className="flex justify-between items-center mb-6 p-4 rounded-xl" style={{
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%)',
                    boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)'
                  }}>
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Total: ${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="space-y-3">
                    <button className="w-full px-6 py-4 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* WhatsApp-like Chat Screen */}
        {showChat && selectedShop && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="bg-emerald-600 text-white p-4 flex items-center shadow-lg">
              <button
                onClick={() => setShowChat(false)}
                className="mr-4 hover:bg-emerald-700 p-2 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img
                src={selectedShop.image}
                alt={selectedShop.name}
                className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{selectedShop.name}</h3>
                <p className="text-sm text-emerald-100">
                  {selectedShop.ownerName} • {selectedShop.category}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
              {getCurrentChatSession()?.messages.map((message) => (
                <div key={message.id} className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="relative group max-w-xs lg:max-w-md">
                    {message.deleted ? (
                      <div className={`px-3 py-2 rounded-lg text-sm italic text-gray-500 ${
                        message.isFromUser ? 'bg-gray-200' : 'bg-white'
                      }`}>
                        {message.deletedForEveryone ? 'This message was deleted' : 'You deleted this message'}
                      </div>
                    ) : (
                      <div
                        className={`px-3 py-2 rounded-lg text-sm relative ${
                          message.isFromUser
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          setShowMessageOptions(message.id);
                        }}
                      >
                        {message.type === 'image' ? (
                          <div>
                            <img
                              src={message.content}
                              alt="Shared image"
                              className="max-w-full h-auto rounded-lg mb-2 cursor-pointer"
                              onClick={() => openImageViewer(message.content)}
                            />
                            {message.fileName && (
                              <p className="text-xs opacity-75">{message.fileName}</p>
                            )}
                          </div>
                        ) : message.type === 'file' ? (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-8 w-8 text-blue-500" />
                            <div className="flex-1">
                              <p className="font-medium">{message.fileName}</p>
                              <p className="text-xs opacity-75">{message.fileSize}</p>
                            </div>
                            <button
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = message.content;
                                link.download = message.fileName || 'file';
                                link.click();
                              }}
                              className="p-1 hover:bg-black/10 rounded"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        ) : message.type === 'audio' ? (
                          <div className="flex items-center space-x-3 min-w-[220px] p-2">
                            <button
                              onClick={() => playAudio(message.id, message.content)}
                              className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                                message.isFromUser 
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                              }`}
                            >
                              {playingAudio === message.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0">
                              <div className={`h-1 rounded-full mb-2 ${
                                message.isFromUser ? 'bg-emerald-300' : 'bg-gray-300'
                              }`}>
                                <div className={`h-full rounded-full transition-all duration-300 ${
                                  playingAudio === message.id ? 'w-full animate-pulse' : 'w-0'
                                } ${
                                  message.isFromUser ? 'bg-white' : 'bg-emerald-500'
                                }`}></div>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-medium ${
                                  message.isFromUser ? 'text-emerald-100' : 'text-gray-600'
                                }`}>
                                  Voice message
                                </span>
                                <span className={`text-xs font-mono ${
                                  message.isFromUser ? 'text-emerald-100' : 'text-gray-600'
                                }`}>
                                  {message.duration || '0:00'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p>{message.content}</p>
                        )}
                        
                        <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                          message.isFromUser ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.isFromUser && (
                            <div className="flex">
                              {message.status === 'sent' && <Check className="h-3 w-3" />}
                              {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                              {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-400" />}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Message Options Menu */}
                    {showMessageOptions === message.id && !message.deleted && (
                      <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg border p-2 z-10">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </button>
                        <button
                          onClick={() => deleteMessage(message.id, false)}
                          className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete for me
                        </button>
                        {message.isFromUser && (
                          <button
                            onClick={() => deleteMessage(message.id, true)}
                            className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete for everyone
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 text-sm">
                  Start a conversation with {selectedShop.name}
                </div>
              )}

              {shopTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{selectedShop.name} is typing...</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Recording Preview */}
            {showAudioPreview && recordedAudio && (
              <div className="bg-emerald-50 border-t p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-emerald-800">Voice Message Ready</h4>
                  <span className="text-emerald-600 text-sm">{formatDuration(previewDuration)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => playAudio('preview', recordedAudio)}
                    className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                  >
                    {playingAudio === 'preview' ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex-1 h-2 bg-emerald-200 rounded-full">
                    <div className="h-full bg-emerald-500 rounded-full w-0 transition-all duration-300"></div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={cancelAudioMessage}
                      className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendRecording}
                      className="px-4 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recording Indicator */}
            {isRecording && (
              <div className="bg-red-50 border-t p-4">
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-600 font-medium">Recording</span>
                  </div>
                  <div className="text-red-700 font-mono text-lg">
                    {formatDuration(recordingTime)}
                  </div>
                  <button
                    onClick={stopRecording}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <Square className="h-4 w-4 mr-1 inline" />
                    Stop
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white border-t p-4">
              <div className="flex items-center space-x-2">
                {/* Attachment Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                
                {/* Image Button */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                >
                  <Image className="h-5 w-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-12"
                  />
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-emerald-600 transition-colors"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                  
                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg w-96 max-h-96 overflow-hidden z-20">
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Choose an emoji</h3>
                        <div className="space-y-4 max-h-80 overflow-y-auto">
                          {Object.entries(emojis).map(([category, emojiList]) => (
                            <div key={category}>
                              <h4 className="text-xs font-medium text-gray-600 mb-2">{category}</h4>
                              <div className="grid grid-cols-8 gap-1">
                                {emojiList.map((emoji, index) => (
                                  <button
                                    key={index}
                                    onClick={() => insertEmoji(emoji)}
                                    className="text-xl hover:bg-gray-100 p-1 rounded transition-colors flex items-center justify-center h-8 w-8"
                                    title={emoji}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {newMessage.trim() ? (
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                ) : !showAudioPreview ? (
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`p-2 rounded-full transition-colors select-none ${
                      isRecording 
                        ? 'bg-red-500 text-white scale-110' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                    title={isRecording ? 'Release to stop recording' : 'Hold to record voice message'}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
              
              {/* Hidden File Inputs */}
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'image')}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                onChange={(e) => handleFileUpload(e, 'file')}
                className="hidden"
              />
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {showImageViewer && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
              <button
                onClick={() => setShowImageViewer(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 text-3xl z-10 bg-black/50 rounded-full w-12 h-12 flex items-center justify-center"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={selectedImage}
                alt="Full view"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Click outside to close overlays */}
        {(showEmojiPicker || showMessageOptions) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowEmojiPicker(false);
              setShowMessageOptions(null);
            }}
          />
        )}
        </div>
        </div>
      </div>
    </>
  );
};

export default PetShops;