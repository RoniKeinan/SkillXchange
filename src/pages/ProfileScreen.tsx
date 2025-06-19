import React from 'react';
import { useUserContext } from '../contexts/UserContext';
import { FiMessageCircle, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import SkillCard from '../components/SkillCard';
import { useRequestContext } from '../contexts/RequestContext';
import { useChatContext } from '../contexts/ChatContext';

const ProfileScreen: React.FC = () => {
  const { user, skills } = useUserContext();
  const navigate = useNavigate();
  const { receivedRequests } = useRequestContext();
  const { userChats } = useChatContext();

  console.log(receivedRequests)



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
        {/* Top Right Bar */}
        <div style={styles.topBar}>
          <div style={styles.buttonGroup}>
            <div style={styles.iconWrapper}>
              <button onClick={() => navigate('/PendingMessages')} style={styles.iconButton}>
                <FiMail size={22} />
              </button>
              {receivedRequests.filter(r => r.status.toLowerCase() !== 'approved').length > 0 && (
                <div style={styles.badge}>
                  {receivedRequests.filter(r => r.status.toLowerCase() !== 'approved').length}
                </div>
              )}
            </div>
            <div style={styles.iconWrapper}>
              <button onClick={() => navigate('/ChatList')} style={styles.iconButton}>
                <FiMessageCircle size={22} />
              </button>
              {userChats.length > 0 && <div style={styles.badge}>{userChats.length}</div>}
            </div>
          </div>
        </div>

        {/* Main User Info */}
        <div style={styles.topSection}>
          <img
            style={styles.image}
            src={user.image || 'https://via.placeholder.com/120'}
            alt="User profile"
          />
          <div style={styles.nameBlock}>
            <div style={styles.name}>
              {user.firstName || 'First name not provided'} {user.lastName || ''}
            </div>
            <div style={styles.value}>{user.email || 'Email not provided'}</div>
            <div style={styles.value}>Phone: {user.phone || 'Not provided'}</div>
          </div>
        </div>

        {/* Other Details */}
        <div style={styles.section}>
          <div style={styles.label}>Birth Date:</div>
          <div style={styles.value}>{user.birthDate || 'Not provided'}</div>
        </div>
        <div style={styles.section}>
          <div style={styles.label}>Address:</div>
          <div style={styles.value}>
            {(user.street && user.houseNumber && user.city)
              ? `${user.street} ${user.houseNumber}, ${user.city}`
              : 'Address not provided'}
          </div>
        </div>

        {/* Skills */}
        <div style={styles.section}>
          <div style={styles.label}>Skills:</div>
          <div style={styles.skillsGrid}>
            {skills.length > 0 ? (
              skills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onClick={(selectedSkill) => navigate(`/MySkill/${selectedSkill.id}`)}
                />
              ))
            ) : (
              <span style={styles.emptyMessage}>No skills listed.</span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={styles.editButtonsContainer}>
          <button
            style={styles.editButton}
            onClick={() => navigate('/AddSkill')}
            onMouseOver={e => (e.currentTarget.style.background = '#6366f1')}
            onMouseOut={e => (e.currentTarget.style.background = '#818cf8')}
          >
            Add Skill
          </button>
          <button
            style={styles.editButton}
            onClick={() => navigate('/EditProfile')}
            onMouseOver={e => (e.currentTarget.style.background = '#6366f1')}
            onMouseOut={e => (e.currentTarget.style.background = '#818cf8')}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    padding: '3rem 1rem',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
    minHeight: '100vh',
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    backgroundColor: '#fff',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 40px rgba(59,130,246,0.15)',
    padding: '2.4rem 2.7rem',
    maxWidth: '920px',
    width: '100%',
    minHeight: 500,
    margin: '2rem 0',
    gap: '1.3rem',
    position: 'relative' as const,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1.3rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.7rem',
  },
  iconWrapper: {
    position: 'relative' as const,
  },
  badge: {
    position: 'absolute' as const,
    top: '-8px',
    right: '-8px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '13px',
    fontWeight: 'bold' as const,
    width: '21px',
    height: '21px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 2px white',
  },
  iconButton: {
    backgroundColor: '#e0e7ff',
    border: 'none',
    padding: '0.55rem',
    borderRadius: '0.7rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.18s',
  },
  topSection: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2.1rem',
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover' as const,
    marginRight: '1.8rem',
    border: '4px solid #c7d2fe',
    boxShadow: '0 2px 12px #e0e7ff',
    background: '#f3f4f6',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.2rem',
  },
  name: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#3730a3',
    marginBottom: '0.35rem',
    letterSpacing: '-1px'
  },
  label: {
    fontWeight: 700,
    color: '#6366f1',
    marginBottom: '0.19rem',
    fontSize: '1.07rem',
    marginTop: '0.5rem',
  },
  value: {
    color: '#334155',
    marginBottom: '0.42rem',
    fontSize: '1.04rem',
    fontWeight: 500,
  },
  section: {
    marginBottom: '0.9rem',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.6rem',
    marginTop: '1rem',
    width: '100%',
  },
  emptyMessage: {
    color: '#6b7280',
    fontWeight: 500,
    fontSize: '1.09rem',
    marginTop: '1.2rem'
  },
  editButtonsContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '2.1rem',
    justifyContent: 'flex-start',
  },
  editButton: {
    padding: '0.8rem 1.65rem',
    fontSize: '1.07rem',
    background: '#818cf8',
    color: '#fff',
    border: 'none',
    borderRadius: '0.7rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #dbeafe',
    fontWeight: 700,
    transition: 'background 0.2s, transform 0.16s',
    outline: 'none',
  },
};

export default ProfileScreen;
