import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { FiMessageCircle, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard';

const ProfileScreen: React.FC = () => {
  const { user, skills } = useUserContext();
  const navigate = useNavigate();

  const unreadMessages = 3;
  const unreadChats = 1;
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>User not found.</h2>
          <p>You must be logged in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.topBar}>
          <div style={styles.buttonGroup}>
            <div style={styles.iconWrapper}>
              <button onClick={() => navigate('/PendingMessages')} style={styles.iconButton}>
                <FiMail size={20} />
              </button>
              {unreadMessages > 0 && (
                <div style={styles.badge}>{unreadMessages}</div>
              )}
            </div>

            <div style={styles.iconWrapper}>
              <button onClick={() => navigate('/ChatList')} style={styles.iconButton}>
                <FiMessageCircle size={20} />
              </button>
              {unreadChats > 0 && (
                <div style={styles.badge}>{unreadChats}</div>
              )}
            </div>
          </div>
        </div>
        <div style={styles.topSection}>
          <img style={styles.image} src={user.image} alt={`${user.firstName} ${user.lastName}`} />
          <div style={styles.nameBlock}>
            <div style={styles.name}>{user.firstName} {user.lastName}</div>
            <div style={styles.value}>{user.email}</div>
            <div style={styles.value}>Phone: {user.phone}</div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Birth Date:</div>
          <div style={styles.value}>{user.birthDate}</div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Address:</div>
          <div style={styles.value}>
            {user.street} {user.houseNumber}, {user.city}
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.label}>Skills:</div>
          <div style={styles.skillsGrid}>
            {skills.length > 0 ? (
              skills.map((skill) => (
                <SkillCard
                  skill={skill}
                  onClick={(selectedSkill) => {
                    console.log('Clicked on skill:', selectedSkill);
                  }}
                />

              ))
            ) : (
              <span>No skills listed.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '2rem',
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    maxWidth: '800px',
    width: '100%',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  iconWrapper: {
    position: 'relative' as const,
  },

  badge: {
    position: 'absolute' as const,
    top: '-6px',
    right: '-6px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 2px white',
  },
  iconButton: {
    backgroundColor: '#eee',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    marginRight: '1.5rem',
    border: '3px solid #ddd',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  name: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#333',
    marginBottom: '0.5rem',
  },
  label: {
    fontWeight: 500,
    color: '#555',
    marginBottom: '0.3rem',
  },
  value: {
    color: '#333',
    marginBottom: '0.5rem',
  },
  section: {
    marginBottom: '1.5rem',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
  skillCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'default',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    flexDirection: 'column' as const,
  },
  skillName: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  skillCategory: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '0.3rem',
  },
  skillDescription: {
    marginTop: '0.5rem',
    fontSize: '1rem',
    color: '#4b5563',
  },
};

export default ProfileScreen;
