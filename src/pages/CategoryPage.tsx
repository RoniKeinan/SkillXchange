import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';
import logo from '../assets/images/logo.png';

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { skills } = useSkillContext();
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const filteredSkills = skills.filter(
    (skill) => skill.category.toLowerCase() === name?.toLowerCase()
  );

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h2 style={styles.title}>Skills in "{name}" Category</h2>
        {filteredSkills.length > 0 ? (
          <div style={styles.grid}>
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                style={
                  hoveredId === skill.id
                    ? { ...styles.card, ...styles.cardHover }
                    : styles.card
                }
                onClick={() => navigate(`/skill/${skill.id}`)}
                onMouseEnter={() => setHoveredId(skill.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Skill image */}
                <img
                  src={skill.images && skill.images.length > 0 ? skill.images[0] : logo}
                  alt={skill.skillName}
                  style={styles.skillImage}
                />

                {/* Skill title and description */}
                <h3 style={styles.skillName}>{skill.skillName}</h3>
                <p style={styles.description}>{skill.description}</p>

                {/* Contact info */}
                <div style={styles.userInfo}>
                  <div>
                    <div style={styles.userName}>{skill.contactName}</div>
                    <div style={styles.userEmail}>{skill.contactEmail}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={styles.noSkills}>No skills found in this category.</p>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  bg: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
    paddingTop: '3.5rem',
    paddingBottom: '2.5rem',
  },
  container: {
    padding: '2.8rem 1.5rem 2rem 1.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '1.3rem',
    boxShadow: '0 8px 38px 0 rgba(59,130,246,0.13)',
  },
  title: {
    fontSize: '2.1rem',
    fontWeight: 800,
    color: '#3730a3',
    marginBottom: '2.2rem',
    textAlign: 'center',
    letterSpacing: '-1px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1.3rem',
  },
  card: {
    backgroundColor: '#fdfcfb',
    borderRadius: '0.85rem',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.09)',
    padding: '1.1rem 0.7rem 1.1rem 0.7rem',
    transition: 'transform 0.18s, box-shadow 0.14s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '0.5rem',
    minHeight: '200px',
    maxWidth: '210px',
    width: '100%',
  },
  cardHover: {
    transform: 'scale(1.035)',
    boxShadow: '0 8px 24px 0 rgba(59,130,246,0.10)',
  },
  skillImage: {
    width: '100%',
    height: '78px',
    objectFit: 'cover',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 3px #f1f5f9',
    marginBottom: '0.35rem',
    background: '#f3f4f6',
  },
  skillName: {
    margin: 0,
    fontSize: '1rem',
    fontWeight: 700,
    color: '#3730a3',
    letterSpacing: '0.01em',
    marginTop: '0.07rem',
    marginBottom: '0.1rem'
  },
  description: {
    marginTop: '0.1rem',
    fontSize: '0.92rem',
    color: '#4b5563',
    minHeight: '24px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '0.45rem',
    marginTop: '0.4rem',
  },
  userName: {
    fontWeight: 600,
    fontSize: '0.92rem',
    color: '#1e3a8a',
  },
  userEmail: {
    fontSize: '0.78rem',
    color: '#6b7280',
    letterSpacing: '.01em'
  },
  noSkills: {
    textAlign: 'center',
    fontSize: '1.07rem',
    color: '#6b7280',
    fontWeight: 500,
    padding: '1.5rem',
    marginTop: '1.3rem',
  },
};

export default CategoryPage;
