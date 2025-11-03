import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { View } from '@aws-amplify/ui-react';
import NotificationBell from './NotificationBell';
import MobileNavigation from './MobileNavigation';
import { useAuth } from '../contexts/AuthContext';

const Navigation = ({ signOut, onNavigate, currentPage, onToggleSearch, isSearchOpen }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const desktopSearchInputRef = useRef(null);

  // Top navigation items order: Home, Moments, Search, Stories, Relations
  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/moments', label: 'Moments', icon: '📸' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/stories', label: 'Stories', icon: '📖' },
    { path: '/family', label: 'Relations', icon: '👥' }
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

  // Focus desktop search input when opened
  useEffect(() => {
    if (isSearchOpen && desktopSearchInputRef.current) {
      desktopSearchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Single Search button that routes to Search page

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <nav 
        className="hidden lg:block desktop-navigation" 
        style={{
          backgroundColor: 'var(--brand-background)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 2px 8px rgba(40, 10, 50, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 20000,
          isolation: 'isolate',
          pointerEvents: 'auto',
          fontFamily: "'ITC Avant Garde Gothic Pro', sans-serif"
        }}
      >
        <div className="amw-container">
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
                    color: 'var(--color-text-primary)',
                    textDecoration: 'none',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--brand-secondary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--color-text-primary)'}
                >
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--brand-primary)',
                    border: '1px solid var(--color-border-clean)',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    backgroundColor: 'transparent'
                  }}>
                    A
                  </div>
                  <span>A Moment With</span>
                </Link>
              </div>

            {/* Desktop Navigation Links - centered */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
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
                    transition: 'color 0.2s ease, border-color 0.2s ease',
                    backgroundColor: 'transparent',
                    color: isActive(item.path) ? 'var(--brand-primary)' : 'var(--color-text-secondary)',
                    border: isActive(item.path) ? '1px solid var(--color-active-border)' : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.color = 'var(--color-text-primary)';
                      e.target.style.borderColor = 'var(--color-border-clean)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(item.path)) {
                      e.target.style.color = 'var(--color-text-secondary)';
                      e.target.style.borderColor = 'transparent';
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
              {/* Right-side Search button removed as requested */}
              
              {/* User Menu */}
              <div ref={profileMenuRef} style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                <button
                  onClick={handleProfileClick}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-primary)',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: '1px solid var(--color-border-clean)',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    transition: 'color 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--brand-primary)';
                    e.target.style.borderColor = 'var(--color-active-border)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--color-text-primary)';
                    e.target.style.borderColor = 'var(--color-border-clean)';
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
                      backgroundColor: 'var(--brand-background)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(40, 10, 50, 0.15)',
                      minWidth: '180px',
                      zIndex: 20001,
                      pointerEvents: 'auto',
                    }}
                  >
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[Nav] Profile mousedown');
                        handleProfileMenuClose();
                        navigate('/profile');
                        if (onNavigate) {
                          onNavigate('/profile');
                        }
                      }}
                      onClick={() => {
                        console.log('[Nav] Profile clicked');
                        handleProfileMenuClose();
                        navigate('/profile');
                        if (onNavigate) {
                          onNavigate('/profile');
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '16px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-alt)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>👤</span>
                      <span>View Profile</span>
                    </button>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[Nav] Settings mousedown');
                        handleProfileMenuClose();
                        navigate('/settings');
                        if (onNavigate) {
                          onNavigate('/settings');
                        }
                      }}
                      onClick={() => {
                        console.log('[Nav] Settings clicked');
                        handleProfileMenuClose();
                        navigate('/settings');
                        if (onNavigate) {
                          onNavigate('/settings');
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: 'var(--color-text-secondary)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '16px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--color-border)',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-background-alt)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span>⚙️</span>
                      <span>Settings</span>
                    </button>
                    <button
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('[Nav] Signout mousedown');
                        handleProfileMenuClose();
                        if (signOut) {
                          signOut();
                        }
                      }}
                      onClick={async () => {
                        console.log('[Nav] Signout clicked');
                        handleProfileMenuClose();
                        if (signOut) {
                          await signOut();
                        }
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 16px',
                        color: 'var(--amw-error)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        fontSize: '16px',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        borderRadius: '0 0 8px 8px',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-background-alt)'}
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

      {/* Desktop Search Bar below top navigation - visible by default */}
      <div
        className={"hidden lg:block desktop-searchbar-container open"}
        role="region"
        aria-label="Site search"
        id="desktop-searchbar-container"
      >
        <div className="amw-container">
          <form
            className="desktop-searchbar"
            id="desktop-searchbar"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.querySelector('input[name="q"]');
              const q = input?.value?.trim();
              if (q) {
                navigate(`/search?q=${encodeURIComponent(q)}`);
                if (onNavigate) {
                  onNavigate(`/search?q=${encodeURIComponent(q)}`);
                }
              }
            }}
          >
            <span className="search-overlay-icon" aria-hidden="true">🔍</span>
            <input
              ref={desktopSearchInputRef}
              name="q"
              type="search"
              aria-label="Search across your family memories"
              placeholder="Search..."
              className="search-input"
            />
            <button type="submit" className="search-submit" aria-label="Submit search">Search</button>
          </form>
        </div>
      </div>

      {/* Mobile Top Navigation Bar - Only on mobile */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 shadow-sm z-50" style={{backgroundColor: 'var(--brand-background)', borderBottom: '2px solid var(--color-border)'}}>
        <div className="amw-container px-4">
          <div className="flex items-center justify-between h-14">
            {/* App Name/Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 transition-colors"
              style={{ color: 'var(--color-text-primary)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md" style={{ backgroundColor: 'transparent', border: '1px solid var(--color-border-clean)' }}>
                <span className="font-bold text-sm" style={{ color: 'var(--brand-primary)' }}>A</span>
              </div>
              <span className="font-bold text-base sm:text-lg">A Moment With</span>
            </Link>

            {/* Right Side - Notification & User Menu */}
            <div className="flex items-center space-x-2">
              {/* Notification Bell */}
              <NotificationBell />
              
              {/* User Menu */}
              <div ref={profileMenuRef} className="relative">
                <button
                  onClick={handleProfileClick}
                  className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{ backgroundColor: 'transparent', color: 'var(--color-text-primary)', border: '1px solid var(--color-border-clean)' }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <>
                    {/* Overlay */}
                    <div 
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={handleProfileMenuClose}
                    />
                    <div 
                      className="absolute top-full right-0 mt-2 rounded-xl shadow-2xl z-50 min-w-[180px] overflow-hidden"
                      style={{ backgroundColor: 'var(--brand-background)', border: '2px solid var(--color-border)' }}
                    >
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[Nav-mobile] Profile mousedown');
                          handleProfileMenuClose();
                          navigate('/profile');
                          if (onNavigate) {
                            onNavigate('/profile');
                          }
                        }}
                        onClick={() => {
                          console.log('[Nav-mobile] Profile clicked');
                          handleProfileMenuClose();
                          navigate('/profile');
                          if (onNavigate) {
                            onNavigate('/profile');
                          }
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 transition-colors cursor-pointer text-left"
                        style={{ color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}
                      >
                        <span className="text-lg">👤</span>
                        <span className="font-medium text-sm">View Profile</span>
                      </button>
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[Nav-mobile] Settings mousedown');
                          handleProfileMenuClose();
                          navigate('/settings');
                          if (onNavigate) {
                            onNavigate('/settings');
                          }
                        }}
                        onClick={() => {
                          console.log('[Nav-mobile] Settings clicked');
                          handleProfileMenuClose();
                          navigate('/settings');
                          if (onNavigate) {
                            onNavigate('/settings');
                          }
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 transition-colors cursor-pointer text-left"
                        style={{ color: 'var(--color-text-secondary)', borderBottom: '1px solid var(--color-border)' }}
                      >
                        <span className="text-lg">⚙️</span>
                        <span className="font-medium text-sm">Settings</span>
                      </button>
                      <button
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('[Nav-mobile] Signout mousedown');
                          handleProfileMenuClose();
                          if (signOut) {
                            signOut();
                          }
                        }}
                        onClick={() => {
                          handleProfileMenuClose();
                          if (signOut) {
                            signOut();
                          }
                        }}
                        className="w-full flex items-center space-x-2 px-4 py-3 transition-colors cursor-pointer"
                        style={{ color: 'var(--amw-error)' }}
                    >
                        <span className="text-lg">🚪</span>
                        <span className="font-medium text-sm">Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Keep existing mobile nav for smaller screens */}
      <div className="lg:hidden">
        <MobileNavigation 
          signOut={signOut} 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
          onToggleSearch={onToggleSearch}
          isSearchOpen={isSearchOpen}
        />
      </div>
    </>
  );
};

export default Navigation;
