import React, { useState } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';
import { useNavigate } from 'react-router-dom';

const CategoryPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { categories } = useCategoryContext();
  const navigate = useNavigate();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  return (
    <div style={styles.popupOverlay} onClick={onClose}>
      <div style={styles.popup} onClick={(e) => e.stopPropagation()}>
        <h2>Categories</h2>
         <div style={styles.skillsGrid}>
          {categories.map(category => (
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
        <button onClick={onClose} style={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};
export default CategoryPopup;

const styles: { [key: string]: React.CSSProperties } = {
  popupOverlay: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
    justifyContent: 'center', alignItems: 'center',
  },
   skillsGrid: {
    display: "flex",
    flexDirection:'column',
    gap:'2px',
    overflowY:'scroll',
    height:'80%',
    overflowX:'hidden',

  },
  popup: {
    backgroundColor: '#fff', padding: '20px', borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
        height:'80%'

  },
  categoryList: { listStyle: 'none', padding: 0 },
  categoryItem: {cursor: 'pointer', padding: '5px 0' },
  closeButton: {
    marginTop: '10px', padding: '5px 10px', cursor: 'pointer',
  },
  popupButton: {
    padding: '10px 15px', backgroundColor: '#3b82f6', color: '#fff',
    border: 'none', cursor: 'pointer', borderRadius: '5px',
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
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#1f2937',
  },
};



