import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Users, Edit, Trash2, Heart, MessageCircle, User, ArrowLeft, Send, Paperclip, Image, FileText, Smile, MoreVertical, Check, CheckCheck, Copy, Forward, Trash, Download, Mic, Play, Pause, Square, Grid, Upload, Search, AlertTriangle, Camera } from 'lucide-react';
import { Card, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useEvents } from '../hooks/useEvents';
import { Event } from '../types';
import { useAuth } from '../AuthContext';
import ChatScreen from './ChatScreen';
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
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  isOnline: boolean;
  lastSeen?: Date;
  messages: Message[];
}

interface UnifiedChatSession {
  id: string;
  name: string;
  image: string;
  isOnline: boolean;
  lastSeen?: Date;
  messages: Message[];
  type: 'doctor' | 'shop' | 'trainer';
}

const Profile: React.FC = () => {
  const { events, updateEvent, deleteEvent } = useEvents();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [participations, setParticipations] = useState<{[eventId: string]: string[]}>({});
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [showUnifiedChat, setShowUnifiedChat] = useState(false);
  const [selectedUnifiedChat, setSelectedUnifiedChat] = useState<UnifiedChatSession | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [doctorTyping, setDoctorTyping] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [showMessageOptions, setShowMessageOptions] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [showAudioPreview, setShowAudioPreview] = useState(false);
  const [previewDuration, setPreviewDuration] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);
  const [editPostForm, setEditPostForm] = useState({ caption: '', content: '', type: 'image' as 'image' | 'video' });
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    mobile: '',
    isFree: true,
    images: [] as string[],
    poster: ''
  });
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const storedFavorites = JSON.parse(localStorage.getItem('event_favorites') || '[]');
      const storedParticipations = JSON.parse(localStorage.getItem('event_participations') || '{}');
      const storedChats = JSON.parse(localStorage.getItem('doctorChats') || '[]');
      setFavorites(storedFavorites);
      setParticipations(storedParticipations);
      
      const enhancedChats = storedChats.map((chat: any) => ({
        ...chat,
        doctorImage: chat.doctorImage || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        isOnline: Math.random() > 0.5,
        lastSeen: new Date(Date.now() - Math.random() * 3600000),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          type: msg.type || 'text',
          status: msg.status || 'delivered',
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChatSessions(enhancedChats);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getEventStatus = (startDate: string, isFree: boolean) => {
    const now = new Date();
    const eventDate = new Date(startDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const diffTime = eventDay.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const statuses = [];
    
    if (isFree) {
      statuses.push({ status: 'Free', variant: 'success' as const });
    }
    
    if (diffDays < 0) {
      statuses.push({ status: 'Closed', variant: 'secondary' as const });
    } else if (diffDays === 0) {
      statuses.push({ status: 'Open', variant: 'success' as const });
    } else if (diffDays <= 20) {
      statuses.push({ status: 'Coming Soon', variant: 'info' as const });
    } else {
      statuses.push({ status: 'Scheduled', variant: 'default' as const });
    }
    
    return statuses;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Date TBD';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    const eventDate = new Date(event.startDate);
    const timeString = eventDate.toTimeString().slice(0, 5); // Get HH:MM format
    
    setFormData({
      title: event.title,
      date: eventDate.toISOString().split('T')[0],
      time: timeString,
      location: event.location.address,
      description: event.description,
      mobile: '+1 (555) 123-4567',
      isFree: event.isFree,
      images: event.gallery || [],
      poster: event.poster || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    
    // Parse time from HTML5 time input (HH:MM format)
    let timeString = formData.time || '10:00';
    
    // Ensure time has seconds for ISO string
    if (timeString.match(/^\d{1,2}:\d{2}$/)) {
      timeString = timeString + ':00';
    } else if (!timeString.match(/^\d{1,2}:\d{2}:\d{2}$/)) {
      timeString = '10:00:00';
    }
    
    const eventDateTime = formData.date + 'T' + timeString;
    
    const updatedEvent: Event = {
      ...editingEvent,
      title: formData.title,
      description: formData.description,
      startDate: new Date(eventDateTime).toISOString(),
      endDate: new Date(eventDateTime).toISOString(),
      location: { ...editingEvent.location, address: formData.location },
      poster: formData.poster,
      gallery: formData.images,
      isFree: formData.isFree
    };
    
    try {
      updateEvent(editingEvent.id, updatedEvent);
      setShowEditModal(false);
      setEditingEvent(null);
      setFormData({ title: '', date: '', time: '', location: '', description: '', mobile: '', isFree: true, images: [], poster: '' });
      toast.success('Event updated successfully!');
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
      toast.success('Event deleted successfully!');
    }
  };

  const openChatScreen = (session: ChatSession) => {
    setSelectedChat(session);
    setShowChatScreen(true);
    const updatedSessions = chatSessions.map(s => 
      s.doctorId === session.doctorId 
        ? { ...s, messages: s.messages.map(m => ({ ...m, status: 'read' as const })) }
        : s
    );
    setChatSessions(updatedSessions);
    localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedChat.doctorId,
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromUser: true,
      type: 'text',
      status: 'sent'
    };

    const updatedSessions = chatSessions.map(s => 
      s.doctorId === selectedChat.doctorId 
        ? { ...s, messages: [...s.messages, message] }
        : s
    );

    setChatSessions(updatedSessions);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, message] });
    localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
    setNewMessage('');

    setDoctorTyping(true);
    setTimeout(() => {
      setDoctorTyping(false);
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedChat.doctorId,
        receiverId: user.id,
        content: getRandomDoctorResponse(),
        timestamp: new Date(),
        isFromUser: false,
        type: 'text',
        status: 'delivered'
      };

      const finalSessions = JSON.parse(localStorage.getItem('doctorChats') || '[]');
      const sessionIndex = finalSessions.findIndex((s: ChatSession) => s.doctorId === selectedChat.doctorId);
      if (sessionIndex >= 0) {
        finalSessions[sessionIndex].messages.push(doctorResponse);
        setChatSessions(finalSessions);
        setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, message, doctorResponse] });
        localStorage.setItem('doctorChats', JSON.stringify(finalSessions));
      }
    }, 2000 + Math.random() * 3000);
  };

  const getRandomDoctorResponse = () => {
    const responses = [
      "Thank you for your message. I'll review your pet's condition and get back to you.",
      "That sounds concerning. Can you provide more details about the symptoms?",
      "I recommend scheduling an appointment for a proper examination.",
      "Based on what you've described, here are some initial recommendations...",
      "Please monitor your pet closely and let me know if there are any changes.",
      "I'm available for a consultation if you'd like to discuss this further."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat || !user) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        receiverId: selectedChat.doctorId,
        content: event.target?.result as string,
        timestamp: new Date(),
        isFromUser: true,
        type: type,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        status: 'sent'
      };

      const updatedSessions = chatSessions.map(s => 
        s.doctorId === selectedChat.doctorId 
          ? { ...s, messages: [...s.messages, message] }
          : s
      );

      setChatSessions(updatedSessions);
      setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, message] });
      localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
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

  const deleteMessage = (messageId: string, forEveryone: boolean = false) => {
    if (!selectedChat) return;

    const updatedSessions = chatSessions.map(s => 
      s.doctorId === selectedChat.doctorId 
        ? {
            ...s, 
            messages: s.messages.map(m => 
              m.id === messageId 
                ? { ...m, deleted: true, deletedForEveryone: forEveryone }
                : m
            )
          }
        : s
    );

    setChatSessions(updatedSessions);
    setSelectedChat({
      ...selectedChat,
      messages: selectedChat.messages.map(m => 
        m.id === messageId 
          ? { ...m, deleted: true, deletedForEveryone: forEveryone }
          : m
      )
    });
    localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
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
      case 'sent': return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const emojis = [
    // Smileys & Emotion
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚',
    '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗',
    '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐',
    '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾',
    // People & Body
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍',
    '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂',
    '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨',
    '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '🥷', '👷',
    '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞',
    // Animals & Nature
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒',
    '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜',
    '🦟', '🦗', '🕷️', '🕸️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳',
    '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖',
    // Food & Drink
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦',
    '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈',
    '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘',
    // Activities & Sports
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳',
    '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺',
    // Travel & Places
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛺', '🚨',
    '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️',
    // Objects
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥',
    '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋',
    // Symbols
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
    '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐',
    '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️',
    // Flags (sample)
    '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🇺🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇪🇸', '🇯🇵', '🇨🇳', '🇮🇳', '🇧🇷', '🇨🇦', '🇦🇺'
  ];

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
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
        // Only process if recording is longer than 1 second
        if (recordingTime >= 1 && audioChunksRef.current.length > 0) {
          try {
            const mimeType = recorder.mimeType || 'audio/webm';
            const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
            
            // Convert to base64 immediately for better compatibility
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
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      setMediaRecorder(recorder);
      recorder.start(1000); // Collect data every 1000ms for better compatibility
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
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
      
      // Stop all tracks
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
  };

  const sendAudioMessage = (audioData: string, duration: number) => {
    if (!selectedChat || !user || !audioData) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      receiverId: selectedChat.doctorId,
      content: audioData, // Already base64
      timestamp: new Date(),
      isFromUser: true,
      type: 'audio',
      duration: formatDuration(duration),
      status: 'sent'
    };

    const updatedSessions = chatSessions.map(s => 
      s.doctorId === selectedChat.doctorId 
        ? { ...s, messages: [...s.messages, message] }
        : s
    );

    setChatSessions(updatedSessions);
    setSelectedChat({ ...selectedChat, messages: [...selectedChat.messages, message] });
    localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
    
    // Reset states
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
    // If same audio is playing, pause it
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

    // Stop any currently playing audio
    if (currentAudio) {
      try {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      } catch (e) {
        console.log('Audio stop error:', e);
      }
      setCurrentAudio(null);
    }

    // Validate audio data
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
        // Clean up event listeners
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const handleError = () => {
        setPlayingAudio(null);
        setCurrentAudio(null);
        // Clean up event listeners
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

  useEffect(() => {
    // Simulate message status updates for all message types
    const updateMessageStatus = () => {
      if (selectedChat) {
        const updatedSessions = chatSessions.map(s => 
          s.doctorId === selectedChat.doctorId 
            ? {
                ...s, 
                messages: s.messages.map(m => {
                  if (m.isFromUser && m.status === 'sent') {
                    return { ...m, status: 'delivered' as const };
                  }
                  if (m.isFromUser && m.status === 'delivered' && Math.random() > 0.6) {
                    return { ...m, status: 'read' as const };
                  }
                  return m;
                })
              }
            : s
        );
        setChatSessions(updatedSessions);
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: updatedSessions.find(s => s.doctorId === prev.doctorId)?.messages || prev.messages
        } : null);
        localStorage.setItem('doctorChats', JSON.stringify(updatedSessions));
      }
    };

    const interval = setInterval(updateMessageStatus, 4000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  // Cleanup audio on component unmount
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h1>
          <p className="text-gray-600">You need to be logged in to access your profile and manage your events.</p>
        </div>
      </div>
    );
  }

  const myEvents = events.filter(event => event.organizerId === user?.id);
  const favoriteEvents = events.filter(event => favorites.includes(event.id));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
        
        .pawcare-container {
          background: #F7FCF8;
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }
        
        .pawcare-heading {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          color: #2C3E50;
        }
        
        .pawcare-subheading {
          font-family: 'Poppins', sans-serif;
          font-weight: 500;
          color: #5D6D7E;
        }
        
        .pawcare-card {
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(26, 188, 156, 0.1);
        }
        
        .pawcare-btn {
          background: #2E86C1;
          color: white;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .pawcare-btn:hover {
          background: #2874A6;
          transform: translateY(-1px);
        }
        
        .pawcare-section-title {
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          color: #2C3E50;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .whatsapp-chat-btn {
          background: #25D366;
          color: white;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .whatsapp-chat-btn:hover {
          background: #128C7E;
          transform: translateY(-1px);
        }
      `}</style>
      
      <div className="pawcare-container py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="pawcare-heading text-4xl sm:text-5xl mb-4">
              My Profile
            </h1>
            <p className="pawcare-subheading text-xl">
              Manage your details, events, and chats in one place
            </p>
          </div>
          
          <div className="pawcare-card p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="pawcare-heading text-xl">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-2">Member since {new Date().toLocaleDateString()}</p>
              </div>
              <button onClick={logout} className="pawcare-btn px-6 py-2">
                Sign Out
              </button>
            </div>
          </div>

        {/* My Events Section */}
        <div className="mb-12">
          <h2 className="pawcare-section-title text-2xl mb-6">🐾 My Events ({myEvents.length})</h2>
          {myEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myEvents.map((event) => {
                const eventStatuses = getEventStatus(event.startDate, event.isFree);
                return (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={event.gallery?.[0] || event.poster || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.gallery && event.gallery.length > 1 && (
                        <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                          <img 
                            src={event.gallery[1]} 
                            alt="Secondary"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <CardContent>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="transition-all duration-300 ease-in-out">
                      <div className="space-y-2 w-full">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {eventStatuses.map((status, index) => (
                            <Badge key={index} variant={status.variant}>{status.status}</Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            onClick={() => handleEditEvent(event)}
                            className="flex-1 transition-all duration-300 ease-in-out"
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            onClick={() => handleDeleteEvent(event.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 transition-all duration-300 ease-in-out"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="pawcare-card text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="pawcare-subheading text-lg mb-2">No events created yet</h3>
              <p className="text-gray-600">Start by creating your first adoption event!</p>
            </div>
          )}
        </div>

        {/* Doctor Chat History Section */}
        <div className="mb-12">
          <h2 className="pawcare-section-title text-2xl mb-6">🐾 Doctor Chats ({chatSessions.length})</h2>
          {chatSessions.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {chatSessions.map((session) => {
                const lastMessage = session.messages[session.messages.length - 1];
                return (
                  <Card key={session.doctorId} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{session.doctorName}</h3>
                          <p className="text-sm text-gray-500">
                            {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      {lastMessage && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {lastMessage.isFromUser ? 'You: ' : `${session.doctorName}: `}
                            {lastMessage.content}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                            {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}
                      
                      <button 
                        className="whatsapp-chat-btn w-full py-2 px-4 text-sm flex items-center justify-center"
                        onClick={() => {
                          const unifiedSession: UnifiedChatSession = {
                            id: session.doctorId,
                            name: session.doctorName,
                            image: session.doctorImage,
                            isOnline: session.isOnline,
                            lastSeen: session.lastSeen,
                            messages: session.messages,
                            type: 'doctor'
                          };
                          setSelectedUnifiedChat(unifiedSession);
                          setShowUnifiedChat(true);
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open WhatsApp Chat
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="pawcare-card text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="pawcare-subheading text-lg mb-2">No chat history yet</h3>
              <p className="text-gray-600">Start chatting with doctors to see your conversation history here!</p>
            </div>
          )}
        </div>

        {/* Pet Stories Chat History Section */}
        <div className="mb-12">
          <h2 className="pawcare-section-title text-2xl mb-6">🐾 Pet Stories Chats</h2>
          {(() => {
            const petStoriesChats = JSON.parse(localStorage.getItem('petStoriesChats') || '[]');
            return petStoriesChats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {petStoriesChats.map((session: any) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  return (
                    <Card key={session.petId} className="overflow-hidden bg-white">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={session.petImage || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={session.petName}
                            className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-emerald-100"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{session.petName}</h3>
                            <p className="text-sm text-gray-500">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lastMessage.isFromUser ? 'You: ' : `${session.petName}: `}
                              {lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        
                        <button 
                          className="whatsapp-chat-btn w-full py-2 px-4 text-sm flex items-center justify-center"
                          onClick={() => {
                            const unifiedSession: UnifiedChatSession = {
                              id: session.petId,
                              name: session.petName,
                              image: session.petImage,
                              isOnline: session.isOnline || Math.random() > 0.5,
                              lastSeen: session.lastSeen || new Date(Date.now() - Math.random() * 3600000),
                              messages: session.messages,
                              type: 'shop'
                            };
                            setSelectedUnifiedChat(unifiedSession);
                            setShowUnifiedChat(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Open WhatsApp Chat
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="pawcare-card text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="pawcare-subheading text-lg mb-2">No pet conversations yet</h3>
                <p className="text-gray-600">Start chatting with pet owners in Pet Stories to see your conversation history here!</p>
              </div>
            );
          })()}
        </div>

        {/* Pet Trainers Chat History Section */}
        <div className="mb-12">
          <h2 className="pawcare-section-title text-2xl mb-6">🐾 Pet Trainers Chats</h2>
          {(() => {
            const trainerChats = JSON.parse(localStorage.getItem('trainerChats') || '[]');
            return trainerChats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {trainerChats.map((session: any) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  return (
                    <Card key={session.trainerId} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={session.trainerImage || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={session.trainerName}
                            className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-emerald-100"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{session.trainerName}</h3>
                            <p className="text-sm text-gray-500">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lastMessage.isFromUser ? 'You: ' : `${session.trainerName}: `}
                              {lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        
                        <button 
                          className="whatsapp-chat-btn w-full py-2 px-4 text-sm flex items-center justify-center"
                          onClick={() => {
                            const unifiedSession: UnifiedChatSession = {
                              id: session.trainerId,
                              name: session.trainerName,
                              image: session.trainerImage,
                              isOnline: session.isOnline || Math.random() > 0.5,
                              lastSeen: session.lastSeen || new Date(Date.now() - Math.random() * 3600000),
                              messages: session.messages,
                              type: 'trainer'
                            };
                            setSelectedUnifiedChat(unifiedSession);
                            setShowUnifiedChat(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Open WhatsApp Chat
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="pawcare-card text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="pawcare-subheading text-lg mb-2">No trainer conversations yet</h3>
                <p className="text-gray-600">Start chatting with pet trainers to see your conversation history here!</p>
              </div>
            );
          })()}
        </div>

        {/* Lost & Found Chat History Section */}
        <div className="mb-12">
          <h2 className="pawcare-section-title text-2xl mb-6">🐾 Lost & Found Chats</h2>
          {(() => {
            const lostFoundChats = JSON.parse(localStorage.getItem('lostFoundChats') || '[]');
            return lostFoundChats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {lostFoundChats.map((session: any) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  return (
                    <Card key={session.postId} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={session.petImage || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={session.contactName}
                            className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-red-100"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{session.contactName}</h3>
                            <p className="text-sm text-gray-500">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lastMessage.isFromUser ? 'You: ' : `${session.contactName}: `}
                              {lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        
                        <button 
                          className="whatsapp-chat-btn w-full py-2 px-4 text-sm flex items-center justify-center"
                          onClick={() => {
                            const unifiedSession: UnifiedChatSession = {
                              id: session.postId,
                              name: session.contactName,
                              image: session.petImage,
                              isOnline: session.isOnline || Math.random() > 0.5,
                              lastSeen: session.lastSeen || new Date(Date.now() - Math.random() * 3600000),
                              messages: session.messages,
                              type: 'shop'
                            };
                            setSelectedUnifiedChat(unifiedSession);
                            setShowUnifiedChat(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Open WhatsApp Chat
                        </button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="pawcare-card text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="pawcare-subheading text-lg mb-2">No lost & found conversations yet</h3>
                <p className="text-gray-600">Start chatting with pet owners/finders to see your conversation history here!</p>
              </div>
            );
          })()}
        </div>

        {/* Caretaker Chats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🐾 Caretaker Chats</h2>
          {(() => {
            const caretakerChats = JSON.parse(localStorage.getItem('caretakerChats') || '[]');
            return caretakerChats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {caretakerChats.map((session: any) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  return (
                    <Card key={session.caretakerId} className="overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={session.caretakerImage || 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={session.caretakerName}
                            className="w-12 h-12 rounded-full mr-3 object-cover border-3 border-green-300"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              🐾 {session.caretakerName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        
                        {lastMessage && (
                          <div className="bg-white/70 rounded-lg p-3 mb-3 border border-green-100">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lastMessage.isFromUser ? 'You: ' : `${session.caretakerName}: `}
                              {lastMessage.type === 'audio' ? '🎤 Voice message' : 
                               lastMessage.type === 'image' ? '🖼️ Image' : lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => {
                              // Open WhatsApp-style chat
                              window.location.href = '/pet-surrender';
                            }}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Open Chat
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700 border-red-300"
                            onClick={() => {
                              if (window.confirm('Delete this chat?')) {
                                const updatedChats = caretakerChats.filter((c: any) => c.caretakerId !== session.caretakerId);
                                localStorage.setItem('caretakerChats', JSON.stringify(updatedChats));
                                window.location.reload();
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-dashed border-green-300">
                <div className="text-6xl mb-4">🐾</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No caretaker conversations yet</h3>
                <p className="text-gray-600 mb-6">Start chatting with pet caretakers to see your WhatsApp-style conversations here!</p>
                <Button 
                  onClick={() => window.location.href = '/pet-surrender'}
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium"
                >
                  🔍 Find Pet Caretakers
                </Button>
              </div>
            );
          })()}
        </div>

        {/* My Communities Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Communities</h2>
          {(() => {
            const userCommunities = JSON.parse(localStorage.getItem('userCommunities') || '[]');
            return userCommunities.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {userCommunities.map((community: any) => (
                  <Card key={community.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={community.logo || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'}
                          alt={community.name}
                          className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-emerald-100"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{community.name}</h3>
                          <p className="text-sm text-gray-500">
                            {community.memberCount} members
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600">
                          Last activity: {new Date(community.lastActivity).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          // Store community ID to open directly
                          localStorage.setItem('openCommunityId', community.id);
                          window.location.href = '/community';
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Community
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No communities joined yet</h3>
                <p className="text-gray-600 mb-4">Join animal lover communities to connect with like-minded people!</p>
                <Button onClick={() => window.location.href = '/community'}>
                  Explore Communities
                </Button>
              </div>
            );
          })()}
        </div>

        {/* Shop Chat History Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop Chats</h2>
          {(() => {
            const shopChats = JSON.parse(localStorage.getItem('shopChats') || '[]');
            return shopChats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {shopChats.map((session: any) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  return (
                    <Card key={session.shopId} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={session.shopImage || 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={session.shopName}
                            className="w-12 h-12 rounded-full mr-3 object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{session.shopName}</h3>
                            <p className="text-sm text-gray-500">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lastMessage.isFromUser ? 'You: ' : `${session.shopName}: `}
                              {lastMessage.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            const unifiedSession: UnifiedChatSession = {
                              id: session.shopId,
                              name: session.shopName,
                              image: session.shopImage,
                              isOnline: session.isOnline || Math.random() > 0.5,
                              lastSeen: session.lastSeen || new Date(Date.now() - Math.random() * 3600000),
                              messages: session.messages,
                              type: 'shop'
                            };
                            setSelectedUnifiedChat(unifiedSession);
                            setShowUnifiedChat(true);
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          View Conversation
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No shop conversations yet</h3>
                <p className="text-gray-600">Start chatting with pet shops to see your conversation history here!</p>
              </div>
            );
          })()}
        </div>

        {/* My Abuse Reports Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Abuse Reports</h2>
          {(() => {
            const userAbuseReports = JSON.parse(localStorage.getItem('userAbuseReports') || '[]');
            return userAbuseReports.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {userAbuseReports.map((report: any) => (
                  <Card key={report.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={report.images[0] || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600'} 
                        alt="Report evidence"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant={report.status === 'pending' ? 'default' : report.status === 'under_review' ? 'info' : 'success'}>
                          {report.status === 'pending' ? 'Pending' : report.status === 'under_review' ? 'Under Review' : 'Action Taken ✅'}
                        </Badge>
                      </div>
                      <div className={`absolute top-4 right-4 px-2 py-1 rounded text-xs font-medium ${
                        report.urgency === 'critical' ? 'bg-red-600 text-white' :
                        report.urgency === 'high' ? 'bg-orange-500 text-white' :
                        report.urgency === 'medium' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'
                      }`}>
                        {report.urgency.toUpperCase()}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span className="text-xs">{report.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span className="text-xs">{report.date} {report.time}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Report #{report.id}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No abuse reports yet</h3>
                <p className="text-gray-600 mb-4">Help protect animals by reporting abuse incidents!</p>
                <Button onClick={() => window.location.href = '/report-abuse'}>
                  Report Animal Abuse
                </Button>
              </div>
            );
          })()}
        </div>

        {/* My Lost & Found Posts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Lost & Found Posts</h2>
          {(() => {
            const userLostFoundPosts = JSON.parse(localStorage.getItem('userLostFoundPosts') || '[]');
            return userLostFoundPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {userLostFoundPosts.map((post: any) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={post.images[0]} 
                        alt={post.petName}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium ${
                        post.type === 'lost' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-blue-500 text-white'
                      }`}>
                        {post.type === 'lost' ? 'MISSING' : 'FOUND'}
                      </div>
                      {post.urgent && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          URGENT
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{post.petName}</h3>
                      <p className="text-gray-600 text-sm mb-2">{post.species} • {post.breed}</p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span className="text-xs">{post.date} {post.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span className="text-xs">{post.location}</span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-xs mb-3 line-clamp-2">{post.description}</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => {
                            const updatedPosts = userLostFoundPosts.map((p: any) => 
                              p.id === post.id 
                                ? { ...p, status: p.status === 'active' ? 'resolved' : 'active' }
                                : p
                            );
                            localStorage.setItem('userLostFoundPosts', JSON.stringify(updatedPosts));
                            const allPosts = JSON.parse(localStorage.getItem('lostFoundPosts') || '[]');
                            const updatedAllPosts = allPosts.map((p: any) => 
                              p.id === post.id 
                                ? { ...p, status: p.status === 'active' ? 'resolved' : 'active' }
                                : p
                            );
                            localStorage.setItem('lostFoundPosts', JSON.stringify(updatedAllPosts));
                            window.location.reload();
                          }}
                        >
                          {post.status === 'active' ? 'Mark Resolved' : 'Mark Active'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            if (window.confirm('Delete this post?')) {
                              const updatedPosts = userLostFoundPosts.filter((p: any) => p.id !== post.id);
                              localStorage.setItem('userLostFoundPosts', JSON.stringify(updatedPosts));
                              const allPosts = JSON.parse(localStorage.getItem('lostFoundPosts') || '[]');
                              const updatedAllPosts = allPosts.filter((p: any) => p.id !== post.id);
                              localStorage.setItem('lostFoundPosts', JSON.stringify(updatedAllPosts));
                              window.location.reload();
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lost & found posts yet</h3>
                <p className="text-gray-600 mb-4">Report a lost or found pet to help reunite families!</p>
                <Button onClick={() => window.location.href = '/lost-found'}>
                  Report Lost/Found Pet
                </Button>
              </div>
            );
          })()}
        </div>

        {/* My Campaigns Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Campaigns</h2>
          {(() => {
            const joinedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]').filter((c: any) => c.isJoined);
            return joinedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {joinedCampaigns.map((campaign: any) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={campaign.banner} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="success">Joined</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span className="text-xs">{new Date(campaign.date).toLocaleDateString()} at {campaign.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span className="text-xs">{campaign.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-3 w-3 mr-2" />
                          <span className="text-xs">{campaign.participants} participants</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = '/awareness-campaigns'}
                      >
                        View Campaign
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns joined yet</h3>
                <p className="text-gray-600 mb-4">Join animal awareness campaigns to make a difference!</p>
                <Button onClick={() => window.location.href = '/awareness-campaigns'}>
                  Explore Campaigns
                </Button>
              </div>
            );
          })()}
        </div>

        {/* My Favorite Campaigns Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Favorite Campaigns</h2>
          {(() => {
            const favoriteCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]').filter((c: any) => c.isFavorite);
            return favoriteCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {favoriteCampaigns.map((campaign: any) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={campaign.banner} 
                        alt={campaign.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="info">❤️ Favorite</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{campaign.title}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{campaign.description}</p>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-3 w-3 mr-2" />
                          <span className="text-xs">{new Date(campaign.date).toLocaleDateString()} at {campaign.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span className="text-xs">{campaign.location}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-3 w-3 mr-2" />
                          <span className="text-xs">{campaign.participants} participants</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = '/awareness-campaigns'}
                      >
                        View Campaign
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite campaigns yet</h3>
                <p className="text-gray-600 mb-4">Save campaigns you're interested in to your favorites!</p>
                <Button onClick={() => window.location.href = '/awareness-campaigns'}>
                  Explore Campaigns
                </Button>
              </div>
            );
          })()}
        </div>

        {/* Campaign Chats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Chats</h2>
          {(() => {
            const campaignChats = JSON.parse(localStorage.getItem('campaignChats') || '[]');
            return campaignChats.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {campaignChats.map((session: any) => {
                  const lastMessage = session.messages[session.messages.length - 1];
                  return (
                    <Card key={session.campaignId} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-center mb-3">
                          <img
                            src={session.campaignBanner || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400'}
                            alt={session.campaignTitle}
                            className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-emerald-100"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{session.campaignTitle}</h3>
                            <p className="text-sm text-gray-500">
                              {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        
                        {lastMessage && (
                          <div className="bg-gray-50 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {lastMessage.isFromUser ? 'You: ' : `${lastMessage.user}: `}
                              {lastMessage.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(lastMessage.timestamp).toLocaleDateString()} at {' '}
                              {new Date(lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            localStorage.setItem('openCampaignChat', session.campaignId);
                            window.location.href = '/awareness-campaigns';
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          View Discussion
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaign discussions yet</h3>
                <p className="text-gray-600">Join campaigns and participate in discussions to see your chat history here!</p>
              </div>
            );
          })()}
        </div>

        {/* My Saved Sanctuaries Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Saved Sanctuaries</h2>
          {(() => {
            const savedSanctuaries = JSON.parse(localStorage.getItem('sanctuaryFavorites') || '[]');
            return savedSanctuaries.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedSanctuaries.map((sanctuaryId: string) => (
                  <Card key={sanctuaryId} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src="https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=600" 
                        alt="Wildlife Sanctuary"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="info">❤️ Saved</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Wildlife Sanctuary #{sanctuaryId}</h3>
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-3 w-3 mr-2" />
                          <span className="text-xs">Location details</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-3 w-3 mr-2" />
                          <span className="text-xs">Conservation area</span>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.location.href = '/wildlife-sanctuary'}
                      >
                        View Sanctuary
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No saved sanctuaries yet</h3>
                <p className="text-gray-600 mb-4">Explore wildlife sanctuaries and save your favorites!</p>
                <Button onClick={() => window.location.href = '/wildlife-sanctuary'}>
                  Explore Sanctuaries
                </Button>
              </div>
            );
          })()}
        </div>

        {/* Wildlife Stories Following Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Wildlife Stories Following</h2>
          {(() => {
            const wildlifeFollowing = JSON.parse(localStorage.getItem('wildlifeFollowing') || '[]');
            const wildlifeProfiles = JSON.parse(localStorage.getItem('wildlifeProfiles') || '[]');
            const followedProfiles = wildlifeProfiles.filter((profile: any) => wildlifeFollowing.includes(profile.id));
            
            return followedProfiles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {followedProfiles.map((profile: any) => (
                  <Card key={profile.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-3">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-12 h-12 rounded-full mr-3 object-cover border-2 border-emerald-100"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                            <Badge variant="success" className="text-xs">✓</Badge>
                          </div>
                          <p className="text-sm text-gray-500">{profile.location}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{profile.about}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">{profile.followers?.length || 0} followers</span>
                          <span className="text-xs text-gray-500">{profile.posts?.length || 0} posts</span>
                        </div>
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          localStorage.setItem('openWildlifeProfile', profile.id);
                          window.location.href = '/wildlife-sanctuary';
                        }}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Not following any wildlife accounts yet</h3>
                <p className="text-gray-600 mb-4">Follow wildlife sanctuaries to see their conservation stories!</p>
                <Button onClick={() => window.location.href = '/wildlife-sanctuary'}>
                  Explore Wildlife Stories
                </Button>
              </div>
            );
          })()}
        </div>

        {/* My Wildlife Posts Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wildlife Posts</h2>
          {(() => {
            const wildlifePosts = JSON.parse(localStorage.getItem('wildlifePosts') || '[]');
            const userPosts = wildlifePosts.filter((post: any) => post.sanctuaryId === user?.id);
            
            return userPosts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {userPosts.map((post: any) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="relative h-48">
                      {post.mediaType === 'image' ? (
                        <img 
                          src={post.media} 
                          alt="Wildlife post"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video 
                          src={post.media} 
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      {post.isStory && (
                        <div className="absolute top-4 left-4">
                          <Badge variant="info">Story</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-700 text-sm mb-3 line-clamp-2">{post.content}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.hashtags.slice(0, 3).map((tag: string, index: number) => (
                          <span key={index} className="text-emerald-600 text-xs">#{tag}</span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                        <div className="flex space-x-3">
                          <span>{post.likes?.length || 0} likes</span>
                          <span>{post.comments?.length || 0} comments</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No wildlife posts yet</h3>
                <p className="text-gray-600 mb-4">Share your wildlife conservation stories and updates!</p>
                <Button onClick={() => window.location.href = '/wildlife-sanctuary'}>
                  Create Wildlife Post
                </Button>
              </div>
            );
          })()}
        </div>

        {/* My Pet Profiles Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Pet Profiles</h2>
          {(() => {
            const userPetProfiles = JSON.parse(localStorage.getItem('petProfiles') || '[]');
            const userPosts = JSON.parse(localStorage.getItem('petPosts') || '[]');
            return userPetProfiles.length > 0 ? (
              <div className="space-y-8">
                {userPetProfiles.map((profile: any) => {
                  const petPosts = userPosts.filter((post: any) => post.petId === profile.id);
                  return (
                    <div key={profile.id} className="bg-white rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                          <img
                            src={profile.profilePhoto}
                            alt={profile.petName}
                            className="w-16 h-16 rounded-full object-cover border-4 border-emerald-100"
                          />
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{profile.petName}</h3>
                            <p className="text-gray-600">{profile.breed} • {profile.age}</p>
                            <div className="flex space-x-4 mt-1">
                              <span className="text-sm text-gray-500">{profile.followers?.length || 0} followers</span>
                              <span className="text-sm text-gray-500">{profile.following?.length || 0} following</span>
                              <span className="text-sm text-gray-500">{petPosts.length} posts</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = '/pet-stories'}
                        >
                          <Grid className="h-4 w-4 mr-2" />
                          Manage Profile
                        </Button>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">{profile.petName}'s Posts</h4>
                        {petPosts.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {petPosts.map((post: any) => (
                              <Card key={post.id} className="overflow-hidden">
                                <div className="relative">
                                  {post.type === 'image' ? (
                                    <img
                                      src={post.content}
                                      alt="Post content"
                                      className="w-full h-48 object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={post.content}
                                      className="w-full h-48 object-cover"
                                      controls
                                    />
                                  )}
                                </div>
                                <CardContent className="p-3">
                                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">{post.caption}</p>
                                  <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                                    <div className="flex space-x-3">
                                      <span>{post.likes?.length || 0} likes</span>
                                      <span>{post.comments?.length || 0} comments</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 mt-3">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-1"
                                      onClick={() => {
                                        setEditingPost(post);
                                        setEditPostForm({ caption: post.caption, content: post.content, type: post.type });
                                        setShowEditPostModal(true);
                                      }}
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      className="flex-1 text-red-600 hover:text-red-700"
                                      onClick={() => {
                                        if (window.confirm('Delete this post?')) {
                                          const updatedPosts = userPosts.filter((p: any) => p.id !== post.id);
                                          localStorage.setItem('petPosts', JSON.stringify(updatedPosts));
                                          window.location.reload();
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <p className="text-gray-500">No posts from {profile.petName} yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No pet profiles yet</h3>
                <p className="text-gray-600 mb-4">Create a pet profile in Pet Stories to showcase your furry friends!</p>
                <Button onClick={() => window.location.href = '/pet-stories'}>
                  Create Pet Profile
                </Button>
              </div>
            );
          })()}
        </div>

        {/* Favorite Events Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Favorite Events ({favoriteEvents.length})</h2>
          {favoriteEvents.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {favoriteEvents.map((event) => {
                const eventStatuses = getEventStatus(event.startDate, event.isFree);
                return (
                  <Card key={event.id} className="overflow-hidden">
                    <div className="relative h-48">
                      <img 
                        src={event.gallery?.[0] || event.poster || 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800'} 
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {event.gallery && event.gallery.length > 1 && (
                        <div className="absolute bottom-2 left-2 w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                          <img 
                            src={event.gallery[1]} 
                            alt="Secondary"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                    <CardContent>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">by {event.organizer}</p>
                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="text-sm">{formatDate(event.startDate)}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.location.address}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="transition-all duration-300 ease-in-out">
                      <div className="space-y-2 w-full">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {eventStatuses.map((status, index) => (
                            <Badge key={index} variant={status.variant}>{status.status}</Badge>
                          ))}
                        </div>
                        <div className="flex justify-center">
                          <Badge variant="success" className="flex items-center">
                            <Heart className="h-3 w-3 mr-1 fill-current" />
                            Favorite
                          </Badge>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No favorite events yet</h3>
              <p className="text-gray-600">Start exploring events and add them to your favorites!</p>
            </div>
          )}
        </div>

        {/* WhatsApp-like Chat Screen */}
        {showChatScreen && selectedChat && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="bg-emerald-600 text-white p-4 flex items-center shadow-lg">
              <button
                onClick={() => setShowChatScreen(false)}
                className="mr-4 hover:bg-emerald-700 p-2 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img
                src={selectedChat.doctorImage}
                alt={selectedChat.doctorName}
                className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{selectedChat.doctorName}</h3>
                <p className="text-sm text-emerald-100">
                  {selectedChat.isOnline ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Online
                    </span>
                  ) : (
                    `Last seen ${selectedChat.lastSeen ? formatTime(selectedChat.lastSeen) : 'recently'}`
                  )}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
              {selectedChat.messages.map((message) => (
                <div key={message.id} className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
                  <div className="relative group max-w-xs lg:max-w-md">
                    {message.deleted ? (
                      <div className={`px-3 py-2 rounded-lg text-sm italic text-gray-500 ${
                        message.isFromUser ? 'bg-gray-200' : 'bg-white'
                      }`}>
                        {message.deletedForEveryone ? 'This message was deleted' : 'You deleted this message'}
                      </div>
                    ) : (
                      <div
                        className={`px-3 py-2 rounded-lg text-sm relative ${
                          message.isFromUser
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
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
                        
                        <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                          message.isFromUser ? 'text-emerald-100' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.isFromUser && getMessageStatusIcon(message.status)}
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
              
              {doctorTyping && (
                <div className="flex justify-start">
                  <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{selectedChat.doctorName} is typing...</p>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t p-4">
              {isRecording && (
                <div className="flex items-center justify-center mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center space-x-4">
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
                      Stop Recording
                    </button>
                  </div>
                </div>
              )}
              
              {showAudioPreview && recordedAudio && (
                <div className="mb-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-emerald-800">Voice Message Ready</h4>
                    <span className="text-emerald-600 text-sm">{formatDuration(previewDuration)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => recordedAudio && playAudio('preview', recordedAudio)}
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
                        onClick={() => recordedAudio && handleSendRecording()}
                        className="px-4 py-1 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                >
                  <Image className="h-5 w-5" />
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-12"
                  />
                  <button 
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-emerald-600 transition-colors"
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
                    className="p-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
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
                    className={`p-3 rounded-full transition-colors select-none ${
                      isRecording 
                        ? 'bg-red-500 text-white scale-110' 
                        : 'bg-emerald-500 text-white hover:bg-emerald-600'
                    }`}
                    title={isRecording ? 'Release to stop recording' : 'Hold to record voice message'}
                  >
                    <Mic className="h-5 w-5" />
                  </button>
                ) : null}
              </div>
            </div>

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
          </div>
        )}

        {/* Unified Chat Screen */}
        {showUnifiedChat && selectedUnifiedChat && (
          <ChatScreen
            session={selectedUnifiedChat}
            onClose={() => {
              setShowUnifiedChat(false);
              setSelectedUnifiedChat(null);
            }}
            showBackToProfile={true}
          />
        )}

        {(showMessageOptions || showEmojiPicker) && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setShowMessageOptions(null);
              setShowEmojiPicker(false);
            }}
          />
        )}

        {/* Edit Post Modal */}
        {showEditPostModal && editingPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
              <h3 className="text-xl font-bold mb-4">Edit Post</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const userPosts = JSON.parse(localStorage.getItem('petPosts') || '[]');
                const updatedPosts = userPosts.map((p: any) => 
                  p.id === editingPost.id 
                    ? { ...p, caption: editPostForm.caption, content: editPostForm.content, type: editPostForm.type }
                    : p
                );
                localStorage.setItem('petPosts', JSON.stringify(updatedPosts));
                setShowEditPostModal(false);
                setEditingPost(null);
                toast.success('Post updated successfully!');
                window.location.reload();
              }} className="space-y-4">
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditPostForm({ ...editPostForm, type: 'image' })}
                    className={`flex-1 py-2 px-4 rounded-lg ${editPostForm.type === 'image' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPostForm({ ...editPostForm, type: 'video' })}
                    className={`flex-1 py-2 px-4 rounded-lg ${editPostForm.type === 'video' ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}
                  >
                    Video
                  </button>
                </div>
                <div>
                  <input
                    type="file"
                    accept={editPostForm.type === 'image' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setEditPostForm({ ...editPostForm, content: event.target?.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="edit-post-content"
                  />
                  <label
                    htmlFor="edit-post-content"
                    className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-400"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Update {editPostForm.type}
                  </label>
                  {editPostForm.content && (
                    <div className="mt-2">
                      {editPostForm.type === 'image' ? (
                        <img src={editPostForm.content} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                      ) : (
                        <video src={editPostForm.content} className="w-full h-32 object-cover rounded-lg" controls />
                      )}
                    </div>
                  )}
                </div>
                <textarea
                  placeholder="Update caption..."
                  value={editPostForm.caption}
                  onChange={(e) => setEditPostForm({ ...editPostForm, caption: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex space-x-3">
                  <Button type="submit" className="flex-1">Update Post</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setShowEditPostModal(false);
                    setEditingPost(null);
                  }} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && editingEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out scale-100">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                  <button 
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEvent(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                  >
                    ×
                  </button>
                </div>
                
                <form onSubmit={handleUpdateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <input 
                      type="text" 
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                    <input 
                      type="time" 
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input 
                      type="text" 
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      rows={4} 
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 flex space-x-4">
                    <button type="submit" className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      Update Event
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingEvent(null);
                      }}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;