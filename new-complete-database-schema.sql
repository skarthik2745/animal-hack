-- Complete Pet Care Platform Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS emergency_contacts CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS caretakers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Adoption Events Page
CREATE TABLE adoption_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location VARCHAR(255) NOT NULL,
  organizer_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  max_participants INTEGER,
  registration_required BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO adoption_events (title, description, event_date, start_time, end_time, location, organizer_name, contact_phone, contact_email, max_participants, registration_required) VALUES
('Happy Tails Adoption Fair', 'Find your perfect furry companion at our monthly adoption event', '2024-02-15', '10:00:00', '16:00:00', 'Central Park Community Center', 'Sarah Johnson', '+1234567890', 'sarah@happytails.org', 100, TRUE),
('Rescue Dogs Unite', 'Special event featuring rescue dogs of all sizes and breeds', '2024-02-22', '09:00:00', '15:00:00', 'Downtown Pet Plaza', 'Mike Wilson', '+1234567891', 'mike@rescuedogs.com', 75, TRUE),
('Cats & Kittens Galore', 'Adoption event specifically for cats and kittens', '2024-03-01', '11:00:00', '17:00:00', 'Westside Animal Shelter', 'Emma Davis', '+1234567892', 'emma@catshelter.org', 50, FALSE),
('Senior Pets Need Love Too', 'Find a loving senior pet who needs a forever home', '2024-03-08', '12:00:00', '18:00:00', 'Riverside Community Hall', 'John Martinez', '+1234567893', 'john@seniorpets.org', 60, TRUE),
('Exotic Pet Adoption Day', 'Special event for rabbits, birds, and other small animals', '2024-03-15', '10:30:00', '16:30:00', 'North Valley Pet Center', 'Lisa Chen', '+1234567894', 'lisa@exoticpets.com', 40, TRUE);

-- 2. Pet Doctors and Hospitals Page
CREATE TABLE pet_hospitals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  website VARCHAR(255),
  specialties TEXT[],
  emergency_services BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.0,
  opening_hours VARCHAR(255),
  doctor_name VARCHAR(255),
  years_experience INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO pet_hospitals (name, address, city, phone, email, website, specialties, emergency_services, rating, opening_hours, doctor_name, years_experience) VALUES
('City Veterinary Clinic', '123 Main Street', 'New York', '+1234567890', 'info@cityvets.com', 'www.cityvets.com', ARRAY['General Care', 'Surgery', 'Dental'], TRUE, 4.8, 'Mon-Fri 8AM-8PM, Sat-Sun 9AM-5PM', 'Dr. Sarah Williams', 15),
('Pet Emergency Hospital', '456 Oak Avenue', 'Los Angeles', '+1234567891', 'emergency@pethospital.com', 'www.pethospital.com', ARRAY['Emergency Care', 'Critical Care', 'Surgery'], TRUE, 4.9, '24/7 Emergency Services', 'Dr. Michael Brown', 20),
('Companion Animal Clinic', '789 Pine Road', 'Chicago', '+1234567892', 'care@companionvet.com', 'www.companionvet.com', ARRAY['Preventive Care', 'Vaccinations', 'Wellness'], FALSE, 4.7, 'Mon-Sat 7AM-7PM', 'Dr. Emily Johnson', 12),
('Exotic Pet Specialists', '321 Elm Street', 'Miami', '+1234567893', 'exotic@petspecialists.com', 'www.exoticpets.com', ARRAY['Exotic Animals', 'Birds', 'Reptiles'], FALSE, 4.6, 'Tue-Sat 9AM-6PM', 'Dr. Robert Garcia', 18),
('Mobile Vet Services', '654 Maple Drive', 'Seattle', '+1234567894', 'mobile@homevetcare.com', 'www.mobilevetcare.com', ARRAY['Home Visits', 'Senior Pet Care', 'Palliative Care'], FALSE, 4.5, 'By Appointment Only', 'Dr. Jennifer Lee', 10);

-- 3. Pet Trainers Page
CREATE TABLE pet_trainers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialization VARCHAR(255) NOT NULL,
  experience_years INTEGER NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  hourly_rate DECIMAL(8,2),
  training_methods TEXT,
  certifications TEXT[],
  rating DECIMAL(3,2) DEFAULT 0.0,
  available_days VARCHAR(255),
  home_visits BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO pet_trainers (name, specialization, experience_years, location, phone, email, hourly_rate, training_methods, certifications, rating, available_days, home_visits) VALUES
