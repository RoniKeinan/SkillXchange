import React, { useState, CSSProperties } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaPlus, FaHome, FaSignOutAlt, FaSignInAlt, FaComments } from 'react-icons/fa';
import logoNoBg from '../assets/images/logoNoBg.png';
import { useUserContext } from '../contexts/UserContext';
import ConfirmModal from '../components/ConfirmModal';
import { useRequireAuth } from '../hooks/useRequireAuth';

const SIDEBAR_WIDTH = 260;

const SideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, removeUser ,isAdmin} = useUserContext();
  const [showConfirm, setShowConfirm] = useState(false);
  const requireAuth = useRequireAuth();
  const navigate = useNavigate();

  // Updated styles
  const buttonStyle: CSSProperties = {
    position: 'fixed',
    top: '1.5rem',
    left: isOpen ? `${SIDEBAR_WIDTH + 24}px` : '1.5rem',
    background: 'linear-gradient(135deg, #3b82f6 30%, #818cf8 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '3.5rem',
    height: '3.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    zIndex: 1001,
    cursor: 'pointer',
    boxShadow: '0 6px 24px 0 rgba(49, 130, 206, 0.15)',
    transition: 'left 0.35s cubic-bezier(.4,0,.2,1)',
  };

  const sidebarStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: isOpen ? 0 : `-${SIDEBAR_WIDTH + 40}px`,
    width: `${SIDEBAR_WIDTH}px`,
    height: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    padding: '2rem 1.5rem 2.5rem 1.5rem',
    boxShadow: '2px 0 20px rgba(30, 58, 138, 0.12)',
    transition: 'left 0.35s cubic-bezier(.4,0,.2,1)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
    alignItems: 'center',
    borderTopRightRadius: '2rem',
    borderBottomRightRadius: '2rem'
  };

  const logoStyle: CSSProperties = {
    width: '100%',
    maxWidth: '140px',
    height: 'auto',
    marginBottom: '1.7rem',
    filter: 'drop-shadow(0 2px 8px rgba(49, 130, 206, 0.07))'
  };

  const navListStyle: CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.1rem',
    width: '100%',
  };

  const linkStyle: CSSProperties = {
    cursor: "pointer",
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.8rem 1.1rem',
    background: 'rgba(240, 249, 255, 0.8)',
    color: '#1e3a8a',
    borderRadius: '0.9rem',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1.06rem',
    boxShadow: '0 2px 8px rgba(30,58,138,0.07)',
    transition: 'background 0.22s, color 0.22s, transform 0.22s',
  };

  // bolder hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(90deg, #818cf8 0%, #3b82f6 100%)';
    (e.currentTarget as HTMLElement).style.color = '#fff';
    (e.currentTarget as HTMLElement).style.transform = 'scale(1.06)';
  };
  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.background = 'rgba(240, 249, 255, 0.8)';
    (e.currentTarget as HTMLElement).style.color = '#1e3a8a';
    (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
  };

  const confirmLogout = () => removeUser();
  const cancelLogout = () => setShowConfirm(false);
  const handleLogout = () => setShowConfirm(true);

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
        <img src={logoNoBg} alt="Logo" style={logoStyle} />

        {/* Optional: Profile display */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
              width: "100%",
              padding: "0.7rem 0.9rem",
              background: "rgba(226,232,240,0.5)",
              borderRadius: "1rem",
              boxShadow: "0 2px 6px rgba(30,58,138,0.05)",
            }}
          >
            <FaUserCircle size={34} color="#475569" />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '1.03rem', color: "#1e293b" }}>
                {user.firstName} {user.lastName}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#64748b" }}>
                {user.email}
              </div>
            </div>
          </div>
        )}

        <nav>
          <ul style={navListStyle}>
            <li>
              <Link
                to="/"
                style={linkStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsOpen(false)}
              >
                <FaHome /> Home
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  to="/ProfileScreen"
                  style={linkStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUserCircle /> Profile
                </Link>
              </li>
            )}
            {user && (
              <li>
                <div
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/AddSkill');
                  }}
                  style={linkStyle}
                  tabIndex={0}
                  role="button"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FaPlus /> Add Skill
                </div>
              </li>
            )}
            <li>
              {user ? (
                <>
                  <div
                    onClick={handleLogout}
                    style={linkStyle}
                    tabIndex={0}
                    role="button"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <FaSignOutAlt /> Logout
                  </div>
                  {showConfirm && (
                    <ConfirmModal
                      isOpen={showConfirm}
                      title="Confirm Action"
                      message="Are you sure you want to logout?"
                      onConfirm={confirmLogout}
                      onCancel={cancelLogout}
                      confirmText="Yes"
                      cancelText="Cancel"
                    />
                  )}
                </>
              ) : (
                <a
                  href="https://us-east-1dwfznry1h.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=5qvgf43gd6c32ve6o5drt5c92d&response_type=token&scope=openid+email+profile&redirect_uri=http://localhost:5173/"
                  style={linkStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <FaSignInAlt /> Login
                </a>
              )}
            </li>

            {user && (
              <li>
                <Link
                  to="/chatlist"
                  style={linkStyle}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsOpen(false)}
                >
                  <FaComments/>My Chats
                </Link>
              </li>
            )}

            {isAdmin && (
              <li>
                  <Link to ="/admin"
                  style={linkStyle}
                   onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                   onClick={() => setIsOpen(false)}>
                   <FaPlus/>Admin Dashboard
                   </Link>
              </li>


            )}
          </ul>


        </nav>
        <div style={{ flexGrow: 1 }} />
        {/* Optional: Footer or tagline */}
        <div style={{ fontSize: '0.97rem', color: '#64748b', marginTop: '2.5rem', textAlign: 'center', letterSpacing: '.02em' }}>
          Skill Swap © {new Date().getFullYear()}
        </div>
      </aside>
    </>
  );
};

export default SideBar;
