import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';

// Provide a safe default to avoid crashes if the provider isn't mounted yet
const defaultAdminContext = {
  isAdmin: false,
  adminPermissions: [],
  adminStats: {
    totalUsers: 0,
    activeUsers: 0,
    totalMoments: 0,
    totalStories: 0,
    pendingReports: 0,
    systemHealth: 'good'
  },
  isLoading: false,
  PERMISSIONS: {
    USER_MANAGEMENT: 'user_management',
    CONTENT_MODERATION: 'content_moderation',
    SYSTEM_SETTINGS: 'system_settings',
    ANALYTICS: 'analytics',
    SUPER_ADMIN: 'super_admin'
  },
  hasPermission: () => false,
  toggleAdminMode: () => {},
  updateUserStatus: async () => false,
  deleteContent: async () => false,
  banUser: async () => false,
  generateReport: async () => null,
  loadAdminStats: async () => {}
};

const AdminContext = createContext(defaultAdminContext);

export const useAdmin = () => {
  return useContext(AdminContext);
};

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPermissions, setAdminPermissions] = useState([]);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalMoments: 0,
    totalStories: 0,
    pendingReports: 0,
    systemHealth: 'good'
  });
  const [isLoading, setIsLoading] = useState(true);

  // Admin permission levels
  const PERMISSIONS = {
    USER_MANAGEMENT: 'user_management',
    CONTENT_MODERATION: 'content_moderation',
    SYSTEM_SETTINGS: 'system_settings',
    ANALYTICS: 'analytics',
    SUPER_ADMIN: 'super_admin'
  };

  // Check if user has admin privileges
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setAdminPermissions([]);
        setIsLoading(false);
        return;
      }

      try {
        // Check user role from AuthContext first
        const userIsAdmin = user.role === 'admin' || 
                           user.role === 'super_admin' ||
                           user.role === 'moderator';

        // Fallback to email-based detection for additional admin accounts
        const adminEmails = [
          'admin@amomentWith.com',
          'moderator@amomentWith.com',
          'support@amomentWith.com'
        ];

        const emailBasedAdmin = adminEmails.includes(user.email) || 
                               user.email?.endsWith('@amomentWith.com') ||
                               localStorage.getItem('admin_mode') === 'true';

        if (userIsAdmin || emailBasedAdmin) {
          setIsAdmin(true);
          
          // Set permissions based on admin level and role
          if (user.role === 'super_admin' || 
              user.email === 'admin@amomentWith.com' || 
              localStorage.getItem('admin_mode') === 'true') {
            // Super admin gets all permissions
            setAdminPermissions(Object.values(PERMISSIONS));
          } else if (user.role === 'admin') {
            // Regular admin gets most permissions except super admin
            setAdminPermissions([
              PERMISSIONS.USER_MANAGEMENT,
              PERMISSIONS.CONTENT_MODERATION,
              PERMISSIONS.SYSTEM_SETTINGS,
              PERMISSIONS.ANALYTICS
            ]);
          } else if (user.role === 'moderator') {
            // Moderator gets limited permissions
            setAdminPermissions([
              PERMISSIONS.CONTENT_MODERATION,
              PERMISSIONS.ANALYTICS
            ]);
          } else {
            // Email-based admin gets basic permissions
            setAdminPermissions([PERMISSIONS.CONTENT_MODERATION, PERMISSIONS.ANALYTICS]);
          }
          
          // Load admin statistics
          await loadAdminStats();
        } else {
          setIsAdmin(false);
          setAdminPermissions([]);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        // Don't show notification error during initial load to avoid dependency issues
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const loadAdminStats = async () => {
    try {
      // In a real app, this would fetch from your backend API
      // For demo purposes, we'll use mock data with localStorage fallback
      const mockStats = {
        totalUsers: parseInt(localStorage.getItem('admin_total_users')) || 1247,
        activeUsers: parseInt(localStorage.getItem('admin_active_users')) || 892,
        totalMoments: parseInt(localStorage.getItem('admin_total_moments')) || 5634,
        totalStories: parseInt(localStorage.getItem('admin_total_stories')) || 234,
        pendingReports: parseInt(localStorage.getItem('admin_pending_reports')) || 12,
        systemHealth: localStorage.getItem('admin_system_health') || 'good'
      };

      setAdminStats(mockStats);
    } catch (error) {
      console.error('Error loading admin stats:', error);
      addNotification('Error loading admin statistics', 'error');
    }
  };

  const hasPermission = (permission) => {
    return adminPermissions.includes(permission) || adminPermissions.includes(PERMISSIONS.SUPER_ADMIN);
  };

  const toggleAdminMode = () => {
    const currentMode = localStorage.getItem('admin_mode') === 'true';
    localStorage.setItem('admin_mode', (!currentMode).toString());
    window.location.reload(); // Reload to apply admin mode
  };

  const updateUserStatus = async (userId, status) => {
    try {
      // In a real app, this would call your backend API
      console.log(`Updating user ${userId} status to ${status}`);
      
      // Update local storage for demo
      const users = JSON.parse(localStorage.getItem('admin_users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = status;
        users[userIndex].lastModified = new Date().toISOString();
        localStorage.setItem('admin_users', JSON.stringify(users));
      }

      addNotification(`User ${status} successfully`, 'success');
      await loadAdminStats(); // Refresh stats
      return true;
    } catch (error) {
      console.error('Error updating user status:', error);
      addNotification('Error updating user status', 'error');
      return false;
    }
  };

  const deleteContent = async (contentId, contentType) => {
    try {
      // In a real app, this would call your backend API
      console.log(`Deleting ${contentType} ${contentId}`);
      
      addNotification(`${contentType} deleted successfully`, 'success');
      await loadAdminStats(); // Refresh stats
      return true;
    } catch (error) {
      console.error('Error deleting content:', error);
      addNotification('Error deleting content', 'error');
      return false;
    }
  };

  const banUser = async (userId, reason, duration) => {
    try {
      // In a real app, this would call your backend API
      console.log(`Banning user ${userId} for ${duration} - Reason: ${reason}`);
      
      const users = JSON.parse(localStorage.getItem('admin_users') || '[]');
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        users[userIndex].status = 'banned';
        users[userIndex].banReason = reason;
        users[userIndex].banDuration = duration;
        users[userIndex].bannedAt = new Date().toISOString();
        localStorage.setItem('admin_users', JSON.stringify(users));
      }

      addNotification('User banned successfully', 'success');
      await loadAdminStats();
      return true;
    } catch (error) {
      console.error('Error banning user:', error);
      addNotification('Error banning user', 'error');
      return false;
    }
  };

  const generateReport = async (reportType, dateRange) => {
    try {
      // In a real app, this would generate actual reports
      console.log(`Generating ${reportType} report for ${dateRange}`);
      
      const reportData = {
        type: reportType,
        dateRange,
        generatedAt: new Date().toISOString(),
        data: {
          // Mock report data
          userGrowth: Math.floor(Math.random() * 100),
          contentEngagement: Math.floor(Math.random() * 100),
          systemPerformance: Math.floor(Math.random() * 100)
        }
      };

      addNotification('Report generated successfully', 'success');
      return reportData;
    } catch (error) {
      console.error('Error generating report:', error);
      addNotification('Error generating report', 'error');
      return null;
    }
  };

  const value = {
    isAdmin,
    adminPermissions,
    adminStats,
    isLoading,
    PERMISSIONS,
    hasPermission,
    toggleAdminMode,
    updateUserStatus,
    deleteContent,
    banUser,
    generateReport,
    loadAdminStats
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;