('Alex Thompson', 'Dog Obedience Training', 8, 'New York, NY', '+1234567890', 'alex@dogtraining.com', 75.00, 'Positive reinforcement, clicker training', ARRAY['CCPDT Certified', 'AKC CGC Evaluator'], 4.9, 'Mon-Fri, Weekends', TRUE),
('Maria Rodriguez', 'Puppy Training & Socialization', 5, 'Los Angeles, CA', '+1234567891', 'maria@puppytraining.com', 60.00, 'Reward-based training, socialization techniques', ARRAY['KPA Certified', 'APDT Member'], 4.8, 'Tue-Sat', FALSE),
('David Kim', 'Behavioral Problem Solving', 12, 'Chicago, IL', '+1234567892', 'david@behaviortraining.com', 90.00, 'Behavior modification, anxiety training', ARRAY['IAABC Certified', 'Fear Free Certified'], 4.7, 'Mon-Sun', TRUE),
('Jessica White', 'Agility & Competition Training', 6, 'Miami, FL', '+1234567893', 'jessica@agilitytraining.com', 80.00, 'Agility training, competition prep', ARRAY['USDAA Judge', 'AKC Agility Instructor'], 4.6, 'Wed-Sun', FALSE),
('Ryan Miller', 'Service Dog Training', 10, 'Seattle, WA', '+1234567894', 'ryan@servicedogtraining.com', 100.00, 'Task training, public access training', ARRAY['ADI Certified', 'IAADP Member'], 4.9, 'Mon-Fri', TRUE);

