import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import ConfirmModal from '../components/ConfirmModal'; // ודא שהנתיב נכון

const MySkillDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { skills, deleteSkill } = useUserContext();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const skill = skills.find(s => s.id === Number(id));
  if (!skill) return <p>Skill not found</p>;

  const handleEdit = () => {
    setMenuOpen(false);
    navigate(`/EditSkill/${skill.id}`);
  };

  const handleDelete = () => {
    setModalOpen(true);
    setMenuOpen(false);
  };

  const confirmDelete = () => {
    deleteSkill(skill.id);
    setModalOpen(false);
    navigate('/ProfileScreen'); // נווט חזרה אחרי מחיקה
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.title}>{skill.name}</div>
        <div style={styles.menuWrapper} ref={menuRef}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>⋮</button>
          {menuOpen && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownItem} onClick={handleEdit}>Edit</div>
              <div style={styles.dropdownItem} onClick={handleDelete}>Delete</div>
            </div>
          )}
        </div>
      </div>

      <p style={styles.description}>{skill.description}</p>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Delete Skill"
        message={`Are you sure you want to delete "${skill.name}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setModalOpen(false)}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '700px',
    margin: '3rem auto',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e3a8a',
  },
  description: {
    fontSize: '1.1rem',
    margin: '1.5rem 0',
  },
  menuWrapper: {
    position: 'relative',
  },
  menuButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: '1rem',
    right: 0,
    backgroundColor: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '0.5rem',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  dropdownItem: {
    padding: '0.75rem 1.25rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    color: '#111827',
    borderBottom: '1px solid #e5e7eb',
  },
};

export default MySkillDetails;
