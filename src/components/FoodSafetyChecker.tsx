import React, { useState, useEffect } from 'react';
import { Upload, Search, AlertTriangle, CheckCircle, Camera, Loader2 } from 'lucide-react';
import { Card } from './Card';

interface SafetyResult {
  food: string;
  status: 'safe' | 'unsafe' | 'caution';
  reason: string;
  benefits?: string;
  alternatives?: string;
}

const FoodSafetyChecker: React.FC = () => {
  const [selectedPet, setSelectedPet] = useState('dog');
  const [foodInput, setFoodInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SafetyResult | null>(null);

  const petTypes = [
    { id: 'dog', name: 'Dog', emoji: '🐕' },
    { id: 'cat', name: 'Cat', emoji: '🐱' },
    { id: 'rabbit', name: 'Rabbit', emoji: '🐰' },
    { id: 'bird', name: 'Bird', emoji: '🦜' },
    { id: 'hamster', name: 'Hamster', emoji: '🐹' }
  ];

  const analyzeFood = async (food: string, imageData?: string) => {
    setIsAnalyzing(true);
    
    try {
      const prompt = imageData 
        ? `Analyze this food image and determine if it's safe for a ${selectedPet}. Identify the food and provide safety information.`
        : `Is "${food}" safe for a ${selectedPet} to eat?`;

      const parts = imageData 
        ? [
            { text: `${prompt} Format as JSON: {"food":"name","status":"safe/unsafe/caution","reason":"explanation","benefits":"if safe","alternatives":"if unsafe"}` },
            { inline_data: { mime_type: "image/jpeg", data: imageData.split(',')[1] } }
          ]
        : [{ text: `${prompt} Format as JSON: {"food":"${food}","status":"safe/unsafe/caution","reason":"explanation","benefits":"if safe","alternatives":"if unsafe"}` }];

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeGrdNlhxR_7UrxU0Lqyb8kUNo7-6uKIk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts }]
        })
      });

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const safetyData = JSON.parse(jsonMatch[0]);
          setResult(safetyData);
        }
      }
    } catch (error) {
      // Fallback based on common knowledge
      const unsafeFoods = ['chocolate', 'grapes', 'onion', 'garlic', 'avocado', 'xylitol'];
      const isUnsafe = unsafeFoods.some(unsafe => food.toLowerCase().includes(unsafe));
      
      setResult({
        food: food || 'Unknown food',
        status: isUnsafe ? 'unsafe' : 'safe',
        reason: isUnsafe ? 'Contains toxic compounds for pets' : 'Generally safe in moderation',
        benefits: isUnsafe ? undefined : 'Provides nutrients when given appropriately',
        alternatives: isUnsafe ? 'Try pet-safe treats like carrots or apple slices' : undefined
      });
    }
    
    setIsAnalyzing(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      setSelectedImage(imageData);
      analyzeFood('', imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleTextSearch = () => {
    if (foodInput.trim()) {
      analyzeFood(foodInput.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'text-green-600 bg-green-50 border-green-200';
      case 'unsafe': return 'text-red-600 bg-red-50 border-red-200';
      case 'caution': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'unsafe': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'caution': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      default: return null;
    }
  };



  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a0033 50%, #001a33 100%)',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(135deg, #00e5ff, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 20px rgba(179, 136, 255, 0.5)'
          }}>Food Safety Checker</h1>
          <p className="text-xl" style={{
            background: 'linear-gradient(135deg, #a0e7ff, #d4b3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(160, 231, 255, 0.4)'
          }}>Check if foods are safe for your pet before sharing</p>
        </div>

        {/* Pet Selection */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Your Pet Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {petTypes.map((pet) => (
              <button
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedPet === pet.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-2">{pet.emoji}</div>
                <div className="font-medium">{pet.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Methods */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Check Food Safety</h2>
            
            {/* Text Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type food name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={foodInput}
                  onChange={(e) => setFoodInput(e.target.value)}
                  placeholder="e.g., chocolate, apple, carrot..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                />
                <button
                  onClick={handleTextSearch}
                  disabled={!foodInput.trim() || isAnalyzing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="text-center text-gray-500 mb-4">OR</div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload food photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {selectedImage ? (
                  <div className="space-y-3">
                    <img src={selectedImage} alt="Food" className="max-h-32 mx-auto rounded" />
                    <button
                      onClick={() => { setSelectedImage(null); setResult(null); }}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Choose different image
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                        id="food-upload"
                      />
                      <label
                        htmlFor="food-upload"
                        className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700"
                      >
                        Upload Photo
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Safety Result</h2>

            {isAnalyzing ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-lg">Analyzing food safety...</span>
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}>
                  <div className="flex items-center mb-2">
                    {getStatusIcon(result.status)}
                    <h3 className="text-xl font-bold ml-2 capitalize">{result.status}</h3>
                  </div>
                  <p className="font-medium text-lg">{result.food}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
                  <p className="text-gray-700">{result.reason}</p>
                </div>

                {result.benefits && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Benefits</h4>
                    <p className="text-green-800">{result.benefits}</p>
                  </div>
                )}

                {result.alternatives && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Safe Alternatives</h4>
                    <p className="text-blue-800">{result.alternatives}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🍎</div>
                <p>Enter a food name or upload a photo to check safety for your {selectedPet}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSafetyChecker;