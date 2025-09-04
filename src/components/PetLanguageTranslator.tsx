import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Volume2, RotateCcw, Loader2 } from 'lucide-react';
import { Card } from './Card';

interface Translation {
  original: string;
  translation: string;
  emotion: string;
  confidence: number;
}

const PetLanguageTranslator: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [recentTranslations, setRecentTranslations] = useState<Translation[]>([]);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const funTranslations = [
    { sound: 'bark', translations: [
      'Hey human! I heard something outside and we should definitely check it out together right now!',
      'I want those delicious treats from the kitchen counter, the ones you think I don\'t know about!',
      'Take me for a walk please! I see my leash and I\'m ready for an adventure!',
      'Someone is at the door and I must protect our home from this potential intruder!',
      'I love you so much and I want to show you by following you everywhere today!',
      'Where did you go? I missed you terribly for those five whole minutes you were gone!',
      'Play fetch with me right now! That tennis ball isn\'t going to throw itself, you know!'
    ] },
    { sound: 'meow', translations: [
      'Feed me immediately because my food bowl is practically empty with only ninety percent remaining!',
      'Pet me gently but only exactly three times, then I might bite because I\'m moody today!',
      'I deliberately knocked that thing off the table because it was in my way, obviously!',
      'Remember that I own this house and you just live here to serve my every need!',
      'Where is that mysterious red dot? I must catch it and solve this puzzle once and for all!',
      'Open this door right now because I changed my mind about wanting to go outside again!',
      'Your keyboard looks perfectly comfortable so I\'ll just sit here while you try to work!'
    ] },
    { sound: 'chirp', translations: [
      'Good morning everyone! It\'s time for my daily beautiful concert to wake up the whole neighborhood!',
      'I can see everything from up here and I\'m keeping watch over our territory today!',
      'It\'s time for my favorite song so listen carefully to my amazing vocal performance right now!',
      'I would like some fresh seeds please, the fancy ones, not those cheap ones from yesterday!',
      'Look at me! I\'m the most beautiful and talented bird in this entire house today!',
      'Let me out of this cage because I want to explore and fly around the room!',
      'That mirror bird keeps copying everything I do and it\'s getting really annoying now!'
    ] },
    { sound: 'squeak', translations: [
      'My exercise wheel is making that annoying squeaky noise again and it really needs some oil!',
      'I need more sunflower seeds because I\'ve hidden them all around my cage for later!',
      'I\'m busy building the most perfect and cozy nest, so please don\'t disturb my work!',
      'It\'s exercise time and I want to run really fast on my wheel to show off!',
      'You need to hide the treats better because I already found your secret stash, human!',
      'I\'m feeling sleepy but also want to play, so I\'m a bit confused right now!',
      'Clean my cage please because I\'ve redecorated it myself and made quite a mess!'
    ] }
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false); // Ensure recording state is false
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false); // Update UI immediately
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis with fun results
    setTimeout(() => {
      const randomCategory = funTranslations[Math.floor(Math.random() * funTranslations.length)];
      const randomTranslation = randomCategory.translations[Math.floor(Math.random() * randomCategory.translations.length)];
      
      const emotions = ['Happy & Excited', 'Demanding & Urgent', 'Playful & Energetic', 'Curious & Alert', 'Sleepy & Content', 'Confident & Proud', 'Anxious & Needy', 'Mischievous & Sneaky'];
      
      const newTranslation: Translation = {
        original: randomCategory.sound.charAt(0).toUpperCase() + randomCategory.sound.slice(1),
        translation: randomTranslation,
        emotion: emotions[Math.floor(Math.random() * emotions.length)],
        confidence: Math.floor(Math.random() * 15) + 85 // 85-99%
      };
      
      setTranslation(newTranslation);
      setRecentTranslations(prev => [newTranslation, ...prev.slice(0, 4)]);
      setIsAnalyzing(false);
    }, 1800);
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setTranslation(null);
  };

  const dailyTips = [
    "🐕 Dogs bark in different tones - high pitched usually means excitement!",
    "🐱 Slow blinking from cats is their way of saying 'I love you'",
    "🦜 Birds chirp more in the morning when they're happiest",
    "🐹 Hamsters make soft squeaks when they're content"
  ];



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
          }}>Pet Language Translator</h1>
          <p className="text-xl mb-2" style={{
            background: 'linear-gradient(135deg, #a0e7ff, #d4b3ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 15px rgba(160, 231, 255, 0.4)'
          }}>Record your pet's sounds and get fun AI translations!</p>
          <p className="text-gray-400">*For entertainment purposes - not scientifically accurate</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recording Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">🎤 Record Your Pet</h2>
            
            <div className="text-center space-y-6">
              {/* Recording Buttons */}
              <div className="space-y-4">
                <div className="relative">
                  <button
                    onClick={startRecording}
                    disabled={isRecording || isAnalyzing}
                    className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 bg-blue-500 hover:bg-blue-600 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Mic className="h-8 w-8" />
                  </button>
                  {isRecording && (
                    <div className="absolute -inset-2 border-4 border-red-300 rounded-full animate-ping"></div>
                  )}
                </div>

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium cursor-pointer"
                    style={{ pointerEvents: 'auto', zIndex: 10 }}
                  >
                    <Square className="h-5 w-5 inline mr-2 pointer-events-none" />
                    <span className="pointer-events-none">Stop Recording</span>
                  </button>
                )}

                <p className="text-gray-600">
                  {isRecording ? 'Recording in progress...' : 'Click to start recording'}
                </p>
              </div>

              {/* Audio Playback */}
              {audioUrl && (
                <div className="space-y-4">
                  <audio ref={audioRef} src={audioUrl} className="hidden" />
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={playAudio}
                      className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    >
                      <Play className="h-4 w-4" />
                      <span>Play Recording</span>
                    </button>
                    <button
                      onClick={resetRecording}
                      className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>Reset</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={analyzeAudio}
                    disabled={isAnalyzing}
                    className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isAnalyzing ? 'Translating...' : '🔮 Translate Pet Language'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Translation Results */}
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-center">💬 Translation</h2>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
                <div className="text-center">
                  <p className="text-lg font-medium">Analyzing pet language...</p>
                  <p className="text-sm text-gray-500">Using advanced AI pet psychology 🧠</p>
                </div>
              </div>
            ) : translation ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg border-2 border-purple-200">
                  <div className="text-center mb-6">
                    <div className="text-3xl mb-3">🗣️</div>
                    <h3 className="text-lg font-bold text-purple-800 mb-4">Translation Message</h3>
                    <p className="text-gray-800 italic text-base leading-relaxed">"{translation.translation}"</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Detected Sound</p>
                      <p className="font-medium text-purple-800">{translation.original}</p>
                    </div>
                    
                    <div className="bg-white/50 p-3 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Emotion</p>
                      <p className="font-medium text-purple-800">{translation.emotion}</p>
                    </div>
                    
                    <div className="bg-white/50 p-3 rounded-lg text-center">
                      <p className="text-sm font-semibold text-gray-700 mb-2">AI Confidence</p>
                      <span className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-sm font-bold">
                        {translation.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🐾</div>
                <p className="text-lg">Record your pet's sound to see the magic translation!</p>
                <p className="text-sm mt-2">Works with barks, meows, chirps, and squeaks</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Translations */}
        {recentTranslations.length > 0 && (
          <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">📚 Recent Translations</h2>
            <div className="space-y-3">
              {recentTranslations.map((trans, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{trans.translation}</p>
                    <p className="text-sm text-gray-500">{trans.emotion} • {trans.confidence}% confidence</p>
                  </div>
                  <Volume2 className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Tips */}
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-center">💡 Daily Pet Communication Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyTips.map((tip, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetLanguageTranslator;