import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T[]) {
  const [storedValue, setStoredValue] = useState<T[]>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T[] | ((val: T[]) => T[])) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  const addItem = (item: T & { id: string }) => {
    setValue(prev => [...prev, item]);
  };

  const updateItem = (id: string, updates: Partial<T>) => {
    setValue(prev => prev.map(item => 
      (item as any).id === id ? { ...item, ...updates } : item
    ));
  };

  const removeItem = (id: string) => {
    setValue(prev => prev.filter(item => (item as any).id !== id));
  };

  return [storedValue, setValue, addItem, updateItem, removeItem] as const;
}