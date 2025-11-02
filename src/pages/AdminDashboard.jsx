import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Heading,
  Text,
  Badge,
  Flex,
  Grid,
} from "@aws-amplify/ui-react";
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
  Bell,
} from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";

const AdminDashboard = ({ onNavigate, adminUser }) => {
  const { hasAdminPermission, ADMIN_PERMISSIONS, adminSignOut } =
    useAdminAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    totalMoments: 5634,
    totalStories: 234,
    pendingReports: 12,
    systemHealth: "good",
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
        type: "user_registered",
        description: "New user registration: sarah.johnson@email.com",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        severity: "info",
      },
      {
        id: 2,
        type: "content_reported",
        description: "Moment reported for inappropriate content",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        severity: "warning",
      },
      {
        id: 3,
        type: "user_banned",
        description: "User banned for policy violation",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        severity: "error",
      },
      {
        id: 4,
        type: "story_created",
        description: 'New family story created: "Summer Vacation 2024"',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        severity: "success",
      },
      {
        id: 5,
        type: "system_backup",
        description: "Daily system backup completed successfully",
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        severity: "info",
      },
    ];
    setRecentActivity(activities);
  };

  const loadSystemAlerts = () => {
    // Mock system alerts
    const alerts = [
      {
        id: 1,
        type: "warning",
        title: "High Storage Usage",
        message: "Media storage is at 85% capacity",
        action: "Review storage settings",
      },
      {
        id: 2,
        type: "info",
        title: "Scheduled Maintenance",
        message: "System maintenance scheduled for Sunday 2:00 AM",
        action: "View maintenance details",
      },
      {
        id: 3,
        type: "error",
        title: "Failed Login Attempts",
        message: "15 failed login attempts detected from suspicious IP",
        action: "Review security logs",
      },
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
      case "export_users":
        await generateReport("users", "last_30_days");
        break;
      case "export_content":
        await generateReport("content", "last_30_days");
        break;
      case "view_reports":
        onNavigate("admin-content-moderation");
        break;
      case "manage_users":
        onNavigate("admin-user-management");
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div
              className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-600 rounded-full animate-spin mx-auto"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
              }}
            ></div>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Loading Dashboard
            </h3>
            <p className="text-gray-600">Preparing your admin workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-6 md:space-y-8">
        {/* Enhanced Dashboard Header */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>
                    Welcome back, {adminUser?.name || adminUser?.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last login: {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <button className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium">
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Refresh</span>
              </button>
              <button className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium relative">
                <Bell className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Alerts</span>
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-1.5 py-0 min-w-[18px] h-[18px] rounded-full font-semibold flex items-center justify-center leading-none">
                  3
                </span>
              </button>
              <button
                onClick={() => onNavigate("admin-settings")}
                disabled={
                  !hasAdminPermission(ADMIN_PERMISSIONS.SYSTEM_SETTINGS)
                }
                className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Settings</span>
              </button>
              <button
                onClick={adminSignOut}
                className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <span className="hidden sm:inline text-sm">Exit Admin</span>
                <span className="sm:hidden text-sm">Exit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Active Users */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg hover:shadow-xl hover:border-green-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+12%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Active Users</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {formatNumber(adminStats.activeUsers)}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                <span className="text-green-600 text-sm font-medium leading-[1.5]">
                  {adminStats.activeUsers > 100
                    ? "High activity"
                    : "Normal activity"}
                </span>
              </div>
            </div>
          </div>

          {/* Total Moments */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+8%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Total Moments</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {formatNumber(adminStats.totalMoments)}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-blue-600 text-sm font-medium leading-[1.5]">
                  Growing steadily
                </span>
              </div>
            </div>
          </div>

          {/* Total Stories */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg hover:shadow-xl hover:border-emerald-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUp className="w-4 h-4" />
                <span className="text-sm font-semibold">+15%</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">Total Stories</p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {formatNumber(adminStats.totalStories)}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0"></div>
                <span className="text-emerald-600 text-sm font-medium leading-[1.5]">
                  Excellent engagement
                </span>
              </div>
            </div>
          </div>

          {/* Pending Reports */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg hover:shadow-xl hover:border-amber-500 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                <span className="text-sm font-semibold">Review</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm font-medium">
                Pending Reports
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                {adminStats.pendingReports}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                <span className="text-amber-600 text-sm font-medium leading-[1.5]">
                  Requires attention
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  Recent Activity
                </h2>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 md:space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl border-2 border-gray-100 hover:bg-gray-100 hover:border-gray-200 transition-all duration-200"
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                      activity.severity === "error"
                        ? "bg-red-500"
                        : activity.severity === "warning"
                        ? "bg-amber-500"
                        : activity.severity === "success"
                        ? "bg-emerald-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm md:text-base font-medium">
                      {activity.description}
                    </p>
                    <p className="text-gray-500 text-xs md:text-sm mt-1">
                      {getTimeAgo(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                System Alerts
              </h2>
            </div>
            <div className="space-y-3 md:space-y-4">
              {systemAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border-2 ${
                    alert.type === "error"
                      ? "bg-red-50 border-red-200"
                      : alert.type === "warning"
                      ? "bg-amber-50 border-amber-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p
                      className={`font-semibold text-sm md:text-base ${
                        alert.type === "error"
                          ? "text-red-900"
                          : alert.type === "warning"
                          ? "text-amber-900"
                          : "text-blue-900"
                      }`}
                    >
                      {alert.title}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-semibold border-2 ${
                        alert.type === "error"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : alert.type === "warning"
                          ? "bg-amber-100 text-amber-800 border-amber-300"
                          : "bg-blue-100 text-blue-800 border-blue-300"
                      }`}
                    >
                      {alert.type}
                    </span>
                  </div>
                  <p
                    className={`text-xs md:text-sm mb-3 ${
                      alert.type === "error"
                        ? "text-red-900"
                        : alert.type === "warning"
                        ? "text-amber-900"
                        : "text-blue-900"
                    }`}
                  >
                    {alert.message}
                  </p>
                  <button
                    className={`text-xs md:text-sm font-semibold hover:underline ${
                      alert.type === "error"
                        ? "text-red-900 hover:text-red-950"
                        : alert.type === "warning"
                        ? "text-amber-900 hover:text-amber-950"
                        : "text-blue-900 hover:text-blue-950"
                    }`}
                  >
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <button
              onClick={() => onNavigate && onNavigate("admin-user-management")}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.USER_MANAGEMENT)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-blue-50 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <UserCheck className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">
                Manage Users
              </span>
            </button>
            <button
              onClick={() =>
                onNavigate && onNavigate("admin-content-moderation")
              }
              disabled={
                !hasAdminPermission(ADMIN_PERMISSIONS.CONTENT_MODERATION)
              }
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-purple-50 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Eye className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">
                Content Moderation
              </span>
            </button>
            <button
              onClick={() => handleQuickAction("export_users")}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.ANALYTICS)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-green-50 rounded-xl border-2 border-gray-200 hover:border-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Download className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">
                Export Users
              </span>
            </button>
            <button
              onClick={() => handleQuickAction("export_content")}
              disabled={!hasAdminPermission(ADMIN_PERMISSIONS.ANALYTICS)}
              className="flex flex-col items-center gap-3 p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl border-2 border-gray-200 hover:border-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Download className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-900">
                Export Content
              </span>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 md:p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              System Health
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-4 md:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Cpu className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600 font-semibold">CPU Usage</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                23%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "23%" }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 md:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600 font-semibold">Memory</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                67%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: "67%" }}
                ></div>
              </div>
            </div>
            <div className="text-center p-4 md:p-5 bg-gray-50 rounded-xl border-2 border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <HardDrive className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-gray-600 font-semibold">Storage</p>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                85%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-amber-600 h-2.5 rounded-full"
                  style={{ width: "85%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
