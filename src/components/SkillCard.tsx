import React from 'react';

interface Skill {
  id: number;
  name: string;
  category: string;
  description: string;
}

interface SkillCardProps {
  skill: Skill;
  onClick?: (skill: Skill) => void;
}

const SkillCard: React.FC<SkillCardProps> = ({ skill, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(skill);
    }
  };

  return (
    <div style={styles.skillCard} onClick={handleClick} >
      <div style={styles.skillName}>{skill.name}</div>
      <div style={styles.skillCategory}>Category: {skill.category}</div>
      <div style={styles.skillDescription}>{skill.description}</div>
    </div>
  );
};

const styles = {
  skillCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    padding: '1.5rem',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    cursor: 'pointer',
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

export default SkillCard;
