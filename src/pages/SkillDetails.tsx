import React from 'react';
import { useParams } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';
import { useUserContext } from '../contexts/UserContext';

const SkillDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { skills } = useSkillContext();
  const { user } = useUserContext();

  const skill = skills.find(s => s.id === Number(id));
  if (!skill) return <p>Skill not found</p>;

  const handleExchangeRequest = () => {
    alert(`🔁 Request sent to ${skill.user.name} to exchange skills!`);
    // בעתיד אפשר לקרוא ל־API אמיתי כאן
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{skill.name}</h2>
      <p style={styles.description}>{skill.description}</p>

      <div style={styles.userInfo}>
        <img src={skill.user.image} alt={skill.user.name} style={styles.avatar} />
        <div>
          <div style={styles.userName}>{skill.user.name}</div>
          <div style={styles.userEmail}>{skill.user.email}</div>
        </div>
      </div>

      {user?.email !== skill.user.email && (
        <button style={styles.button} onClick={handleExchangeRequest}>
          🤝 Send Exchange Request
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
};

export default SkillDetails;
