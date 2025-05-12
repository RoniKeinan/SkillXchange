import React, { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const SIDEBAR_WIDTH = 240;

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonStyle: CSSProperties = {
    position: 'fixed',
    top: '1rem',
    left: isOpen ? `${SIDEBAR_WIDTH + 16}px` : '1rem',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '3rem',
    height: '3rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    zIndex: 1001,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
    transition: 'left 0.3s ease-in-out',
  };

  const sidebarStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : `-${SIDEBAR_WIDTH + 40}px`,
    width: `${SIDEBAR_WIDTH}px`,
    height: '100vh',
    backgroundColor: '#f0f4f8',
    padding: '2rem 1.5rem',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: '2rem',
  };

  const titleStyle: CSSProperties = {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#1e3a8a',
    margin: 0,
    textAlign: 'center',
  };

  const navListStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const linkStyle: CSSProperties = {
    display: 'block',
    padding: '0.75rem 1rem',
    backgroundColor: '#white',
    borderColor: '#3b82f6',
    color: '#1e3a8a',
    borderRadius: '1rem',
    textDecoration: 'none',
    fontWeight: 500,
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease',
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={buttonStyle}
        aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside style={sidebarStyle}>
        <h3 style={titleStyle}>SkillXchange</h3>
        <nav>
          <ul style={navListStyle}>
            <li>
              <Link to="/" style={linkStyle}>
                Home
              </Link>
            </li>
            <li>
              <a href="#" style={linkStyle}>
                Login
              </a>
            </li>
            <li>
              <Link to="/ProfileScreen" style={linkStyle}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/add-skill" style={linkStyle}>
                Add Skill
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default SideBar;
