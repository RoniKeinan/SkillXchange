import React, { useState } from 'react';
import { useCategoryContext } from '../contexts/CategoryContext';

const CategoryPopup: React.FC<{
  onClose: () => void;
  onCategorySelect: (categoryId: string) => void;
}> = ({ onClose, onCategorySelect }) => {
  const { categories } = useCategoryContext();
  const [hoveredCategoryId, setHoveredCategoryId] = useState<string | null>(null);

  return (
    <div style={styles.popupOverlay} onClick={onClose}>
      <div style={styles.popup} onClick={e => e.stopPropagation()}>
        <h2 style={styles.heading}>Categories</h2>
        <div style={styles.skillsGrid}>
          {categories.map(category => (
            <div
              key={category.id}
              style={
                hoveredCategoryId === String(category.name)
                  ? { ...styles.skillCard, ...styles.skillCardHover }
                  : styles.skillCard
              }
              onMouseEnter={() => setHoveredCategoryId(String(category.name))}
              onMouseLeave={() => setHoveredCategoryId(null)}
              onClick={() => {
                onCategorySelect(String(category.name));
                onClose();
              }}
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
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(30, 41, 59, 0.22)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9998, // <--- HIGH VALUE!
  },
  popup: {
    backgroundColor: '#fff',
    padding: '2.2rem 2.1rem 1.1rem 2.1rem',
    borderRadius: '1.4rem',
    boxShadow: '0 10px 44px 0 rgba(59,130,246,0.13)',
    minWidth: 340,
    maxWidth: 410,
    width: '100%',
    maxHeight: 440,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    zIndex: 9999, // <--- EVEN HIGHER!
  },
  heading: {
    fontSize: '2.1rem',
    fontWeight: 800,
    color: '#3730a3',
    marginBottom: '1.3rem',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },
  skillsGrid: {
    display: "flex",
    flexDirection: 'column',
    gap: '1.15rem',
    overflowY: 'auto',
    maxHeight: 220,
    minWidth: 200,
    width: '100%',
    marginBottom: '1.3rem',
  },
  skillCard: {
    backgroundColor: '#e0e7ff',
    borderRadius: '0.85rem',
    padding: '0.92rem 1.2rem',
    textAlign: 'center',
    border: 'none',
    fontWeight: 600,
    color: '#3730a3',
    fontSize: '1.14rem',
    boxShadow: '0 2px 10px rgba(59,130,246,0.07)',
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s',
    outline: 'none',
  },
  skillCardHover: {
    backgroundColor: '#818cf8',
    color: '#fff',
    transform: 'scale(1.045)',
    boxShadow: '0 4px 16px rgba(59,130,246,0.14)',
  },
  skillName: {
    margin: 0,
    fontSize: '1.18rem',
    fontWeight: 700,
    color: 'inherit',
    letterSpacing: '0.01em',
  },
  closeButton: {
    marginTop: '0.7rem',
    padding: '0.7rem 1.3rem',
    background: '#e0e7ff',
    color: '#3730a3',
    border: 'none',
    borderRadius: '0.7rem',
    fontWeight: 700,
    fontSize: '1.02rem',
    cursor: 'pointer',
    boxShadow: '0 1px 6px #dbeafe',
    transition: 'background 0.14s',
  },
};
