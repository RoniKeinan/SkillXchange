import React from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSkillContext } from '../contexts/SkillsContext';

const CategoryPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { skills } = useSkillContext();
  const navigate = useNavigate();

  const filteredSkills = skills.filter(
    (skill) => skill.category.toLowerCase() === name?.toLowerCase()
  );

  console.log(filteredSkills)
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Skills in "{name}" Category</h2>
      {filteredSkills.length > 0 ? (
        <div style={styles.grid}>
          {filteredSkills.map((skill) => (
            <div
              key={skill.id}
              style={{ ...styles.card, cursor: 'pointer' }}
              onClick={() => navigate(`/skill/${skill.id}`)}
            >
              {/* Skill image */}
              {skill.images && skill.images.length > 0 && (
                <img
                  src={skill.images[0]}
                  alt={skill.skillName}
                  style={styles.skillImage}
                />
              )}

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
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '3rem 1.5rem',
    maxWidth: '1100px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '2rem',
  },
  card: {
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
  description: {
    marginTop: '0.5rem',
    fontSize: '1rem',
    color: '#4b5563',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  userName: {
    fontWeight: 500,
    fontSize: '0.95rem',
    color: '#1e3a8a',
  },
  userEmail: {
    fontSize: '0.85rem',
    color: '#6b7280',
  },
  noSkills: {
    textAlign: 'center',
    fontSize: '1.125rem',
    color: '#6b7280',
  },
  skillImage: {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '10px',
},
};

export default CategoryPage;
