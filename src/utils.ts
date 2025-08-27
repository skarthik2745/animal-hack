import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mockData = {
  events: [
    {
      id: '1',
      title: 'Weekend Pet Adoption Drive',
      description: 'Join us for a wonderful weekend adoption event featuring dogs and cats of all ages.',
      organizerId: '1',
      organizer: 'Happy Paws Rescue',
      startDate: '2025-01-20T10:00:00Z',
      endDate: '2025-01-20T16:00:00Z',
      location: { address: 'Central Park Pavilion', lat: 40.7829, lng: -73.9654 },
      capacity: 50,
      attendees: 45,
      poster: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      gallery: ['https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'],
      tags: ['dogs', 'cats', 'adoption'],
      isFree: true,
      status: 'active' as const,
      createdAt: '2025-01-15T00:00:00Z'
    }
  ],
  providers: [
    {
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
    }
  ],
  lostFoundPets: [
    {
      id: '1',
      type: 'lost' as const,
      petName: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      color: 'Golden',
      description: 'Friendly golden retriever, responds to Max',
      lastSeen: { address: 'Central Park', lat: 40.7829, lng: -73.9654, date: '2025-01-15T14:00:00Z' },
      images: ['https://images.pexels.com/photos/2023384/pexels-photo-2023384.jpeg?auto=compress&cs=tinysrgb&w=600'],
      contactInfo: { name: 'John Doe', phone: '+1 (555) 987-6543', email: 'john@example.com' },
      reward: 500,
      microchip: 'Yes',
      status: 'active' as const,
      createdAt: '2025-01-15T00:00:00Z'
    }
  ],
  emergencyContacts: [
    {
      id: '1',
      name: 'Animal Emergency Hotline',
      phone: '911',
      type: 'govt' as const,
      services: ['Emergency Rescue', 'Animal Control'],
      location: 'Nationwide',
      available24x7: true,
      verified: true
    }
  ]
};