import React, { useState, useEffect } from 'react';
import { Button, Card, Heading, Text, Badge, Flex, Grid } from '@aws-amplify/ui-react';
import { 
  Users, 
  FileText, 
  BookOpen, 
  AlertTriangle, 
  Activity, 
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  UserCheck,
  UserX,
  Eye,
  Download
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';


const AdminDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const { 
    isAdmin, 
    adminStats, 
    isLoading, 
    hasPermission, 
    PERMISSIONS,
    toggleAdminMode,
    generateReport 
  } = useAdmin();
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    if (isAdmin) {
      loadRecentActivity();
      loadSystemAlerts();
    }
  }, [isAdmin]);

  const loadRecentActivity = () => {
    // Mock recent activity data
    const activities = [
      {
        id: 1,
        type: 'user_registered',
        description: 'New user registration: sarah.johnson@email.com',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        severity: 'info'
      },
      {
        id: 2,
        type: 'content_reported',
        description: 'Moment reported for inappropriate content',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        severity: 'warning'
      },
      {
        id: 3,
        type: 'user_banned',
        description: 'User banned for policy violation',
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        severity: 'error'
      },
      {
        id: 4,
        type: 'story_created',
        description: 'New family story created: "Summer Vacation 2024"',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        severity: 'success'
      },
      {
        id: 5,
        type: 'system_backup',
        description: 'Daily system backup completed successfully',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        severity: 'info'
      }
    ];
    setRecentActivity(activities);
  };

  const loadSystemAlerts = () => {
    // Mock system alerts
    const alerts = [
      {
        id: 1,
        type: 'warning',
        title: 'High Storage Usage',
        message: 'Media storage is at 85% capacity',
        action: 'Review storage settings'
      },
      {
        id: 2,
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for Sunday 2:00 AM',
        action: 'View maintenance details'
      },
      {
        id: 3,
        type: 'error',
        title: 'Failed Login Attempts',
        message: '15 failed login attempts detected from suspicious IP',
        action: 'Review security logs'
      }
    ];
    setSystemAlerts(alerts);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const handleQuickAction = async (action) => {
    switch (action) {
      case 'export_users':
        await generateReport('users', 'last_30_days');
        break;
      case 'export_content':
        await generateReport('content', 'last_30_days');
        break;
      case 'view_reports':
        onNavigate('admin-content-moderation');
        break;
      case 'manage_users':
        onNavigate('admin-user-management');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--amw-error)' }}>
              <Shield size={40} className="text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Access Denied</h3>
              <p className="text-white/70">You don't have administrator privileges to access this page.</p>
            </div>
            {user?.email && (
              <div className="space-y-3">
                <p className="text-sm text-white/60">For demo purposes, you can enable admin mode:</p>
                <button 
                  onClick={toggleAdminMode}
                  className="w-full px-6 py-3 text-white font-semibold rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg"
                  style={{ 
                    backgroundColor: 'var(--amw-primary)',
                    ':hover': { backgroundColor: 'var(--amw-primary-dark)' }
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--amw-primary-dark)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--amw-primary)'}
                >
                  Enable Admin Mode
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h2>
          <p className="text-white/70">
            Welcome back, {user?.email} • Last login: {new Date().toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => onNavigate('admin-settings')}
            disabled={!hasPermission(PERMISSIONS.SYSTEM_SETTINGS)}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <button
            onClick={toggleAdminMode}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
          >
            Exit Admin Mode
          </button>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="backdrop-blur-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--amw-primary)' }}>
              <Users size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Users</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatNumber(adminStats.totalUsers)}</h3>
              <p className="text-sm" style={{ color: 'var(--amw-success)' }}>
                +{formatNumber(adminStats.activeUsers)} active
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--amw-secondary)' }}>
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Moments</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatNumber(adminStats.totalMoments)}</h3>
              <p className="text-sm" style={{ color: 'var(--amw-primary)' }}>
                +127 this week
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--amw-success)' }}>
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Stories</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{formatNumber(adminStats.totalStories)}</h3>
              <p className="text-sm" style={{ color: 'var(--amw-primary)' }}>
                +23 this week
              </p>
            </div>
          </div>
        </div>

        <div className="backdrop-blur-lg rounded-2xl p-6" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--amw-warning)' }}>
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Pending Reports</p>
              <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{adminStats.pendingReports}</h3>
              <p className="text-sm" style={{ color: 'var(--amw-warning)' }}>
                Requires attention
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-bold text-white">Recent Activity</h4>
            <button className="text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  activity.severity === 'error' ? 'bg-red-500' :
                  activity.severity === 'warning' ? 'bg-yellow-500' :
                  activity.severity === 'success' ? 'bg-green-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-white">{activity.description}</p>
                  <p className="text-sm text-white/60 mt-1">
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* System Alerts */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h4 className="text-xl font-bold text-white mb-4">System Alerts</h4>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-xl border ${
                  alert.type === 'error' ? 'bg-red-500/10 border-red-500/30' :
                  alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
                  'bg-blue-500/10 border-blue-500/30'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-white">{alert.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.type === 'error' ? 'bg-red-500/20 text-red-300' :
                      alert.type === 'warning' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 mb-3">{alert.message}</p>
                  <button className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors">
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
            <h4 className="text-xl font-bold text-white mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button
                onClick={() => onNavigate && onNavigate('admin-user-management')}
                disabled={!hasPermission(PERMISSIONS.USER_MANAGEMENT)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserCheck size={16} />
                <span>Manage Users</span>
              </button>
              <button
                onClick={() => onNavigate && onNavigate('admin-content-moderation')}
                disabled={!hasPermission(PERMISSIONS.CONTENT_MODERATION)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye size={16} />
                <span>Content Moderation</span>
              </button>
              <button
                onClick={() => handleQuickAction('export_users')}
                disabled={!hasPermission(PERMISSIONS.ANALYTICS)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span>Export Users</span>
              </button>
              <button
                onClick={() => handleQuickAction('export_content')}
                disabled={!hasPermission(PERMISSIONS.ANALYTICS)}
                className="w-full flex items-center space-x-3 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download size={16} />
                <span>Export Content</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-xl font-bold text-white mb-2">System Health</h4>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                adminStats.systemHealth === 'healthy' ? 'bg-green-500' : 
                adminStats.systemHealth === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <p className="text-white/70">All systems operational</p>
            </div>
          </div>
          <div className="flex space-x-8">
            <div className="text-center">
              <p className="text-sm text-white/60">CPU Usage</p>
              <p className="text-lg font-bold text-white">23%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Memory</p>
              <p className="text-lg font-bold text-white">67%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-white/60">Storage</p>
              <p className="text-lg font-bold text-white">85%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;