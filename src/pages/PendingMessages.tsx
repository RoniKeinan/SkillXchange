import React, { useState } from 'react';
import { useUserContext } from '../contexts/UserContext';

type Request = {
  id: number;
  userName: string;
  userEmail: string;
  userImage: string;
  message: string; // original message/request text
  offerDescription: string; // what the user is offering
};

const mockSentRequests: Request[] = [
  {
    id: 1,
    userName: 'Liam Cohen',
    userEmail: 'liam@example.com',
    userImage: 'https://i.pravatar.cc/150?img=32',
    message: 'Waiting for your reply about exchanging skills.',
    offerDescription: '',
  },
];

const mockReceivedRequestsInitial: Request[] = [
  {
    id: 2,
    userName: 'Emma Levi',
    userEmail: 'emma@example.com',
    userImage: 'https://i.pravatar.cc/150?img=45',
    message: 'Would love to exchange skills with you!',
    offerDescription: 'Can teach you Photoshop and Graphic Design basics.',
  },
];

const PendingRequests: React.FC = () => {
  const { user } = useUserContext();
  const [receivedRequests, setReceivedRequests] = useState(mockReceivedRequestsInitial);

  if (!user) return <p>Loading user...</p>;

  const handleAccept = (id: number) => {
    alert(`You accepted the request with id ${id}`);
    setReceivedRequests((prev) => prev.filter((r) => r.id !== id));
    // TODO: call your API to accept the request
  };

  const handleDeny = (id: number) => {
    alert(`You denied the request with id ${id}`);
    setReceivedRequests((prev) => prev.filter((r) => r.id !== id));
    // TODO: call your API to deny the request
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🤝 Exchange Requests</h2>

      <section>
        <h3 style={styles.subHeader}>Requests You Sent</h3>
        {mockSentRequests.length === 0 ? (
          <p style={styles.noRequests}>No sent requests.</p>
        ) : (
          <ul style={styles.list}>
            {mockSentRequests.map((req) => (
              <li key={req.id} style={styles.item}>
                <img src={req.userImage} alt={req.userName} style={styles.avatar} />
                <div style={styles.messageContent}>
                  <div style={styles.name}>{req.userName}</div>
                  <div style={styles.message}>{req.message}</div>
                </div>
                <div style={{ ...styles.statusLabel, backgroundColor: '#3b82f6' }}>
                  Pending
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={styles.subHeader}>Requests You Received</h3>
        {receivedRequests.length === 0 ? (
          <p style={styles.noRequests}>No received requests.</p>
        ) : (
          <ul style={styles.list}>
            {receivedRequests.map((req) => (
              <li key={req.id} style={styles.itemVertical}>
                <img src={req.userImage} alt={req.userName} style={styles.avatar} />
                <div style={styles.messageContentVertical}>
                  <div style={styles.name}>{req.userName}</div>
                  <div style={styles.message}>{req.message}</div>
                  <div style={styles.offerDescription}>
                    <strong>Offering:</strong> {req.offerDescription}
                  </div>
                  <div style={styles.buttonsContainer}>
                    <button
                      style={{ ...styles.button, ...styles.acceptButton }}
                      onClick={() => handleAccept(req.id)}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.denyButton }}
                      onClick={() => handleDeny(req.id)}
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '600px',
    margin: '2rem auto',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#111827',
  },
  subHeader: {
    fontSize: '1.3rem',
    marginBottom: '1rem',
    color: '#374151',
    borderBottom: '1px solid #ddd',
    paddingBottom: '0.3rem',
  },
  noRequests: {
    fontStyle: 'italic',
    color: '#6b7280',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
  },
  itemVertical: {
    display: 'flex',
    gap: '1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #eee',
  },
  avatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  messageContent: {
    flex: 1,
  },
  messageContentVertical: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  message: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '0.3rem',
  },
  offerDescription: {
    fontSize: '0.9rem',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  buttonsContainer: {
    display: 'flex',
    gap: '0.75rem',
  },
  button: {
    flex: 1,
    padding: '0.5rem 1rem',
    fontSize: '0.9rem',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: 'white',
    transition: 'background-color 0.2s ease',
  },
  acceptButton: {
    backgroundColor: '#22c55e',
  },
  denyButton: {
    backgroundColor: '#ef4444',
  },
  statusLabel: {
    padding: '4px 10px',
    borderRadius: '9999px',
    color: 'white',
    fontWeight: 'bold',
    minWidth: '70px',
    textAlign: 'center',
  },
};

export default PendingRequests;
