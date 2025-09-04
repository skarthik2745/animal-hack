import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Heart, Share2, Users, MessageCircle, Filter, Search, Plus, Phone, Mail, MessageSquare, Star, Clock, ArrowLeft, Send, Pin, Image, Video, Gift } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  date: string;
  time: string;
  location: string;
  coordinates: { lat: number; lng: number };
  organizer: string;
  contact: { phone: string; email: string; whatsapp: string };
  banner: string;
  category: string;
  rewards: string[];
  participants: number;
  isFavorite: boolean;
  isJoined: boolean;
  gallery: string[];
  updates: Array<{ id: string; message: string; timestamp: string; pinned: boolean }>;
  discussions: Array<{ id: string; user: string; message: string; timestamp: string; avatar: string }>;
}

const dummyCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Save the Strays Rally',
    description: 'Join us for a massive awareness rally to protect street animals and promote adoption.',
    fullDescription: 'A comprehensive rally aimed at raising awareness about stray animal welfare, promoting adoption over purchase, and educating the public about responsible pet ownership. We will march from Marina Beach to the city center with banners, distribute pamphlets, and organize adoption drives.',
    date: '2024-09-05',
    time: '09:00',
    location: 'Marina Beach, Chennai',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    organizer: 'StrayCare India',
    contact: { phone: '+91-9876543210', email: 'info@straycare.org', whatsapp: '+91-9876543210' },
    banner: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    category: 'Animal Protection',
    rewards: ['Awareness T-shirts', 'Stickers', 'Pet care pamphlets'],
    participants: 245,
    isFavorite: false,
    isJoined: false,
    gallery: [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'
    ],
    updates: [
      { id: '1', message: 'Rally starting point confirmed at Marina Beach main entrance', timestamp: '2024-08-20 10:00', pinned: true },
      { id: '2', message: 'Free breakfast for all participants from 8:30 AM', timestamp: '2024-08-22 15:30', pinned: false }
    ],
    discussions: [
      { id: '1', user: 'Priya S', message: 'What should we bring for the rally?', timestamp: '2024-08-25 14:30', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' },
      { id: '2', user: 'Organizer', message: 'Just bring your enthusiasm! We will provide banners and materials.', timestamp: '2024-08-25 14:45', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' }
    ]
  },
  {
    id: '2',
    title: 'No More Plastic in Oceans',
    description: 'Beach cleanup drive to protect marine life from plastic pollution.',
    fullDescription: 'Join our mission to clean Mumbai beaches and raise awareness about plastic pollution affecting marine animals. We will collect plastic waste, educate beachgoers, and organize workshops on sustainable alternatives.',
    date: '2024-09-12',
    time: '06:00',
    location: 'Juhu Beach, Mumbai',
    coordinates: { lat: 19.0990, lng: 72.8258 },
    organizer: 'OceanPaws',
    contact: { phone: '+91-9123456789', email: 'pawsocean@gmail.com', whatsapp: '+91-9123456789' },
    banner: 'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Eco-friendly bags', 'Marine life awareness booklets', 'Volunteer certificates'],
    participants: 189,
    isFavorite: false,
    isJoined: false,
    gallery: [
      'https://images.pexels.com/photos/2547565/pexels-photo-2547565.jpeg',
      'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg'
    ],
    updates: [
      { id: '1', message: 'Gloves and collection bags will be provided', timestamp: '2024-08-18 09:00', pinned: true }
    ],
    discussions: [
      { id: '1', user: 'Rahul M', message: 'Is transportation provided from Andheri?', timestamp: '2024-08-24 16:20', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg' }
    ]
  },
  {
    id: '3',
    title: 'Save the Tigers Awareness Walk',
    description: 'Educational walk to promote tiger conservation and habitat protection.',
    fullDescription: 'An educational awareness walk through Bannerghatta National Park to highlight the importance of tiger conservation, habitat protection, and anti-poaching efforts. Includes wildlife photography workshop and conservation talks.',
    date: '2024-09-20',
    time: '07:30',
    location: 'Bannerghatta National Park, Bengaluru',
    coordinates: { lat: 12.8005, lng: 77.5773 },
    organizer: 'Wildlife India',
    contact: { phone: '+91-9123456789', email: 'contact@wildlifeindia.org', whatsapp: '+91-9123456789' },
    banner: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Tiger conservation guides', 'Wildlife photography tips booklet', 'Park entry tickets'],
    participants: 156,
    isFavorite: false,
    isJoined: false,
    gallery: [
      'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg',
      'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg'
    ],
    updates: [],
    discussions: []
  },
  {
    id: '4',
    title: 'Adopt, Don\'t Shop Campaign',
    description: 'Mega adoption drive promoting pet adoption over purchasing from breeders.',
    fullDescription: 'A comprehensive adoption campaign featuring rescued pets from multiple shelters across Delhi NCR. Includes pet health checkups, adoption counseling, and post-adoption support services.',
    date: '2024-10-02',
    time: '10:00',
    location: 'Central Park, Delhi NCR',
    coordinates: { lat: 28.6139, lng: 77.2090 },
    organizer: 'Paws Rescue',
    contact: { phone: '+91-9988776655', email: 'rescuepaws@gmail.com', whatsapp: '+91-9988776655' },
    banner: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    category: 'Adoption Drives',
    rewards: ['Pet starter kits', 'Adoption certificates', 'Free vet consultation vouchers'],
    participants: 312,
    isFavorite: false,
    isJoined: false,
    gallery: [
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg'
    ],
    updates: [],
    discussions: []
  },
  {
    id: '5',
    title: 'Stop Animal Abuse Flashmob',
    description: 'Silent flashmob to raise awareness against animal cruelty and abuse.',
    fullDescription: 'A powerful silent flashmob performance to draw attention to animal abuse issues. Participants will perform synchronized movements representing the voice of voiceless animals, followed by awareness distribution.',
    date: '2024-10-10',
    time: '17:00',
    location: 'MG Road, Pune',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    organizer: 'Humane Future',
    contact: { phone: '+91-9988776655', email: 'info@humanefuture.org', whatsapp: '+91-9988776655' },
    banner: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
    category: 'Anti-Abuse Awareness',
    rewards: ['Anti-abuse awareness bands', 'Information pamphlets', 'Volunteer badges'],
    participants: 98,
    isFavorite: false,
    isJoined: false,
    gallery: [
      'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'
    ],
    updates: [],
    discussions: []
  },
  {
    id: '6',
    title: 'Stray Animal Vaccination Drive',
    description: 'Free vaccination and health checkup camp for stray animals in the community.',
    fullDescription: 'A comprehensive vaccination drive targeting stray dogs and cats in residential areas. Our team of veterinarians will provide free vaccinations, deworming, and basic health checkups. We also aim to create awareness about responsible pet ownership.',
    date: '2024-09-15',
    time: '08:00',
    location: 'Community Center, Koramangala, Bengaluru',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    organizer: 'Stray Care Foundation',
    contact: { phone: '+91-9876543211', email: 'info@straycare.org', whatsapp: '+91-9876543211' },
    banner: 'https://images.pexels.com/photos/4269505/pexels-photo-4269505.jpeg',
    category: 'Stray Animal Care',
    rewards: ['Vaccination certificates', 'Pet care guides', 'Volunteer badges'],
    participants: 78,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/4269505/pexels-photo-4269505.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '7',
    title: 'Wildlife Photography Workshop',
    description: 'Learn wildlife photography techniques while supporting conservation efforts.',
    fullDescription: 'Join professional wildlife photographers for a hands-on workshop in nature reserves. Learn ethical wildlife photography practices, camera techniques, and contribute to conservation documentation. All skill levels welcome.',
    date: '2024-09-25',
    time: '06:00',
    location: 'Sanjay Gandhi National Park, Mumbai',
    coordinates: { lat: 19.2147, lng: 72.9101 },
    organizer: 'Wildlife Lens India',
    contact: { phone: '+91-9123456790', email: 'contact@wildlifelens.in', whatsapp: '+91-9123456790' },
    banner: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Photography tips booklet', 'Nature conservation guides', 'Photo contest entry'],
    participants: 45,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '8',
    title: 'Pet Adoption Fair - Delhi',
    description: 'Mega pet adoption event featuring rescued animals from multiple shelters.',
    fullDescription: 'The largest pet adoption fair in Delhi featuring over 200 rescued dogs, cats, and other animals from certified shelters. Includes on-site veterinary checkups, adoption counseling, and post-adoption support services.',
    date: '2024-10-05',
    time: '10:00',
    location: 'India Gate Lawns, New Delhi',
    coordinates: { lat: 28.6129, lng: 77.2295 },
    organizer: 'Delhi Animal Welfare Society',
    contact: { phone: '+91-9988776656', email: 'adopt@daws.org', whatsapp: '+91-9988776656' },
    banner: 'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg',
    category: 'Adoption Drives',
    rewards: ['Pet starter kits', 'Free vet consultations', 'Adoption certificates'],
    participants: 567,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '9',
    title: 'Animal Rights Awareness March',
    description: 'Peaceful march advocating for stronger animal protection laws.',
    fullDescription: 'Join thousands of animal lovers in a peaceful march demanding stronger animal protection laws, better enforcement of existing regulations, and increased penalties for animal cruelty. Together we can be the voice for the voiceless.',
    date: '2024-10-15',
    time: '16:00',
    location: 'Jantar Mantar, New Delhi',
    coordinates: { lat: 28.6273, lng: 77.2194 },
    organizer: 'Animal Rights Coalition',
    contact: { phone: '+91-9876543212', email: 'march@animalrights.in', whatsapp: '+91-9876543212' },
    banner: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
    category: 'Animal Protection',
    rewards: ['Awareness ribbons', 'Information pamphlets', 'March certificates'],
    participants: 1234,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '10',
    title: 'Elephant Conservation Workshop',
    description: 'Educational workshop on elephant conservation and human-wildlife conflict.',
    fullDescription: 'Learn about elephant behavior, conservation challenges, and solutions to human-wildlife conflict. Features presentations by wildlife experts, documentary screenings, and interactive sessions with conservationists.',
    date: '2024-10-20',
    time: '14:00',
    location: 'Wildlife Institute, Dehradun',
    coordinates: { lat: 30.3165, lng: 78.0322 },
    organizer: 'Elephant Conservation Network',
    contact: { phone: '+91-9123456791', email: 'info@elephantcare.org', whatsapp: '+91-9123456791' },
    banner: 'https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Conservation handbooks', 'Elephant adoption certificates', 'Workshop certificates'],
    participants: 89,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/631292/pexels-photo-631292.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '11',
    title: 'Street Dog Sterilization Camp',
    description: 'Free sterilization and vaccination camp for street dogs.',
    fullDescription: 'Professional veterinary team conducting free sterilization surgeries for street dogs to control population humanely. Includes post-operative care, vaccination, and community education about animal birth control.',
    date: '2024-09-30',
    time: '07:00',
    location: 'Municipal Grounds, Pune',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    organizer: 'Pune Animal Welfare Society',
    contact: { phone: '+91-9988776657', email: 'sterilization@paws.org', whatsapp: '+91-9988776657' },
    banner: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    category: 'Stray Animal Care',
    rewards: ['Medical certificates', 'Care instructions', 'Volunteer appreciation'],
    participants: 156,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '12',
    title: 'Bird Conservation Awareness',
    description: 'Workshop on urban bird conservation and creating bird-friendly spaces.',
    fullDescription: 'Learn about urban bird species, their challenges, and how to create bird-friendly environments in cities. Includes bird watching sessions, nest box making workshop, and tips for balcony gardening for birds.',
    date: '2024-10-08',
    time: '09:00',
    location: 'Cubbon Park, Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    organizer: 'Bangalore Bird Watchers',
    contact: { phone: '+91-9123456792', email: 'birds@bbw.org', whatsapp: '+91-9123456792' },
    banner: 'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Bird identification guides', 'Nest box kits', 'Bird watching certificates'],
    participants: 67,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '13',
    title: 'Animal Shelter Volunteer Drive',
    description: 'Recruitment drive for animal shelter volunteers and foster families.',
    fullDescription: 'Join our mission to care for abandoned and rescued animals. We are looking for dedicated volunteers for daily care activities, foster families for temporary care, and skilled professionals for specialized services.',
    date: '2024-09-28',
    time: '11:00',
    location: 'Animal Shelter, Gurgaon',
    coordinates: { lat: 28.4595, lng: 77.0266 },
    organizer: 'Gurgaon Animal Shelter',
    contact: { phone: '+91-9876543213', email: 'volunteer@gurgaonshelter.org', whatsapp: '+91-9876543213' },
    banner: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    category: 'Animal Protection',
    rewards: ['Volunteer ID cards', 'Training materials', 'Appreciation certificates'],
    participants: 234,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '14',
    title: 'Marine Life Protection Rally',
    description: 'Coastal cleanup and marine life protection awareness campaign.',
    fullDescription: 'Protect our oceans and marine life through beach cleanup activities, awareness sessions about plastic pollution, and educational programs about marine ecosystem conservation. Includes underwater cleanup by certified divers.',
    date: '2024-10-12',
    time: '06:30',
    location: 'Marina Beach, Chennai',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    organizer: 'Marine Conservation India',
    contact: { phone: '+91-9123456793', email: 'ocean@marinecare.in', whatsapp: '+91-9123456793' },
    banner: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Eco-friendly bags', 'Marine life guides', 'Conservation certificates'],
    participants: 445,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '15',
    title: 'Pet Therapy Training Program',
    description: 'Training program for pet therapy volunteers and their animals.',
    fullDescription: 'Comprehensive training program for volunteers and their pets to provide therapeutic services in hospitals, nursing homes, and schools. Includes behavioral assessment, training techniques, and certification process.',
    date: '2024-10-25',
    time: '10:00',
    location: 'Training Center, Hyderabad',
    coordinates: { lat: 17.3850, lng: 78.4867 },
    organizer: 'Pet Therapy Association',
    contact: { phone: '+91-9988776658', email: 'therapy@petcare.org', whatsapp: '+91-9988776658' },
    banner: 'https://images.pexels.com/photos/4269505/pexels-photo-4269505.jpeg',
    category: 'Animal Protection',
    rewards: ['Training manuals', 'Therapy pet certificates', 'Volunteer badges'],
    participants: 123,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/4269505/pexels-photo-4269505.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '16',
    title: 'Wildlife Corridor Restoration',
    description: 'Community-driven wildlife corridor restoration and tree plantation drive.',
    fullDescription: 'Join hands to restore wildlife corridors by planting native trees, removing invasive species, and creating safe passages for animals. Includes educational sessions on ecosystem restoration and biodiversity conservation.',
    date: '2024-11-02',
    time: '07:00',
    location: 'Forest Reserve, Coorg',
    coordinates: { lat: 12.3375, lng: 75.8069 },
    organizer: 'Forest Conservation Network',
    contact: { phone: '+91-9123456794', email: 'restore@forestcare.org', whatsapp: '+91-9123456794' },
    banner: 'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Plantation certificates', 'Native plant saplings', 'Conservation handbooks'],
    participants: 89,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '17',
    title: 'Animal Cruelty Prevention Workshop',
    description: 'Educational workshop on recognizing and preventing animal cruelty.',
    fullDescription: 'Learn to identify signs of animal abuse, understand legal procedures for reporting cruelty, and discover ways to prevent animal suffering in your community. Features legal experts, veterinarians, and animal welfare officers.',
    date: '2024-11-08',
    time: '14:00',
    location: 'Law College, Mumbai',
    coordinates: { lat: 19.0760, lng: 72.8777 },
    organizer: 'Legal Aid for Animals',
    contact: { phone: '+91-9876543214', email: 'legal@animalaid.org', whatsapp: '+91-9876543214' },
    banner: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
    category: 'Anti-Abuse Awareness',
    rewards: ['Legal guide booklets', 'Reporting procedure cards', 'Workshop certificates'],
    participants: 178,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '18',
    title: 'Senior Pet Care Seminar',
    description: 'Specialized care techniques for elderly pets and adoption of senior animals.',
    fullDescription: 'Comprehensive seminar on caring for senior pets, understanding age-related health issues, and promoting adoption of older animals. Includes veterinary advice, nutrition guidance, and emotional support techniques.',
    date: '2024-11-15',
    time: '11:00',
    location: 'Veterinary College, Chennai',
    coordinates: { lat: 13.0827, lng: 80.2707 },
    organizer: 'Senior Pet Care Society',
    contact: { phone: '+91-9123456795', email: 'senior@petcare.org', whatsapp: '+91-9123456795' },
    banner: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    category: 'Adoption Drives',
    rewards: ['Senior pet care guides', 'Health monitoring charts', 'Adoption priority cards'],
    participants: 145,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '19',
    title: 'Urban Wildlife Coexistence Forum',
    description: 'Forum discussing peaceful coexistence between urban development and wildlife.',
    fullDescription: 'Multi-stakeholder forum bringing together urban planners, wildlife experts, and citizens to discuss sustainable urban development that considers wildlife needs. Includes case studies, solution workshops, and policy discussions.',
    date: '2024-11-20',
    time: '09:30',
    location: 'Convention Center, Bengaluru',
    coordinates: { lat: 12.9716, lng: 77.5946 },
    organizer: 'Urban Wildlife Alliance',
    contact: { phone: '+91-9988776659', email: 'forum@urbanwildlife.org', whatsapp: '+91-9988776659' },
    banner: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg',
    category: 'Wildlife Conservation',
    rewards: ['Policy recommendation booklets', 'Urban planning guides', 'Forum certificates'],
    participants: 267,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg'],
    updates: [],
    discussions: []
  },
  {
    id: '20',
    title: 'Animal Rescue Training Camp',
    description: 'Intensive training camp for animal rescue volunteers and emergency responders.',
    fullDescription: 'Three-day intensive training camp covering animal rescue techniques, first aid for animals, disaster response protocols, and safe handling of different species. Includes hands-on practice sessions and certification.',
    date: '2024-11-25',
    time: '08:00',
    location: 'Training Academy, Pune',
    coordinates: { lat: 18.5204, lng: 73.8567 },
    organizer: 'Animal Emergency Response Team',
    contact: { phone: '+91-9876543215', email: 'rescue@animalemergency.org', whatsapp: '+91-9876543215' },
    banner: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    category: 'Animal Protection',
    rewards: ['Rescue equipment kits', 'Training certificates', 'Emergency contact cards'],
    participants: 98,
    isFavorite: false,
    isJoined: false,
    gallery: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg'],
    updates: [],
    discussions: []
  }
];

