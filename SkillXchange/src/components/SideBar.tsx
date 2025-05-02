import React, { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

// רוחב הסיידבר שמשמש למיקום הכפתור כשהוא פתוח
const SIDEBAR_WIDTH = 200; // ב-px

// סגנונות בסיסיים לכפתור
const buttonBaseStyles: CSSProperties = {
  position: 'fixed',
  top: '1rem',
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '0.5rem',
  cursor: 'pointer',
  fontSize: '1.25rem',
  zIndex: 1001,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // סגנונות הדינמיים לכפתור בהתאם למצב
  const dynamicButtonStyles: CSSProperties = {
    ...buttonBaseStyles,
    left: isOpen ? `${SIDEBAR_WIDTH + 16}px` : '1rem',
  };

  const sidebarStyles: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : `-${SIDEBAR_WIDTH + 20}px`, // +padding & קצת מרווח נוסף
    width: `${SIDEBAR_WIDTH}px`,
    height: '100vh',
    background: '#fff',
    padding: '1rem',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
  };

  const linkStyle: CSSProperties = {
    textDecoration: 'none',
    color: '#333',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={dynamicButtonStyles}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside style={sidebarStyles}>
        <h3 style={{ marginTop: 0, color: '#333' }}>SkillXchange</h3>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ margin: '0.5rem 0' }}>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link to="/" style={linkStyle}>
                Login
              </Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link to="/" style={linkStyle}>
                Profile
              </Link>
            </li>
            <li style={{ margin: '0.5rem 0' }}>
              <Link to="/" style={linkStyle}>
                Add Skill
              </Link>
            </li>
            {/* ניתן להוסיף כאן קישורים נוספים */}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;