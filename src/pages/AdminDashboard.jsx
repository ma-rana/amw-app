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
  Download,
  Calendar,
  Clock,
  Server,
  Cpu,
  HardDrive,
  Zap,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  RefreshCw,
  Bell
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

const AdminDashboard = ({ onNavigate, adminUser }) => {
  const { 
    hasAdminPermission, 
    ADMIN_PERMISSIONS,
    adminSignOut
  } = useAdminAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalMoments: 5634,
    totalStories: 234,
    pendingReports: 12,
    systemHealth: 'good'
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    if (adminUser) {
      loadRecentActivity();
      loadSystemAlerts();
    }
  }, [adminUser]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-500 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-white">Loading Dashboard</h3>
            <p className="text-white/60">Preparing your admin workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Dashboard Header */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Welcome back, {adminUser?.name || adminUser?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last login: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 backdrop-blur-sm">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30 backdrop-blur-sm">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline">Alerts</span>
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
              </button>
              <button
                onClick={() => onNavigate('admin-settings')}
                disabled={!hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button
                onClick={adminSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all duration-200 border border-red-500/30 hover:border-red-500/50 backdrop-blur-sm"
              >
                <span className="hidden sm:inline">Exit Admin</span>
                <span className="sm:hidden">Exit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Users */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-brand-accent rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+12%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <h3 className="text-3xl font-bold text-gray-900">{adminStats.activeUsers}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-green-600 text-sm">
                  {adminStats.activeUsers > 100 ? 'High activity' : 'Normal activity'}
                </p>
              </div>
            </div>
          </div>

          {/* Total Moments */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-brand-secondary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-blue-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+8%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Total Moments</p>
              <h3 className="text-3xl font-bold text-gray-900">{adminStats.totalMoments}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-blue-600 text-sm">
                  Growing steadily
                </p>
              </div>
            </div>
          </div>

          {/* Total Stories */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-brand-neutral rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-medium">+15%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Total Stories</p>
              <h3 className="text-3xl font-bold text-gray-900">{adminStats.totalStories}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <p className="text-emerald-600 text-sm">
                  Excellent engagement
                </p>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-amber-600">
                <MoreVertical className="w-4 h-4" />
                <span className="text-sm font-medium">Review</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Pending Reports</p>
              <h3 className="text-3xl font-bold text-gray-900">{adminStats.pendingReports}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <p className="text-amber-600 text-sm">
                  Requires attention
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                    activity.severity === 'error' ? 'bg-red-500' :
                    activity.severity === 'warning' ? 'bg-amber-500' :
                    activity.severity === 'success' ? 'bg-emerald-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">System Alerts</h2>
            </div>
            <div className="space-y-4">
              {systemAlerts.map((alert) => (
                <div key={alert.id} className={`p-4 rounded-lg border ${
                  alert.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                  alert.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                  'bg-blue-50 border-blue-200 text-blue-800'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold">{alert.title}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      alert.type === 'error' ? 'bg-red-100 text-red-700' :
                      alert.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-sm mb-3">{alert.message}</p>
                  <button className="text-sm font-medium hover:underline">
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-secondary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => onNavigate && onNavigate('admin-user-management')}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.USER_MANAGEMENT)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserCheck className="w-6 h-6 text-brand-accent" />
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </button>
            <button
              onClick={() => onNavigate && onNavigate('admin-content-moderation')}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.CONTENT_MODERATION)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Eye className="w-6 h-6 text-brand-accent" />
              <span className="text-sm font-medium text-gray-900">Content Moderation</span>
            </button>
            <button
              onClick={() => handleQuickAction('export_users')}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.ANALYTICS)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-6 h-6 text-brand-accent" />
              <span className="text-sm font-medium text-gray-900">Export Users</span>
            </button>
            <button
              onClick={() => handleQuickAction('export_content')}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.ANALYTICS)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-6 h-6 text-brand-accent" />
              <span className="text-sm font-medium text-gray-900">Export Content</span>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">System Health</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Cpu className="w-5 h-5 text-blue-500" />
                <p className="text-sm text-gray-600 font-medium">CPU Usage</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">23%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-purple-500" />
                <p className="text-sm text-gray-600 font-medium">Memory</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">67%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <HardDrive className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-gray-600 font-medium">Storage</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">85%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
    </div>
    </div>
  );
};

export default AdminDashboard;
