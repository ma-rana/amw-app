import React, { useEffect, useState } from 'react';

const ToastNotification = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto-dismiss after duration
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, toast.duration || 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(dismissTimer);
    };
  }, [toast.duration]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Match exit animation duration
  };

  const getToastIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  };

  const getToastClass = (type) => {
    const baseClass = 'toast-notification';
    const typeClass = `toast-${type}`;
    const visibilityClass = isVisible && !isExiting ? 'toast-visible' : '';
    const exitClass = isExiting ? 'toast-exiting' : '';
    
    return `${baseClass} ${typeClass} ${visibilityClass} ${exitClass}`.trim();
  };

  return (
    <div className={getToastClass(toast.type)}>
      <div className="toast-icon">
        {toast.icon || getToastIcon(toast.type)}
      </div>
      <div className="toast-content">
        {toast.title && <div className="toast-title">{toast.title}</div>}
        <div className="toast-message">{toast.message}</div>
      </div>
      <button 
        className="toast-close" 
        onClick={handleDismiss}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default ToastNotification;