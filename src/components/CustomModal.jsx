import React, { useEffect } from 'react';


const CustomModal = ({ 
  isOpen, 
  onDismiss, 
  className = '', 
  children,
  showCloseButton = true 
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onDismiss();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  return (
    <div className="custom-modal-overlay" onClick={onDismiss}>
      <div 
        className={`custom-modal-content ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {showCloseButton && (
          <button 
            className="custom-modal-close"
            onClick={onDismiss}
            aria-label="Close modal"
          >
            ×
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default CustomModal;