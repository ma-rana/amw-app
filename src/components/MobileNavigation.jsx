import React from "react";
import { Link, useLocation } from "react-router-dom";

const MobileNavigation = ({
  signOut: _signOut,
  onNavigate: _onNavigate,
  currentPage: _currentPage,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Mobile bottom navigation (includes Search in responsive mode)
  const navigationItems = [
    { key: 'home', path: '/', label: '🏠 Home', icon: '🏠' },
    { key: 'moments', path: '/moments', label: '📸 Moments', icon: '📸' },
    { key: 'search', path: '/search', label: '🔍 Search', icon: '🔍' },
    { key: 'stories', path: '/stories', label: '📖 Stories', icon: '📖' },
    { key: 'family', path: '/family', label: '👥 Relations', icon: '👥' }
  ];

  return (
    <>
      {/* Modern Mobile Bottom Navigation */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
      >
        <div className="flex items-center justify-around px-1 py-2 max-w-lg mx-auto">
          {navigationItems.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path === "/" &&
                (currentPath === "/" || currentPath === "/home"));
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`relative flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 active:text-blue-600"
                }`}
              >
                <span
                  className={`text-xl leading-none ${
                    isActive ? "scale-110" : ""
                  } transition-transform duration-200`}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] sm:text-xs font-medium leading-tight truncate w-full text-center">
                  {item.label.replace(/^[^\s]+ /, "")}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-600 rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default MobileNavigation;
