import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { UserCreateForm } from '../ui-components';
import FamilyTreeVisualization from '../components/FamilyTree/FamilyTreeVisualization';
import { Search, Filter, Plus, Users, UserCheck, Crown, X, MessageCircle, Trash2, Eye, Heart, BookOpen, HelpCircle } from 'lucide-react';

const FamilyPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await API.listUsers();
      setUsers(usersData || []);
    } catch (err) {
      setError('Failed to load family members');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      const newUser = await API.createUser({
        ...userData,
        joinedDate: new Date().toISOString(),
        isActive: true
      });
      setUsers(prev => [newUser, ...prev]);
      setShowCreateForm(false);
    } catch (err) {
      setError('Failed to create family member');
      console.error('Error creating user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this family member?')) {
      return;
    }

    try {
      await API.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to remove family member');
      console.error('Error deleting user:', err);
    }
  };

  const filteredUsers = users
    .filter(user => {
      if (filterRole !== 'all') return user.role === filterRole;
      return true;
    })
    .filter(user =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const familyRoles = [
    { id: 'parent', name: 'Parent', icon: '👨‍👩‍👧‍👦', color: 'from-blue-500 to-cyan-500' },
    { id: 'child', name: 'Child', icon: '👶', color: 'from-pink-500 to-rose-500' },
    { id: 'grandparent', name: 'Grandparent', icon: '👴', color: 'from-purple-500 to-violet-500' },
    { id: 'sibling', name: 'Sibling', icon: '👫', color: 'from-orange-500 to-amber-500' },
    { id: 'relative', name: 'Relative', icon: '👥', color: 'from-green-500 to-emerald-500' },
    { id: 'friend', name: 'Family Friend', icon: '🤝', color: 'from-teal-500 to-cyan-500' }
  ];

  const getRoleInfo = (roleId) => {
    return familyRoles.find(role => role.id === roleId) || 
           { name: roleId, icon: '👤', color: 'from-gray-500 to-slate-500' };
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-background)' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--amw-primary)', borderTopColor: 'transparent' }}></div>
          <p className="text-lg" style={{ color: 'var(--color-text-primary)' }}>Loading family members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        {/* Page Header */}
        <div className="bg-white border-b-2 border-gray-200 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 md:space-x-4 mb-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users size={28} className="md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Our Family</h1>
                  <p className="text-base md:text-lg text-gray-600">Connect with your loved ones and build lasting memories together</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-red-800 font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {/* Controls Section */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search family members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                  />
                </div>
                
                {/* Role Filter */}
                <div className="relative">
                  <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer font-medium"
                  >
                    <option value="all">All Roles</option>
                    {familyRoles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Add Member Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 md:px-6 md:py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                <Plus size={20} />
                <span>Add Family Member</span>
              </button>
            </div>
          </div>

          {/* Family Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 hover:border-purple-500 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-purple-600">{users.length}</div>
                  <div className="text-gray-600 text-sm font-medium">Total Members</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 hover:border-green-500 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                  <UserCheck size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
                  <div className="text-gray-600 text-sm font-medium">Active Members</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 hover:border-amber-500 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center shadow-md">
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-600">{new Set(users.map(u => u.role)).size}</div>
                  <div className="text-gray-600 text-sm font-medium">Different Roles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Family Grid */}
          <div className="mb-6 md:mb-8">
            {filteredUsers.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12 text-center">
                <div className="text-5xl md:text-6xl mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {searchQuery || filterRole !== 'all' 
                    ? 'No family members found' 
                    : 'No family members yet'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchQuery || filterRole !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Add your first family member to start building your family tree!'
                  }
                </p>
                {!searchQuery && filterRole === 'all' && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 md:px-8 md:py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <Plus size={20} />
                    <span>Add Your First Family Member</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredUsers.map(user => {
                  const roleInfo = getRoleInfo(user.role);
                  
                  return (
                    <div key={user.id} className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 hover:border-purple-500 hover:shadow-xl transition-all duration-300">
                      {/* Avatar */}
                      <div className="relative mb-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-lg md:text-xl font-bold">{getInitials(user.name)}</span>
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                      
                      {/* Member Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1">{user.name}</h3>
                        <p className="text-gray-600 text-xs md:text-sm mb-3">{user.email}</p>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs md:text-sm font-medium border-2 border-purple-200">
                          <span>{roleInfo.icon}</span>
                          <span>{roleInfo.name}</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4">
                        <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg md:text-xl font-bold text-gray-900">{user.momentsCount || 0}</div>
                          <div className="text-gray-600 text-xs">Moments</div>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg md:text-xl font-bold text-gray-900">{user.storiesCount || 0}</div>
                          <div className="text-gray-600 text-xs">Stories</div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl transition-all duration-200 border-2 border-purple-200 hover:border-purple-300 font-medium text-sm"
                        >
                          <Eye size={16} />
                          <span>View Profile</span>
                        </button>
                        <div className="flex space-x-2">
                          <button 
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border-2 border-blue-200 hover:border-blue-300"
                            title="Send Message"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button 
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200 border-2 border-red-200 hover:border-red-300"
                            title="Remove Member"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Family Tree Section */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md">
                <Users size={20} className="text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Family Tree</h2>
            </div>
            <FamilyTreeVisualization />
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Family Member</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <UserCreateForm
                onSubmit={handleCreateUser}
                onCancel={() => setShowCreateForm(false)}
                roles={familyRoles}
              />
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-2xl overflow-hidden flex items-center justify-center mb-4 bg-gradient-to-br from-purple-600 to-pink-600">
                  {selectedUser.profilePicture ? (
                    <img src={selectedUser.profilePicture} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl md:text-3xl font-bold">{getInitials(selectedUser.name)}</span>
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{selectedUser.name}</h3>
                <p className="text-gray-600 mb-4">{selectedUser.email}</p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium border-2 border-purple-200">
                  <span>{getRoleInfo(selectedUser.role).icon}</span>
                  <span>{getRoleInfo(selectedUser.role).name}</span>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600">{selectedUser.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                  <div className="flex items-center justify-center mb-2">
                    <Heart size={20} className="text-pink-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedUser.momentsCount || 0}</div>
                  <div className="text-gray-600 text-sm">Moments</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedUser.storiesCount || 0}</div>
                  <div className="text-gray-600 text-sm">Stories</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <HelpCircle size={20} className="text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{selectedUser.questionsAnswered || 0}</div>
                  <div className="text-gray-600 text-sm">Questions</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
                >
                  <Heart size={20} />
                  <span>View Moments</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-semibold">
                  <MessageCircle size={20} />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyPage;