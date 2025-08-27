export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  city?: string;
  role: 'guest' | 'user' | 'verified_ngo' | 'verified_vet' | 'verified_trainer' | 'moderator' | 'admin';
  verified: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizer: string;
  startDate: string;
  endDate: string;
  location: { address: string; lat: number; lng: number };
  capacity?: number;
  attendees: number;
  poster?: string;
  gallery: string[];
  tags: string[];
  isFree: boolean;
  status: 'active' | 'full' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'ngo' | 'vet' | 'trainer' | 'shop';
  description: string;
  services: string[];
  location: { address: string; lat: number; lng: number };
  contact: { phone: string; email: string };
  rating: number;
  verified: boolean;
  images: string[];
  hours?: string;
  pricing?: string;
  createdAt: string;
}

export interface LostFoundPet {
  id: string;
  type: 'lost' | 'found';
  petName?: string;
  species: string;
  breed: string;
  color: string;
  description: string;
  lastSeen: { address: string; lat: number; lng: number; date: string };
  images: string[];
  contactInfo: { name: string; phone: string; email: string };
  reward?: number;
  microchip?: string;
  status: 'active' | 'resolved';
  createdAt: string;
}

export interface Report {
  id: string;
  type: 'abuse' | 'content';
  description: string;
  location?: { address: string; lat: number; lng: number };
  images: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  anonymous: boolean;
  reporterId?: string;
  status: 'received' | 'in_review' | 'escalated' | 'resolved' | 'closed';
  createdAt: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  mission: string;
  startDate: string;
  endDate: string;
  targetMetrics: { signups?: number; donations?: number; actions?: number };
  currentProgress: { signups: number; donations: number; actions: number };
  organizerId: string;
  participants: string[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  type: 'college' | 'city' | 'topic';
  location?: string;
  rules: string[];
  officers: string[];
  members: string[];
  meetingSchedule?: string;
  gallery: string[];
  createdAt: string;
}

export interface Story {
  id: string;
  authorId: string;
  author: string;
  content: string;
  media: string[];
  tags: string[];
  views: number;
  reactions: { [key: string]: number };
  expiresAt?: string;
  pinned: boolean;
  createdAt: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'govt' | 'ngo' | 'private';
  services: string[];
  location: string;
  available24x7: boolean;
  verified: boolean;
}

export interface HealthRecord {
  id: string;
  petId: string;
  type: 'vaccination' | 'checkup' | 'treatment' | 'medication';
  title: string;
  description: string;
  date: string;
  nextDue?: string;
  veterinarian?: string;
  documents: string[];
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  images: string[];
  price: { min: number; max: number };
  specifications: { [key: string]: string };
  suitableFor: { species: string[]; ageRange: string; sizeRange: string };
  rating: number;
  reviews: number;
  vendorLink?: string;
}

export interface Sanctuary {
  id: string;
  name: string;
  description: string;
  location: { address: string; lat: number; lng: number };
  visitingInfo: { hours: string; rules: string[]; activities: string[] };
  species: string[];
  gallery: string[];
  virtual?: { tour360: string[]; narration: string };
  contact: { phone: string; email: string; website?: string };
  verified: boolean;
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  taxonomy: { kingdom: string; phylum: string; class: string; order: string; family: string; genus: string };
  conservationStatus: 'LC' | 'NT' | 'VU' | 'EN' | 'CR' | 'EW' | 'EX';
  population?: string;
  threats: string[];
  habitat: string;
  rangeMap?: string;
  images: string[];
  description: string;
  conservationActions: string[];
  sources: string[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  source: string;
  publishedAt: string;
  tags: string[];
  image?: string;
  aiGenerated?: boolean;
}