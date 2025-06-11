import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';
import logo from '../assets/images/logo.png';

const UserProfile: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const { skills } = useSkillContext();
  const navigate = useNavigate();

  // Find all skills uploaded by this user
  const userSkills = skills.filter(skill => skill.contactEmail === email);

  // Use info from the first skill for the profile section
  const user = {
    name: userSkills[0]?.contactName || '',
    email: userSkills[0]?.contactEmail || email || '',
    image: userSkills[0]?.images?.[0] || logo,
  };

  return (
    <div style={styles.container}>
      <div style={styles.userHeader}>
        <img
          src={user.image}
          alt={user.name || user.email}
          style={styles.avatar}
        />
        <div>
          <div style={styles.userName}>{user.name || 'Unknown User'}</div>
          <div style={styles.userEmail}>{user.email}</div>
        </div>
      </div>
      <h3 style={styles.skillsTitle}>Uploaded Skills</h3>
      <div style={styles.grid}>
        {userSkills.map(skill => (
          <div
            key={skill.id}
            style={{ ...styles.card, cursor: 'pointer' }} // Just like in CategoryPage
            onClick={() => navigate(`/skill/${skill.id}`)}
          >
            <img
              src={skill.images && skill.images.length > 0 ? skill.images[0] : logo}
              alt={skill.skillName}
              style={styles.skillImage}
            />
            <div style={styles.skillName}>{skill.skillName}</div>
            <div style={styles.skillCategory}>{skill.category}</div>
            <div style={styles.skillDescription}>{skill.description}</div>
          </div>
        ))}
      </div>
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
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '1.5rem',
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #e5e7eb',
  },
  userName: {
    fontWeight: 700,
    fontSize: '1.4rem',
    color: '#1f2937',
    marginBottom: '0.2rem',
  },
  userEmail: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  skillsTitle: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: '1rem',
    marginTop: '1rem',
  },
  grid: { // Copy from your CategoryPage styles
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
  card: { // Copy from your CategoryPage styles
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  skillName: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1f2937',
  },
  skillCategory: {
    fontSize: '0.95rem',
    color: '#2563eb',
    marginBottom: '0.3rem',
  },
  skillDescription: {
    fontSize: '1rem',
    color: '#4b5563',
    marginTop: '0.5rem',
    marginBottom: '0.2rem',
    flexGrow: 1,
  },
  skillImage: {
    height: '190px',
    objectFit: 'cover',
    width: '100%',
    borderRadius: '0.5rem',
    marginBottom: '0.5rem',
  },
};

export default UserProfile;
