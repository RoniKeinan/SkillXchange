import React, { useState } from 'react';
import { useSkillContext } from '../contexts/SkillsContext';
import { useCategoryContext } from '../contexts/CategoryContext';

const Home: React.FC = () => {
  const { skills } = useSkillContext();
  const { categories } = useCategoryContext();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');  // Track selected category

// Filter skills based on search term and selected category
const filteredSkills = skills.filter(skill => {
  const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());

  // If the selectedCategory is 'Other', skip filtering by category and show all skills
  const matchesCategory = selectedCategory && selectedCategory !== 'other'
    ? skill.category === selectedCategory
    : true; // When 'Other' is selected, all skills are shown

  return matchesSearch && matchesCategory;
});

  return (
    <div className="flex-grow bg-gradient-to-b from-blue-50 to-white min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 mb-10 tracking-tight">
          🔄 SkillXchange
        </h1>

        <div className="flex flex-col items-center gap-8">
          {/* Search Bar */}
          <div className="w-full max-w-xl">
            <input
              type="text"
              placeholder="Search skills (e.g. React, Guitar, Writing)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full max-w-xl">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-6 py-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
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
        <div style={styles.cardGridWrapper} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredSkills.length > 0 ? (
            filteredSkills.map(skill => (
              <div
                key={skill.id}
                style={styles.card}
                onMouseEnter={(e) => {
                  Object.assign(e.currentTarget.style, styles.cardHover);
                }}
                onMouseLeave={(e) => {
                  Object.assign(e.currentTarget.style, styles.card);
                }}
              >
                <span style={styles.skillName}>{skill.name}</span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-lg font-light">
              No skills found 😕
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    textAlign: 'center' as const,
    border: '1px solid #e5e7eb',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease-in-out',
    cursor: 'pointer',
    maxWidth: '240px',
    margin: '1 auto',
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
  },
  skillName: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#1f2937',
  },
  cardGridWrapper: {
    marginTop: '2.5rem',
  },
};

export default Home;
