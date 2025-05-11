import React, { useState } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';

const Home: React.FC = () => {
  const { skills } = useSkillContext();
  const { categories } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory && selectedCategory !== 'other'
      ? skill.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SkillXchange</h1>

        <div style={styles.filters}>
          {/* Search Bar */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search skills (e.g. React, Guitar, Writing)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                ...styles.input,
                ...(isFocused ? styles.inputFocus : {})
              }}
            />
          </div>

          {/* Category Filter */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              style={styles.input}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Display Skills */}
        <div style={styles.skillsGrid}>
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div
                key={skill.id}
                style={
                  hoveredSkillId === String(skill.id)
                    ? { ...styles.skillCard, ...styles.skillCardHover }
                    : styles.skillCard
                }
                onMouseEnter={() => setHoveredSkillId(String(skill.id))}
                onMouseLeave={() => setHoveredSkillId(null)}
              >
                <span style={styles.skillName}>{skill.name}</span>
              </div>
            ))
          ) : (
            <div style={styles.noSkillsMessage}>No skills found 😕</div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexGrow: 1,
    background: 'linear-gradient(to bottom, #e0f7fa, white)',
    minHeight: '100vh',
    padding: '2rem',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 800,
    textAlign: 'center',
    color: '#1e3a8a',
    marginBottom: '2.5rem',
    letterSpacing: '-1px',
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2rem',
  },
  input: {
    width: '100%',
    padding: '1rem',
    borderRadius: '1.5rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    color: '#333',
    transition: 'all 0.3s ease',
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#3b82f6',
    boxShadow: '0 0 5px rgba(59, 130, 246, 0.6)',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '2rem',
    marginTop: '2.5rem',
  },
  skillCard: {
    backgroundColor: '#3b82f6',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    maxWidth: '240px',
    margin: '1rem auto',
  },
  skillCardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
  },
  skillName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
  },
  noSkillsMessage: {
    gridColumn: 'span 4',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '1.125rem',
    fontWeight: 300,
  },
};

export default Home;
