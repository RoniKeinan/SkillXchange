import React, { useEffect, useState } from 'react';
import { useUserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.header}>Chat List</h2>
        {userChats.length === 0 ? (
          <p style={styles.noChats}>You have no chats yet.</p>
        ) : (
          <ul style={styles.list}>
            {userChats.map((chat, idx) => {
              const otherUser = chat.user1 === user.email ? chat.user2 : chat.user1;
              return (
                <li
                  key={chat.chatId || idx}
                  style={styles.chatItem}
                  onClick={() => navigate(`/chat/${chat.chatId}`)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === 'Enter') navigate(`/chat/${chat.chatId}`);
                  }}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${otherUser}`}
                    alt={otherUser}
                    style={styles.avatar}
                  />
                  <div style={styles.infoBlock}>
                    <div style={styles.name}>{otherUser}</div>
                    <div style={styles.lastMessage}>
                      <span role="img" aria-label="clock">🕒</span> {new Date(chat.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 0',
  },
  container: {
    width: '100%',
    maxWidth: '430px',
    backgroundColor: '#fff',
    borderRadius: '1.2rem',
    boxShadow: '0 6px 36px 0 rgba(44, 104, 255, 0.13)',
    padding: '2.2rem 2rem 2rem 2rem',
    margin: '2rem auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '1.8rem',
    fontSize: '2.1rem',
    fontWeight: 800,
    color: '#3730a3',
    textAlign: 'center' as const,
    letterSpacing: '-1.5px',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.6rem',
  },
  noChats: {
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    fontSize: '1.14rem',
    padding: '1.8rem 0',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  chatItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.1rem',
    padding: '1rem 0.8rem',
    borderRadius: '1rem',
    marginBottom: '0.7rem',
    cursor: 'pointer',
    transition: 'background 0.18s, transform 0.15s',
    backgroundColor: '#f3f4f6',
    border: '1px solid #eef2ff',
    outline: 'none',
    boxShadow: '0 2px 7px rgba(59,130,246,0.06)',
  } as React.CSSProperties,
  avatar: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    objectFit: 'cover',
    background: '#dbeafe',
    border: '2px solid #c7d2fe',
    boxShadow: '0 2px 6px #e0e7ff',
  },
  infoBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    fontWeight: 700,
    fontSize: '1.18rem',
    color: '#1e3a8a',
    marginBottom: '0.19rem',
    letterSpacing: '-0.5px',
  },
  lastMessage: {
    fontSize: '0.97rem',
    color: '#64748b',
    fontWeight: 500,
    marginTop: '0.08rem',
    letterSpacing: '-0.1px',
  },
};

export default ChatList;
