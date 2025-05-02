import React, { useState, CSSProperties } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';

const containerStyles: CSSProperties = {
  flexGrow: 1,
  padding: '2rem',
  background: '#f5f7fa',
  minHeight: '100vh',
};

const headingStyles: CSSProperties = {
  textAlign: 'center',
  color: '#333',
  marginBottom: '1.5rem',
  fontSize: '2rem',
};

const inputStyles: CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  marginBottom: '1.5rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  fontSize: '1rem',
};

const listStyles: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: '1rem',
  padding: 0,
  listStyle: 'none',
};

const itemStyles: CSSProperties = {
  background: '#fff',
  padding: '1rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  textAlign: 'center',
  color: '#333',
  fontSize: '1rem',
};

const Home: React.FC = () => {
  const { skills } = useSkillContext();
  const [search, setSearch] = useState('');

  const filteredSkills = skills.filter(skill =>
    skill.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={containerStyles}>
      <h1 style={headingStyles}>Welcome to SkillSwap</h1>
      <input
        type="text"
        placeholder="Search for a skill..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={inputStyles}
      />

      <ul style={listStyles}>
        {filteredSkills.length > 0 ? (
          filteredSkills.map(skill => (
            <li key={skill.id} style={itemStyles}>
              {skill.name}
            </li>
          ))
        ) : (
          <li style={{ ...itemStyles, color: '#999' }}>No skills found</li>
        )}
      </ul>
    </div>
  );
};

export default Home;
