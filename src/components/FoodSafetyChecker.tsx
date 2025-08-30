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

  useEffect(() => {
    const createBouncingBalls = () => {
      const container = document.querySelector('.food-safety-page');
      if (!container) return;
      
      const colors = ['#FF4444', '#4444FF', '#44FF44', '#FFFF44', '#FF44FF', '#FF8844'];
      
      // Main area balls (lower 70%)
      for (let i = 0; i < 200; i++) {
        const ball = document.createElement('div');
        ball.className = 'bouncing-ball';
        ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = Math.random() * 100 + '%';
        ball.style.top = (Math.random() * 70 + 30) + '%';
        ball.style.animationDelay = Math.random() * 5 + 's';
        ball.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(ball);
      }
      
      // Top left corner balls
      for (let i = 0; i < 24; i++) {
        const ball = document.createElement('div');
        ball.className = 'bouncing-ball';
        ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = Math.random() * 25 + '%';
        ball.style.top = Math.random() * 25 + '%';
        ball.style.animationDelay = Math.random() * 5 + 's';
        ball.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(ball);
      }
      
      // Top right corner balls
      for (let i = 0; i < 25; i++) {
        const ball = document.createElement('div');
        ball.className = 'bouncing-ball';
        ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = (Math.random() * 25 + 75) + '%';
        ball.style.top = Math.random() * 25 + '%';
        ball.style.animationDelay = Math.random() * 5 + 's';
        ball.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(ball);
      }
      
      // Top center balls (above heading)
      for (let i = 0; i < 20; i++) {
        const ball = document.createElement('div');
        ball.className = 'bouncing-ball';
        ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        ball.style.left = (Math.random() * 50 + 25) + '%';
        ball.style.top = Math.random() * 15 + '%';
        ball.style.animationDelay = Math.random() * 5 + 's';
        ball.style.animationDuration = (Math.random() * 3 + 2) + 's';
        container.appendChild(ball);
      }
    };
    
    createBouncingBalls();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');
        .food-safety-page {
          position: relative;
          min-height: 100vh;
          padding-top: 80px;
          background: linear-gradient(135deg, #E8F5E8 0%, #FFF9C4 50%, #E1F5FE 100%);
          overflow: hidden;
        }
        
        .bouncing-ball {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: bounce 3s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-50px) translateX(30px);
          }
          50% {
            transform: translateY(0) translateX(60px);
          }
          75% {
            transform: translateY(-30px) translateX(90px);
          }
        }
        
        .food-heading {
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 3.5rem;
          background: linear-gradient(90deg, #00695C, #004D40, #00BCD4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0px 4px 16px rgba(0, 105, 92, 0.5);
          margin-bottom: 1rem;
        }
        
        .food-subline {
          font-family: 'Nunito', sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #00695C;
          border-bottom: 4px solid #00BCD4;
          display: inline-block;
          padding-bottom: 8px;
        }
      `}</style>
      
      <div className="food-safety-page">
        <div className="max-w-4xl mx-auto px-4 py-8" style={{position: 'relative', zIndex: 1}}>
          <div className="text-center mb-8">
            <h1 className="food-heading">Food Safety Checker</h1>
            <p className="food-subline">Check if foods are safe for your pet before sharing</p>
          </div>

        {/* Pet Selection */}
        <Card className="p-6 mb-6">
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
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Methods */}
          <Card className="p-6">
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
          </Card>

          {/* Results */}
          <Card className="p-6">
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
          </Card>
        </div>
        </div>
      </div>
    </>
  );
};

export default FoodSafetyChecker;