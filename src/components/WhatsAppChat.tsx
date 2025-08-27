import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Smile, Image, Mic, Phone, Video, MoreVertical, Check, CheckCheck, Play, Pause, Square } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  type: 'text' | 'image' | 'audio';
  status: 'sent' | 'delivered' | 'read';
  duration?: string;
}

interface Caretaker {
  id: string;
  name: string;
  profilePicture: string;
  phone: string;
}

interface ChatProps {
  caretaker: Caretaker;
  onClose: () => void;
}

const WhatsAppChat: React.FC<ChatProps> = ({ caretaker, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'];

  useEffect(() => {
    // Load existing chat
    const chats = JSON.parse(localStorage.getItem('caretakerChats') || '[]');
    const existingChat = chats.find((chat: any) => chat.caretakerId === caretaker.id);
    if (existingChat) {
      setMessages(existingChat.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, [caretaker.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveChat = (updatedMessages: Message[]) => {
    const chats = JSON.parse(localStorage.getItem('caretakerChats') || '[]');
    const existingIndex = chats.findIndex((chat: any) => chat.caretakerId === caretaker.id);
    
    const chatData = {
      caretakerId: caretaker.id,
      caretakerName: caretaker.name,
      caretakerImage: caretaker.profilePicture,
      messages: updatedMessages
    };

    if (existingIndex >= 0) {
      chats[existingIndex] = chatData;
    } else {
      chats.push(chatData);
    }
    
    localStorage.setItem('caretakerChats', JSON.stringify(chats));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content: newMessage.trim(),
      timestamp: new Date(),
      isFromUser: true,
      type: 'text',
      status: 'sent'
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveChat(updatedMessages);
    setNewMessage('');

    // Simulate caretaker response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const responses = [
        "Hi! I'd be happy to take care of your pet. When do you need my services?",
        "Thank you for reaching out! I have experience with all types of pets.",
        "I'm available and would love to help with your pet care needs.",
        "Great! I can provide excellent care for your furry friend.",
        "I'm excited to meet your pet! What specific care do they need?"
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: caretaker.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isFromUser: false,
        type: 'text',
        status: 'delivered'
      };

      const finalMessages = [...updatedMessages, response];
      setMessages(finalMessages);
      saveChat(finalMessages);
    }, 1000 + Math.random() * 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: 'user',
        content: event.target?.result as string,
        timestamp: new Date(),
        isFromUser: true,
        type: 'image',
        status: 'sent'
      };

      const updatedMessages = [...messages, message];
      setMessages(updatedMessages);
      saveChat(updatedMessages);
    };
    reader.readAsDataURL(file);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Simulate recording for demo
      setTimeout(() => {
        stopRecording();
      }, 5000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }

    // Create audio message
    const message: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      content: 'data:audio/wav;base64,demo', // Demo audio data
      timestamp: new Date(),
      isFromUser: true,
      type: 'audio',
      status: 'sent',
      duration: formatDuration(recordingTime)
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveChat(updatedMessages);
    setRecordingTime(0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-gray-400" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default: return null;
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 flex items-center shadow-lg">
        <button onClick={onClose} className="mr-4 hover:bg-green-600 p-2 rounded-full transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img
          src={caretaker.profilePicture}
          alt={caretaker.name}
          className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{caretaker.name}</h3>
          <p className="text-sm text-green-100">
            {isTyping ? 'typing...' : 'online'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => window.open(`tel:${caretaker.phone}`)} className="p-2 hover:bg-green-600 rounded-full transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
            <Video className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Start a conversation with {caretaker.name}</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
              message.isFromUser ? 'bg-green-500 text-white' : 'bg-white text-gray-900 shadow-sm'
            }`}>
              {message.type === 'image' ? (
                <img
                  src={message.content}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => window.open(message.content, '_blank')}
                />
              ) : message.type === 'audio' ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setPlayingAudio(playingAudio === message.id ? null : message.id)}
                    className={`p-2 rounded-full ${message.isFromUser ? 'bg-green-600' : 'bg-gray-200'}`}
                  >
                    {playingAudio === message.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <div className="flex-1">
                    <div className={`h-1 rounded-full ${message.isFromUser ? 'bg-green-300' : 'bg-gray-300'}`}>
                      <div className={`h-full rounded-full w-1/3 ${message.isFromUser ? 'bg-white' : 'bg-green-500'}`}></div>
                    </div>
                    <span className={`text-xs ${message.isFromUser ? 'text-green-100' : 'text-gray-600'}`}>
                      {message.duration}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{message.content}</p>
              )}
              
              <div className={`flex items-center justify-end mt-1 space-x-1 text-xs ${
                message.isFromUser ? 'text-green-100' : 'text-gray-500'
              }`}>
                <span>{formatTime(message.timestamp)}</span>
                {message.isFromUser && getStatusIcon(message.status)}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="bg-red-50 border-t border-red-200 p-4 flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">Recording: {formatDuration(recordingTime)}</span>
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <Square className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
          >
            <Image className="h-5 w-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-green-500 pr-12"
            />
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-green-600 transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-lg p-4 w-80 max-h-60 overflow-y-auto z-20">
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => insertEmoji(emoji)}
                      className="text-xl hover:bg-gray-100 p-1 rounded transition-colors"
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
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-2 rounded-full transition-colors ${
                isRecording ? 'bg-red-500 text-white' : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {showEmojiPicker && (
        <div className="fixed inset-0 z-40" onClick={() => setShowEmojiPicker(false)} />
      )}
    </div>
  );
};

export default WhatsAppChat;