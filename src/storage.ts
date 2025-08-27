import { 
  Event, Provider, LostFoundPet, Report, Campaign, Club, Story, 
  EmergencyContact, HealthRecord, Product, Sanctuary, Species, NewsArticle 
} from './types';

// Storage keys for each feature
export const STORAGE_KEYS = {
  ADOPTION_EVENTS: 'adoption_events',
  PET_SURRENDER: 'pet_surrender_providers',
  PET_DOCTORS: 'pet_doctors',
  LOST_FOUND: 'lost_found_pets',
  PET_TRAINERS: 'pet_trainers',
  REPORT_ABUSE: 'abuse_reports',
  AWARENESS_CAMPAIGNS: 'awareness_campaigns',
  WELFARE_CLUBS: 'welfare_clubs',
  COMMUNITY_POSTS: 'community_posts',
  PET_STORIES: 'pet_stories',
  EMERGENCY_NUMBERS: 'emergency_contacts',
  HEALTH_RECORDS: 'health_records',
  PET_SHOPS: 'pet_products',
  WILDLIFE_SANCTUARY: 'wildlife_sanctuaries',
  ENDANGERED_SPECIES: 'endangered_species',
  NEWS: 'news_articles'
} as const;

// Generic storage functions
export const storage = {
  get: <T>(key: string, defaultValue: T[] = []): T[] => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set: <T>(key: string, data: T[]): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },

  add: <T extends { id: string }>(key: string, item: T): T[] => {
    const items = storage.get<T>(key);
    const newItems = [...items, item];
    storage.set(key, newItems);
    return newItems;
  },

  update: <T extends { id: string }>(key: string, id: string, updates: Partial<T>): T[] => {
    const items = storage.get<T>(key);
    const newItems = items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    storage.set(key, newItems);
    return newItems;
  },

  remove: <T extends { id: string }>(key: string, id: string): T[] => {
    const items = storage.get<T>(key);
    const newItems = items.filter(item => item.id !== id);
    storage.set(key, newItems);
    return newItems;
  }
};

// Feature-specific storage functions
export const adoptionEventsStorage = {
  getAll: () => storage.get<Event>(STORAGE_KEYS.ADOPTION_EVENTS),
  add: (event: Event) => storage.add(STORAGE_KEYS.ADOPTION_EVENTS, event),
  update: (id: string, updates: Partial<Event>) => storage.update(STORAGE_KEYS.ADOPTION_EVENTS, id, updates),
  delete: (id: string) => storage.remove(STORAGE_KEYS.ADOPTION_EVENTS, id),
  remove: (id: string) => storage.remove(STORAGE_KEYS.ADOPTION_EVENTS, id)
};

export const petSurrenderStorage = {
  getAll: () => storage.get<Provider>(STORAGE_KEYS.PET_SURRENDER),
  add: (provider: Provider) => storage.add(STORAGE_KEYS.PET_SURRENDER, provider),
  update: (id: string, updates: Partial<Provider>) => storage.update(STORAGE_KEYS.PET_SURRENDER, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.PET_SURRENDER, id)
};

export const petDoctorsStorage = {
  getAll: () => storage.get<Provider>(STORAGE_KEYS.PET_DOCTORS),
  add: (doctor: Provider) => storage.add(STORAGE_KEYS.PET_DOCTORS, doctor),
  update: (id: string, updates: Partial<Provider>) => storage.update(STORAGE_KEYS.PET_DOCTORS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.PET_DOCTORS, id)
};

export const lostFoundStorage = {
  getAll: () => storage.get<LostFoundPet>(STORAGE_KEYS.LOST_FOUND),
  add: (pet: LostFoundPet) => storage.add(STORAGE_KEYS.LOST_FOUND, pet),
  update: (id: string, updates: Partial<LostFoundPet>) => storage.update(STORAGE_KEYS.LOST_FOUND, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.LOST_FOUND, id)
};

export const petTrainersStorage = {
  getAll: () => storage.get<Provider>(STORAGE_KEYS.PET_TRAINERS),
  add: (trainer: Provider) => storage.add(STORAGE_KEYS.PET_TRAINERS, trainer),
  update: (id: string, updates: Partial<Provider>) => storage.update(STORAGE_KEYS.PET_TRAINERS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.PET_TRAINERS, id)
};

export const reportAbuseStorage = {
  getAll: () => storage.get<Report>(STORAGE_KEYS.REPORT_ABUSE),
  add: (report: Report) => storage.add(STORAGE_KEYS.REPORT_ABUSE, report),
  update: (id: string, updates: Partial<Report>) => storage.update(STORAGE_KEYS.REPORT_ABUSE, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.REPORT_ABUSE, id)
};

