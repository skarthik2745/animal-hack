import { useState, useEffect } from 'react';
import { Event } from '../types';
import db from '../lib/database';
import { useAuth } from '../AuthContext';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const refreshEvents = async () => {
    setLoading(true);
    const { data, error } = await db.getEvents();
    if (data && !error && data.length > 0) {
      setEvents(data);
    } else {
      // Add dummy data when no events are found
      const dummyEvents: Event[] = [
        {
          id: '1',
          title: 'Mega Pet Adoption Drive - Mumbai',
          description: 'Join us for the largest pet adoption event in Mumbai! Over 200 rescued dogs, cats, and other animals looking for loving homes.',
          organizer: 'Mumbai Animal Welfare Society',
          organizerId: '1',
          startDate: '2025-02-15T10:00:00Z',
          endDate: '2025-02-15T18:00:00Z',
          location: { address: 'Juhu Beach, Mumbai, Maharashtra' },
          poster: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
          gallery: [
            'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          isFree: true,
          attendees: 156,
          tags: ['dogs', 'cats', 'adoption']
        },
        {
          id: '2',
          title: 'Street Dogs Vaccination & Adoption Camp',
          description: 'Free vaccination camp for street dogs along with adoption opportunities for healthy, vaccinated pets.',
          organizer: 'Delhi Street Animal Care',
          organizerId: '2',
          startDate: '2025-02-20T09:00:00Z',
          endDate: '2025-02-20T17:00:00Z',
          location: { address: 'Central Park, Connaught Place, New Delhi' },
          poster: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=800',
          gallery: [
            'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          isFree: true,
          attendees: 89,
          tags: ['dogs', 'vaccination', 'street animals']
        },
        {
          id: '3',
          title: 'Cat Lovers Adoption Festival',
          description: 'Special event dedicated to finding homes for rescued cats and kittens. Includes cat care workshops and free health checkups.',
          organizer: 'Bangalore Cat Rescue',
          organizerId: '3',
          startDate: '2025-02-25T11:00:00Z',
          endDate: '2025-02-25T16:00:00Z',
          location: { address: 'Cubbon Park, Bangalore, Karnataka' },
          poster: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800',
          gallery: [
            'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          isFree: true,
          attendees: 67,
          tags: ['cats', 'kittens', 'workshops']
        },
        {
          id: '4',
          title: 'Senior Pets Need Love Too',
          description: 'Special adoption drive focusing on senior pets who need extra care and love in their golden years.',
          organizer: 'Golden Years Pet Sanctuary',
          organizerId: '4',
          startDate: '2025-03-01T10:30:00Z',
          endDate: '2025-03-01T15:30:00Z',
          location: { address: 'Marine Drive, Chennai, Tamil Nadu' },
          poster: 'https://images.pexels.com/photos/1931367/pexels-photo-1931367.jpeg?auto=compress&cs=tinysrgb&w=800',
          gallery: [
            'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          isFree: true,
          attendees: 34,
          tags: ['senior pets', 'dogs', 'cats']
        },
        {
          id: '5',
          title: 'Exotic Birds Adoption & Care Workshop',
          description: 'Learn about exotic bird care while meeting beautiful rescued birds looking for specialized homes.',
          organizer: 'Avian Rescue India',
          organizerId: '5',
          startDate: '2025-03-05T14:00:00Z',
          endDate: '2025-03-05T18:00:00Z',
          location: { address: 'Nehru Park, Pune, Maharashtra' },
          poster: 'https://images.pexels.com/photos/45853/grey-crowned-crane-bird-crane-animal-45853.jpeg?auto=compress&cs=tinysrgb&w=800',
          gallery: [
            'https://images.pexels.com/photos/326900/pexels-photo-326900.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          isFree: true,
          attendees: 23,
          tags: ['birds', 'exotic', 'workshop']
        },
        {
          id: '6',
          title: 'Puppy Adoption Carnival',
          description: 'Fun-filled event with puppy adoptions, training demonstrations, and family activities. Perfect for families with children.',
          organizer: 'Happy Tails Foundation',
          organizerId: '6',
          startDate: '2025-03-10T10:00:00Z',
          endDate: '2025-03-10T17:00:00Z',
          location: { address: 'Phoenix Mall, Hyderabad, Telangana' },
          poster: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=800',
          gallery: [
            'https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'
          ],
          isFree: true,
          attendees: 198,
          tags: ['puppies', 'families', 'training']
        }
      ];
      setEvents(dummyEvents);
    }
    setLoading(false);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const addEvent = async (event: any) => {
    if (!user) return;
    const eventData = {
      title: event.title,
      description: event.description,
      start_date: event.start_date,
      end_date: event.end_date || event.start_date,
      location_address: event.location_address,
      poster_url: event.poster_url,
      gallery: event.gallery || [],
      is_free: event.is_free,
      attendees: event.attendees || 0,
      organizer_id: user.id
    };
    const { data, error } = await db.createEvent(eventData);
    if (error) {
      console.error('Database error:', error);
      throw error;
    }
    await refreshEvents();
    return data;
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    const { data, error } = await db.updateEvent(id, updates);
    if (!error) {
      await refreshEvents();
    }
    return data;
  };

  const deleteEvent = async (id: string) => {
    const { error } = await db.deleteEvent(id);
    if (!error) {
      await refreshEvents();
    }
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
    loading
  };
};