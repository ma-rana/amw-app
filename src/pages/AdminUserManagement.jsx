import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Heading,
  Text,
  TextField,
  SelectField,
  Badge,
  Flex,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Alert,
} from "@aws-amplify/ui-react";
import CustomModal from "../components/CustomModal";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Calendar,
  MoreVertical,
  Eye,
  Ban,
  Unlock,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdminAuth } from "../contexts/AdminAuthContext";
import { useNotifications } from "../contexts/NotificationContext";

const AdminUserManagement = ({ _onNavigate }) => {
  const { hasAdminPermission, ADMIN_PERMISSIONS } = useAdminAuth();
  const { addNotification } = useNotifications();

  // Local admin functions since they're no longer in useAdminAuth
  const updateUserStatus = async (userId, status) => {
    try {
      console.log(`Updating user ${userId} status to ${status}`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, status } : user
        )
      );
      addNotification(`User status updated to ${status}`, "success");
    } catch (error) {
      console.error("Error updating user status:", error);
      addNotification("Failed to update user status", "error");
    }
  };

  const banUser = async (userId, reason, duration) => {
    try {
      console.log(`Banning user ${userId} for ${reason} (${duration})`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: "banned",
                banReason: reason,
                banDuration: duration,
                bannedAt: new Date().toISOString(),
              }
            : user
        )
      );
      addNotification(`User banned successfully`, "success");
    } catch (error) {
      console.error("Error banning user:", error);
      addNotification("Failed to ban user", "error");
    }
  };

  const generateReport = async (type) => {
    try {
      console.log(`Generating ${type} report`);
      addNotification(`${type} report generated successfully`, "success");
    } catch (error) {
      console.error("Error generating report:", error);
      addNotification("Failed to generate report", "error");
    }
  };

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState("");
  const [banDuration, setBanDuration] = useState("7_days");

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, statusFilter, roleFilter, sortBy, sortOrder]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would fetch from your backend API
      // For demo purposes, we'll use mock data with localStorage
      let mockUsers = JSON.parse(localStorage.getItem("admin_users") || "[]");

      if (mockUsers.length === 0) {
        // Generate mock users if none exist
        mockUsers = generateMockUsers();
        localStorage.setItem("admin_users", JSON.stringify(mockUsers));
      }

      setUsers(mockUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      addNotification("Error loading users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockUsers = () => {
    const statuses = ["active", "inactive", "banned", "pending"];
    const roles = ["user", "moderator", "admin"];
    const names = [
      "John Smith",
      "Sarah Johnson",
      "Michael Brown",
      "Emily Davis",
      "David Wilson",
      "Lisa Anderson",
      "Robert Taylor",
      "Jennifer Martinez",
      "William Garcia",
      "Jessica Rodriguez",
      "James Lopez",
      "Ashley Lee",
      "Christopher Walker",
      "Amanda Hall",
      "Daniel Allen",
      "Stephanie Young",
    ];

    return names.map((name, index) => ({
      id: `user_${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      created_at: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ).toISOString(),
      last_login: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      moments_count: Math.floor(Math.random() * 100),
      stories_count: Math.floor(Math.random() * 20),
      family_members: Math.floor(Math.random() * 15),
      profile_picture: null,
      verified: Math.random() > 0.3,
      banReason: null,
      banDuration: null,
      bannedAt: null,
    }));
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "created_at" || sortBy === "last_login") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleUserAction = async (action, user) => {
    switch (action) {
      case "activate":
        await updateUserStatus(user.id, "active");
        await loadUsers();
        break;
      case "deactivate":
        await updateUserStatus(user.id, "inactive");
        await loadUsers();
        break;
      case "ban":
        setSelectedUser(user);
        setShowBanModal(true);
        break;
      case "unban":
        await updateUserStatus(user.id, "active");
        await loadUsers();
        break;
      case "view":
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      default:
        console.log("Unknown action:", action);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      addNotification("Please provide a ban reason", "error");
      return;
    }

    const success = await banUser(selectedUser.id, banReason, banDuration);
    if (success) {
      setShowBanModal(false);
      setBanReason("");
      setBanDuration("7_days");
      setSelectedUser(null);
      await loadUsers();
    }
  };

  const handleExportUsers = async () => {
    const report = await generateReport("users", "all_time");
    if (report) {
      // In a real app, this would trigger a download
      console.log("Exporting users:", filteredUsers);
      addNotification("User export started", "success");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (!hasAdminPermission(ADMIN_PERMISSIONS.USER_MANAGEMENT)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <Shield size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-gray-900">
            Access Denied
          </h3>
          <p className="text-gray-600">
            You don't have permission to manage users.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              User Management
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Manage user accounts, permissions, and status
            </p>
          </div>
          <div className="flex gap-2 md:gap-3">
            <button
              onClick={loadUsers}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              <span className="text-sm">Refresh</span>
            </button>
            <button
              onClick={handleExportUsers}
              className="inline-flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              <Download size={16} />
              <span className="text-sm">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 mb-4 md:mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
          <div className="xl:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Users
            </label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 md:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Role
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2.5 md:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 md:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
            >
              <option value="created_at">Join Date</option>
              <option value="last_login">Last Login</option>
              <option value="name">Name</option>
              <option value="moments_count">Moments</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <div className="w-32">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-3 py-2.5 md:py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <div className="p-4 md:p-6 border-b-2 border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              {filteredUsers.length} users found
            </h3>
            <p className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">
                      User
                    </th>
                    <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">
                      Role
                    </th>
                    <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">
                      Activity
                    </th>
                    <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">
                      Joined
                    </th>
                    <th className="text-left py-3 px-4 md:px-6 text-xs md:text-sm font-bold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b-2 border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="py-3 px-4 md:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-blue-600 to-purple-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm md:text-base">
                              {user.name}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 md:px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                            user.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : user.status === "inactive"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : user.status === "banned"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 md:px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                            user.role === "admin"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : user.role === "moderator"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4 md:px-6">
                        <div>
                          <p className="text-xs md:text-sm text-gray-900 font-medium">
                            {user.moments_count} moments, {user.stories_count}{" "}
                            stories
                          </p>
                          <p className="text-xs text-gray-600">
                            Last login: {getTimeAgo(user.last_login)}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4 md:px-6">
                        <p className="text-xs md:text-sm text-gray-600">
                          {formatDate(user.created_at)}
                        </p>
                      </td>
                      <td className="py-3 px-4 md:px-6">
                        <div className="flex items-center space-x-1 md:space-x-2">
                          <button
                            onClick={() => handleUserAction("view", user)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-blue-200"
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          {user.status === "active" ? (
                            <button
                              onClick={() =>
                                handleUserAction("deactivate", user)
                              }
                              className="p-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-yellow-200"
                              title="Deactivate User"
                            >
                              <UserX size={14} />
                            </button>
                          ) : user.status === "banned" ? (
                            <button
                              onClick={() => handleUserAction("unban", user)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-green-200"
                              title="Unban User"
                            >
                              <Unlock size={14} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction("activate", user)}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-green-200"
                              title="Activate User"
                            >
                              <UserCheck size={14} />
                            </button>
                          )}
                          {user.status !== "banned" && (
                            <button
                              onClick={() => handleUserAction("ban", user)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border-2 border-transparent hover:border-red-200"
                              title="Ban User"
                            >
                              <Ban size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-4 md:p-6 border-t-2 border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between gap-4">
                  {/* Previous Link - Left */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-700 group"
                  >
                    <ChevronLeft
                      size={18}
                      className="transition-transform duration-200 group-hover:-translate-x-1 group-focus:-translate-x-1"
                    />
                    <span className="text-sm md:text-base font-medium">
                      Previous
                    </span>
                  </button>

                  {/* Pagination Text - Center */}
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-sm md:text-base text-gray-700 font-semibold">
                      Page{" "}
                      <span className="text-blue-600 font-bold">
                        {currentPage}
                      </span>{" "}
                      of{" "}
                      <span className="text-gray-900 font-bold">
                        {totalPages}
                      </span>
                    </span>
                  </div>

                  {/* Next Link - Right */}
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-gray-700 group"
                  >
                    <span className="text-sm md:text-base font-medium">
                      Next
                    </span>
                    <ChevronRight
                      size={18}
                      className="transition-transform duration-200 group-hover:translate-x-1 group-focus:translate-x-1"
                    />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Details Modal */}
      <CustomModal
        isOpen={showUserModal}
        onDismiss={() => setShowUserModal(false)}
        className="user-modal"
      >
        {selectedUser && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              User Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Name:</span>
                <span className="text-gray-900">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-900">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Status:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                    selectedUser.status === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : selectedUser.status === "inactive"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : selectedUser.status === "banned"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {selectedUser.status.charAt(0).toUpperCase() +
                    selectedUser.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Role:</span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border-2 ${
                    selectedUser.role === "admin"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : selectedUser.role === "moderator"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                >
                  {selectedUser.role.charAt(0).toUpperCase() +
                    selectedUser.role.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Joined:</span>
                <span className="text-gray-900">
                  {formatDate(selectedUser.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Last Login:</span>
                <span className="text-gray-900">
                  {formatDate(selectedUser.last_login)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">Content:</span>
                <span className="text-gray-900">
                  {selectedUser.moments_count} moments,{" "}
                  {selectedUser.stories_count} stories
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                <span className="font-semibold text-gray-700">
                  Family Members:
                </span>
                <span className="text-gray-900">
                  {selectedUser.family_members}
                </span>
              </div>
              {selectedUser.status === "banned" && (
                <>
                  <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                    <span className="font-semibold text-gray-700">
                      Ban Reason:
                    </span>
                    <span className="text-gray-900">
                      {selectedUser.banReason}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b-2 border-gray-200">
                    <span className="font-semibold text-gray-700">
                      Banned At:
                    </span>
                    <span className="text-gray-900">
                      {formatDate(selectedUser.bannedAt)}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </CustomModal>

      {/* Ban User Modal */}
      <CustomModal
        isOpen={showBanModal}
        onDismiss={() => setShowBanModal(false)}
        className="ban-modal"
      >
        {selectedUser && (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ban User</h3>
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-sm">
                You are about to ban <strong>{selectedUser.name}</strong> (
                {selectedUser.email})
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ban Reason
              </label>
              <textarea
                placeholder="Enter reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                rows="3"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ban Duration
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 font-medium"
              >
                <option value="7_days">7 Days</option>
                <option value="30_days">30 Days</option>
                <option value="90_days">90 Days</option>
                <option value="permanent">Permanent</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={!banReason.trim()}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg font-medium"
              >
                Ban User
              </button>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
};

export default AdminUserManagement;
