import React, { createContext, useContext, useState } from 'react';
import ToastNotification from '../components/ToastNotification';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      duration: 4000,
      ...toast
    };
    
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, options = {}) => {
    return addToast({
      type: 'success',
      title: 'Success',
      message,
      ...options
    });
  };

  const showError = (message, options = {}) => {
    return addToast({
      type: 'error',
      title: 'Error',
      message,
      ...options
    });
  };

  const showWarning = (message, options = {}) => {
    return addToast({
      type: 'warning',
      title: 'Warning',
      message,
      ...options
    });
  };

  const showInfo = (message, options = {}) => {
    return addToast({
      type: 'info',
      title: 'Information',
      message,
      ...options
    });
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAllToasts
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <ToastNotification
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastContext;