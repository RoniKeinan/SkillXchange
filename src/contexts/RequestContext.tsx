import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUserContext } from './UserContext';
import { useSkillContext } from '../contexts/SkillsContext';

type Request = {
  id: string;
  userName: string;
  fromUserEmail: string;
  toUserEmail: string;
  userImage: string;
  message: string;
  offerDescription: string;
  taskToken: string;
  status: string;
  createdAt: string;
};

type RequestContextType = {
  receivedRequests: Request[];
  sentRequests: Request[];
  loading: boolean;
  error: string | null;
  refreshRequests: () => void;
};

const RequestContext = createContext<RequestContextType | undefined>(undefined);

export const useRequestContext = () => {
  const context = useContext(RequestContext);
  if (!context) throw new Error('useRequestContext must be used within RequestProvider');
  return context;
};



export const RequestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUserContext();
  const [receivedRequests, setReceivedRequests] = useState<Request[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { skills } = useSkillContext(); 

    // Helper function to get the skill name by ID
  const getSkillName = (id: string | number | undefined) => {
    if (!id) return '';
    const skill = skills.find(s => String(s.id) === String(id));
    return skill?.skillName || skill?.skillName || String(id);
  };

  const getRequests = async (): Promise<void> => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Request');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const rawData = await response.json();

      const received = rawData
        .filter((r: any) => r.toUserEmail === user.email)
        .map((r: any) => ({
          id: r.requestId,
          userName: r.fromUserEmail?.split('@')[0] || 'Unknown',
          fromUserEmail: r.fromUserEmail,
          toUserEmail: r.toUserEmail,
          userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.fromUserEmail || 'User')}`,
          message: `Wants to exchange skill: ${getSkillName(r.requestedSkillId)}`,
          offerDescription: `Offers skill: ${getSkillName(r.offeredSkillId)}`,
          taskToken: r.taskToken || '',
          status: r.status || 'pending',
          createdAt: r.createdAt || new Date().toISOString(),
        }));

      const sent = rawData
        .filter((r: any) => r.fromUserEmail === user.email)
        .map((r: any) => ({
          id: r.requestId,
          userName: r.toUserEmail?.split('@')[0] || 'Unknown',
          fromUserEmail: r.fromUserEmail,
          toUserEmail: r.toUserEmail,
          userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.toUserEmail || 'User')}`,
          message: `You requested: ${getSkillName(r.requestedSkillId)}`,
          offerDescription: `You offered: ${getSkillName(r.offeredSkillId)}`,
          taskToken: r.taskToken || '',
          status: r.status || 'pending',
          createdAt: r.createdAt || new Date().toISOString(),
        }));

      setReceivedRequests(received);
      setSentRequests(sent);
      setError(null);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) getRequests();
  }, [user]);

  return (
    <RequestContext.Provider
      value={{
        receivedRequests,
        sentRequests,
        loading,
        error,
        refreshRequests: getRequests,
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