const categories = [
  'All Categories',
  'Animal Protection',
  'Anti-Abuse Awareness', 
  'Adoption Drives',
  'Wildlife Conservation',
  'Stray Animal Care'
];

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(dummyCampaigns);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('date');
  const [newMessage, setNewMessage] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    date: '',
    time: '',
    location: '',
    organizer: '',
    phone: '',
    email: '',
    whatsapp: '',
    category: 'Animal Protection',
    rewards: '',
    banner: ''
  });

  useEffect(() => {
    const savedCampaigns = localStorage.getItem('campaigns');
    if (savedCampaigns) {
      setCampaigns(JSON.parse(savedCampaigns));
    }
  }, []);

  const saveCampaigns = (updatedCampaigns: Campaign[]) => {
    setCampaigns(updatedCampaigns);
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
  };

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      fullDescription: formData.fullDescription,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      coordinates: { lat: 0, lng: 0 },
      organizer: formData.organizer,
      contact: {
        phone: formData.phone,
        email: formData.email,
        whatsapp: formData.whatsapp
      },
      banner: formData.banner || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
      category: formData.category,
      rewards: formData.rewards.split(',').map(r => r.trim()).filter(r => r),
      participants: 0,
      isFavorite: false,
      isJoined: false,
      gallery: [],
      updates: [],
      discussions: []
    };

    saveCampaigns([newCampaign, ...campaigns]);
    setShowCreateForm(false);
    setFormData({
      title: '', description: '', fullDescription: '', date: '', time: '', location: '',
      organizer: '', phone: '', email: '', whatsapp: '', category: 'Animal Protection', rewards: '', banner: ''
    });
  };

  const toggleFavorite = (campaignId: string) => {
    const updated = campaigns.map(c => 
      c.id === campaignId ? { ...c, isFavorite: !c.isFavorite } : c
    );
    saveCampaigns(updated);
  };

  const joinCampaign = (campaignId: string) => {
    const updated = campaigns.map(c => 
      c.id === campaignId ? { 
        ...c, 
        isJoined: !c.isJoined,
        participants: c.isJoined ? c.participants - 1 : c.participants + 1
      } : c
    );
    saveCampaigns(updated);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedCampaign) return;
    
    const message = {
      id: Date.now().toString(),
      user: 'You',
      message: newMessage,
      timestamp: new Date().toLocaleString(),
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    };

    const updated = campaigns.map(c => 
      c.id === selectedCampaign.id 
        ? { ...c, discussions: [...c.discussions, message] }
        : c
    );
    
    saveCampaigns(updated);
    setSelectedCampaign({ ...selectedCampaign, discussions: [...selectedCampaign.discussions, message] });
    setNewMessage('');
  };

  const shareContent = async (campaign: Campaign) => {
    const shareData = {
      title: campaign.title,
      text: `Join "${campaign.title}" on ${campaign.date} at ${campaign.location}. Organized by ${campaign.organizer}`,
      url: window.location.href
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}`);
    }
  };

  const filteredCampaigns = campaigns
    .filter(c => selectedCategory === 'All Categories' || c.category === selectedCategory)
    .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 c.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'participants') return b.participants - a.participants;
      return 0;
    });

  if (selectedCampaign) {
    return (
      <div className="min-h-screen p-4" style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%)'
      }}>
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedCampaign(null)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden">
            <img 
              src={selectedCampaign.banner} 
              alt={selectedCampaign.title}
              className="w-full h-64 object-cover"
            />
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedCampaign.title}</h1>
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                    {selectedCampaign.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleFavorite(selectedCampaign.id)}
                    className={`p-2 rounded-full ${selectedCampaign.isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Heart className="w-5 h-5" fill={selectedCampaign.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => shareContent(selectedCampaign)}
                    className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <span>{new Date(selectedCampaign.date).toLocaleDateString()} at {selectedCampaign.time}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <span>{selectedCampaign.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span>{selectedCampaign.participants} participants</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Organizer</h3>
                  <p className="text-gray-600">{selectedCampaign.organizer}</p>
                  <div className="flex gap-2">
                    <a href={`tel:${selectedCampaign.contact.phone}`} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </a>
                    <a href={`mailto:${selectedCampaign.contact.email}`} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <Mail className="w-4 h-4" />
                    </a>
                    <a href={`https://wa.me/${selectedCampaign.contact.whatsapp}`} className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                      <MessageSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">About This Campaign</h3>
                <p className="text-gray-600 leading-relaxed">{selectedCampaign.fullDescription}</p>
              </div>

              {selectedCampaign.rewards.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Free Materials & Rewards</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.rewards.map((reward, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => joinCampaign(selectedCampaign.id)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-colors ${
                    selectedCampaign.isJoined
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {selectedCampaign.isJoined ? 'Leave Campaign' : 'Join Campaign'}
                </button>
              </div>

              {/* Updates Section */}
              {selectedCampaign.updates.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4">Campaign Updates</h3>
                  <div className="space-y-3">
                    {selectedCampaign.updates.map(update => (
                      <div key={update.id} className={`p-4 rounded-lg ${update.pinned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-2">
                          {update.pinned && <Pin className="w-4 h-4 text-yellow-600 mt-1" />}
                          <div className="flex-1">
                            <p className="text-gray-800">{update.message}</p>
                            <p className="text-sm text-gray-500 mt-1">{update.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Discussion Section */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Discussion</h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto mb-4">
                  {selectedCampaign.discussions.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No discussions yet. Be the first to ask a question!</p>
                  ) : (
                    <div className="space-y-4">
                      {selectedCampaign.discussions.map(msg => (
                        <div key={msg.id} className="flex gap-3">
                          <img src={msg.avatar} alt={msg.user} className="w-8 h-8 rounded-full object-cover" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm text-gray-800">{msg.user}</span>
                              <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            </div>
                            <p className="text-gray-700 text-sm">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Ask a question or share your thoughts..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="min-h-screen p-4" style={{
        background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%)'
      }}>
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowCreateForm(false)}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Campaign</h2>
            
            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                <textarea
                  required
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({...formData, fullDescription: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  rows={4}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Banner/Poster</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({...formData, banner: event.target?.result as string});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                {formData.banner && (
                  <div className="mt-2">
                    <img src={formData.banner} alt="Campaign banner preview" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rewards/Free Materials (comma separated)</label>
                <input
                  type="text"
                  value={formData.rewards}
                  onChange={(e) => setFormData({...formData, rewards: e.target.value})}
                  placeholder="T-shirts, Stickers, Pamphlets"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{
            background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(179, 136, 255, 0.8)'
          }}>Animal Awareness Campaigns</h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed mb-8" style={{
            background: 'linear-gradient(135deg, #a0e7ff, #d4b3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(160, 231, 255, 0.4)'
          }}>Discover, create, and participate in campaigns for animal welfare</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl hover:bg-emerald-700 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Create Campaign
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="date">Sort by Date</option>
                <option value="participants">Sort by Popularity</option>
              </select>
            </div>
          </div>
        </div>

        {/* Campaign Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <div key={campaign.id} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <img 
                src={campaign.banner} 
                alt={campaign.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                    {campaign.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleFavorite(campaign.id)}
                      className={`p-2 rounded-full ${campaign.isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}
                    >
                      <Heart className="w-4 h-4" fill={campaign.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => shareContent(campaign)}
                      className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{campaign.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(campaign.date).toLocaleDateString()} at {campaign.time}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {campaign.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    {campaign.participants} participants
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => joinCampaign(campaign.id)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                      campaign.isJoined
                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {campaign.isJoined ? 'Joined' : 'Join'}
                  </button>
                  <button
                    onClick={() => setSelectedCampaign(campaign)}
                    className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No campaigns found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}