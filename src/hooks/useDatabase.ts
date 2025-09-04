import { useState, useEffect } from 'react';
import db from '../lib/database';
import { useAuth } from '../AuthContext';

export const useDatabase = () => {
  const { user } = useAuth();

  // Pet Stories
  const usePetProfiles = () => {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchProfiles = async (ownerId?: string) => {
      setLoading(true);
      const { data, error } = await db.getPetProfiles(ownerId);
      if (data && !error) setProfiles(data);
      setLoading(false);
    };

    const createProfile = async (profile: any) => {
      const { data, error } = await db.createPetProfile({ ...profile, owner_id: user?.id });
      if (data && !error) await fetchProfiles();
      return { data, error };
    };

    useEffect(() => {
      fetchProfiles();
    }, []);

    return { profiles, loading, fetchProfiles, createProfile };
  };

  // Pet Posts
  const usePetPosts = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async (petId?: string) => {
      setLoading(true);
      const { data, error } = await db.getPetPosts(petId);
      if (data && !error) setPosts(data);
      setLoading(false);
    };

    const createPost = async (post: any) => {
      const { data, error } = await db.createPetPost({ ...post, owner_id: user?.id });
      if (data && !error) await fetchPosts();
      return { data, error };
    };

    const updatePost = async (id: string, updates: any) => {
      const { data, error } = await db.updatePetPost(id, updates);
      if (data && !error) await fetchPosts();
      return { data, error };
    };

    const deletePost = async (id: string) => {
      const { error } = await db.deletePetPost(id);
      if (!error) await fetchPosts();
      return { error };
    };

    useEffect(() => {
      fetchPosts();
    }, []);

    return { posts, loading, fetchPosts, createPost, updatePost, deletePost };
  };

  // Lost & Found
  const useLostFound = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await db.getLostFoundPosts();
      if (data && !error) setPosts(data);
      setLoading(false);
    };

    const createPost = async (post: any) => {
      const { data, error } = await db.createLostFoundPost({ ...post, user_id: user?.id });
      if (data && !error) await fetchPosts();
      return { data, error };
    };

    const updatePost = async (id: string, updates: any) => {
      const { data, error } = await db.updateLostFoundPost(id, updates);
      if (data && !error) await fetchPosts();
      return { data, error };
    };

    const deletePost = async (id: string) => {
      const { error } = await db.deleteLostFoundPost(id);
      if (!error) await fetchPosts();
      return { error };
    };

    useEffect(() => {
      fetchPosts();
    }, []);

    return { posts, loading, fetchPosts, createPost, updatePost, deletePost };
  };

  // Abuse Reports
  const useAbuseReports = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await db.getAbuseReports(user?.id);
      if (data && !error) setReports(data);
      setLoading(false);
    };

    const createReport = async (report: any) => {
      const { data, error } = await db.createAbuseReport({ ...report, reporter_id: user?.id });
      if (data && !error) await fetchReports();
      return { data, error };
    };

    useEffect(() => {
      if (user) fetchReports();
    }, [user]);

    return { reports, loading, fetchReports, createReport };
  };

  // Campaigns
  const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCampaigns = async () => {
      setLoading(true);
      const { data, error } = await db.getCampaigns();
      if (data && !error) setCampaigns(data);
      setLoading(false);
    };

    const createCampaign = async (campaign: any) => {
      const { data, error } = await db.createCampaign({ ...campaign, organizer_id: user?.id });
      if (data && !error) await fetchCampaigns();
      return { data, error };
    };

    const updateCampaign = async (id: string, updates: any) => {
      const { data, error } = await db.updateCampaign(id, updates);
      if (data && !error) await fetchCampaigns();
      return { data, error };
    };

    useEffect(() => {
      fetchCampaigns();
    }, []);

    return { campaigns, loading, fetchCampaigns, createCampaign, updateCampaign };
  };

  // Doctors, Trainers, Shops
  const useDoctors = () => {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchDoctors = async () => {
      setLoading(true);
      const { data, error } = await db.getDoctors();
      if (data && !error) setDoctors(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchDoctors();
    }, []);

    return { doctors, loading, fetchDoctors };
  };

  const useTrainers = () => {
    const [trainers, setTrainers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchTrainers = async () => {
      setLoading(true);
      const { data, error } = await db.getTrainers();
      if (data && !error) setTrainers(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchTrainers();
    }, []);

    return { trainers, loading, fetchTrainers };
  };

  const useShops = () => {
    const [shops, setShops] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchShops = async () => {
      setLoading(true);
      const { data, error } = await db.getShops();
      if (data && !error) setShops(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchShops();
    }, []);

    return { shops, loading, fetchShops };
  };

  const useCaretakers = () => {
    const [caretakers, setCaretakers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCaretakers = async () => {
      setLoading(true);
      const { data, error } = await db.getCaretakers();
      if (data && !error) setCaretakers(data);
      setLoading(false);
    };

    useEffect(() => {
      fetchCaretakers();
    }, []);

    return { caretakers, loading, fetchCaretakers };
  };

  // Wildlife
  const useWildlife = () => {
    const [sanctuaries, setSanctuaries] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSanctuaries = async () => {
      setLoading(true);
      const { data, error } = await db.getWildlifeSanctuaries();
      if (data && !error) setSanctuaries(data);
      setLoading(false);
    };

    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await db.getWildlifePosts();
      if (data && !error) setPosts(data);
      setLoading(false);
    };

    const createPost = async (post: any) => {
      const { data, error } = await db.createWildlifePost({ ...post, author_id: user?.id });
      if (data && !error) await fetchPosts();
      return { data, error };
    };

    useEffect(() => {
      fetchSanctuaries();
      fetchPosts();
    }, []);

    return { sanctuaries, posts, loading, fetchSanctuaries, fetchPosts, createPost };
  };

  // Communities
  const useCommunities = () => {
    const [communities, setCommunities] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchCommunities = async () => {
      setLoading(true);
      const { data, error } = await db.getCommunities();
      if (data && !error) setCommunities(data);
      setLoading(false);
    };

    const createCommunity = async (community: any) => {
      const { data, error } = await db.createCommunity({ ...community, creator_id: user?.id });
      if (data && !error) await fetchCommunities();
      return { data, error };
    };

    useEffect(() => {
      fetchCommunities();
    }, []);

    return { communities, loading, fetchCommunities, createCommunity };
  };

  return {
    usePetProfiles,
    usePetPosts,
    useLostFound,
    useAbuseReports,
    useCampaigns,
    useDoctors,
    useTrainers,
    useShops,
    useCaretakers,
    useWildlife,
    useCommunities
  };
};