export const campaignsStorage = {
  getAll: () => storage.get<Campaign>(STORAGE_KEYS.AWARENESS_CAMPAIGNS),
  add: (campaign: Campaign) => storage.add(STORAGE_KEYS.AWARENESS_CAMPAIGNS, campaign),
  update: (id: string, updates: Partial<Campaign>) => storage.update(STORAGE_KEYS.AWARENESS_CAMPAIGNS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.AWARENESS_CAMPAIGNS, id)
};

export const welfareClubsStorage = {
  getAll: () => storage.get<Club>(STORAGE_KEYS.WELFARE_CLUBS),
  add: (club: Club) => storage.add(STORAGE_KEYS.WELFARE_CLUBS, club),
  update: (id: string, updates: Partial<Club>) => storage.update(STORAGE_KEYS.WELFARE_CLUBS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.WELFARE_CLUBS, id)
};

export const communityStorage = {
  getAll: () => storage.get<Story>(STORAGE_KEYS.COMMUNITY_POSTS),
  add: (post: Story) => storage.add(STORAGE_KEYS.COMMUNITY_POSTS, post),
  update: (id: string, updates: Partial<Story>) => storage.update(STORAGE_KEYS.COMMUNITY_POSTS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.COMMUNITY_POSTS, id)
};

export const petStoriesStorage = {
  getAll: () => storage.get<Story>(STORAGE_KEYS.PET_STORIES),
  add: (story: Story) => storage.add(STORAGE_KEYS.PET_STORIES, story),
  update: (id: string, updates: Partial<Story>) => storage.update(STORAGE_KEYS.PET_STORIES, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.PET_STORIES, id)
};

export const emergencyContactsStorage = {
  getAll: () => storage.get<EmergencyContact>(STORAGE_KEYS.EMERGENCY_NUMBERS),
  add: (contact: EmergencyContact) => storage.add(STORAGE_KEYS.EMERGENCY_NUMBERS, contact),
  update: (id: string, updates: Partial<EmergencyContact>) => storage.update(STORAGE_KEYS.EMERGENCY_NUMBERS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.EMERGENCY_NUMBERS, id)
};

export const healthRecordsStorage = {
  getAll: () => storage.get<HealthRecord>(STORAGE_KEYS.HEALTH_RECORDS),
  add: (record: HealthRecord) => storage.add(STORAGE_KEYS.HEALTH_RECORDS, record),
  update: (id: string, updates: Partial<HealthRecord>) => storage.update(STORAGE_KEYS.HEALTH_RECORDS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.HEALTH_RECORDS, id)
};

export const petShopsStorage = {
  getAll: () => storage.get<Product>(STORAGE_KEYS.PET_SHOPS),
  add: (product: Product) => storage.add(STORAGE_KEYS.PET_SHOPS, product),
  update: (id: string, updates: Partial<Product>) => storage.update(STORAGE_KEYS.PET_SHOPS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.PET_SHOPS, id)
};

export const wildlifeSanctuaryStorage = {
  getAll: () => storage.get<Sanctuary>(STORAGE_KEYS.WILDLIFE_SANCTUARY),
  add: (sanctuary: Sanctuary) => storage.add(STORAGE_KEYS.WILDLIFE_SANCTUARY, sanctuary),
  update: (id: string, updates: Partial<Sanctuary>) => storage.update(STORAGE_KEYS.WILDLIFE_SANCTUARY, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.WILDLIFE_SANCTUARY, id)
};

export const endangeredSpeciesStorage = {
  getAll: () => storage.get<Species>(STORAGE_KEYS.ENDANGERED_SPECIES),
  add: (species: Species) => storage.add(STORAGE_KEYS.ENDANGERED_SPECIES, species),
  update: (id: string, updates: Partial<Species>) => storage.update(STORAGE_KEYS.ENDANGERED_SPECIES, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.ENDANGERED_SPECIES, id)
};

export const newsStorage = {
  getAll: () => storage.get<NewsArticle>(STORAGE_KEYS.NEWS),
  add: (article: NewsArticle) => storage.add(STORAGE_KEYS.NEWS, article),
  update: (id: string, updates: Partial<NewsArticle>) => storage.update(STORAGE_KEYS.NEWS, id, updates),
  remove: (id: string) => storage.remove(STORAGE_KEYS.NEWS, id)
};

