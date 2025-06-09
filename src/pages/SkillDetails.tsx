import React, { useState } from 'react'; 
import { useParams } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';
import { useUserContext } from '../contexts/UserContext';

const SkillDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { skills } = useSkillContext();
  const { user } = useUserContext();

  const [requestSent, setRequestSent] = useState(false);

  // Fix: search by string id, no Number conversion
  const skill = skills.find(s => s.id === id);
  console.log(skill);
  if (!skill) return <p>Skill not found</p>;

  const handleExchangeRequest = () => {
    if (requestSent) {
      const confirmCancel = confirm("❌ Cancel your exchange request?");
      if (confirmCancel) {
        setRequestSent(false);
        alert("Request canceled.");
      }
    } else {
      setRequestSent(true);
      alert(`🔁 Request sent to ${skill.contactName} to exchange skills!`);
    }
    // In the future you can call a real API here
  };

  return (
    <div style={styles.container}>
      {/* Use skillName instead of name */}
      <h2 style={styles.title}>{skill.skillName}</h2>
      <p style={styles.description}>{skill.description}</p>

      <div style={styles.userInfo}>
        {/* There is no user object, use contactName and contactEmail */}
        <img 
          src={skill.images && skill.images.length > 0 ? skill.images[0] : 'https://via.placeholder.com/60'} 
          alt={skill.contactName} 
          style={styles.avatar} 
        />
        <div>
          <div style={styles.userName}>{skill.contactName}</div>
          <div style={styles.userEmail}>{skill.contactEmail}</div>
        </div>
      </div>

      {/* Compare user email to contactEmail */}
      {user?.email !== skill.contactEmail && (
        <button
          style={{
            ...styles.button,
            ...(requestSent ? styles.pendingText : {}),
          }}
          onClick={handleExchangeRequest}
        >
          {requestSent ? '⏳ Pending Request' : '🤝 Send Exchange Request'}
        </button>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '700px',
    margin: '3rem auto',
    padding: '2rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: '1rem',
  },
  description: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.5rem',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontWeight: 600,
    fontSize: '1rem',
    color: '#1f2937',
  },
  userEmail: {
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background 0.2s ease-in-out',
  },
  pendingText: {
    backgroundColor: '#e5e7eb',
    color: '#374151',
    cursor: 'default',
    padding: '10px 20px',
  },
};

export default SkillDetails;
