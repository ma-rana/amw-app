import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  Flag, 
  Settings, 
  BarChart3,
  Home,
  LogOut
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import AdminDashboard from './AdminDashboard';
import AdminUserManagement from './AdminUserManagement';
import AdminContentModeration from './AdminContentModeration';
import AdminSettings from './AdminSettings';
import AdminAnalytics from './AdminAnalytics';


const AdminAppContent = ({ onExit, adminUser, onAdminSignOut }) => {
  const { hasAdminPermission, ADMIN_PERMISSIONS } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate admin verification
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const handleExitAdmin = () => {
    onAdminSignOut();
    if (onExit) {
      onExit();
    }
  };

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      permission: null // Dashboard is always accessible to admins
    },
    {
      id: 'admin-user-management',
      label: 'User Management',
      icon: Users,
      permission: ADMIN_PERMISSIONS.USER_MANAGEMENT
    },
    {
      id: 'admin-content-moderation',
      label: 'Content Moderation',
      icon: Flag,
      permission: ADMIN_PERMISSIONS.CONTENT_MODERATION
    },
    {
      id: 'admin-settings',
      label: 'Settings',
      icon: Settings,
      permission: ADMIN_PERMISSIONS.SYSTEM_SETTINGS
    },
    {
      id: 'admin-analytics',
      label: 'Analytics',
      icon: BarChart3,
      permission: ADMIN_PERMISSIONS.ANALYTICS
    }
  ];

  const getCurrentPageTitle = () => {
    const item = navigationItems.find(item => item.id === currentPage);
    return item ? item.label : 'Admin Panel';
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={handleNavigation} adminUser={adminUser} />;
      case 'admin-user-management':
        return <AdminUserManagement onNavigate={handleNavigation} />;
      case 'admin-content-moderation':
        return <AdminContentModeration onNavigate={handleNavigation} />;
      case 'admin-settings':
        return <AdminSettings />;
      case 'admin-analytics':
        return <AdminAnalytics />;
      default:
        return <AdminDashboard onNavigate={handleNavigation} />;
    }
  };



  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-md w-full backdrop-blur-lg rounded-3xl p-8" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto border-4 rounded-full animate-spin" style={{ borderColor: 'var(--color-border)', borderTopColor: 'var(--amw-primary)' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield size={24} style={{ color: 'var(--color-text-primary)' }} />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Loading Admin Panel</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Verifying administrator privileges...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Admin Header */}
      <header className="backdrop-blur-lg border-b sticky top-0 z-50" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--amw-primary)' }}>
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>Admin Panel</h4>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>A Moment With - Administration</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {adminUser?.name || adminUser?.email}
                </p>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--amw-success-light)', color: 'var(--amw-success)', border: '1px solid var(--amw-success)' }}>
                  {adminUser?.role === 'super_admin' ? 'Super Administrator' : adminUser?.role === 'moderator' ? 'Moderator' : 'Administrator'}
                </span>
              </div>
              <button
                onClick={handleExitAdmin}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
                style={{ backgroundColor: 'var(--color-hover)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-background-alt)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
              >
                <ArrowLeft size={16} />
                <span>Exit Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 backdrop-blur-lg border-r min-h-screen" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <nav className="p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const hasAccess = !item.permission || hasAdminPermission(item.permission);
                
                return (
                  <li key={item.id}>
                    <button
                      className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200"
                      style={{
                        backgroundColor: isActive 
                          ? 'var(--amw-primary-light)' 
                          : hasAccess 
                            ? 'transparent' 
                            : 'transparent',
                        color: isActive 
                          ? 'var(--amw-primary)' 
                          : hasAccess 
                            ? 'var(--color-text-secondary)' 
                            : 'var(--color-text-disabled)',
                        border: isActive 
                          ? '1px solid var(--amw-primary)' 
                          : '1px solid transparent',
                        cursor: hasAccess ? 'pointer' : 'not-allowed'
                      }}
                      onMouseEnter={(e) => {
                        if (hasAccess && !isActive) {
                          e.target.style.backgroundColor = 'var(--color-hover)';
                          e.target.style.color = 'var(--color-text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (hasAccess && !isActive) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = 'var(--color-text-secondary)';
                        }
                      }}
                      onClick={() => hasAccess && handleNavigation(item.id)}
                      disabled={!hasAccess}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                      {!hasAccess && (
                        <span className="ml-auto px-2 py-1 text-xs rounded-full" style={{ backgroundColor: 'var(--amw-warning-light)', color: 'var(--amw-warning)', border: '1px solid var(--amw-warning)' }}>
                          No Access
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Admin Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>{getCurrentPageTitle()}</h2>
                <p style={{ color: 'var(--color-text-secondary)' }}>Manage and monitor your platform</p>
              </div>
              {currentPage !== 'dashboard' && (
                <button
                  onClick={() => handleNavigation('dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200"
                  style={{ backgroundColor: 'var(--color-hover)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)' }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--color-background-alt)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--color-hover)'}
                >
                  <Home size={16} />
                  <span>Dashboard</span>
                </button>
              )}
            </div>
          </div>

          <div className="backdrop-blur-lg rounded-2xl p-6 min-h-[600px]" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            {renderCurrentPage()}
          </div>
        </main>
      </div>

      {/* Admin Footer */}
      <footer className="backdrop-blur-lg border-t mt-auto" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>© 2024 A Moment With - Admin Panel</p>
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Version 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AdminApp = ({ onExit, adminUser, onAdminSignOut }) => {
  return (
    <AdminAppContent onExit={onExit} adminUser={adminUser} onAdminSignOut={onAdminSignOut} />
  );
};

export default AdminApp;