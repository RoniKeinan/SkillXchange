import React, { useEffect, useState } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useNavigate } from 'react-router-dom';
import logoNoBg from '../assets/images/logoNoBg.png';
import CategoryPopup from '../components/CategoryPopup';
import { FaSearch, FaTimesCircle, FaThList } from 'react-icons/fa';

const Home: React.FC = () => {
  const { skills } = useSkillContext();
  const { categories } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
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
    setSearchTriggered(true);

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
      <div style={styles.heroSection}>
        <img src={logoNoBg} alt="SkillXchange Logo" style={styles.heroLogo} />
        <h1 style={styles.title}>
          <span style={styles.gradientText}>SkillXchange</span>
        </h1>
        <p style={styles.heroSubtitle}>
          Swap skills. Grow together. Find your next passion!
        </p>
      </div>

      <div style={styles.filters}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
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
            onKeyDown={e => {
              if (e.key === 'Enter') handleSearchClick();
            }}
          />
          {search && (
            <FaTimesCircle
              onClick={() => {
                setSearch('');
                setSearchResults({ skills: [], categories: [] });
                setSearchTriggered(false);
              }}
              style={styles.clearButton}
              title="Clear"
            />
          )}
          <button onClick={handleSearchClick} style={styles.searchButton}>Search</button>
          <button onClick={() => setShowPopup(true)} style={styles.categoryButton}>
            <FaThList /> Categories
          </button>
          {showPopup && (
            <CategoryPopup
              onClose={() => setShowPopup(false)}
              onCategorySelect={(categoryId) => {
                setSelectedCategoryId(categoryId);
                setSearch('');
                setSearchResults({ skills: [], categories: [] });
                setShowPopup(false);
              }}
            />
          )}
        </div>
      </div>

      <div style={styles.content}>
        {/* Category filter view */}
        {selectedCategoryId && (
          <>
            <h2 style={styles.sectionTitle}>Skills in Selected Category</h2>
            <div style={styles.skillsGrid}>
              {skills
                .filter(skill => String(skill.category) === selectedCategoryId)
                .map(skill => (
                  <div
                    key={skill.id}
                    style={
                      hoveredSkillId === String(skill.id)
                        ? { ...styles.card, ...styles.cardHover }
                        : styles.card
                    }
                    onMouseEnter={() => setHoveredSkillId(String(skill.id))}
                    onMouseLeave={() => setHoveredSkillId(null)}
                    onClick={() => navigate(`/skill/${skill.id}`)}
                  >
                    <img
                      src={skill.images && skill.images.length > 0 ? skill.images[0] : logoNoBg}
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

        {/* Categories from search */}
        {searchResults.categories.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Matching Categories</h2>
            <div style={styles.skillsGrid}>
              {searchResults.categories.map(category => (
                <div
                  key={category.id}
                  style={styles.skillCard}
                  onClick={() => navigate(`/category/${category.name}`)}
                >
                  <span style={styles.skillName}>{category.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Skills from search */}
        {searchResults.skills.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Matching Skills</h2>
            <div style={styles.skillsGrid}>
              {searchResults.skills.map(skill => (
                <div
                  key={skill.id}
                  style={
                    hoveredSkillId === String(skill.id)
                      ? { ...styles.card, ...styles.cardHover }
                      : styles.card
                  }
                  onMouseEnter={() => setHoveredSkillId(String(skill.id))}
                  onMouseLeave={() => setHoveredSkillId(null)}
                  onClick={() => navigate(`/skill/${skill.id}`)}
                >
                  <img
                    src={skill.images && skill.images.length > 0 ? skill.images[0] : logoNoBg}
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
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(120deg, #e0e7ff 0%, #f9fafb 60%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2.5rem 0',
    position: 'relative'
  },
  heroSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2.5rem',
  },
  heroLogo: {
    width: 150,
    height: 150,
    borderRadius: '28%',
    objectFit: 'contain',
  },
  gradientText: {
    background: 'linear-gradient(90deg, #818cf8, #3b82f6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: 900,
  },
  title: {
    fontSize: '2.7rem',
    fontWeight: 900,
    letterSpacing: '-1px',
    marginBottom: '0.3rem',
    textShadow: '0 2px 12px #dbeafe'
  },
  heroSubtitle: {
    fontSize: '1.13rem',
    color: '#475569',
    marginBottom: '0.8rem',
    fontWeight: 500,
    textAlign: 'center',
  },
  filters: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '2.3rem',
  },
  searchWrapper: {
    width: '100%',
    maxWidth: '580px',
    background: 'white',
    borderRadius: '2rem',
    boxShadow: '0 2px 16px 0 rgba(59,130,246,0.10)',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    padding: '0.3rem 1.2rem',
    gap: '0.7rem',
    margin: 'auto',
  },
  searchIcon: {
    color: '#818cf8',
    fontSize: '1.25rem',
    marginRight: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.6rem 1rem',
    fontSize: '1.11rem',
    border: 'none',
    background: 'transparent',
    outline: 'none',
    color: '#334155',
    fontWeight: 500,
    borderRadius: '1.5rem',
    transition: 'box-shadow 0.23s',
    minWidth: 0,
  },
  inputFocus: {
    boxShadow: '0 0 0 2px #818cf8',
    background: '#f1f5fd',
  },
  clearButton: {
    color: '#a5b4fc',
    fontSize: '1.6rem',
    cursor: 'pointer',
    marginLeft: '-0.6rem',
    marginRight: '0.3rem',
    transition: 'color 0.18s',
  },
  searchButton: {
    padding: '0.65rem 1.3rem',
    background: 'linear-gradient(90deg, #3b82f6 60%, #818cf8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '1.5rem',
    fontWeight: 700,
    fontSize: '1.07rem',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    boxShadow: '0 2px 8px #dbeafe',
    transition: 'background 0.18s',
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    padding: '0.65rem 1.1rem',
    background: '#e0e7ff',
    color: '#4338ca',
    border: 'none',
    borderRadius: '1.5rem',
    fontWeight: 700,
    fontSize: '1.04rem',
    cursor: 'pointer',
    marginLeft: '0.45rem',
    boxShadow: '0 1px 4px #dbeafe',
    transition: 'background 0.15s',
  },
  content: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 700,
    fontSize: '1.28rem',
    color: '#6366f1',
    letterSpacing: '0.01em',
    marginBottom: '0.5rem',
    marginTop: '2.2rem',
    textAlign: 'left',
    width: '100%',
    maxWidth: '1200px',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
    gap: '2.2rem',
    width: '100%',
    marginTop: '1.1rem',
    marginBottom: '1.6rem',
    justifyItems: 'center',
  },
  skillCard: {
    background: 'white',
    borderRadius: '1.2rem',
    padding: '1.25rem',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(59,130,246,0.03)',
    transition: 'transform 0.21s, box-shadow 0.21s',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '1.13rem',
    minWidth: 220,
    maxWidth: 320,
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '1.15rem',
    boxShadow: '0 4px 14px rgba(49, 130, 206, 0.11)',
    padding: '1.3rem 1.1rem 1.7rem 1.1rem',
    transition: 'transform 0.19s, box-shadow 0.19s',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '0.85rem',
    minHeight: '320px',
    maxWidth: '340px',
    width: '100%',
  },
  cardHover: {
    transform: 'scale(1.045)',
    boxShadow: '0 10px 40px 0 rgba(59,130,246,0.14)'
  },
  skillImage: {
    width: '100%',
    height: '140px',
    objectFit: 'cover',
    borderRadius: '0.8rem',
    boxShadow: '0 2px 8px #f1f5f9',
    marginBottom: '0.7rem',
    background: '#f3f4f6',
  },
  skillName: {
    margin: 0,
    fontSize: '1.21rem',
    fontWeight: 700,
    color: '#3730a3',
    letterSpacing: '0.01em',
    marginTop: '0.1rem',
    marginBottom: '0.23rem'
  },
  description: {
    marginTop: '0.1rem',
    fontSize: '1rem',
    color: '#4b5563',
    minHeight: '44px',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    borderTop: '1px solid #e5e7eb',
    paddingTop: '0.75rem',
    marginTop: '0.65rem',
  },
  userName: {
    fontWeight: 600,
    fontSize: '1.01rem',
    color: '#1e3a8a',
  },
  userEmail: {
    fontSize: '0.91rem',
    color: '#64748b',
    letterSpacing: '.01em'
  },
  noSkillsMessage: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '1.18rem',
    fontWeight: 500,
    padding: '2.2rem',
    marginTop: '2.5rem',
  },
};

export default Home;
