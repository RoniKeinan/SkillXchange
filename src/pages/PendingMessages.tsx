import React, { useState, useEffect } from 'react';
import { useUserContext } from '../contexts/UserContext';

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

const PendingRequests: React.FC = () => {
  const { user } = useUserContext();
  const [receivedRequests, setReceivedRequests] = useState<Request[]>([]);
  const [sentRequests, setSentRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getRequests = async (): Promise<void> => {
    try {
      const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Request');
      if (!response.ok) throw new Error('Failed to fetch requests');

      const rawData = await response.json();

      const received = rawData
        .filter((r: any) => r.toUserEmail === user?.email)
        .map((r: any) => ({
          id: r.requestId,
          userName: r.fromUserEmail?.split('@')[0] || 'Unknown',
          fromUserEmail: r.fromUserEmail,
          toUserEmail: r.toUserEmail,
          userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.fromUserEmail || 'User')}`,
          message: `Wants to exchange skill: ${r.requestedSkillId}`,
          offerDescription: `Offers skill: ${r.offeredSkillId}`,
          taskToken: r.taskToken || '',
          status: r.status || 'pending',
          createdAt: r.createdAt || new Date().toISOString(),
        }));

      const sent = rawData
        .filter((r: any) => r.fromUserEmail === user?.email)
        .map((r: any) => ({
          id: r.requestId,
          userName: r.toUserEmail?.split('@')[0] || 'Unknown',
          fromUserEmail: r.fromUserEmail,
          toUserEmail: r.toUserEmail,
          userImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.toUserEmail || 'User')}`,
          message: `You requested: ${r.requestedSkillId}`,
          offerDescription: `You offered: ${r.offeredSkillId}`,
          taskToken: r.taskToken || '',
          status: r.status || 'pending',
          createdAt: r.createdAt || new Date().toISOString(),
        }));
      setReceivedRequests(received);
      setSentRequests(sent);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      getRequests();
    }
  }, [user]);



  const handleDecision = async (id: string, approved: boolean) => {
    const request = receivedRequests.find((r) => r.id === id);

    if (!request) {
      console.error('❌ Request not found');
      return;
    }

    if (!request.taskToken || !request.fromUserEmail || !request.toUserEmail) {
      console.error('❌ Missing required fields:', {
        taskToken: request.taskToken,
        fromUserEmail: request.fromUserEmail,
        toUserEmail: request.toUserEmail,
      });
      alert('This request is missing necessary information. Please try again later.');
      return;
    }

    try {
      const payload = {
         taskToken: request.taskToken,
        input: {
         
          requestId: request.id,
          approved: approved,
          fromUserEmail: request.fromUserEmail,
          toUserEmail: request.toUserEmail,
        }
      };

      const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('✅ Decision sent:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Unknown error');
      }

      alert(`You ${approved ? 'accepted' : 'denied'} the request from ${request.userName}`);
      setReceivedRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('❌ Error sending decision:', error);
      alert('Something went wrong while sending your decision.');
    }
  };


  const handleAccept = (id: string) => handleDecision(id, true);
  const handleDeny = (id: string) => handleDecision(id, false);

  if (!user) return <p>Loading user...</p>;
  if (loading) return <p>Loading requests...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>🤝 Exchange Requests</h2>

      <section>
        <h3 style={styles.subHeader}>Requests You Sent</h3>
        {sentRequests.length === 0 ? (
          <p style={styles.noRequests}>No sent requests.</p>
        ) : (
          <ul style={styles.list}>
            {sentRequests.map((req) => (
              <li key={req.id} style={styles.item}>
                <img src={req.userImage} alt={req.userName} style={styles.avatar} />
                <div style={styles.messageContent}>
                  <div style={styles.name}>{req.userName}</div>
                  <div style={styles.message}>{req.message}</div>
                  <div style={styles.offerDescription}>{req.offerDescription}</div>
                  <div style={styles.message}>Status: <strong>{req.status}</strong></div>
                </div>
                <div style={{ ...styles.statusLabel, backgroundColor: '#3b82f6' }}>
                  {req.status}
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
                <img src={req.userImage} alt={req.fromUserEmail} style={styles.avatar} />
                <div style={styles.messageContentVertical}>
                  <div style={styles.name}>{req.fromUserEmail}</div>
                  <div style={styles.message}>{req.message}</div>
                  <div style={styles.offerDescription}>{req.offerDescription}</div>
                  <div style={styles.message}>
                    <strong>Status:</strong>{' '}
                    <span style={{ color: req.status === 'pending' ? '#f59e0b' : '#10b981' }}>
                      {req.status}
                    </span>
                  </div>
                  <div style={styles.message}>
                    <strong>Created:</strong> {new Date(req.createdAt).toLocaleString()}
                  </div>
                  <div style={styles.buttonsContainer}>
                    <button
                      style={{ ...styles.button, ...styles.acceptButton }}
                      onClick={() => handleAccept(req.id)}
                      disabled={req.status !== 'pending'}
                    >
                      Accept
                    </button>
                    <button
                      style={{ ...styles.button, ...styles.denyButton }}
                      onClick={() => handleDeny(req.id)}
                      disabled={req.status !== 'pending'}
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
