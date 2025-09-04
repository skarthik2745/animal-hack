import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Paperclip, Image, Smile, Mic, Play, Pause, Square, Check, CheckCheck, Copy, Trash, Download, FileText } from 'lucide-react';
import { useAuth } from '../AuthContext';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  type: 'text' | 'image' | 'file' | 'audio';
  fileName?: string;
  fileSize?: string;
  duration?: string;
  status: 'sent' | 'delivered' | 'read';
  deleted?: boolean;
  deletedForEveryone?: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
  lastSeen?: Date;
  messages: Message[];
  type: 'doctor' | 'shop' | 'trainer';
}

interface ChatScreenProps {
  session: ChatSession;
  onClose: () => void;
  showBackToProfile?: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ session, onClose, showBackToProfile = false }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [showAudioPreview, setShowAudioPreview] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(0);
  const [showMessageOptions, setShowMessageOptions] = useState<string | null>(null);
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>(session.messages);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const { user } = useAuth();

  const emojis = [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
    '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️'
  ];

  const getStorageConfig = () => {
    const isLostFound = window.location.pathname === '/lost-found';
    const storageKey = session.type === 'doctor' ? 'doctorChats' : 
                      session.type === 'trainer' ? 'trainerChats' :
                      session.type === 'shop' && window.location.pathname === '/pet-stories' ? 'petStoriesChats' :
                      isLostFound ? 'lostFoundChats' : 'shopChats';
    const idKey = session.type === 'doctor' ? 'doctorId' : 
                 session.type === 'trainer' ? 'trainerId' :
                 storageKey === 'petStoriesChats' ? 'petId' :
                 storageKey === 'lostFoundChats' ? 'postId' : 'shopId';
    const nameKey = storageKey === 'petStoriesChats' ? 'petName' : 
                   storageKey === 'lostFoundChats' ? 'contactName' :
                   session.type === 'doctor' ? 'doctorName' : 
                   session.type === 'trainer' ? 'trainerName' : 'shopName';
    const imageKey = storageKey === 'petStoriesChats' ? 'petImage' : 
                    storageKey === 'lostFoundChats' ? 'petImage' :
                    session.type === 'doctor' ? 'doctorImage' : 
                    session.type === 'trainer' ? 'trainerImage' : 'shopImage';
    return { storageKey, idKey, nameKey, imageKey };
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const updateMessageStatus = () => {
      setMessages(prev => prev.map(m => {
        if (m.isFromUser && m.status === 'sent') {
          return { ...m, status: 'delivered' as const };
        }
        if (m.isFromUser && m.status === 'delivered' && Math.random() > 0.6) {
          return { ...m, status: 'read' as const };
        }
        return m;
      }));
    };

    const interval = setInterval(updateMessageStatus, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.src = '';
        } catch (e) {
          console.log('Cleanup audio error:', e);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const updateStorage = (updatedMessages: Message[]) => {
    try {
      const { storageKey, idKey, nameKey, imageKey } = getStorageConfig();
      const allSessions = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const sessionIndex = allSessions.findIndex((s: any) => s[idKey] === session.id);
      
      if (sessionIndex >= 0) {
        allSessions[sessionIndex].messages = updatedMessages;
      } else {
        const newSession = {
          [idKey]: session.id,
          [nameKey]: session.name,
          [imageKey]: session.image,
          isOnline: session.isOnline,
          lastSeen: session.lastSeen,
          messages: updatedMessages
        };
        allSessions.push(newSession);
      }
      localStorage.setItem(storageKey, JSON.stringify(allSessions));
    } catch (error) {
      console.error('Error updating chat storage:', error);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: session.id,
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromUser: true,
      type: 'text',
      status: 'sent'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    updateStorage(updatedMessages);
    setNewMessage('');

    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: session.id,
        receiverId: user.id,
        content: getRandomResponse(),
        timestamp: new Date(),
        isFromUser: false,
        type: 'text',
        status: 'delivered'
      };

      const finalMessages = [...updatedMessages, response];
      setMessages(finalMessages);
      updateStorage(finalMessages);
    }, 2000 + Math.random() * 3000);
  };

  const getRandomResponse = () => {
    const isLostFound = window.location.pathname === '/lost-found';
    const responses = session.type === 'doctor' ? [
      "Thank you for your message. I'll review your pet's condition and get back to you.",
      "That sounds concerning. Can you provide more details about the symptoms?",
      "I recommend scheduling an appointment for a proper examination.",
      "Based on what you've described, here are some initial recommendations...",
      "Please monitor your pet closely and let me know if there are any changes.",
      "I'm available for a consultation if you'd like to discuss this further."
    ] : session.type === 'trainer' ? [
      "Thank you for reaching out! I'd be happy to help with your pet's training needs.",
      "That's a common behavioral issue. Let me suggest some training techniques.",
      "I recommend starting with basic obedience training. When would you like to schedule a session?",
      "Based on your pet's age and breed, here's what I suggest for training...",
      "Consistency is key in training. I can guide you through the process.",
      "I'm available for both in-person and virtual training sessions."
    ] : isLostFound ? [
      "Thank you for contacting me about the pet! I really appreciate your help.",
      "Do you have any additional information that might help?",
      "Can we arrange a time to meet? I'm available most days.",
      "I'm so grateful for people like you who care about lost pets.",
      "Please let me know if you see the pet again or have any updates.",
      "Thank you for taking the time to reach out. Every bit of help matters!"
    ] : [
      "Thank you for your interest! How can I help you today?",
      "We have that product in stock. Would you like more details?",
      "Great choice! That's one of our bestsellers.",
      "I can offer you a special discount on bulk orders.",
      "We also provide free delivery for orders over $50.",
      "Feel free to visit our store anytime during business hours!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: session.id,
        content: event.target?.result as string,
        timestamp: new Date(),
        isFromUser: true,
        type: type,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        status: 'sent'
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      updateStorage(updatedMessages);
    };
    
    reader.readAsDataURL(file);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });
      
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      audioChunksRef.current = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        if (recordingTime >= 1 && audioChunksRef.current.length > 0) {
          try {
            const mimeType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Audio = reader.result as string;
              setRecordedAudio(base64Audio);
              setPreviewDuration(recordingTime);
              setShowAudioPreview(true);
            };
            reader.onerror = () => {
              console.error('Failed to convert audio to base64');
            };
            reader.readAsDataURL(audioBlob);
          } catch (error) {
            console.error('Error processing recorded audio:', error);
          }
        }
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      setMediaRecorder(recorder);
      recorder.start(1000);
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const sendAudioMessage = (audioData: string, duration: number) => {
    if (!user || !audioData) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: session.id,
      content: audioData,
      timestamp: new Date(),
      isFromUser: true,
      type: 'audio',
      duration: formatDuration(duration),
      status: 'sent'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    updateStorage(updatedMessages);
    
    setRecordedAudio(null);
    setShowAudioPreview(false);
    setRecordingTime(0);
    setPreviewDuration(0);
  };

  const cancelAudioMessage = () => {
    setRecordedAudio(null);
    setShowAudioPreview(false);
    setRecordingTime(0);
    setPreviewDuration(0);
  };

  const handleSendRecording = () => {
    if (recordedAudio && previewDuration > 0) {
      sendAudioMessage(recordedAudio, previewDuration);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playAudio = (messageId: string, audioData: string) => {
    if (playingAudio === messageId) {
      if (currentAudio) {
        try {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        } catch (e) {
          console.log('Audio pause error:', e);
        }
        setCurrentAudio(null);
      }
      setPlayingAudio(null);
      return;
    }

    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Audio stop error:', e);
      }
      setCurrentAudio(null);
    }

    if (!audioData || !audioData.startsWith('data:audio/')) {
      console.error('Invalid audio data');
      return;
    }

    try {
      const audio = new Audio();
      
      const handleCanPlay = () => {
        audio.play().then(() => {
          setPlayingAudio(messageId);
          setCurrentAudio(audio);
        }).catch((error) => {
          console.error('Play failed:', error);
          setPlayingAudio(null);
          setCurrentAudio(null);
        });
      };

      const handleEnded = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const handleError = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      
      audio.src = audioData;
      audio.load();
      
    } catch (error) {
      console.error('Audio creation error:', error);
      setPlayingAudio(null);
      setCurrentAudio(null);
    }
  };

  const deleteMessage = (messageId: string, forEveryone: boolean = false) => {
    const updatedMessages = messages.map(m => 
      m.id === messageId 
        ? { ...m, deleted: true, deletedForEveryone: forEveryone }
        : m
    );

    setMessages(updatedMessages);
    updateStorage(updatedMessages);
    setShowMessageOptions(null);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setShowMessageOptions(null);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-white/60" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-white/60" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-cyan-300" />;
      default: return null;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        .whatsapp-chat {
          font-family: 'Poppins', sans-serif;
          background: #ECE5DD;
          position: relative;
        }
        
        .whatsapp-chat::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 30c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 35c-8.3 0-15-6.7-15-15s6.7-15 15-15 15 6.7 15 15-6.7 15-15 15z'/%3E%3Cpath d='M20 20h10v10h-10z'/%3E%3Cpath d='M70 70h10v10h-10z'/%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.1;
          pointer-events: none;
        }
        
        .whatsapp-header {
          background: #075E54;
          color: white;
          border-bottom: none;
        }
        
        .user-message {
          background: #DCF8C6;
          color: #000;
          border-radius: 7.5px 7.5px 7.5px 0;
          box-shadow: 0 1px 0.5px rgba(0,0,0,.13);
          position: relative;
        }
        
        .user-message::after {
          content: '';
          position: absolute;
          bottom: 0;
          right: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-left-color: #DCF8C6;
          border-bottom: 0;
          border-right: 0;
        }
        
        .other-message {
          background: #FFFFFF;
          color: #000;
          border-radius: 7.5px 7.5px 0 7.5px;
          box-shadow: 0 1px 0.5px rgba(0,0,0,.13);
          position: relative;
        }
        
        .other-message::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-right-color: #FFFFFF;
          border-bottom: 0;
          border-left: 0;
        }
        
        .whatsapp-input {
          background: #F0F0F0;
          border: none;
          border-radius: 21px;
          padding: 9px 12px;
          font-size: 15px;
          outline: none;
          font-family: 'Poppins', sans-serif;
        }
        
        .whatsapp-input:focus {
          background: #FFFFFF;
        }
        
        .whatsapp-send-btn {
          background: #25D366;
          color: white;
          border: none;
          border-radius: 50%;
          width: 45px;
          height: 45px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .whatsapp-send-btn:hover {
          background: #128C7E;
          transform: scale(1.05);
        }
        
        .whatsapp-typing {
          background: #FFFFFF;
          border-radius: 7.5px 7.5px 0 7.5px;
          box-shadow: 0 1px 0.5px rgba(0,0,0,.13);
          position: relative;
        }
        
        .whatsapp-typing::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -8px;
          width: 0;
          height: 0;
          border: 8px solid transparent;
          border-right-color: #FFFFFF;
          border-bottom: 0;
          border-left: 0;
        }
        
        .message-time {
          font-size: 11px;
          color: #667781;
          margin-top: 2px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 2px;
        }
        
        .tick-mark {
          font-size: 12px;
          color: #667781;
        }
        
        .tick-mark.read {
          color: #4FC3F7;
        }
        
        .online-status {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }
      `}</style>
      
      <div className="fixed inset-0 whatsapp-chat z-50 flex flex-col">
        {/* Header */}
        <div className="whatsapp-header text-white p-4 flex items-center shadow-lg relative z-10">
          <button
            onClick={onClose}
            className="mr-4 hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="relative">
            <img
              src={session.image}
              alt={session.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            {session.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{session.name}</h3>
            <p className="online-status">
              {session.isOnline ? 'online' : `last seen ${session.lastSeen ? formatTime(session.lastSeen) : 'recently'}`}
            </p>
          </div>
          {showBackToProfile && (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/profile';
                }
              }}
              className="ml-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm transition-colors backdrop-blur-sm"
            >
              Back to Profile
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
              <div className="relative group max-w-xs lg:max-w-md">
                {message.deleted ? (
                  <div className={`px-4 py-3 rounded-2xl text-sm italic text-gray-500 ${
                    message.isFromUser ? 'bg-gray-200' : 'bg-white/80 backdrop-blur-sm'
                  }`}>
                    {message.deletedForEveryone ? 'This message was deleted' : 'You deleted this message'}
                  </div>
                ) : (
                  <div
                    className={`px-3 py-2 text-sm relative max-w-xs ${
                      message.isFromUser
                        ? 'user-message ml-auto'
                        : 'other-message mr-auto'
                    }`}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setShowMessageOptions(message.id);
                    }}
                  >
                  {message.type === 'image' ? (
                    <div>
                      <img
                        src={message.content}
                        alt="Shared image"
                        className="max-w-full h-auto rounded-lg mb-2 cursor-pointer"
                        onClick={() => window.open(message.content, '_blank')}
                      />
                      {message.fileName && (
                        <p className="text-xs opacity-75">{message.fileName}</p>
                      )}
                    </div>
                  ) : message.type === 'file' ? (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{message.fileName}</p>
                        <p className="text-xs opacity-75">{message.fileSize}</p>
                      </div>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = message.content;
                          link.download = message.fileName || 'file';
                          link.click();
                        }}
                        className="p-1 hover:bg-black/10 rounded"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ) : message.type === 'audio' ? (
                    <div className="flex items-center space-x-3 min-w-[220px] p-3">
                      <button
                        onClick={() => playAudio(message.id, message.content)}
                        className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                          message.isFromUser 
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                      >
                        {playingAudio === message.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`h-1 rounded-full mb-2 ${
                          message.isFromUser ? 'bg-emerald-300' : 'bg-gray-300'
                        }`}>
                          <div className={`h-full rounded-full transition-all duration-300 ${
                            playingAudio === message.id ? 'w-full animate-pulse' : 'w-0'
                          } ${
                            message.isFromUser ? 'bg-white' : 'bg-emerald-500'
                          }`}></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`text-xs font-medium ${
                            message.isFromUser ? 'text-emerald-100' : 'text-gray-600'
                          }`}>
                            Voice message
                          </span>
                          <span className={`text-xs font-mono ${
                            message.isFromUser ? 'text-emerald-100' : 'text-gray-600'
                          }`}>
                            {message.duration || '0:00'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>{message.content}</p>
                  )}
                  
                  <div className="message-time">
                    <span>{formatTime(message.timestamp)}</span>
                    {message.isFromUser && (
                      <span className={`tick-mark ${message.status === 'read' ? 'read' : ''}`}>
                        {message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : '✓✓'}
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {showMessageOptions === message.id && !message.deleted && (
                <div className="absolute top-0 right-0 bg-white rounded-lg shadow-lg border p-2 z-10">
                  <button
                    onClick={() => copyMessage(message.content)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                  <button
                    onClick={() => deleteMessage(message.id, false)}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete for me
                  </button>
                  {message.isFromUser && (
                    <button
                      onClick={() => deleteMessage(message.id, true)}
                      className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 rounded text-red-600"
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete for everyone
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        
          {typing && (
            <div className="flex justify-start">
              <div className="whatsapp-typing px-3 py-2 max-w-xs mr-auto">
                <div className="flex space-x-1 mb-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <p className="text-xs text-gray-500 font-medium">{session.name} is typing...</p>
              </div>
            </div>
          )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="bg-red-50 border-t p-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-red-600 font-medium">Recording</span>
            </div>
            <div className="text-red-700 font-mono text-lg">
              {formatDuration(recordingTime)}
            </div>
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Square className="h-4 w-4 mr-1 inline" />
              Stop
            </button>
          </div>
        </div>
      )}
      
      {/* Audio Preview */}
      {showAudioPreview && recordedAudio && (
        <div className="bg-emerald-50 border-t p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-emerald-800">Voice Message Ready</h4>
            <span className="text-emerald-600 text-sm">{formatDuration(previewDuration)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => playAudio('preview', recordedAudio)}
              className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
            >
              {playingAudio === 'preview' ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
            <div className="flex-1 h-2 bg-emerald-200 rounded-full">
              <div className="h-full bg-emerald-500 rounded-full w-0 transition-all duration-300"></div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={cancelAudioMessage}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRecording}
                className="px-4 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

        {/* Input Area */}
        <div className="bg-white p-3 border-t border-gray-200 relative z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
            >
              <Image className="h-5 w-5" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message"
                className="whatsapp-input w-full pr-12"
              />
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Smile className="h-5 w-5" />
              </button>
            
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-4 w-96 max-h-80 overflow-y-auto z-20">
                  <div className="mb-2">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Choose an emoji</h3>
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => insertEmoji(emoji)}
                        className="text-2xl hover:bg-gray-100 p-2 rounded transition-colors flex items-center justify-center h-10 w-10"
                        title={emoji}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {newMessage.trim() ? (
              <button
                onClick={sendMessage}
                className="whatsapp-send-btn"
              >
                <Send className="h-5 w-5" />
              </button>
            ) : !showAudioPreview ? (
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onMouseLeave={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`whatsapp-send-btn select-none ${
                  isRecording 
                    ? 'bg-red-500 scale-110' 
                    : ''
                }`}
                title={isRecording ? 'Release to stop recording' : 'Hold to record voice message'}
              >
                <Mic className="h-5 w-5" />
              </button>
            ) : null}
          </div>
        </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileUpload(e, 'image')}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={(e) => handleFileUpload(e, 'file')}
        className="hidden"
      />

      {/* Click outside to close overlays */}
      {(showEmojiPicker || showMessageOptions) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowEmojiPicker(false);
            setShowMessageOptions(null);
          }}
        />
      )}
      </div>
    </>
  );
};

export default ChatScreen;