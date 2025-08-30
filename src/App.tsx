import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Header from './components/CategoryHeader';
import Home from './Home';
import Login from './components/Login';
import Signup from './components/Signup';
import AdoptionEvents from './components/AdoptionEvents';

import PetDoctors from './components/PetDoctors';
import LostFound from './components/LostFound';
import PetTrainers from './components/PetTrainers';
import ReportAbuse from './components/ReportAbuse';
import Campaigns from './components/Campaigns';

import Community from './components/Community';
import PetStories from './components/PetStories';
import EmergencyRescue from './components/EmergencyRescue';
import HealthRecords from './components/HealthRecords';
import PetShops from './components/PetShops';
import PetRestaurants from './components/PetRestaurants';
import WildlifeSanctuary from './components/WildlifeSanctuary';
import EndangeredSpecies from './components/EndangeredSpecies';
import News from './components/News';
import Profile from './components/Profile';
import Footer from './components/Footer';
import DogBreedIdentifier from './components/DogBreedIdentifier';
import FoodSafetyChecker from './components/FoodSafetyChecker';
import PetLanguageTranslator from './components/PetLanguageTranslator';
import AIVirtualVet from './components/AIVirtualVet';
import PetGallery from './components/PetGallery';
import PetCareServices from './components/PetCareServices';
import { AuthProvider } from './AuthContext';
import { initializeStorage } from './storage';

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
            <Header />
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />

                <Route path="/adoption-events" element={<AdoptionEvents />} />

                <Route path="/pet-doctors" element={<PetDoctors />} />
                <Route path="/lost-found" element={<LostFound />} />
                <Route path="/pet-trainers" element={<PetTrainers />} />
                <Route path="/report-abuse" element={<ReportAbuse />} />
                <Route path="/awareness-campaigns" element={<Campaigns />} />

                <Route path="/community" element={<Community />} />
                <Route path="/pet-stories" element={<PetStories />} />
                <Route path="/emergency-numbers" element={<EmergencyRescue />} />
                <Route path="/health-records" element={<HealthRecords />} />
                <Route path="/pet-shops" element={<PetShops />} />
                <Route path="/pet-restaurants" element={<PetRestaurants />} />
                <Route path="/wildlife-sanctuary" element={<WildlifeSanctuary />} />
                <Route path="/endangered-species" element={<EndangeredSpecies />} />
                <Route path="/news" element={<News />} />
                
                <Route path="/ai-assistant/dog-breed" element={<DogBreedIdentifier />} />
                <Route path="/ai-assistant/food-checker" element={<FoodSafetyChecker />} />
                <Route path="/ai-assistant/language-translator" element={<PetLanguageTranslator />} />
                <Route path="/ai-assistant/virtual-vet" element={<AIVirtualVet />} />
                <Route path="/pet-gallery" element={<PetGallery />} />
                <Route path="/pet-care-services" element={<PetCareServices />} />
              </Routes>
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;