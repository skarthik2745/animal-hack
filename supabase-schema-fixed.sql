-- Complete SQL Schema for Pet Care Platform
-- Run this in your Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location_address TEXT,
  location_lat DECIMAL,
  location_lng DECIMAL,
  poster_url TEXT,
  gallery TEXT[],
  is_free BOOLEAN DEFAULT true,
  attendees INTEGER DEFAULT 0,
  max_attendees INTEGER,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet Doctors table
CREATE TABLE IF NOT EXISTS public.pet_doctors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT,
  experience_years INTEGER,
  clinic_name TEXT,
  clinic_address TEXT,
  phone TEXT,
  email TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  consultation_fee DECIMAL(10,2),
  availability_hours TEXT,
  image_url TEXT,
  is_online BOOLEAN DEFAULT false,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet Trainers table
CREATE TABLE IF NOT EXISTS public.pet_trainers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  specialization TEXT[],
  experience_years INTEGER,
  training_methods TEXT[],
  location TEXT,
  phone TEXT,
  email TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability TEXT,
  image_url TEXT,
  is_online BOOLEAN DEFAULT false,
  certifications TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet Shops table
CREATE TABLE IF NOT EXISTS public.pet_shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  image_url TEXT,
  opening_hours TEXT,
  services TEXT[],
  delivery_available BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet Profiles table
CREATE TABLE IF NOT EXISTS public.pet_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  pet_name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  gender TEXT,
  weight DECIMAL(5,2),
  color TEXT,
  personality TEXT[],
  medical_conditions TEXT[],
  profile_photo TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  followers UUID[],
  following UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet Posts table (for Pet Stories)
CREATE TABLE IF NOT EXISTS public.pet_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES public.pet_profiles(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  caption TEXT,
  hashtags TEXT[],
  likes UUID[],
  comments_count INTEGER DEFAULT 0,
  is_story BOOLEAN DEFAULT false,
  story_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.pet_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id),
  likes UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lost & Found Posts table
CREATE TABLE IF NOT EXISTS public.lost_found_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  pet_name TEXT,
  species TEXT NOT NULL,
  breed TEXT,
  description TEXT NOT NULL,
  last_seen_date DATE,
  last_seen_time TIME,
  location TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  images TEXT[],
  reward_amount DECIMAL(10,2),
  is_urgent BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Abuse Reports table
CREATE TABLE IF NOT EXISTS public.abuse_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  incident_type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  incident_date DATE NOT NULL,
  incident_time TIME,
  urgency TEXT DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  images TEXT[],
  witness_info TEXT,
  contact_authorities BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'action_taken', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  goal_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  banner_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  participants UUID[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildlife Sanctuaries table
CREATE TABLE IF NOT EXISTS public.wildlife_sanctuaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  area_size TEXT,
  established_year INTEGER,
  species_protected TEXT[],
  contact_info JSONB,
  images TEXT[],
  visiting_hours TEXT,
  entry_fee DECIMAL(10,2),
  conservation_programs TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wildlife Posts table
CREATE TABLE IF NOT EXISTS public.wildlife_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sanctuary_id UUID REFERENCES public.wildlife_sanctuaries(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video')),
  hashtags TEXT[],
  likes UUID[],
  comments_count INTEGER DEFAULT 0,
  is_story BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  logo_url TEXT,
  banner_url TEXT,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  moderators UUID[],
  members UUID[],
  member_count INTEGER DEFAULT 0,
  is_private BOOLEAN DEFAULT false,
  rules TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID REFERENCES public.communities(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL,
  media_url TEXT,
  post_type TEXT DEFAULT 'discussion' CHECK (post_type IN ('discussion', 'question', 'announcement', 'event')),
  likes UUID[],
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for chat functionality)
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID,
  receiver_type TEXT CHECK (receiver_type IN ('user', 'doctor', 'trainer', 'shop')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file', 'audio')),
  file_name TEXT,
  file_size TEXT,
  duration TEXT,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
  is_deleted BOOLEAN DEFAULT false,
  deleted_for_everyone BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pet Caretakers table
CREATE TABLE IF NOT EXISTS public.pet_caretakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  services TEXT[],
  experience_years INTEGER,
  rating DECIMAL(3,2) DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  daily_rate DECIMAL(10,2),
  availability TEXT,
  phone TEXT,
  email TEXT,
  image_url TEXT,
  certifications TEXT[],
  pet_types TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pet_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abuse_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "Users can update own events" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Anyone can view public pet profiles" ON public.pet_profiles FOR SELECT USING (is_public = true OR auth.uid() = owner_id);
CREATE POLICY "Users can create pet profiles" ON public.pet_profiles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own pet profiles" ON public.pet_profiles FOR UPDATE USING (auth.uid() = owner_id);

-- Insert sample data
INSERT INTO public.pet_doctors (name, specialization, clinic_name, phone, email, image_url, is_online) VALUES
('Dr. Sarah Johnson', 'Small Animal Medicine', 'PawCare Veterinary Clinic', '+1-555-0101', 'sarah@pawcare.com', 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('Dr. Michael Chen', 'Exotic Animals', 'Exotic Pet Hospital', '+1-555-0102', 'michael@exoticpet.com', 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=400', false),
('Dr. Emily Rodriguez', 'Emergency Care', '24/7 Animal Emergency', '+1-555-0103', 'emily@emergency.com', 'https://images.pexels.com/photos/4269729/pexels-photo-4269729.jpeg?auto=compress&cs=tinysrgb&w=400', true);

INSERT INTO public.pet_trainers (name, specialization, location, phone, email, image_url, is_online) VALUES
('Alex Thompson', ARRAY['Obedience Training', 'Behavioral Issues'], 'Downtown Area', '+1-555-0201', 'alex@pettraining.com', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=400', true),
('Maria Garcia', ARRAY['Puppy Training', 'Agility'], 'Westside', '+1-555-0202', 'maria@puppyschool.com', 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400', false);

INSERT INTO public.pet_shops (name, description, address, phone, email, image_url) VALUES
('Happy Paws Pet Store', 'Complete pet supplies and accessories', '123 Main St, City Center', '+1-555-0301', 'info@happypaws.com', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400'),
('Furry Friends Emporium', 'Premium pet food and toys', '456 Oak Ave, Suburb', '+1-555-0302', 'contact@furryfriends.com', 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400');

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();