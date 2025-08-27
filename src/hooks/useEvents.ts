import { useState, useEffect } from 'react';
import { adoptionEventsStorage } from '../storage';
import { Event } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const refreshEvents = () => {
    const allEvents = adoptionEventsStorage.getAll();
    setEvents(allEvents);
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const addEvent = (event: Event) => {
    const updatedEvents = adoptionEventsStorage.add(event);
    setEvents(updatedEvents);
    return updatedEvents;
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const updatedEvents = adoptionEventsStorage.update(id, updates);
    setEvents(updatedEvents);
    return updatedEvents;
  };

  const deleteEvent = (id: string) => {
    const updatedEvents = adoptionEventsStorage.delete(id);
    setEvents(updatedEvents);
    return updatedEvents;
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    refreshEvents
  };
};