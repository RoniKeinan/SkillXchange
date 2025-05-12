import React from 'react';
import { useUserContext } from '../contexts/UserContext';

const ProfileScreen: React.FC = () => {
  const { user } = useUserContext();

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
          <div style={styles.skillList}>
            {user.mySkills && user.mySkills.length > 0 ? (
              user.mySkills.map((skill, index) => (
                <span key={index} style={styles.skillBadge}>
                  {skill}
                </span>
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
    maxWidth: '700px',
    width: '100%',
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
  },
  value: {
    color: '#333',
    marginBottom: '0.5rem',
  },
  section: {
    marginBottom: '1.5rem',
  },
  skillList: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.5rem',
  },
  skillBadge: {
    backgroundColor: '#e0e0e0',
    padding: '0.4rem 0.8rem',
    borderRadius: '16px',
    fontSize: '14px',
    color: '#333',
  },
};

export default ProfileScreen;
