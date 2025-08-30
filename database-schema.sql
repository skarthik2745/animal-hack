-- Pet Care Services Database Schema

-- Users table (for both pet owners and caretakers)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  profile_picture TEXT,
  user_type VARCHAR(20) CHECK (user_type IN ('owner', 'caretaker', 'both')) DEFAULT 'owner',
  location VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Caretakers table (extended profile for caretakers)
CREATE TABLE caretakers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  experience TEXT,
  description TEXT,
  rating DECIMAL(3,2) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  availability JSONB, -- Store availability schedule
  services TEXT[], -- Array of services offered
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pets table
CREATE TABLE pets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  species VARCHAR(100) NOT NULL,
  breed VARCHAR(100),
  age INTEGER,
  weight DECIMAL(5,2),
  medical_conditions TEXT,
  special_instructions TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  caretaker_id UUID REFERENCES caretakers(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  service_type VARCHAR(100) NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_amount DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table (for chat functionality)
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text',
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  caretaker_id UUID REFERENCES caretakers(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE emergency_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  relationship VARCHAR(100),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_caretakers_user_id ON caretakers(user_id);
CREATE INDEX idx_caretakers_rating ON caretakers(rating);
CREATE INDEX idx_pets_owner_id ON pets(owner_id);
CREATE INDEX idx_bookings_pet_owner_id ON bookings(pet_owner_id);
CREATE INDEX idx_bookings_caretaker_id ON bookings(caretaker_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_reviews_caretaker_id ON reviews(caretaker_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE caretakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic examples - customize based on your auth setup)
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Caretakers are viewable by everyone" ON caretakers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Caretakers can update own profile" ON caretakers FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Pet owners can manage own pets" ON pets FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Booking participants can view bookings" ON bookings FOR SELECT USING (
  auth.uid() = pet_owner_id OR 
  auth.uid() = (SELECT user_id FROM caretakers WHERE id = caretaker_id)
);

-- Insert sample data
INSERT INTO users (id, email, name, phone, user_type, location) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', '+1234567890', 'owner', 'New York, NY'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'Sarah Smith', '+1234567891', 'caretaker', 'Los Angeles, CA'),
('550e8400-e29b-41d4-a716-446655440003', 'mike@example.com', 'Mike Johnson', '+1234567892', 'both', 'Chicago, IL');

INSERT INTO caretakers (user_id, experience, description, rating, services, hourly_rate) VALUES
('550e8400-e29b-41d4-a716-446655440002', '5 years', 'Experienced pet sitter with love for all animals', 4.8, ARRAY['Pet Sitting', 'Dog Walking', 'Pet Grooming'], 25.00),
('550e8400-e29b-41d4-a716-446655440003', '3 years', 'Professional dog trainer and pet care specialist', 4.6, ARRAY['Pet Training', 'Pet Sitting', 'Veterinary Care'], 30.00);