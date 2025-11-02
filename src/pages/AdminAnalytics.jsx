import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FileText, 
  Activity, 
  Download, 
  Calendar,
  Eye,
  MessageSquare,
  Heart,
  Share2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { useNotifications } from '../contexts/NotificationContext';


const AdminAnalytics = () => {
  const { hasAdminPermission, ADMIN_PERMISSIONS } = useAdminAuth();
  const { addNotification } = useNotifications();
  
  const [timeRange, setTimeRange] = useState('last_30_days');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData] = useState({
    overview: {
      totalUsers: 1247,
      activeUsers: 892,
      totalMoments: 3456,
      totalStories: 234,
      engagementRate: 78.5,
      growthRate: 12.3
    },
    userMetrics: {
      newUsers: 156,
      returningUsers: 736,
      userRetention: 68.2,
      averageSessionTime: '12m 34s'
    },
    contentMetrics: {
      momentsCreated: 234,
      storiesCreated: 45,
      chaptersCreated: 123,
      averageEngagement: 85.7
    },
    engagementMetrics: {
      totalViews: 12456,
      totalLikes: 3456,
      totalComments: 1234,
      totalShares: 567
    }
  });

  const timeRangeOptions = [
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual analytics API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would fetch data based on timeRange
      // const data = await API.getAnalytics(timeRange);
      // setAnalyticsData(data);
      
      addNotification('Analytics data updated successfully', 'success');
    } catch (error) {
      console.error('Error loading analytics:', error);
      addNotification('Failed to load analytics data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateReport = async (reportType, timeRange) => {
    // Simulate report generation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Generating ${reportType} report for ${timeRange}`);
        resolve();
      }, 1000);
    });
  };

  const handleExportReport = async (reportType) => {
    try {
      setIsLoading(true);
      await generateReport(reportType, timeRange);
      addNotification(`${reportType} report exported successfully`, 'success');
    } catch (error) {
      console.error('Error exporting report:', error);
      addNotification('Failed to export report', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, trend, color = 'primary' }) => {
    const colorClasses = {
      primary: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      success: 'text-green-400 bg-green-500/10 border-green-500/20',
      info: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    };

    const trendColors = {
      up: 'text-green-400 bg-green-500/10',
      down: 'text-red-400 bg-red-500/10'
    };

    return (
      <div className={`relative overflow-hidden rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/10 ${colorClasses[color]} bg-gray-900/50 border-gray-700/50`}>
        <div className="absolute inset-0" style={{ backgroundColor: 'var(--color-surface-alt)' }}></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon size={24} />
            </div>
            {change && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[trend]}`}>
                {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {change}%
              </div>
            )}
          </div>
          <div>
            <div className="text-2xl font-bold text-white mb-1">
              {value}
            </div>
            <div className="text-sm text-gray-400">
              {title}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!hasAdminPermission(ADMIN_PERMISSIONS.ANALYTICS)) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 text-center">
            <div className="mb-6">
              <div className="inline-flex p-4 rounded-full bg-red-500/10 border border-red-500/20">
                <BarChart3 size={48} className="text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Access Denied</h3>
            <p className="text-gray-400">You don't have permission to view analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.1)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
      
      <div className="relative z-10 p-6 space-y-8">
        {/* Analytics Header */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h2>
              <p className="text-gray-400">
                Monitor platform performance and user engagement
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-300">Time Range</label>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                >
                  {timeRangeOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={loadAnalyticsData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium mt-auto"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Overview Metrics */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Users"
              value={analyticsData.overview.totalUsers.toLocaleString()}
              change={analyticsData.overview.growthRate}
              trend="up"
              icon={Users}
              color="primary"
            />
            <MetricCard
              title="Active Users"
              value={analyticsData.overview.activeUsers.toLocaleString()}
              change={8.5}
              trend="up"
              icon={Activity}
              color="success"
            />
            <MetricCard
              title="Total Moments"
              value={analyticsData.overview.totalMoments.toLocaleString()}
              change={15.2}
              trend="up"
              icon={FileText}
              color="info"
            />
            <MetricCard
              title="Engagement Rate"
              value={`${analyticsData.overview.engagementRate}%`}
              change={5.3}
              trend="up"
              icon={Heart}
              color="warning"
            />
          </div>
        </section>

        {/* User Metrics */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-white">User Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="New Users"
              value={analyticsData.userMetrics.newUsers.toLocaleString()}
              change={12.8}
              trend="up"
              icon={Users}
              color="primary"
            />
            <MetricCard
              title="Returning Users"
              value={analyticsData.userMetrics.returningUsers.toLocaleString()}
              change={7.2}
              trend="up"
              icon={RefreshCw}
              color="success"
            />
            <MetricCard
              title="User Retention"
              value={`${analyticsData.userMetrics.userRetention}%`}
              change={3.1}
              trend="up"
              icon={TrendingUp}
              color="info"
            />
            <MetricCard
              title="Avg Session Time"
              value={analyticsData.userMetrics.averageSessionTime}
              change={8.7}
              trend="up"
              icon={Clock}
              color="warning"
            />
          </div>
        </section>

        {/* Content Metrics */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Content Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Moments Created"
              value={analyticsData.contentMetrics.momentsCreated.toLocaleString()}
              change={18.5}
              trend="up"
              icon={FileText}
              color="primary"
            />
            <MetricCard
              title="Stories Created"
              value={analyticsData.contentMetrics.storiesCreated.toLocaleString()}
              change={22.3}
              trend="up"
              icon={MessageSquare}
              color="success"
            />
            <MetricCard
              title="Chapters Created"
              value={analyticsData.contentMetrics.chaptersCreated.toLocaleString()}
              change={14.7}
              trend="up"
              icon={Calendar}
              color="info"
            />
            <MetricCard
              title="Avg Engagement"
              value={`${analyticsData.contentMetrics.averageEngagement}%`}
              change={6.2}
              trend="up"
              icon={Heart}
              color="warning"
            />
          </div>
        </section>

        {/* Engagement Metrics */}
        <section className="space-y-6">
          <h3 className="text-xl font-semibold text-white">Engagement Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Views"
              value={analyticsData.engagementMetrics.totalViews.toLocaleString()}
              change={25.4}
              trend="up"
              icon={Eye}
              color="primary"
            />
            <MetricCard
              title="Total Likes"
              value={analyticsData.engagementMetrics.totalLikes.toLocaleString()}
              change={19.8}
              trend="up"
              icon={Heart}
              color="success"
            />
            <MetricCard
              title="Total Comments"
              value={analyticsData.engagementMetrics.totalComments.toLocaleString()}
              change={16.3}
              trend="up"
              icon={MessageSquare}
              color="info"
            />
            <MetricCard
              title="Total Shares"
              value={analyticsData.engagementMetrics.totalShares.toLocaleString()}
              change={28.7}
              trend="up"
              icon={Share2}
              color="warning"
            />
          </div>
        </section>

        {/* Export Reports */}
        <section className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Export Reports</h3>
                <p className="text-gray-400">
                  Generate detailed reports for further analysis
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleExportReport('users')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Download size={16} />
                  User Report
                </button>
                <button
                  onClick={() => handleExportReport('content')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Download size={16} />
                  Content Report
                </button>
                <button
                  onClick={() => handleExportReport('engagement')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Download size={16} />
                  Engagement Report
                </button>
                <button
                  onClick={() => handleExportReport('comprehensive')}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 hover:text-purple-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  <Download size={16} />
                  Comprehensive Report
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminAnalytics;
