import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { View } from '@aws-amplify/ui-react';
import NotificationBell from './NotificationBell';
import MobileNavigation from './MobileNavigation';

const Navigation = ({ signOut, onNavigate, currentPage }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/moments', label: 'Moments', icon: '✨' },
    { path: '/family', label: 'Relationships', icon: '👥' },
    { path: '/profile', label: 'Profile', icon: '👤' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleProfileMenuClose = () => {
    setShowProfileMenu(false);
  };

  // Handle click outside to close profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        className="desktop-navigation" 
        style={{
          display: 'block',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E7E7E7',
          boxShadow: '0 2px 8px rgba(40, 10, 50, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          fontFamily: "'ITC Avant Garde Gothic Pro', sans-serif"
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
            {/* Brand Logo */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Link 
                to="/" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#280A32',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#C37CDE'}
                onMouseLeave={(e) => e.target.style.color = '#280A32'}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#280A32',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  A
                </div>
                <span>A Moment With</span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => onNavigate && onNavigate(item.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive(item.path) ? '#C37CDE' : 'transparent',
                    color: isActive(item.path) ? '#FFFFFF' : '#280A32',
                    border: isActive(item.path) ? '1px solid #C37CDE' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = '#E7E7E7';
                      e.target.style.color = '#280A32';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#280A32';
                    }
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Right Side Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <NotificationBell />
              </div>
              
              {/* User Menu */}
               <div ref={profileMenuRef} style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                <button
                  onClick={handleProfileClick}
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#8CA1A3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#047BC1';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#8CA1A3';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  U
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '50px',
                      right: '0',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E7E7E7',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(40, 10, 50, 0.15)',
                      minWidth: '180px',
                      zIndex: 100
                    }}
                  >
                    <Link
                      to="/profile"
                      onClick={handleProfileMenuClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: '#280A32',
                        textDecoration: 'none',
                        fontSize: '16px',
                        borderBottom: '1px solid #E7E7E7',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#E7E7E7'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span>👤</span>
                      <span>View Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      onClick={handleProfileMenuClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: '#280A32',
                        textDecoration: 'none',
                        fontSize: '16px',
                        borderBottom: '1px solid #E7E7E7',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#E7E7E7'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleProfileMenuClose();
                        signOut();
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: '#280A32',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '16px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '0 0 8px 8px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#E7E7E7'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                      <span>🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Keep existing mobile nav for smaller screens */}
      <div className="lg:hidden">
        <MobileNavigation 
          signOut={signOut} 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
        />
      </div>
    </>
  );
};

export default Navigation;
