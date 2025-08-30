import React, { useState, useRef } from 'react';
import { Send, Mic, Camera, Upload, MapPin, Phone, AlertTriangle, CheckCircle, Clock, User, Bot } from 'lucide-react';
import { Card } from './Card';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  urgency?: 'low' | 'medium' | 'high';
}

interface SymptomAnalysis {
  condition: string;
  causes: string[];
  urgency: 'home-care' | 'vet-recommended' | 'emergency';
  recommendations: string[];
  nearbyVets?: any[];
}

const AIVirtualVet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'symptoms'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI Virtual Vet Assistant 🐾 How can I help you and your pet today?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMode, setChatMode] = useState<'casual' | 'professional'>('casual');
  const [symptomAnalysis, setSymptomAnalysis] = useState<SymptomAnalysis | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analyzeWithAI = async (query: string, imageData?: string) => {
    const modePrompt = chatMode === 'casual' 
      ? 'Answer in a friendly, easy-to-understand way as a caring vet assistant.'
      : 'Provide scientific, professional veterinary advice with medical terminology.';

    const prompt = activeTab === 'symptoms'
      ? `Analyze these pet symptoms: "${query}". Provide JSON: {"condition":"name","causes":["cause1","cause2"],"urgency":"home-care/vet-recommended/emergency","recommendations":["rec1","rec2"]}. ${modePrompt}`
      : `Pet care question: "${query}". ${modePrompt}`;

    try {
      const parts = imageData 
        ? [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: imageData.split(',')[1] } }
          ]
        : [{ text: prompt }];

      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeGrdNlhxR_7UrxU0Lqyb8kUNo7-6uKIk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t process that request. Please try again.';
    } catch (error) {
      return 'I\'m having trouble connecting right now. For urgent matters, please contact your local vet immediately.';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText || 'Uploaded an image',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAnalyzing(true);

    const response = await analyzeWithAI(inputText, selectedImage);
    
    if (activeTab === 'symptoms') {
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const analysis = JSON.parse(jsonMatch[0]);
          setSymptomAnalysis(analysis);
        }
      } catch (error) {
        // Fallback for symptoms
        setSymptomAnalysis({
          condition: 'General Pet Discomfort',
          causes: ['Stress', 'Minor irritation', 'Environmental factors'],
          urgency: 'vet-recommended',
          recommendations: ['Monitor symptoms', 'Ensure comfort', 'Contact vet if worsens']
        });
      }
    }

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setInputText('');
    setSelectedImage(null);
    setIsAnalyzing(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'home-care': return 'text-green-600 bg-green-50 border-green-200';
      case 'vet-recommended': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'emergency': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'home-care': return <CheckCircle className="h-5 w-5" />;
      case 'vet-recommended': return <Clock className="h-5 w-5" />;
      case 'emergency': return <AlertTriangle className="h-5 w-5" />;
      default: return null;
    }
  };

  const mockVets = [
    { name: 'City Animal Hospital', phone: '(555) 123-4567', distance: '0.8 miles' },
    { name: 'Pet Care Clinic', phone: '(555) 987-6543', distance: '1.2 miles' }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@400;600;700;800&family=Poppins:wght@400;500;600&display=swap');
        .vet-page {
          position: relative;
          min-height: 100vh;
          padding-top: 80px;
          background: linear-gradient(45deg, #1e3a8a, #06b6d4, #7c3aed, #ec4899);
          background-size: 400% 400%;
          animation: gradientShift 5s ease-in-out infinite;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .vet-heading {
          font-family: 'Montserrat Alternates', sans-serif;
          font-weight: 800;
          font-size: 4.5rem;
          color: #ffffff;
          text-shadow: 0px 0px 30px rgba(255, 255, 255, 0.8), 0px 0px 60px rgba(255, 255, 255, 0.4);
          margin-bottom: 1rem;
        }
        
        .vet-subheading {
          font-family: 'Poppins', sans-serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: #a7f3d0;
          text-shadow: 0px 0px 15px rgba(167, 243, 208, 0.6);
        }
      `}</style>
      
      <div className="vet-page">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="vet-heading">AI Virtual Vet Assistant</h1>
            <p className="vet-subheading">24/7 AI-powered pet health guidance and symptom analysis</p>
          </div>

        {/* Mode & Tab Selection */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'chat' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💬 Chat Assistant
            </button>
            <button
              onClick={() => {
                setActiveTab('symptoms');
                setMessages([{
                  id: Date.now().toString(),
                  type: 'bot',
                  content: 'Welcome to the Symptom Checker! 🔍 Please describe your pet\'s symptoms or upload a photo.',
                  timestamp: new Date()
                }]);
                setSymptomAnalysis(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'symptoms' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🔍 Symptom Checker
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setChatMode('casual')}
              className={`px-3 py-1 rounded text-sm ${
                chatMode === 'casual' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Casual
            </button>
            <button
              onClick={() => setChatMode('professional')}
              className={`px-3 py-1 rounded text-sm ${
                chatMode === 'professional' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Professional
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <div className="flex items-center mb-1">
                        {message.type === 'user' ? <User className="h-4 w-4 mr-1" /> : <Bot className="h-4 w-4 mr-1" />}
                        <span className="text-xs opacity-75">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isAnalyzing && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t p-4">
                {selectedImage && (
                  <div className="mb-3">
                    <img src={selectedImage} alt="Upload" className="h-20 w-20 object-cover rounded border" />
                    <button onClick={() => setSelectedImage(null)} className="text-xs text-red-600 ml-2">Remove</button>
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={activeTab === 'chat' ? 'Ask about pet care...' : 'Describe symptoms...'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                  />
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() && !selectedImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Symptom Analysis & Emergency Contacts */}
          <div className="space-y-6">
            {activeTab === 'symptoms' && symptomAnalysis && (
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">🔍 Analysis Results</h3>
                
                <div className={`p-3 rounded-lg border-2 mb-4 ${getUrgencyColor(symptomAnalysis.urgency)}`}>
                  <div className="flex items-center mb-2">
                    {getUrgencyIcon(symptomAnalysis.urgency)}
                    <span className="ml-2 font-medium capitalize">
                      {symptomAnalysis.urgency.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="font-medium">{symptomAnalysis.condition}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Possible Causes:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {symptomAnalysis.causes.map((cause, index) => (
                        <li key={index}>• {cause}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Recommendations:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {symptomAnalysis.recommendations.map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Emergency Contacts */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                Emergency Vets Nearby
              </h3>
              
              <div className="space-y-3">
                {mockVets.map((vet, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{vet.name}</h4>
                      <span className="text-xs text-gray-500">{vet.distance}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{vet.phone}</span>
                      <div className="flex space-x-2">
                        <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                          <Phone className="h-3 w-3 inline mr-1" />
                          Call
                        </button>
                        <button className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          <MapPin className="h-3 w-3 inline mr-1" />
                          Map
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h3 className="text-lg font-semibold mb-3 text-yellow-800">⚠️ Important Notice</h3>
              <p className="text-sm text-yellow-700">
                This AI assistant provides general guidance only. For serious symptoms or emergencies, 
                always consult a licensed veterinarian immediately.
              </p>
            </Card>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default AIVirtualVet;