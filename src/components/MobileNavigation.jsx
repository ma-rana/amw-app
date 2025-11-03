import React from "react";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = ({
  signOut: _signOut,
  onNavigate: _onNavigate,
  currentPage: _currentPage,
  onToggleSearch,
  isSearchOpen,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Mobile bottom navigation (includes Search in responsive mode)
  const navigationItems = [
    { key: 'home', path: '/', label: '🏠 Home', icon: '🏠' },
    { key: 'moments', path: '/moments', label: '📸 Moments', icon: '📸' },
    { key: 'search', path: '/search', label: '🔍 Search', icon: '🔍', isToggle: true },
    { key: 'stories', path: '/stories', label: '📖 Stories', icon: '📖' },
    { key: 'family', path: '/family', label: '👥 Relations', icon: '👥' }
  ];

  return (
    <>
      {/* Modern Mobile Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 shadow-lg z-50 mobile-nav"
        style={{ 
          paddingBottom: "env(safe-area-inset-bottom, 0)",
          backgroundColor: 'var(--brand-background)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
          {navigationItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path === "/" &&
                (currentPath === "/" || currentPath === "/home"));
            return (
              item.isToggle ? (
                <button
                key={item.key}
                type="button"
                aria-label="Toggle search"
                aria-expanded={Boolean(isSearchOpen)}
                onClick={() => {
                  if (typeof onToggleSearch === 'function') {
                    onToggleSearch();
                  }
                }}
                className={`relative flex flex-col items-center justify-center gap-2 px-2 py-2 rounded-lg min-w-0 flex-1`}
                style={{ 
                  color: isActive ? 'var(--brand-primary)' : 'var(--color-text-secondary)',
                  transition: 'var(--transition-fast)',
                  minHeight: '48px',
                  border: '1px solid transparent'
                }}
                aria-current={isActive ? 'page' : undefined}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-clean)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive ? 'var(--brand-primary)' : 'var(--color-text-secondary)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-active-border)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <span
                  className={`text-xl leading-none`}
                  style={{ transition: 'var(--transition-fast)' }}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] sm:text-xs font-medium leading-tight truncate w-full text-center" style={{ marginTop: '2px' }}>
                  {item.label.replace(/^[^\s]+ /, "")}
                </span>
              </button>
              ) : (
              <Link
                key={item.key}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-2 px-2 py-2 rounded-lg min-w-0 flex-1`}
                style={{ 
                  color: isActive ? 'var(--brand-primary)' : 'var(--color-text-secondary)',
                  transition: 'var(--transition-fast)',
                  minHeight: '48px',
                  border: '1px solid transparent'
                }}
                aria-current={isActive ? 'page' : undefined}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                  e.currentTarget.style.borderColor = 'var(--color-border-clean)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive ? 'var(--brand-primary)' : 'var(--color-text-secondary)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-active-border)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <span
                  className={`text-xl leading-none`}
                  style={{ transition: 'var(--transition-fast)' }}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] sm:text-xs font-medium leading-tight truncate w-full text-center" style={{ marginTop: '2px' }}>
                  {item.label.replace(/^[^\s]+ /, "")}
                </span>
              </Link>
              )
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
