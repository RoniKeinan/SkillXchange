import React, { useState, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
// ודא שאתה מעדכן את הנתיב הנכון כאן:
import logo from '../assets/images/logo.png';

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
    backgroundColor: '#fdfcfb',
    padding: '2rem 1.5rem',
    boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
    transition: 'left 0.3s ease-in-out',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    alignItems: 'center',
  };

  const logoStyle: CSSProperties = {
    width: '100%',
    maxWidth: '160px',
    height: 'auto',
    marginBottom: '1rem',
  };

  const navListStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '200px',
  };

  const linkStyle: CSSProperties = {
    display: 'block',
    padding: '0.75rem 1rem',
    backgroundColor: '#f1f5f9',
    color: '#1e3a8a',
    borderRadius: '0.75rem',
    textDecoration: 'none',
    fontWeight: 500,
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#e0e7ff';
    e.currentTarget.style.transform = 'scale(1.02)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#f1f5f9';
    e.currentTarget.style.transform = 'scale(1)';
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
        <img src={logo} alt="Logo" style={logoStyle} />
        <nav>
          <ul style={navListStyle}>
            <li>
              <Link to="/" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}onClick={() => setIsOpen(!isOpen)}>
                Home
              </Link>
            </li>
            <li>
              <a href="#" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}onClick={() => setIsOpen(!isOpen)}>
                Login
              </a>
            </li>
            <li>
              <Link to="/ProfileScreen" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={() => setIsOpen(!isOpen)}>
                Profile
              </Link>
            </li>
            <li>
              <Link to="/AddSkill" style={linkStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}onClick={() => setIsOpen(!isOpen)}>
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
