import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the admin authentication context
const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [adminSession, setAdminSession] = useState(null);

  // Admin user database (in a real app, this would be in a secure backend)
  const ADMIN_USERS = {
    'admin@example.com': {
      id: 'admin-001',
      email: 'admin@example.com',
      password: 'admin123', // In production, this would be hashed
      role: 'admin',
      name: 'System Administrator',
      permissions: ['user_management', 'content_moderation', 'analytics']
    },
    'superadmin@example.com': {
      id: 'superadmin-001',
      email: 'superadmin@example.com',
      password: 'super123',
      role: 'super_admin',
      name: 'Super Administrator',
      permissions: ['user_management', 'content_moderation', 'system_settings', 'analytics', 'super_admin']
    },
    'moderator@example.com': {
      id: 'moderator-001',
      email: 'moderator@example.com',
      password: 'mod123',
      role: 'moderator',
      name: 'Content Moderator',
      permissions: ['content_moderation']
    }
  };

  // Check for existing admin session on component mount
  useEffect(() => {
    const loadAdminSession = () => {
      console.log('🔐 Checking for admin session...');
      
      try {
        const savedSession = localStorage.getItem('adminSession');
        if (savedSession) {
          const session = JSON.parse(savedSession);
          
          // Check if session is still valid (24 hours)
          const sessionAge = Date.now() - session.timestamp;
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionAge < maxAge) {
            console.log('✅ Valid admin session found:', session.user.email);
            setAdminUser(session.user);
            setAdminSession(session);
          } else {
            console.log('⏰ Admin session expired');
            localStorage.removeItem('adminSession');
          }
        } else {
          console.log('ℹ️ No admin session found');
        }
      } catch (error) {
        console.error('❌ Error loading admin session:', error);
        localStorage.removeItem('adminSession');
      }
    };

    loadAdminSession();
  }, []);

  // Admin sign in function
  const adminSignIn = async (email, password) => {
    setIsAdminLoading(true);
    console.log('🔐 Admin Sign In Attempt:', { email });
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const adminUser = ADMIN_USERS[email];
      
      if (!adminUser || adminUser.password !== password) {
        throw new Error('Invalid admin credentials');
      }
      
      // Create admin session
      const session = {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          name: adminUser.name,
          permissions: adminUser.permissions
        },
        timestamp: Date.now(),
        sessionId: `admin-session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      
      // Save session to localStorage
      localStorage.setItem('adminSession', JSON.stringify(session));
      
      setAdminUser(session.user);
      setAdminSession(session);
      
      console.log('✅ Admin sign in successful:', session.user.email);
      return session.user;
      
    } catch (error) {
      console.error('❌ Admin sign in failed:', error.message);
      throw error;
    } finally {
      setIsAdminLoading(false);
    }
  };

  // Admin sign out function
  const adminSignOut = async () => {
    console.log('🔐 Admin Sign Out');
    
    try {
      // Clear session
      localStorage.removeItem('adminSession');
      setAdminUser(null);
      setAdminSession(null);
      
      console.log('✅ Admin signed out successfully');
    } catch (error) {
      console.error('❌ Error during admin sign out:', error);
    }
  };

  // Check if admin has specific permission
  const hasAdminPermission = (permission) => {
    if (!adminUser || !adminUser.permissions) return false;
    return adminUser.permissions.includes(permission) || adminUser.permissions.includes('super_admin');
  };

  // Get admin role display name
  const getAdminRoleDisplay = () => {
    if (!adminUser) return '';
    
    switch (adminUser.role) {
      case 'super_admin':
        return 'Super Administrator';
      case 'admin':
        return 'Administrator';
      case 'moderator':
        return 'Moderator';
      default:
        return 'Admin';
    }
  };

  // Admin context value
  const value = {
    // Admin user state
    adminUser,
    isAdminLoading,
    adminSession,
    isAdminAuthenticated: !!adminUser,
    
    // Admin authentication functions
    adminSignIn,
    adminSignOut,
    
    // Admin permission functions
    hasAdminPermission,
    getAdminRoleDisplay,
    
    // Admin permissions constants
    ADMIN_PERMISSIONS: {
      USER_MANAGEMENT: 'user_management',
      CONTENT_MODERATION: 'content_moderation',
      SYSTEM_SETTINGS: 'system_settings',
      ANALYTICS: 'analytics',
      SUPER_ADMIN: 'super_admin'
    }
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Hook to use admin authentication
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export default AdminAuthContext;