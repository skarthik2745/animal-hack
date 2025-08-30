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
  availability JSONB,
  services TEXT[],
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

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Caretakers are viewable by everyone" ON caretakers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Caretakers can update own profile" ON caretakers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Pet owners can manage own pets" ON pets FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Booking participants can view bookings" ON bookings FOR SELECT USING (
  auth.uid() = pet_owner_id OR 
  auth.uid() = (SELECT user_id FROM caretakers WHERE id = caretaker_id)
);

-- Insert 5 users
INSERT INTO users (id, email, name, phone, user_type, location) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'john@example.com', 'John Doe', '+1234567890', 'owner', 'New York, NY'),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', 'Sarah Smith', '+1234567891', 'caretaker', 'Los Angeles, CA'),
('550e8400-e29b-41d4-a716-446655440003', 'mike@example.com', 'Mike Johnson', '+1234567892', 'both', 'Chicago, IL'),
('550e8400-e29b-41d4-a716-446655440004', 'emma@example.com', 'Emma Wilson', '+1234567893', 'caretaker', 'Miami, FL'),
('550e8400-e29b-41d4-a716-446655440005', 'alex@example.com', 'Alex Brown', '+1234567894', 'owner', 'Seattle, WA');

-- Insert 5 caretakers
INSERT INTO caretakers (user_id, experience, description, rating, services, hourly_rate, total_reviews) VALUES
('550e8400-e29b-41d4-a716-446655440002', '5 years', 'Experienced pet sitter with love for all animals', 4.8, ARRAY['Pet Sitting', 'Dog Walking', 'Pet Grooming'], 25.00, 15),
('550e8400-e29b-41d4-a716-446655440003', '3 years', 'Professional dog trainer and pet care specialist', 4.6, ARRAY['Pet Training', 'Pet Sitting', 'Veterinary Care'], 30.00, 12),
('550e8400-e29b-41d4-a716-446655440004', '7 years', 'Certified veterinary assistant specializing in exotic pets', 4.9, ARRAY['Veterinary Care', 'Pet Sitting', 'Emergency Care'], 35.00, 25),
('550e8400-e29b-41d4-a716-446655440001', '2 years', 'Part-time pet walker and dog lover', 4.3, ARRAY['Dog Walking', 'Pet Sitting'], 20.00, 8),
('550e8400-e29b-41d4-a716-446655440005', '4 years', 'Cat specialist with grooming certification', 4.7, ARRAY['Pet Grooming', 'Cat Care', 'Pet Sitting'], 28.00, 18);

-- Insert 5 pets
INSERT INTO pets (owner_id, name, species, breed, age, weight, medical_conditions, special_instructions, photo_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Buddy', 'Dog', 'Golden Retriever', 3, 30.5, 'None', 'Loves treats and belly rubs', 'https://example.com/buddy.jpg'),
('550e8400-e29b-41d4-a716-446655440001', 'Whiskers', 'Cat', 'Persian', 2, 4.2, 'Allergic to fish', 'Indoor cat only', 'https://example.com/whiskers.jpg'),
('550e8400-e29b-41d4-a716-446655440005', 'Charlie', 'Dog', 'Labrador', 5, 28.0, 'Hip dysplasia', 'Needs medication twice daily', 'https://example.com/charlie.jpg'),
('550e8400-e29b-41d4-a716-446655440005', 'Luna', 'Cat', 'Siamese', 1, 3.8, 'None', 'Very playful, needs lots of toys', 'https://example.com/luna.jpg'),
('550e8400-e29b-41d4-a716-446655440003', 'Max', 'Dog', 'German Shepherd', 4, 35.0, 'None', 'Well trained, responds to commands', 'https://example.com/max.jpg');

-- Insert 5 bookings
INSERT INTO bookings (pet_owner_id, caretaker_id, pet_id, service_type, start_date, end_date, total_amount, status, special_requests) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'), (SELECT id FROM pets WHERE name = 'Buddy'), 'Pet Sitting', '2024-01-15 09:00:00+00', '2024-01-15 17:00:00+00', 200.00, 'completed', 'Please take photos during walks'),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440003'), (SELECT id FROM pets WHERE name = 'Charlie'), 'Veterinary Care', '2024-01-20 10:00:00+00', '2024-01-20 11:00:00+00', 120.00, 'confirmed', 'Medication administration needed'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440004'), (SELECT id FROM pets WHERE name = 'Whiskers'), 'Pet Grooming', '2024-01-25 14:00:00+00', '2024-01-25 16:00:00+00', 80.00, 'pending', 'Be gentle, first time grooming'),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'), (SELECT id FROM pets WHERE name = 'Luna'), 'Pet Sitting', '2024-02-01 08:00:00+00', '2024-02-03 18:00:00+00', 600.00, 'confirmed', 'Weekend care needed'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440004'), (SELECT id FROM pets WHERE name = 'Max'), 'Pet Training', '2024-02-05 15:00:00+00', '2024-02-05 16:30:00+00', 90.00, 'in_progress', 'Advanced obedience training');

-- Insert 5 messages
INSERT INTO messages (booking_id, sender_id, message_text, message_type) VALUES
((SELECT id FROM bookings WHERE service_type = 'Pet Sitting' AND total_amount = 200.00 LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', 'Hi Sarah! Looking forward to you taking care of Buddy tomorrow.', 'text'),
((SELECT id FROM bookings WHERE service_type = 'Pet Sitting' AND total_amount = 200.00 LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 'Hello John! I am excited to meet Buddy. What time should I arrive?', 'text'),
((SELECT id FROM bookings WHERE service_type = 'Veterinary Care' LIMIT 1), '550e8400-e29b-41d4-a716-446655440005', 'Please remember Charlie needs his medication at 2 PM', 'text'),
((SELECT id FROM bookings WHERE service_type = 'Pet Grooming' LIMIT 1), '550e8400-e29b-41d4-a716-446655440004', 'I will be very gentle with Whiskers. Any specific grooming requests?', 'text'),
((SELECT id FROM bookings WHERE service_type = 'Pet Sitting' AND total_amount = 600.00 LIMIT 1), '550e8400-e29b-41d4-a716-446655440002', 'Luna is such a sweet cat! She is playing with her toys right now.', 'text');

-- Insert 5 reviews
INSERT INTO reviews (booking_id, reviewer_id, caretaker_id, rating, comment) VALUES
((SELECT id FROM bookings WHERE service_type = 'Pet Sitting' AND total_amount = 200.00 LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'), 5, 'Sarah was amazing with Buddy! Highly recommend her services.'),
((SELECT id FROM bookings WHERE service_type = 'Veterinary Care' LIMIT 1), '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440003'), 4, 'Mike was professional and took great care of Charlie.'),
((SELECT id FROM bookings WHERE service_type = 'Pet Grooming' LIMIT 1), '550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440004'), 5, 'Emma did an excellent job grooming Whiskers. Very gentle and caring.'),
((SELECT id FROM bookings WHERE service_type = 'Pet Sitting' AND total_amount = 600.00 LIMIT 1), '550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440002'), 5, 'Sarah provided excellent weekend care for Luna. Will book again!'),
((SELECT id FROM bookings WHERE service_type = 'Pet Training' LIMIT 1), '550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM caretakers WHERE user_id = '550e8400-e29b-41d4-a716-446655440004'), 4, 'Emma is knowledgeable about dog training. Max learned new commands.');

-- Insert 5 emergency contacts
INSERT INTO emergency_contacts (pet_id, name, relationship, phone, email) VALUES
((SELECT id FROM pets WHERE name = 'Buddy'), 'Jane Doe', 'Wife', '+1234567895', 'jane@example.com'),
((SELECT id FROM pets WHERE name = 'Whiskers'), 'Bob Smith', 'Brother', '+1234567896', 'bob@example.com'),
((SELECT id FROM pets WHERE name = 'Charlie'), 'Lisa Brown', 'Sister', '+1234567897', 'lisa@example.com'),
((SELECT id FROM pets WHERE name = 'Luna'), 'Tom Wilson', 'Friend', '+1234567898', 'tom@example.com'),
((SELECT id FROM pets WHERE name = 'Max'), 'Amy Johnson', 'Neighbor', '+1234567899', 'amy@example.com');

-- Insert 5 notifications
INSERT INTO notifications (user_id, title, message, type, read) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Booking Confirmed', 'Your pet sitting booking with Sarah has been confirmed for tomorrow.', 'booking', false),
('550e8400-e29b-41d4-a716-446655440002', 'New Review', 'You received a 5-star review from John for pet sitting services.', 'review', true),
('550e8400-e29b-41d4-a716-446655440003', 'Payment Received', 'Payment of $120 has been received for veterinary care services.', 'payment', false),
('550e8400-e29b-41d4-a716-446655440004', 'New Booking Request', 'You have a new grooming request for a Persian cat.', 'booking', false),
('550e8400-e29b-41d4-a716-446655440005', 'Reminder', 'Don''t forget Charlie''s medication at 2 PM today.', 'reminder', true);