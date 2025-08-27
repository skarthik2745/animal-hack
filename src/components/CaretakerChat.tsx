import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Smile, Image, Phone, Video, MoreVertical, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  isFromUser: boolean;
  type: 'text' | 'image';
  status: 'sent' | 'delivered' | 'read';
}

interface ChatProps {
  caretaker: {
    id: string;
    name: string;
    image: string;
    isOnline: boolean;
  };
  onClose: () => void;
}

const CaretakerChat: React.FC<ChatProps> = ({ caretaker, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'];

  useEffect(() => {
    // Load existing chat history
    const petCareChats = JSON.parse(localStorage.getItem('petCareChats') || '[]');
    const existingChat = petCareChats.find((chat: any) => chat.caretakerId === caretaker.id);
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
    setNewMessage('');

    // Save to localStorage
    const petCareChats = JSON.parse(localStorage.getItem('petCareChats') || '[]');
    const existingChatIndex = petCareChats.findIndex((chat: any) => chat.caretakerId === caretaker.id);
    
    if (existingChatIndex >= 0) {
      petCareChats[existingChatIndex].messages = updatedMessages;
    } else {
      petCareChats.push({
        caretakerId: caretaker.id,
        caretakerName: caretaker.name,
        caretakerImage: caretaker.image,
        isOnline: caretaker.isOnline,
        messages: updatedMessages
      });
    }
    localStorage.setItem('petCareChats', JSON.stringify(petCareChats));

    // Simulate caretaker response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll take great care of your pet.",
        "I'm available to help with your pet's needs. What specific care do you require?",
        "I have experience with this type of pet. When would you like to schedule the care?",
        "I'd be happy to provide updates and photos during the care period.",
        "Let me know if you have any special instructions for your pet's care."
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
      
      // Update localStorage with response
      const updatedChats = JSON.parse(localStorage.getItem('petCareChats') || '[]');
      const chatIndex = updatedChats.findIndex((chat: any) => chat.caretakerId === caretaker.id);
      if (chatIndex >= 0) {
        updatedChats[chatIndex].messages = finalMessages;
        localStorage.setItem('petCareChats', JSON.stringify(updatedChats));
      }
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
      
      // Save to localStorage
      const petCareChats = JSON.parse(localStorage.getItem('petCareChats') || '[]');
      const existingChatIndex = petCareChats.findIndex((chat: any) => chat.caretakerId === caretaker.id);
      
      if (existingChatIndex >= 0) {
        petCareChats[existingChatIndex].messages = updatedMessages;
      } else {
        petCareChats.push({
          caretakerId: caretaker.id,
          caretakerName: caretaker.name,
          caretakerImage: caretaker.image,
          isOnline: caretaker.isOnline,
          messages: updatedMessages
        });
      }
      localStorage.setItem('petCareChats', JSON.stringify(petCareChats));
    };
    reader.readAsDataURL(file);
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
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

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-green-500 text-white p-4 flex items-center shadow-lg">
        <button
          onClick={onClose}
          className="mr-4 hover:bg-green-600 p-2 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <img
          src={caretaker.image}
          alt={caretaker.name}
          className="w-10 h-10 rounded-full mr-3 border-2 border-white object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{caretaker.name}</h3>
          <p className="text-sm text-green-100">
            {caretaker.isOnline ? (
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-300 rounded-full mr-2"></span>
                Online
              </span>
            ) : (
              'Last seen recently'
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
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
              message.isFromUser
                ? 'bg-green-500 text-white'
                : 'bg-white text-gray-900 shadow-sm'
            }`}>
              {message.type === 'image' ? (
                <img
                  src={message.content}
                  alt="Shared image"
                  className="max-w-full h-auto rounded-lg cursor-pointer"
                  onClick={() => window.open(message.content, '_blank')}
                />
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
        
        <div ref={messagesEndRef} />
      </div>

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
          
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
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
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowEmojiPicker(false)}
        />
      )}
    </div>
  );
};

export default CaretakerChat;