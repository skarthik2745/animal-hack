import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useAuth } from '../AuthContext';

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createProfile = async (userData: any) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: user.id,
        email: user.email,
        full_name: userData.name || user.name,
        avatar_url: userData.avatar_url || null
      }])
      .select()
      .single();
    
    if (data && !error) {
      setProfile(data);
    }
    return { data, error };
  };

  const getProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (data && !error) {
      setProfile(data);
    } else if (error && error.code === 'PGRST116') {
      // Profile doesn't exist, create it
      await createProfile(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getProfile();
    }
  }, [user]);

  return { profile, loading, createProfile, getProfile };
};