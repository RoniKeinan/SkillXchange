import React, { useEffect, useState } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import CategoryPopup from '../components/CategoryPopup';

const Home: React.FC = () => {
  const { skills } = useSkillContext();
  const { categories } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);


  const [searchResults, setSearchResults] = useState<{
    skills: typeof skills;
    categories: typeof categories;
  }>({ skills: [], categories: [] });

  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (search === '') return;
    setSearchTriggered(true); // כאן נציין שהחיפוש התחיל

    const lower = search.toLowerCase();
    const matchedSkills = skills.filter(
      (skill) =>
        skill.skillName.toLowerCase().includes(lower) ||
        skill.description.toLowerCase().includes(lower)
    );

    const matchedCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(lower)
    );

    setSearchResults({ skills: matchedSkills, categories: matchedCategories });
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>SkillXchange</h1>

        <div style={styles.filters}>
          {/* Search Bar + Button */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search skills or categories..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setSearchTriggered(false);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              style={{
                ...styles.input,
                ...(isFocused ? styles.inputFocus : {})
              }}
            />
            {search && (
              <button
                onClick={() => {
                  setSearch('');
                  setSearchResults({ skills: [], categories: [] });
                  setSearchTriggered(false);
                }}
                style={styles.clearButton}
              >
                ×
              </button>
            )}
            <button onClick={handleSearchClick} style={styles.searchButton}>Search</button>
            <button onClick={() => setShowPopup(true)} style={styles.searchButton}>
              Categories
            </button>
            {showPopup && (
              <CategoryPopup
                onClose={() => setShowPopup(false)}
                onCategorySelect={(category) => {
                  setSelectedCategoryId(category);
                  setSearch(''); // אפס חיפוש
                  setSearchResults({ skills: [], categories: [] }); // אפס תוצאות חיפוש
                }}
              />
            )}
          </div>

        </div>
            {selectedCategoryId && (
  <>
    <h2 style={styles.sectionTitle}>Skills in Selected Category</h2>
    <div style={styles.skillsGrid}>
      {skills
        .filter(skill => String(skill.category) === selectedCategoryId)
        .map(skill => (
          <div
            key={skill.id}
            style={{ ...styles.card, cursor: 'pointer' }}
            onClick={() => navigate(`/skill/${skill.id}`)}
          >
            <img
              src={skill.images && skill.images.length > 0 ? skill.images[0] : logo}
              alt={skill.skillName}
              style={styles.skillImage}
            />
            <h3 style={styles.skillName}>{skill.skillName}</h3>
            <p style={styles.description}>{skill.description}</p>
            <div style={styles.userInfo}>
              <div>
                <div style={styles.userName}>{skill.contactName}</div>
                <div style={styles.userEmail}>{skill.contactEmail}</div>
              </div>
            </div>
          </div>
        ))}
    </div>
  </>
)}


        {/* Show Categories from Search Results */}
        {searchResults.categories.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Matching Categories</h2>
            <div style={styles.skillsGrid}>
              {searchResults.categories.map(category => (
                <div
                  key={category.id}
                  style={
                    hoveredCategoryId === String(category.id)
                      ? { ...styles.skillCard, ...styles.skillCardHover }
                      : styles.skillCard
                  }
                  onMouseEnter={() => setHoveredCategoryId(String(category.id))}
                  onMouseLeave={() => setHoveredCategoryId(null)}
                  onClick={() => navigate(`/category/${category.name}`)}
                >
                  <span style={styles.skillName}>{category.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Show Skills from Search Results */}
        {searchResults.skills.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Matching Skills</h2>
            <div style={styles.skillsGrid}>
              {searchResults.skills.map(skill => (
                <div
                  key={skill.id}
                  style={{ ...styles.card, cursor: 'pointer' }}
                  onClick={() => navigate(`/skill/${skill.id}`)}
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
          </>
        )}

        {/* No results message */}
        {searchTriggered &&
          searchResults.skills.length === 0 &&
          searchResults.categories.length === 0 && (
            <div style={styles.noSkillsMessage}>
              No matching skills or categories found 😕
            </div>
          )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: '3rem 1rem',
  },
  clearButton: {
    position: 'absolute',
    right: '15rem', // מיקום בהתחשב בכפתור ה-Search
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    fontSize: '1.8rem',
    color: '#6b7280',
    cursor: 'pointer',
    padding: 0,
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
    maxWidth: '600px',
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
  searchButton: {
    padding: '0.75rem 1.2rem',
    fontSize: '1rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
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
  skillImage: {
    height: '190px',
    objectFit: 'cover',
  },
  noSkillsMessage: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.125rem',
    padding: '2rem',
  },
};

export default Home;