// Initialize with mock data if empty
export const initializeStorage = () => {
  const mockData = {
    events: [
      {
        id: '1',
        title: 'Weekend Pet Adoption Drive',
        description: 'Join us for a wonderful weekend adoption event featuring dogs and cats of all ages.',
        organizerId: '1',
        organizer: 'Happy Paws Rescue',
        startDate: '2025-02-15T10:00:00Z',
        endDate: '2025-02-15T16:00:00Z',
        location: { address: 'Central Park Pavilion, Downtown', lat: 40.7829, lng: -73.9654 },
        capacity: 50,
        attendees: 45,
        poster: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'],
        tags: ['dogs', 'cats', 'adoption'],
        isFree: true,
        status: 'active' as const,
        createdAt: '2025-01-15T00:00:00Z'
      },
      {
        id: '2',
        title: 'Senior Dogs Need Love Too',
        description: 'Special adoption event focused on finding homes for senior dogs aged 7+ years.',
        organizerId: '2',
        organizer: 'Golden Years Animal Sanctuary',
        startDate: '2025-01-25T09:00:00Z',
        endDate: '2025-01-25T15:00:00Z',
        location: { address: 'Community Center, Westside', lat: 40.7589, lng: -73.9851 },
        capacity: 30,
        attendees: 18,
        poster: 'https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: ['https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=800'],
        tags: ['dogs', 'senior', 'special needs'],
        isFree: true,
        status: 'active' as const,
        createdAt: '2025-01-10T00:00:00Z'
      },
      {
        id: '3',
        title: 'Kitten Season Adoption Fair',
        description: 'Adorable kittens and young cats looking for their forever families.',
        organizerId: '3',
        organizer: 'Feline Friends Rescue',
        startDate: '2025-02-01T11:00:00Z',
        endDate: '2025-02-01T17:00:00Z',
        location: { address: 'Pet Store Plaza, Eastside', lat: 40.7505, lng: -73.9934 },
        capacity: 40,
        attendees: 32,
        poster: 'https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: ['https://images.pexels.com/photos/1643457/pexels-photo-1643457.jpeg?auto=compress&cs=tinysrgb&w=800'],
        tags: ['cats', 'kittens', 'young'],
        isFree: true,
        status: 'active' as const,
        createdAt: '2025-01-12T00:00:00Z'
      },
      {
        id: '4',
        title: 'Small Pets Big Hearts',
        description: 'Rabbits, guinea pigs, and other small animals seeking loving homes.',
        organizerId: '4',
        organizer: 'Small Animal Rescue Network',
        startDate: '2025-02-08T10:00:00Z',
        endDate: '2025-02-08T14:00:00Z',
        location: { address: 'Animal Hospital, Central', lat: 40.7614, lng: -73.9776 },
        capacity: 25,
        attendees: 12,
        poster: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: ['https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800'],
        tags: ['rabbits', 'guinea pigs', 'small animals'],
        isFree: true,
        status: 'active' as const,
        createdAt: '2025-01-14T00:00:00Z'
      },
      {
        id: '5',
        title: 'Valentine\'s Day Pet Adoption',
        description: 'Find your perfect companion this Valentine\'s Day. All pets come with adoption gift packages.',
        organizerId: '1',
        organizer: 'Happy Paws Rescue',
        startDate: '2025-02-14T12:00:00Z',
        endDate: '2025-02-14T18:00:00Z',
        location: { address: 'Love Park Pavilion, Northside', lat: 40.7686, lng: -73.9918 },
        capacity: 60,
        attendees: 28,
        poster: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800',
        gallery: ['https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=800'],
        tags: ['dogs', 'cats', 'valentine', 'special'],
        isFree: true,
        status: 'active' as const,
        createdAt: '2025-01-16T00:00:00Z'
      }
    ],
    providers: [{
      id: '1',
      name: 'Happy Paws Rescue',
      type: 'ngo' as const,
      description: 'Professional animal rescue organization with 10+ years experience',
      services: ['Dog Care', 'Cat Care', 'Emergency Care'],
      location: { address: 'Downtown District', lat: 40.7589, lng: -73.9851 },
      contact: { phone: '+1 (555) 123-4567', email: 'contact@happypaws.org' },
      rating: 4.8,
      verified: true,
      images: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'],
      hours: '9 AM - 6 PM',
      pricing: 'Free services',
      createdAt: '2025-01-01T00:00:00Z'
    }],
    emergencyContacts: [{
      id: '1',
      name: 'Animal Emergency Hotline',
      phone: '911',
      type: 'govt' as const,
      services: ['Emergency Rescue', 'Animal Control'],
      location: 'Nationwide',
      available24x7: true,
      verified: true
    }]
  };

  if (!localStorage.getItem(STORAGE_KEYS.ADOPTION_EVENTS)) {
    storage.set(STORAGE_KEYS.ADOPTION_EVENTS, mockData.events);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PET_SURRENDER)) {
    storage.set(STORAGE_KEYS.PET_SURRENDER, mockData.providers);
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMERGENCY_NUMBERS)) {
    storage.set(STORAGE_KEYS.EMERGENCY_NUMBERS, mockData.emergencyContacts);
  }
};