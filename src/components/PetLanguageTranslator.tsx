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
    { sound: 'bark', translations: ['I want treats NOW! 🍖', 'Play with me, human! 🎾', 'Someone\'s at the door! 🚪', 'I love you so much! ❤️', 'Where did you go? I missed you! 😢'] },
    { sound: 'meow', translations: ['Feed me immediately! 🍽️', 'Pet me... but only 3 times 😼', 'I knocked something off the table 😈', 'I own this house, you just live here 👑', 'The red dot... where is it?! 🔴'] },
    { sound: 'chirp', translations: ['Good morning, world! 🌅', 'I see everything from up here! 👁️', 'Time for my favorite song! 🎵', 'Fresh seeds please! 🌱', 'I\'m the prettiest bird here! 💅'] },
    { sound: 'squeak', translations: ['My wheel needs oil! 🎡', 'More sunflower seeds! 🌻', 'I\'m building the perfect nest! 🏠', 'Exercise time! 🏃‍♂️', 'Hide the treats better, human! 🕵️'] }
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
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
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
      
      const newTranslation: Translation = {
        original: `*${randomCategory.sound} sound detected*`,
        translation: randomTranslation,
        emotion: ['Happy', 'Excited', 'Demanding', 'Playful', 'Curious'][Math.floor(Math.random() * 5)],
        confidence: Math.floor(Math.random() * 20) + 80 // 80-99%
      };
      
      setTranslation(newTranslation);
      setRecentTranslations(prev => [newTranslation, ...prev.slice(0, 4)]);
      setIsAnalyzing(false);
    }, 2000);
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

  useEffect(() => {
    const createRollingBones = () => {
      const container = document.querySelector('.translator-page');
      if (!container) return;
      
      const colors = ['#F5DEB3', '#DEB887', '#D2B48C', '#F4A460', '#CD853F'];
      
      for (let i = 0; i < 35; i++) {
        const bone = document.createElement('div');
        bone.className = 'rolling-bone';
        bone.innerHTML = '🦴';
        bone.style.color = colors[Math.floor(Math.random() * colors.length)];
        bone.style.top = Math.random() * 90 + 5 + '%';
        bone.style.right = '-60px';
        bone.style.animationDelay = i * 1 + 's';
        bone.style.animationDuration = '15s';
        bone.style.fontSize = (Math.random() * 20 + 30) + 'px';
        container.appendChild(bone);
      }
    };
    
    createRollingBones();
    const interval = setInterval(createRollingBones, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Poppins:wght@400;500;600&display=swap');
        .translator-page {
          position: relative;
          min-height: 100vh;
          padding-top: 80px;
          background: linear-gradient(135deg, #FFF8DC 0%, #E6F3FF 100%);
          overflow: hidden;
        }
        
        .rolling-bone {
          position: absolute;
          animation: rollBone linear infinite;
          z-index: 0;
        }
        
        @keyframes rollBone {
          0% {
            transform: translateX(0) rotate(0deg);
            right: -60px;
          }
          100% {
            transform: translateX(-100vw) rotate(-360deg);
            right: 100vw;
          }
        }
        
        .translator-heading {
          font-family: 'Fredoka One', cursive;
          font-size: 4rem;
          background: linear-gradient(90deg, #FF6B35, #F7931E, #FFD23F);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0px 4px 12px rgba(255, 107, 53, 0.3);
          margin-bottom: 1rem;
        }
        
        .translator-subtext {
          font-family: 'Poppins', sans-serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: #4A5568;
        }
        
        .translator-disclaimer {
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          color: #718096;
          margin-top: 0.5rem;
        }
      `}</style>
      
      <div className="translator-page">
        <div className="max-w-4xl mx-auto px-4 py-8" style={{position: 'relative', zIndex: 1}}>
          <div className="text-center mb-8">
            <h1 className="translator-heading">Pet Language Translator</h1>
            <p className="translator-subtext">Record your pet's sounds and get fun AI translations!</p>
            <p className="translator-disclaimer">*For entertainment purposes - not scientifically accurate</p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recording Section */}
          <Card className="p-6">
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
                    className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <Square className="h-5 w-5 inline mr-2" />
                    Stop Recording
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
          </Card>

          {/* Translation Results */}
          <Card className="p-6">
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
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🗣️</div>
                    <h3 className="text-xl font-bold text-purple-800">{translation.translation}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Detected Sound</p>
                      <p className="font-medium">{translation.original}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Emotion</p>
                      <p className="font-medium">{translation.emotion}</p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4">
                    <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {translation.confidence}% AI Confidence
                    </span>
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
          </Card>
        </div>

        {/* Recent Translations */}
        {recentTranslations.length > 0 && (
          <Card className="p-6 mt-6">
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
          </Card>
        )}

        {/* Daily Tips */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <h2 className="text-xl font-semibold mb-4 text-center">💡 Daily Pet Communication Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyTips.map((tip, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </Card>
        </div>
      </div>
    </>
  );
};

export default PetLanguageTranslator;