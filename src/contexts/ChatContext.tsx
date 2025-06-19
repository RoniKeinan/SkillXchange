import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './UserContext';

export type ChatUser = {
  chatId: string;
  user1: string;
  user2: string;
  createdAt: string;
};

type ChatContextType = {
  userChats: ChatUser[];
  loading: boolean;
  refreshChats: () => Promise<void>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [userChats, setUserChats] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Chat?userEmail=${encodeURIComponent(user.email)}`
      );
      if (!res.ok) throw new Error('Failed to fetch chats');

      const data = await res.json();
      setUserChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [user]);

  return (
    <ChatContext.Provider value={{ userChats, loading, refreshChats: fetchChats }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChatContext must be used within a ChatProvider');
  return context;
};