-- 4. Pet Care and Caretaker Services Page
CREATE TABLE caretaker_services (
  id SERIAL PRIMARY KEY,
  caretaker_name VARCHAR(255) NOT NULL,
  services_offered TEXT[] NOT NULL,
  experience_years INTEGER NOT NULL,
  location VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  hourly_rate DECIMAL(8,2),
  daily_rate DECIMAL(8,2),
  description TEXT,
  availability VARCHAR(255),
  pet_types TEXT[],
  rating DECIMAL(3,2) DEFAULT 0.0,
  background_checked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO caretaker_services (caretaker_name, services_offered, experience_years, location, phone, email, hourly_rate, daily_rate, description, availability, pet_types, rating, background_checked) VALUES
('Sarah Johnson', ARRAY['Pet Sitting', 'Dog Walking', 'Overnight Care'], 7, 'New York, NY', '+1234567890', 'sarah@petcare.com', 25.00, 150.00, 'Experienced pet sitter with love for all animals', 'Mon-Sun, Flexible hours', ARRAY['Dogs', 'Cats', 'Birds'], 4.8, TRUE),
('Mike Wilson', ARRAY['Dog Walking', 'Pet Exercise', 'Basic Training'], 4, 'Los Angeles, CA', '+1234567891', 'mike@dogwalking.com', 20.00, 120.00, 'Active dog walker specializing in high-energy breeds', 'Mon-Fri, Morning & Evening', ARRAY['Dogs'], 4.7, TRUE),
('Emma Davis', ARRAY['Cat Sitting', 'Litter Box Cleaning', 'Medication Administration'], 6, 'Chicago, IL', '+1234567892', 'emma@catcare.com', 22.00, 130.00, 'Cat specialist with veterinary assistant background', 'Tue-Sat, Flexible', ARRAY['Cats', 'Small Animals'], 4.9, TRUE),
('John Martinez', ARRAY['Pet Sitting', 'House Sitting', 'Plant Watering'], 5, 'Miami, FL', '+1234567893', 'john@housepetsitting.com', 30.00, 180.00, 'Reliable house and pet sitter for extended trips', 'Available for multi-day stays', ARRAY['Dogs', 'Cats', 'Fish', 'Birds'], 4.6, TRUE),
('Lisa Chen', ARRAY['Exotic Pet Care', 'Reptile Care', 'Small Animal Care'], 8, 'Seattle, WA', '+1234567894', 'lisa@exoticpetcare.com', 35.00, 200.00, 'Specialist in exotic and unusual pets', 'Wed-Sun, By appointment', ARRAY['Reptiles', 'Birds', 'Rabbits', 'Hamsters'], 4.8, TRUE);

-- 5. Pet Shops and Products Page
CREATE TABLE pet_shops (
  id SERIAL PRIMARY KEY,
  shop_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  website VARCHAR(255),
  product_categories TEXT[] NOT NULL,
  delivery_available BOOLEAN DEFAULT FALSE,
  online_ordering BOOLEAN DEFAULT FALSE,
  opening_hours VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0.0,
  special_offers TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO pet_shops (shop_name, address, city, phone, email, website, product_categories, delivery_available, online_ordering, opening_hours, rating, special_offers) VALUES
('Paws & Claws Pet Store', '123 Pet Street', 'New York', '+1234567890', 'info@pawsandclaws.com', 'www.pawsandclaws.com', ARRAY['Dog Food', 'Cat Food', 'Toys', 'Accessories', 'Grooming Supplies'], TRUE, TRUE, 'Mon-Sat 9AM-8PM, Sun 10AM-6PM', 4.7, '10% off first purchase, Free delivery over $50'),
('The Pet Emporium', '456 Animal Avenue', 'Los Angeles', '+1234567891', 'sales@petemporium.com', 'www.petemporium.com', ARRAY['Premium Pet Food', 'Health Supplements', 'Training Equipment', 'Beds & Furniture'], TRUE, TRUE, 'Daily 8AM-9PM', 4.8, 'Loyalty program, Monthly deals'),
('Furry Friends Supply', '789 Companion Road', 'Chicago', '+1234567892', 'hello@furryfriends.com', 'www.furryfriends.com', ARRAY['Organic Pet Food', 'Natural Treats', 'Eco-friendly Toys', 'Wellness Products'], FALSE, TRUE, 'Tue-Sun 10AM-7PM', 4.6, 'Bulk discounts, Subscription service'),
('Exotic Pet Paradise', '321 Unique Lane', 'Miami', '+1234567893', 'exotic@petparadise.com', 'www.exoticpetparadise.com', ARRAY['Reptile Supplies', 'Bird Food', 'Aquarium Equipment', 'Small Animal Habitats'], TRUE, FALSE, 'Mon-Fri 11AM-7PM, Sat 9AM-6PM', 4.5, 'Expert advice included, Setup services'),
('Budget Pet Supplies', '654 Value Street', 'Seattle', '+1234567894', 'deals@budgetpet.com', 'www.budgetpetsupplies.com', ARRAY['Affordable Pet Food', 'Basic Accessories', 'Cleaning Supplies', 'Generic Medications'], TRUE, TRUE, 'Daily 7AM-10PM', 4.3, 'Lowest price guarantee, Bulk savings');

-- 6. Pet Friendly Restaurants Page
CREATE TABLE pet_friendly_restaurants (
  id SERIAL PRIMARY KEY,
  restaurant_name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  cuisine_type VARCHAR(100),
  pet_amenities TEXT[],
  outdoor_seating BOOLEAN DEFAULT FALSE,
  pet_menu_available BOOLEAN DEFAULT FALSE,
  water_bowls_provided BOOLEAN DEFAULT FALSE,
  pet_size_restrictions VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0.0,
  opening_hours VARCHAR(255),
  special_pet_events TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO pet_friendly_restaurants (restaurant_name, address, city, phone, cuisine_type, pet_amenities, outdoor_seating, pet_menu_available, water_bowls_provided, pet_size_restrictions, rating, opening_hours, special_pet_events) VALUES
('The Barking Bistro', '123 Doggy Drive', 'New York', '+1234567890', 'American', ARRAY['Water bowls', 'Pet treats', 'Leash hooks'], TRUE, TRUE, TRUE, 'All sizes welcome', 4.8, 'Mon-Sun 11AM-10PM', 'Puppy Brunch Sundays'),
('Paws & Pizza', '456 Tail Street', 'Los Angeles', '+1234567891', 'Italian', ARRAY['Outdoor pet area', 'Pet waste bags', 'Shade structures'], TRUE, FALSE, TRUE, 'Medium and small dogs only', 4.6, 'Tue-Sun 12PM-11PM', 'Pizza with your Pooch Fridays'),
('Café Woof', '789 Bark Boulevard', 'Chicago', '+1234567892', 'Café/Bakery', ARRAY['Pet-safe treats', 'Comfortable seating', 'Pet photo wall'], TRUE, TRUE, TRUE, 'All pets welcome', 4.7, 'Daily 7AM-6PM', 'Pet birthday parties available'),
('The Furry Spoon', '321 Whisker Way', 'Miami', '+1234567893', 'Brunch', ARRAY['Pet cooling stations', 'Special pet seating', 'Pet toys'], TRUE, TRUE, TRUE, 'Well-behaved pets only', 4.5, 'Wed-Mon 8AM-3PM', 'Yappy Hour Wednesdays'),
('Tail Waggers Tavern', '654 Companion Court', 'Seattle', '+1234567894', 'Pub Food', ARRAY['Large outdoor area', 'Pet washing station', 'Agility course'], TRUE, FALSE, TRUE, 'Dogs under 80lbs', 4.4, 'Mon-Sat 4PM-12AM', 'Dog training demonstrations');

-- 7. Health and Vaccinations Page
CREATE TABLE vaccination_records (
  id SERIAL PRIMARY KEY,
  pet_name VARCHAR(255) NOT NULL,
  pet_species VARCHAR(100) NOT NULL,
  pet_breed VARCHAR(100),
  owner_name VARCHAR(255) NOT NULL,
  owner_phone VARCHAR(20) NOT NULL,
  vaccine_name VARCHAR(255) NOT NULL,
  vaccination_date DATE NOT NULL,
  next_due_date DATE NOT NULL,
  veterinarian_name VARCHAR(255) NOT NULL,
  clinic_name VARCHAR(255),
  batch_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO vaccination_records (pet_name, pet_species, pet_breed, owner_name, owner_phone, vaccine_name, vaccination_date, next_due_date, veterinarian_name, clinic_name, batch_number, notes) VALUES
('Buddy', 'Dog', 'Golden Retriever', 'John Smith', '+1234567890', 'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)', '2024-01-15', '2025-01-15', 'Dr. Sarah Williams', 'City Veterinary Clinic', 'VAC001234', 'Annual booster completed, no adverse reactions'),
('Whiskers', 'Cat', 'Persian', 'Mary Johnson', '+1234567891', 'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)', '2024-01-20', '2025-01-20', 'Dr. Michael Brown', 'Pet Emergency Hospital', 'VAC001235', 'First adult vaccination, indoor cat'),
('Charlie', 'Dog', 'Labrador Mix', 'Robert Davis', '+1234567892', 'Rabies Vaccine', '2024-01-25', '2027-01-25', 'Dr. Emily Johnson', 'Companion Animal Clinic', 'RAB005678', '3-year rabies vaccine administered'),
('Luna', 'Cat', 'Siamese', 'Lisa Wilson', '+1234567893', 'FeLV (Feline Leukemia)', '2024-02-01', '2025-02-01', 'Dr. Robert Garcia', 'Exotic Pet Specialists', 'FEL009876', 'Outdoor cat, high-risk area'),
('Max', 'Dog', 'German Shepherd', 'David Martinez', '+1234567894', 'Bordetella (Kennel Cough)', '2024-02-05', '2024-08-05', 'Dr. Jennifer Lee', 'Mobile Vet Services', 'BOR004321', 'Required for boarding, 6-month duration');

-- 8. Pet Gallery Page
CREATE TABLE pet_gallery (
  id SERIAL PRIMARY KEY,
  pet_name VARCHAR(255) NOT NULL,
  pet_species VARCHAR(100) NOT NULL,
  pet_breed VARCHAR(100),
  owner_name VARCHAR(255) NOT NULL,
  photo_url TEXT NOT NULL,
  photo_title VARCHAR(255),
  photo_description TEXT,
  upload_date DATE DEFAULT CURRENT_DATE,
  likes_count INTEGER DEFAULT 0,
  category VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  age_months INTEGER,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO pet_gallery (pet_name, pet_species, pet_breed, owner_name, photo_url, photo_title, photo_description, likes_count, category, is_featured, age_months, location) VALUES
('Bella', 'Dog', 'Golden Retriever', 'Sarah Thompson', 'https://example.com/bella_beach.jpg', 'Bella at the Beach', 'My beautiful Golden Retriever enjoying her first beach day!', 156, 'Outdoor Adventures', TRUE, 18, 'California'),
('Mittens', 'Cat', 'Maine Coon', 'John Wilson', 'https://example.com/mittens_window.jpg', 'Window Watching', 'Mittens loves to watch birds from her favorite window perch', 89, 'Indoor Life', FALSE, 36, 'New York'),
('Rocky', 'Dog', 'German Shepherd', 'Mike Davis', 'https://example.com/rocky_training.jpg', 'Training Day Success', 'Rocky mastering his new agility course!', 203, 'Training & Skills', TRUE, 24, 'Texas'),
('Princess', 'Cat', 'Persian', 'Emma Rodriguez', 'https://example.com/princess_groomed.jpg', 'Fresh from the Groomer', 'Princess looking absolutely stunning after her spa day', 127, 'Grooming & Style', FALSE, 42, 'Florida'),
('Buddy', 'Dog', 'Beagle Mix', 'Alex Johnson', 'https://example.com/buddy_playing.jpg', 'Playtime Fun', 'Buddy having the time of his life at the dog park', 178, 'Playtime', FALSE, 12, 'Washington');

-- 9. Pet Stories Page
CREATE TABLE pet_stories (
  id SERIAL PRIMARY KEY,
  story_title VARCHAR(255) NOT NULL,
  pet_name VARCHAR(255) NOT NULL,
  pet_species VARCHAR(100) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  story_content TEXT NOT NULL,
  story_category VARCHAR(100),
  publish_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT TRUE,
  featured_image_url TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO pet_stories (story_title, pet_name, pet_species, author_name, author_email, story_content, story_category, featured_image_url, likes_count, comments_count, tags) VALUES
('From Shelter to Hero: Max''s Journey', 'Max', 'Dog', 'Jennifer Smith', 'jennifer@email.com', 'Max was a scared, abandoned puppy when we found him at the shelter. Today, he''s a certified therapy dog bringing joy to hospital patients. His transformation has been incredible, and he''s taught our family so much about resilience and love.', 'Rescue Stories', 'https://example.com/max_therapy.jpg', 245, 18, ARRAY['rescue', 'therapy dog', 'transformation']),
('The Great Escape Artist: Houdini the Cat', 'Houdini', 'Cat', 'Robert Johnson', 'robert@email.com', 'Our cat Houdini earned his name through his incredible ability to escape from any enclosure. From carrier crates to closed rooms, he always finds a way out. Here are some of his most impressive escape stories that left us both frustrated and amazed.', 'Funny Stories', 'https://example.com/houdini_escape.jpg', 189, 25, ARRAY['funny', 'escape artist', 'clever cat']),
('Bella''s Battle: Overcoming Cancer Together', 'Bella', 'Dog', 'Sarah Williams', 'sarah@email.com', 'When Bella was diagnosed with cancer at age 8, our world turned upside down. This is the story of her brave fight, the treatments that saved her life, and how she''s now thriving at age 10. Her strength inspired our entire family.', 'Health Journey', 'https://example.com/bella_recovery.jpg', 312, 42, ARRAY['cancer survivor', 'health journey', 'inspiration']),
('The Unlikely Friendship: Dog and Duck', 'Charlie', 'Dog', 'Mike Davis', 'mike@email.com', 'Charlie, our Labrador, formed the most unusual friendship with a wild duck that visits our pond. Every morning, they have their routine together. This heartwarming story shows how animals can form bonds across species.', 'Friendship Stories', 'https://example.com/charlie_duck.jpg', 156, 31, ARRAY['friendship', 'unusual bond', 'heartwarming']),
('Rescued and Rescuer: Luna''s New Purpose', 'Luna', 'Cat', 'Emma Martinez', 'emma@email.com', 'Luna was rescued from a hoarding situation, traumatized and fearful. Through patience and love, she not only recovered but became a foster mom to orphaned kittens. Her maternal instincts have saved dozens of babies.', 'Rescue Stories', 'https://example.com/luna_kittens.jpg', 278, 36, ARRAY['rescue', 'foster mom', 'second chances']);

-- 10. Lost and Found Pets Page
CREATE TABLE lost_found_pets (
  id SERIAL PRIMARY KEY,
  status VARCHAR(20) CHECK (status IN ('lost', 'found', 'reunited')) NOT NULL,
  pet_name VARCHAR(255),
  pet_species VARCHAR(100) NOT NULL,
  pet_breed VARCHAR(100),
  pet_color VARCHAR(100),
  pet_size VARCHAR(50),
  distinctive_features TEXT,
  last_seen_location VARCHAR(255) NOT NULL,
  last_seen_date DATE NOT NULL,
  contact_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(20) NOT NULL,
  contact_email VARCHAR(255),
  reward_offered DECIMAL(8,2),
  additional_info TEXT,
  photo_url TEXT,
  is_microchipped BOOLEAN DEFAULT FALSE,
  microchip_number VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO lost_found_pets (status, pet_name, pet_species, pet_breed, pet_color, pet_size, distinctive_features, last_seen_location, last_seen_date, contact_name, contact_phone, contact_email, reward_offered, additional_info, photo_url, is_microchipped, microchip_number) VALUES
('lost', 'Buddy', 'Dog', 'Golden Retriever', 'Golden/Cream', 'Large', 'White patch on chest, wearing blue collar', 'Central Park, near playground', '2024-02-10', 'John Smith', '+1234567890', 'john@email.com', 500.00, 'Very friendly, responds to name, may approach strangers', 'https://example.com/lost_buddy.jpg', TRUE, 'MC123456789'),
('found', NULL, 'Cat', 'Tabby Mix', 'Gray and White', 'Medium', 'White paws, green eyes, very thin', 'Downtown area, near Main Street', '2024-02-12', 'Sarah Johnson', '+1234567891', 'sarah@email.com', NULL, 'Found hiding under car, appears hungry and scared', 'https://example.com/found_tabby.jpg', FALSE, NULL),
('lost', 'Princess', 'Cat', 'Persian', 'White', 'Small', 'Long fluffy fur, pink collar with bell', 'Residential area on Oak Street', '2024-02-08', 'Mary Wilson', '+1234567892', 'mary@email.com', 300.00, 'Indoor cat, not used to outdoors, very shy', 'https://example.com/lost_princess.jpg', TRUE, 'MC987654321'),
('found', NULL, 'Dog', 'Mixed Breed', 'Black and Brown', 'Medium', 'Floppy ears, no collar, limping slightly', 'Highway rest stop, Route 95', '2024-02-14', 'Mike Davis', '+1234567893', 'mike@email.com', NULL, 'Friendly but cautious, appears to be lost for several days', 'https://example.com/found_mixed.jpg', FALSE, NULL),
('reunited', 'Charlie', 'Dog', 'Beagle', 'Tri-color', 'Medium', 'Long ears, white tip on tail', 'Neighborhood park on Elm Avenue', '2024-02-05', 'Lisa Martinez', '+1234567894', 'lisa@email.com', 200.00, 'REUNITED! Thank you to everyone who helped search', 'https://example.com/reunited_charlie.jpg', TRUE, 'MC456789123');

-- 11. Report Animal Abuse Page
CREATE TABLE animal_abuse_reports (
  id SERIAL PRIMARY KEY,
  report_type VARCHAR(100) NOT NULL,
  animal_species VARCHAR(100),
  location_address VARCHAR(255) NOT NULL,
  incident_date DATE,
  incident_description TEXT NOT NULL,
  reporter_name VARCHAR(255),
  reporter_phone VARCHAR(20),
  reporter_email VARCHAR(255),
  anonymous_report BOOLEAN DEFAULT FALSE,
  urgency_level VARCHAR(20) CHECK (urgency_level IN ('low', 'medium', 'high', 'emergency')) DEFAULT 'medium',
  status VARCHAR(50) CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')) DEFAULT 'reported',
  assigned_officer VARCHAR(255),
  follow_up_required BOOLEAN DEFAULT TRUE,
  evidence_photos TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO animal_abuse_reports (report_type, animal_species, location_address, incident_date, incident_description, reporter_name, reporter_phone, reporter_email, anonymous_report, urgency_level, status, assigned_officer, follow_up_required, evidence_photos) VALUES
('Neglect', 'Dog', '123 Abandoned Street, City', '2024-02-10', 'Dog appears malnourished, no access to water, chained outside in freezing weather', 'Sarah Concerned', '+1234567890', 'sarah@email.com', FALSE, 'high', 'investigating', 'Officer Johnson', TRUE, ARRAY['evidence1.jpg', 'evidence2.jpg']),
('Abandonment', 'Multiple Cats', 'Empty house at 456 Vacant Road', '2024-02-12', 'Multiple cats found in abandoned house, no food or water, several appear sick', NULL, NULL, NULL, TRUE, 'emergency', 'reported', NULL, TRUE, ARRAY['cats_abandoned.jpg']),
('Physical Abuse', 'Cat', 'Apartment complex on Oak Avenue', '2024-02-08', 'Witnessed person kicking cat repeatedly, animal appeared injured', 'Mike Witness', '+1234567892', 'mike@email.com', FALSE, 'high', 'investigating', 'Officer Smith', TRUE, NULL),
('Hoarding', 'Multiple Dogs and Cats', '789 Hoarding Lane', '2024-02-05', 'Strong odor, multiple animals visible through windows, property in poor condition', 'Anonymous Neighbor', NULL, NULL, TRUE, 'medium', 'reported', NULL, TRUE, ARRAY['hoarding_exterior.jpg']),
('Inadequate Shelter', 'Horse', 'Rural property on Country Road 15', '2024-02-14', 'Horse left outside without adequate shelter during storm, no visible food source', 'Lisa Rural', '+1234567894', 'lisa@email.com', FALSE, 'medium', 'resolved', 'Officer Davis', FALSE, ARRAY['horse_conditions.jpg']);

-- 12. Animal Lovers Community Page
CREATE TABLE community_posts (
  id SERIAL PRIMARY KEY,
  post_title VARCHAR(255) NOT NULL,
  post_content TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  post_category VARCHAR(100),
  post_type VARCHAR(50) CHECK (post_type IN ('discussion', 'question', 'advice', 'story', 'event')) DEFAULT 'discussion',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO community_posts (post_title, post_content, author_name, author_email, post_category, post_type, likes_count, comments_count, is_pinned, tags) VALUES
('Best Dog Parks in the City - Share Your Favorites!', 'I''m new to the area and looking for great dog parks where my Golden Retriever can run and socialize. What are your top recommendations? Looking for places with good fencing and water access.', 'Jennifer New', 'jennifer@email.com', 'Local Resources', 'question', 23, 15, FALSE, ARRAY['dog parks', 'recommendations', 'local']),
('Tips for First-Time Cat Owners', 'After years of wanting a cat, I finally adopted one! Any essential tips for a first-time cat parent? I want to make sure I''m doing everything right for my new furry friend.', 'Mark Newbie', 'mark@email.com', 'Pet Care Advice', 'advice', 45, 28, TRUE, ARRAY['cat care', 'first time owner', 'tips']),
('Community Pet Adoption Event - This Saturday!', 'Don''t forget about the big adoption event this Saturday at Central Park! Over 50 dogs and cats looking for homes. I''ll be volunteering at the cat section. Hope to see you there!', 'Sarah Volunteer', 'sarah@email.com', 'Events', 'event', 67, 12, TRUE, ARRAY['adoption event', 'volunteer', 'community']),
('Dealing with Separation Anxiety in Dogs', 'My rescue dog has severe separation anxiety. He destroys things when I leave and neighbors complain about barking. Has anyone successfully worked through this? What techniques worked for you?', 'Mike Struggling', 'mike@email.com', 'Behavioral Issues', 'question', 34, 22, FALSE, ARRAY['separation anxiety', 'dog behavior', 'training']),
('Amazing Recovery Story - Never Give Up Hope', 'Six months ago, I found a severely injured stray cat. Vets said she might not make it. Today, she''s healthy, happy, and the sweetest companion. Sometimes miracles do happen with love and patience.', 'Emma Hope', 'emma@email.com', 'Success Stories', 'story', 89, 31, FALSE, ARRAY['rescue story', 'recovery', 'inspiration']);

-- 13. Awareness Campaign Page
CREATE TABLE awareness_campaigns (
  id SERIAL PRIMARY KEY,
  campaign_title VARCHAR(255) NOT NULL,
  campaign_description TEXT NOT NULL,
  campaign_type VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  organizer_name VARCHAR(255) NOT NULL,
  organizer_contact VARCHAR(255),
  target_audience VARCHAR(255),
  goals TEXT,
  current_participants INTEGER DEFAULT 0,
  target_participants INTEGER,
  campaign_status VARCHAR(50) CHECK (campaign_status IN ('planning', 'active', 'completed', 'cancelled')) DEFAULT 'planning',
  social_media_hashtag VARCHAR(100),
  website_url VARCHAR(255),
  donation_goal DECIMAL(10,2),
  current_donations DECIMAL(10,2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO awareness_campaigns (campaign_title, campaign_description, campaign_type, start_date, end_date, organizer_name, organizer_contact, target_audience, goals, current_participants, target_participants, campaign_status, social_media_hashtag, website_url, donation_goal, current_donations) VALUES
('Spay and Neuter Awareness Month', 'Promoting the importance of spaying and neutering pets to reduce overpopulation and improve pet health. Free and low-cost services available throughout the month.', 'Health & Wellness', '2024-02-01', '2024-02-29', 'City Animal Welfare Society', 'info@animalwelfare.org', 'Pet owners and general public', 'Reduce pet overpopulation by 20% in our city', 156, 500, 'active', '#SpayNeuterSavesLives', 'www.spayneuter2024.org', 25000.00, 8750.00),
('Senior Pet Adoption Drive', 'Special campaign to find loving homes for senior pets (7+ years) who often get overlooked at shelters. Highlighting the benefits of adopting older, calmer companions.', 'Adoption', '2024-03-01', '2024-03-31', 'Golden Years Pet Rescue', 'seniors@petrescue.com', 'Adults 40+ and empty nesters', 'Find homes for 100 senior pets', 23, 100, 'planning', '#SeniorPetsRock', 'www.seniorpetadoption.org', 15000.00, 3200.00),
('Stop Puppy Mills Campaign', 'Educational campaign about the horrors of puppy mills and promoting adoption from shelters and reputable breeders. Includes legislative advocacy for stricter regulations.', 'Education & Advocacy', '2024-02-15', '2024-05-15', 'Humane Society Coalition', 'advocacy@humanecoalition.org', 'Potential pet buyers and legislators', 'Pass new puppy mill legislation', 89, 1000, 'active', '#StopPuppyMills', 'www.stoppuppymills.org', 50000.00, 12500.00),
('Pet Emergency Preparedness Week', 'Teaching pet owners how to prepare for natural disasters and emergencies. Includes creating pet emergency kits and evacuation plans.', 'Emergency Preparedness', '2024-04-01', '2024-04-07', 'Emergency Pet Response Team', 'prepare@petresponse.org', 'All pet owners', 'Educate 5000 families on pet emergency prep', 234, 5000, 'planning', '#PetEmergencyPrep', 'www.petemergencyprep.org', 10000.00, 2100.00),
('Microchip Your Pet Initiative', 'Community-wide effort to increase pet microchipping rates. Offering discounted microchipping events and education about the importance of pet identification.', 'Safety & Identification', '2024-03-15', '2024-04-15', 'Lost Pet Prevention Alliance', 'microchip@lostpetprevention.org', 'Pet owners without microchipped pets', 'Microchip 2000 pets in our community', 67, 2000, 'planning', '#MicrochipSavesLives', 'www.microchipinitiative.org', 8000.00, 1950.00);

-- Create indexes for better performance
CREATE INDEX idx_adoption_events_date ON adoption_events(event_date);
CREATE INDEX idx_pet_hospitals_city ON pet_hospitals(city);
CREATE INDEX idx_pet_trainers_location ON pet_trainers(location);
CREATE INDEX idx_caretaker_services_location ON caretaker_services(location);
CREATE INDEX idx_pet_shops_city ON pet_shops(city);
CREATE INDEX idx_pet_friendly_restaurants_city ON pet_friendly_restaurants(city);
CREATE INDEX idx_vaccination_records_pet_name ON vaccination_records(pet_name);
CREATE INDEX idx_pet_gallery_category ON pet_gallery(category);
CREATE INDEX idx_pet_stories_category ON pet_stories(story_category);
CREATE INDEX idx_lost_found_pets_status ON lost_found_pets(status);
CREATE INDEX idx_abuse_reports_status ON animal_abuse_reports(status);
CREATE INDEX idx_community_posts_category ON community_posts(post_category);
CREATE INDEX idx_campaigns_status ON awareness_campaigns(campaign_status);