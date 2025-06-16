import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import { useLocation } from 'react-router-dom';

const ChatMessages: React.FC = () => {
  const { user } = useUserContext();
  const { chatId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
   const location = useLocation();
  const otherUser = location.state?.otherUser;

  const fetchMessages = async () => {
    const res = await fetch(
      `https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Messages?chatId=${chatId}`
    );
    if (res.ok) {
      const data = await res.json();
      
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    const res = await fetch(`https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, sender: user?.email, text }),
    });

    if (res.ok) {
      setText('');
      fetchMessages();
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // poll for new messages every 5 sec
    return () => clearInterval(interval);
  }, [chatId]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Chat with - {otherUser} </h2>

      <div style={styles.messageContainer}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.sender === user?.email ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === user?.email ? '#3b82f6' : '#e5e7eb',
              color: msg.sender === user?.email ? '#fff' : '#111827',
            }}
          >
            <div style={styles.sender}>
              {msg.sender === user?.email ? 'You' : msg.sender}
            </div>
            <div style={styles.text}>{msg.text}</div>
          </div>
        ))}
      </div>

      <div style={styles.inputArea}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '700px',
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '1rem',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  messageContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    marginBottom: '1.2rem',
  },
  message: {
    maxWidth: '75%',
    padding: '0.75rem 1rem',
    borderRadius: '1rem',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
  },
  sender: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
  },
  text: {
    fontSize: '1rem',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid #cbd5e1',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.2rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '0.75rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

export default ChatMessages;
