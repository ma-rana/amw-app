import React, { useState, useEffect } from 'react';
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
  Alert
} from '@aws-amplify/ui-react';
import CustomModal from '../components/CustomModal';
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
  RefreshCw
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useNotifications } from '../contexts/NotificationContext';


const AdminUserManagement = ({ _onNavigate }) => {
  const { 
    hasPermission, 
    PERMISSIONS, 
    updateUserStatus, 
    banUser,
    generateReport 
  } = useAdmin();
  const { addNotification } = useNotifications();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const [banDuration, setBanDuration] = useState('7_days');

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
      let mockUsers = JSON.parse(localStorage.getItem('admin_users') || '[]');
      
      if (mockUsers.length === 0) {
        // Generate mock users if none exist
        mockUsers = generateMockUsers();
        localStorage.setItem('admin_users', JSON.stringify(mockUsers));
      }

      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      addNotification('Error loading users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockUsers = () => {
    const statuses = ['active', 'inactive', 'banned', 'pending'];
    const roles = ['user', 'moderator', 'admin'];
    const names = [
      'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis',
      'David Wilson', 'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez',
      'William Garcia', 'Jessica Rodriguez', 'James Lopez', 'Ashley Lee',
      'Christopher Walker', 'Amanda Hall', 'Daniel Allen', 'Stephanie Young'
    ];

    return names.map((name, index) => ({
      id: `user_${index + 1}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@email.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      role: roles[Math.floor(Math.random() * roles.length)],
      created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_login: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      moments_count: Math.floor(Math.random() * 100),
      stories_count: Math.floor(Math.random() * 20),
      family_members: Math.floor(Math.random() * 15),
      profile_picture: null,
      verified: Math.random() > 0.3,
      banReason: null,
      banDuration: null,
      bannedAt: null
    }));
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'created_at' || sortBy === 'last_login') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
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
      case 'activate':
        await updateUserStatus(user.id, 'active');
        await loadUsers();
        break;
      case 'deactivate':
        await updateUserStatus(user.id, 'inactive');
        await loadUsers();
        break;
      case 'ban':
        setSelectedUser(user);
        setShowBanModal(true);
        break;
      case 'unban':
        await updateUserStatus(user.id, 'active');
        await loadUsers();
        break;
      case 'view':
        setSelectedUser(user);
        setShowUserModal(true);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleBanUser = async () => {
    if (!selectedUser || !banReason.trim()) {
      addNotification('Please provide a ban reason', 'error');
      return;
    }

    const success = await banUser(selectedUser.id, banReason, banDuration);
    if (success) {
      setShowBanModal(false);
      setBanReason('');
      setBanDuration('7_days');
      setSelectedUser(null);
      await loadUsers();
    }
  };

  const handleExportUsers = async () => {
    const report = await generateReport('users', 'all_time');
    if (report) {
      // In a real app, this would trigger a download
      console.log('Exporting users:', filteredUsers);
      addNotification('User export started', 'success');
    }
  };



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (!hasPermission(PERMISSIONS.USER_MANAGEMENT)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center max-w-md" style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ backgroundColor: 'var(--amw-error)' }}>
            <Shield size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text-primary)' }}>Access Denied</h3>
          <p style={{ color: 'var(--color-text-secondary)' }}>You don't have permission to manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
            <p className="text-white/70">
              Manage user accounts, permissions, and status
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadUsers}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              onClick={handleExportUsers}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2">
            <label className="block text-sm font-medium text-white/90 mb-2">Search Users</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all" className="bg-slate-800">All Status</option>
              <option value="active" className="bg-slate-800">Active</option>
              <option value="inactive" className="bg-slate-800">Inactive</option>
              <option value="banned" className="bg-slate-800">Banned</option>
              <option value="pending" className="bg-slate-800">Pending</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all" className="bg-slate-800">All Roles</option>
              <option value="user" className="bg-slate-800">User</option>
              <option value="moderator" className="bg-slate-800">Moderator</option>
              <option value="admin" className="bg-slate-800">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="created_at" className="bg-slate-800">Join Date</option>
              <option value="last_login" className="bg-slate-800">Last Login</option>
              <option value="name" className="bg-slate-800">Name</option>
              <option value="moments_count" className="bg-slate-800">Moments</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <div className="w-32">
            <label className="block text-sm font-medium text-white/90 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="desc" className="bg-slate-800">Descending</option>
              <option value="asc" className="bg-slate-800">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              {filteredUsers.length} users found
            </h3>
            <p className="text-sm text-white/70">
              Page {currentPage} of {totalPages}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-white/90">User</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-white/90">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-white/90">Role</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-white/90">Activity</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-white/90">Joined</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-white/90">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: 'var(--amw-primary)' }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-sm text-white/70">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                        user.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        user.status === 'banned' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                        user.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm text-white">
                          {user.moments_count} moments, {user.stories_count} stories
                        </p>
                        <p className="text-xs text-white/70">
                          Last login: {getTimeAgo(user.last_login)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-white/70">
                        {formatDate(user.created_at)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUserAction('view', user)}
                          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        {user.status === 'active' ? (
                          <button
                            onClick={() => handleUserAction('deactivate', user)}
                            className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 rounded-lg transition-all duration-200"
                            title="Deactivate User"
                          >
                            <UserX size={14} />
                          </button>
                        ) : user.status === 'banned' ? (
                          <button
                            onClick={() => handleUserAction('unban', user)}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                            title="Unban User"
                          >
                            <Unlock size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUserAction('activate', user)}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                            title="Activate User"
                          >
                            <UserCheck size={14} />
                          </button>
                        )}
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => handleUserAction('ban', user)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
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
              <div className="p-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Previous</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                            currentPage === pageNum
                              ? 'text-white shadow-lg'
                              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                          }`}
                          style={currentPage === pageNum ? { backgroundColor: 'var(--amw-primary)' } : {}}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Next</span>
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">User Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Name:</span>
                <span className="text-white">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Email:</span>
                <span className="text-white">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedUser.status === 'active' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                  selectedUser.status === 'inactive' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  selectedUser.status === 'banned' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {selectedUser.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Role:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  selectedUser.role === 'admin' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  selectedUser.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                  'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}>
                  {selectedUser.role}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Joined:</span>
                <span className="text-white">{formatDate(selectedUser.created_at)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Last Login:</span>
                <span className="text-white">{formatDate(selectedUser.last_login)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Content:</span>
                <span className="text-white">
                  {selectedUser.moments_count} moments, {selectedUser.stories_count} stories
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/20">
                <span className="font-semibold text-white/90">Family Members:</span>
                <span className="text-white">{selectedUser.family_members}</span>
              </div>
              {selectedUser.status === 'banned' && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="font-semibold text-white/90">Ban Reason:</span>
                    <span className="text-white">{selectedUser.banReason}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/20">
                    <span className="font-semibold text-white/90">Banned At:</span>
                    <span className="text-white">{formatDate(selectedUser.bannedAt)}</span>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6 max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ban User</h3>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
              <p className="text-yellow-300 text-sm">
                You are about to ban <strong>{selectedUser.name}</strong> ({selectedUser.email})
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Ban Reason
              </label>
              <textarea
                placeholder="Enter reason for banning this user..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 resize-none"
                rows="3"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Ban Duration
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
              >
                <option value="7_days" className="bg-slate-800">7 Days</option>
                <option value="30_days" className="bg-slate-800">30 Days</option>
                <option value="90_days" className="bg-slate-800">90 Days</option>
                <option value="permanent" className="bg-slate-800">Permanent</option>
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBanModal(false)}
                className="px-6 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBanUser}
                disabled={!banReason.trim()}
                className="px-6 py-2 text-white rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'var(--amw-error)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--amw-error-dark)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'var(--amw-error)'}
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