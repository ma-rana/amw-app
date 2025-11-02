import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Shield,
  Users,
  Flag,
  Settings,
  BarChart3,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import AdminDashboard from "./AdminDashboard";
import AdminUserManagement from "./AdminUserManagement";
import AdminContentModeration from "./AdminContentModeration";
import AdminSettings from "./AdminSettings";
import AdminAnalytics from "./AdminAnalytics";

const AdminAppContent = ({ onExit, adminUser, onAdminSignOut }) => {
  const { hasAdminPermission, ADMIN_PERMISSIONS } = useAdminAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    // Simulate admin verification
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
  };

  const handleExitAdmin = () => {
    onAdminSignOut();
    if (onExit) {
      onExit();
    }
  };

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      permission: null, // Dashboard is always accessible to admins
    },
    {
      id: "admin-user-management",
      label: "User Management",
      icon: Users,
      permission: ADMIN_PERMISSIONS.USER_MANAGEMENT,
    },
    {
      id: "admin-content-moderation",
      label: "Content Moderation",
      icon: Flag,
      permission: ADMIN_PERMISSIONS.CONTENT_MODERATION,
    },
    {
      id: "admin-settings",
      label: "Settings",
      icon: Settings,
      permission: ADMIN_PERMISSIONS.SYSTEM_SETTINGS,
    },
    {
      id: "admin-analytics",
      label: "Analytics",
      icon: BarChart3,
      permission: ADMIN_PERMISSIONS.ANALYTICS,
    },
  ];

  const getCurrentPageTitle = () => {
    const item = navigationItems.find((item) => item.id === currentPage);
    return item ? item.label : "Admin Panel";
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <AdminDashboard onNavigate={handleNavigation} adminUser={adminUser} />
        );
      case "admin-user-management":
        return <AdminUserManagement onNavigate={handleNavigation} />;
      case "admin-content-moderation":
        return <AdminContentModeration onNavigate={handleNavigation} />;
      case "admin-settings":
        return <AdminSettings />;
      case "admin-analytics":
        return <AdminAnalytics />;
      default:
        return <AdminDashboard onNavigate={handleNavigation} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8">
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto border-4 rounded-full animate-spin border-gray-200 border-t-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">
                Loading Admin Panel
              </h3>
              <p className="text-gray-600">
                Verifying administrator privileges...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar - Facebook Style - Fixed */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b-2 border-gray-200 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Section - Logo & Navigation (Desktop) */}
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <Shield size={20} className="text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 hidden sm:block">
                  Admin
                </h4>
              </div>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  const hasAccess =
                    !item.permission || hasAdminPermission(item.permission);

                  if (!hasAccess) return null;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                        isActive
                          ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            {/* Right Section - User Info & Actions */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2">
                <span className="text-sm text-gray-600 truncate max-w-[120px] font-medium">
                  {adminUser?.name || adminUser?.email}
                </span>
                <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                  {adminUser?.role === "super_admin"
                    ? "Super Admin"
                    : adminUser?.role === "moderator"
                    ? "Moderator"
                    : "Admin"}
                </span>
              </div>
              <button
                onClick={handleExitAdmin}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 text-sm font-medium border-2 border-transparent hover:border-gray-300"
              >
                <ArrowLeft size={14} />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            ref={mobileMenuRef}
            className="fixed top-16 left-0 right-0 bg-white border-b-2 border-gray-200 shadow-xl z-50 lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
            style={{ marginTop: "0" }}
          >
            <nav className="p-4 space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const hasAccess =
                  !item.permission || hasAdminPermission(item.permission);

                if (!hasAccess) return null;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all text-left ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </>
      )}

      {/* Main Content - Centered */}
      <main className="flex-1 bg-gray-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {renderCurrentPage()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-600">
              © 2024 A Moment With - Admin Panel
            </p>
            <p className="text-sm text-gray-600">Version 1.0.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AdminApp = ({ onExit, adminUser, onAdminSignOut }) => {
  return (
    <AdminAppContent
      onExit={onExit}
      adminUser={adminUser}
      onAdminSignOut={onAdminSignOut}
    />
  );
};

export default AdminApp;
