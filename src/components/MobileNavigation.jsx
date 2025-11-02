import React, { useState, useEffect } from 'react';
import { Button, Heading } from '@aws-amplify/ui-react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
const MobileNavigation = ({ signOut, onNavigate, currentPage: _currentPage }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [currentPath]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const _handleNavigation = (page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const navigationItems = [
    { key: 'home', path: '/home', label: '🏠 Home', icon: '🏠' },
    { key: 'moments', path: '/moments', label: '📸 Moments', icon: '📸' },
    { key: 'stories', path: '/stories', label: '📖 Stories', icon: '📖' },
    { key: 'family', path: '/family', label: '👨‍👩‍👧‍👦 Family', icon: '👨‍👩‍👧‍👦' },
    { key: 'search', path: '/search', label: '🔍 Search', icon: '🔍' },
    { key: 'profile', path: '/profile', label: '👤 Profile', icon: '👤' },
    { key: 'settings', path: '/settings', label: '⚙️ Settings', icon: '⚙️' }
  ];

  return (
    <>
      {/* Modern Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
          {navigationItems.slice(0, 5).map((item) => (
            <Link 
              key={item.key} 
              to={item.path} 
              className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                (currentPath === item.path || (item.path === '/home' && currentPath === '/')) 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-xs font-medium leading-tight truncate w-full text-center">
                {item.label.replace(/^[^\s]+ /, '')}
              </span>
            </Link>
          ))}
          
          {/* More menu for additional items */}
          <button
            className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
              isMenuOpen 
                ? 'bg-blue-50 text-blue-600' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
            onClick={toggleMenu}
            aria-label="More options"
          >
            <span className="text-lg leading-none">☰</span>
            <span className="text-xs font-medium leading-tight">More</span>
          </button>
        </div>
      </div>

      {/* Overlay Menu for additional options */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          
          <div className="fixed bottom-16 left-4 right-4 bg-white rounded-2xl shadow-xl z-50 max-w-sm mx-auto border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="text-lg font-semibold text-slate-900">More Options</span>
              <button
                className="p-2 hover:bg-slate-100 rounded-full transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-slate-500 text-lg">✕</span>
              </button>
            </div>
            
            <div className="p-2">
              <Link 
                to="/profile" 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  currentPath === '/profile' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">👤</span>
                <span className="font-medium">Profile</span>
              </Link>
              
              <Link 
                to="/settings" 
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                  currentPath === '/settings' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">⚙️</span>
                <span className="font-medium">Settings</span>
              </Link>
              
              <div className="flex items-center justify-between p-3 rounded-xl text-slate-700">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🔔</span>
                  <span className="font-medium">Notifications</span>
                </div>
                <NotificationBell />
              </div>
              
              <button
                className="w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 text-red-600 hover:bg-red-50"
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
              >
                <span className="text-xl">🚪</span>
                <span className="font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MobileNavigation;