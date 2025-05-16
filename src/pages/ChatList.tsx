

import React from 'react';
import { useUserContext } from '../contexts/UserContext'; // Adjust path as needed

type ChatUser = {
  id: number;
  user1Email: string;
  user2Email: string;
  name: string;
  image: string;
  lastMessage: string;
};

const mockChats: ChatUser[] = [
  {
    id: 1,
    user1Email: 'you@example.com',
    user2Email: 'liam@example.com',
    name: 'Liam Cohen',
    image: 'https://i.pravatar.cc/150?img=32',
    lastMessage: 'Sure, let’s trade!',
  },
  {
    id: 2,
    user1Email: 'emma@example.com',
    user2Email: 'you@example.com',
    name: 'Emma Levi',
    image: 'https://i.pravatar.cc/150?img=45',
    lastMessage: 'What skill do you offer?',
  },
  {
    id: 3,
    user1Email: 'otheruser@example.com',
    user2Email: 'someone@example.com',
    name: 'Not Your Chat',
    image: 'https://i.pravatar.cc/150?img=22',
    lastMessage: 'You should not see this',
  },
];

const ChatList: React.FC = () => {
  const { user } = useUserContext();

  if (!user) return <p>Loading user...</p>;

  // Filter only chats where the logged-in user is a participant
  const userChats = mockChats.filter(
    chat => chat.user1Email === user.email || chat.user2Email === user.email
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Your Chats</h2>
      {userChats.length === 0 ? (
        <p style={styles.noChats}>You have no chats yet.</p>
      ) : (
        <ul style={styles.list}>
          {userChats.map((chat) => (
            <li key={chat.id} style={styles.chatItem}>
              <img src={chat.image} alt={chat.name} style={styles.avatar} />
              <div>
                <div style={styles.name}>{chat.name}</div>
                <div style={styles.lastMessage}>{chat.lastMessage}</div>
              </div>
            </li>
          ))}
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
