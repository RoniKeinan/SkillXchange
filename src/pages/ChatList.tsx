import React, { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/UserContext';

type ChatUser = {
  chatId: string;
  user1: string;
  user2: string;
  createdAt: string;
};

const ChatList: React.FC = () => {
  const { user } = useUserContext();
  const [userChats, setUserChats] = useState<ChatUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user || !user.email) return;

      try {
        const res = await fetch(
          `https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Chat?userEmail=${encodeURIComponent(user.email)}`
        );

        if (res.ok) {
          const data = await res.json();
          setUserChats(data);
        } else {
          console.error('Failed to fetch chats');
        }
      } catch (err) {
        console.error('Error fetching chats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  if (!user) return <p>Loading user...</p>;

  if (loading) return <p>Loading chats...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Your Chats</h2>
      {userChats.length === 0 ? (
        <p style={styles.noChats}>You have no chats yet.</p>
      ) : (
        <ul style={styles.list}>
          {userChats.map((chat, idx) => {
            const otherUser = chat.user1 === user.email ? chat.user2 : chat.user1;
            return (
              <li key={chat.chatId || idx} style={styles.chatItem}>
                <img
                  src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${otherUser}`}
                  alt={otherUser}
                  style={styles.avatar}
                />
                <div>
                  <div style={styles.name}>{otherUser}</div>
                  <div style={styles.lastMessage}>
                    Chat started on: {new Date(chat.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '500px',
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '1rem',
    fontSize: '1.5rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.5rem',
    color: '#1e3a8a',
  },
  noChats: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  lastMessage: {
    fontSize: '0.9rem',
    color: '#555',
  },
};

export default ChatList;
