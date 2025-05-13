import React, { useState } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useNavigate } from 'react-router-dom';



const Home: React.FC = () => {
  const { skills } = useSkillContext();
  const { categories } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);


  const filteredCategories = categories.filter(category => {
    const matchesSelected =
      !selectedCategory || selectedCategory === '' || selectedCategory === category.name;
  
    const matchesSearch =
      search.trim() === '' ||
      category.name.toLowerCase().includes(search.toLowerCase());
  
    return matchesSelected && matchesSearch;
  });


  const navigate = useNavigate();



  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SkillXchange</h1>

        <div style={styles.filters}>
          {/* Search Bar */}
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <input
              type="text"
              placeholder="Search categories (e.g. React, Guitar, Writing)..."
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

        {/* Display Categories */}
        <div style={styles.skillsGrid}>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                style={
                  hoveredSkillId === String(category.id)
                    ? { ...styles.skillCard, ...styles.skillCardHover }
                    : styles.skillCard
                }
                onMouseEnter={() => setHoveredSkillId(String(category.id))}
                onMouseLeave={() => setHoveredSkillId(null)}
                onClick={() => navigate(`/category/${category.name}`)}
              >
                <span style={styles.skillName}>{category.name}</span>
              </div>
            ))
          ) : (
            <div style={styles.noSkillsMessage}>No categories found 😕</div>
          )}
        </div>

      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
    padding: '3rem 1rem',
  },
  content: {
    width: '100%',
    maxWidth: '1100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#1f2937',
    marginBottom: '2rem',
  },
  filters: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    marginBottom: '2rem',
  },
  input: {
    width: '100%',
    maxWidth: '400px',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.2s ease-in-out',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 6px rgba(59, 130, 246, 0.4)',
    outline: 'none',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '1.5rem',
    width: '100%',
  },
  skillCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '1.25rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
    cursor: 'pointer',
  },
  skillCardHover: {
    transform: 'scale(1.03)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
  },
  skillName: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827',
  },
  noSkillsMessage: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.125rem',
    padding: '2rem',
  },
};


export default Home;
