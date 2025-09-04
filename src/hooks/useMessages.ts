import { useState, useEffect } from 'react';
import db from '../lib/database';
import { useAuth } from '../AuthContext';

export const useMessages = (receiverId?: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!user || !receiverId) return;
    setLoading(true);
    const { data, error } = await db.getMessages(user.id, receiverId);
    if (data && !error) {
      setMessages(data);
    }
    setLoading(false);
  };

  const sendMessage = async (content: string, type: string = 'text', metadata?: any) => {
    if (!user || !receiverId) return;
    
    const message = {
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      message_type: type,
      ...metadata
    };

    const { data, error } = await db.sendMessage(message);
    if (data && !error) {
      await fetchMessages();
    }
    return { data, error };
  };

  useEffect(() => {
    if (user && receiverId) {
      fetchMessages();
    }
  }, [user, receiverId]);

  return {
    messages,
    loading,
    sendMessage,
    fetchMessages
  };
};