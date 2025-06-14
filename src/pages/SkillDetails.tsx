import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';
import { useUserContext } from '../contexts/UserContext';
import logo from '../assets/images/logo.png';
import { v4 as uuidv4 } from 'uuid';

const SkillDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { skills } = useSkillContext();
  const { user } = useUserContext();

  const [requestSent, setRequestSent] = useState(false);

  // Find skill by string id
  const skill = skills.find(s => s.id === id);

  if (!skill) return (
    <div style={styles.notFoundContainer}>
      <div style={styles.notFoundCard}>
        <h2>Skill not found</h2>
        <Link to="/" style={styles.homeLink}>Go Home</Link>
      </div>
    </div>
  );

console.log(user)

const handleExchangeRequest = async () => {
  if (!user?.email) return alert("User not logged in.");

  if (requestSent) {
    const confirmCancel = confirm("❌ Cancel your exchange request?");
    if (confirmCancel) {
      setRequestSent(false);
      alert("Request canceled.");

      // TODO: Optional delete/cancel API
    }
  } else {
    const requestId = uuidv4();
    const createdAt = new Date().toISOString();

    const payload = {
      requestId: { S: requestId },
      createdAt: { S: createdAt },
      fromUserEmail: { S: user.email },
      toUserEmail: { S: skill.contactEmail }, // assuming this exists
      offeredSkills: { S: user.mySkills || "skill-offered-placeholder" },
      requestedSkillId: { S: skill.id },
      status: { S: "pending" },
    };

    try {
      const response = await fetch('https://nnuizx91vd.execute-api.us-east-1.amazonaws.com/dev/Request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send request.");
      }

      const data = await response.json();
      console.log("✅ Request posted:", data);
      setRequestSent(true);
      alert(`🔁 Request sent to ${skill.contactName} to exchange skills!`);
    } catch (err) {
      console.error("❌ Error sending request:", err);
      alert("Something went wrong while sending the request.");
    }
  }
};


  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <div style={styles.imgBlock}>
          <img
            src={skill.images && skill.images.length > 0 ? skill.images[0] : logo}
            alt={skill.skillName}
            style={styles.skillImage}
          />
        </div>
        <h2 style={styles.title}>{skill.skillName}</h2>
        <p style={styles.description}>{skill.description}</p>

        <div style={styles.userInfo}>
          <Link to={`/user/${encodeURIComponent(skill.contactEmail)}`} style={styles.profileLink}>
            <img
              src={skill.images && skill.images.length > 0 ? skill.images[0] : logo}
              alt={skill.contactName}
              style={styles.avatar}
            />
            <div>
              <div style={styles.userName}>{skill.contactName}</div>
              <div style={styles.userEmail}>{skill.contactEmail}</div>
            </div>
          </Link>
        </div>

        {/* Show request button only if not skill owner */}
        {user?.email !== skill.contactEmail && (
          <button
            style={{
              ...styles.button,
              ...(requestSent ? styles.pendingText : {}),
            }}
            onClick={handleExchangeRequest}
            disabled={requestSent}
          >
            {requestSent ? '⏳ Pending Request' : '🤝 Send Exchange Request'}
          </button>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    maxWidth: '470px',
    margin: '2.5rem auto',
    padding: '2.7rem 2.1rem 2.4rem 2.1rem',
    backgroundColor: '#fff',
    borderRadius: '1.4rem',
    boxShadow: '0 8px 40px 0 rgba(59,130,246,0.13)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.2rem',
  },
  imgBlock: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '0.5rem'
  },
  skillImage: {
    width: '100%',
    maxWidth: '280px',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '1.1rem',
    boxShadow: '0 2px 16px #e0e7ff',
    background: '#f3f4f6',
  },
  title: {
    fontSize: '2.2rem',
    fontWeight: 900,
    color: '#3730a3',
    marginBottom: '0.9rem',
    letterSpacing: '-1px',
    textAlign: 'center' as const,
  },
  description: {
    fontSize: '1.13rem',
    marginBottom: '1.5rem',
    color: '#475569',
    textAlign: 'center' as const,
    lineHeight: 1.5,
    fontWeight: 500,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.1rem',
    marginBottom: '1.7rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1.3rem',
    width: '100%',
    justifyContent: 'center',
  },
  profileLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    textDecoration: 'none',
    color: 'inherit',
  },
  avatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #818cf8',
    background: '#f3f4f6',
    boxShadow: '0 2px 10px #e0e7ff',
  },
  userName: {
    fontWeight: 700,
    fontSize: '1.13rem',
    color: '#1e3a8a',
    marginBottom: '0.25rem'
  },
  userEmail: {
    fontSize: '0.96rem',
    color: '#64748b',
    letterSpacing: '.01em',
  },
  button: {
    width: '100%',
    padding: '0.9rem',
    background: 'linear-gradient(90deg, #818cf8, #3b82f6)',
    color: '#fff',
    fontWeight: 700,
    border: 'none',
    borderRadius: '0.7rem',
    fontSize: '1.11rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px #dbeafe',
    transition: 'background 0.19s, transform 0.14s',
    marginTop: '1rem',
  },
  pendingText: {
    background: '#e5e7eb',
    color: '#374151',
    cursor: 'default',
    boxShadow: 'none',
  },
  notFoundContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
  },
  notFoundCard: {
    background: '#fff',
    padding: '2rem 2.5rem',
    borderRadius: '1.4rem',
    boxShadow: '0 8px 40px 0 rgba(59,130,246,0.13)',
    textAlign: 'center' as const,
  },
  homeLink: {
    color: '#3b82f6',
    fontWeight: 700,
    textDecoration: 'underline',
    fontSize: '1.05rem',
    marginTop: '1.4rem',
    display: 'inline-block',
  },
};

export default SkillDetails;
