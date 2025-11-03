import React, { useState, useEffect } from 'react';
import { API } from '../services/api';
import { UserCreateForm } from '../ui-components';
import FamilyTreeVisualization from '../components/FamilyTree/FamilyTreeVisualization';
import { Search, Filter, Plus, Users, UserCheck, Crown, X, MessageCircle, Trash2, Eye, Heart, BookOpen, HelpCircle, Loader2, ChevronDown, GitBranch } from 'lucide-react';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Loading family members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="bg-white border-b-2 border-gray-200 sticky lg:sticky top-14 lg:top-0 z-40 shadow-sm">
        <div className="amw-container py-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Our Family</h1>
              <p className="text-sm text-gray-600 mt-0.5">Connect with your loved ones and build lasting memories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="amw-container py-4">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-between">
            <span className="text-red-800 font-medium text-sm">{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800 p-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="amw-container py-6 md:py-8">
        {/* Controls Section - Clean and Professional */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 md:p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search family members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            {/* Role Filter Dropdown */}
            <div className="relative">
              <Filter size={18} className="absolute left-3 top-3 text-gray-400 pointer-events-none z-10" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer font-medium text-sm"
              >
                <option value="all">All Roles</option>
                {familyRoles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
            </div>
            
            {/* Add Member Button */}
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg text-sm whitespace-nowrap"
            >
              <Plus size={18} />
              <span>Add Member</span>
            </button>
          </div>
        </div>

        {/* Family Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-5 md:p-6 hover:border-blue-500 hover:shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{users.length}</div>
                <div className="text-gray-600 text-sm font-medium">Total Members</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-5 md:p-6 hover:border-green-500 hover:shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <UserCheck size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{users.filter(u => u.isActive).length}</div>
                <div className="text-gray-600 text-sm font-medium">Active Members</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-5 md:p-6 hover:border-amber-500 hover:shadow-xl">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900">{new Set(users.map(u => u.role)).size}</div>
                <div className="text-gray-600 text-sm font-medium">Different Roles</div>
              </div>
            </div>
          </div>
        </div>

        {/* Family Grid */}
        <div className="mb-6 md:mb-8">
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 md:p-12">
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center">
                  <Users size={48} className="md:w-14 md:h-14 text-gray-400" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                  {searchQuery || filterRole !== 'all' 
                    ? 'No family members found' 
                    : 'No family members yet'
                  }
                </h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base max-w-md mx-auto">
                  {searchQuery || filterRole !== 'all'
                    ? 'Try adjusting your search or filter criteria to find family members.'
                    : 'Start building your family network by adding your first family member.'
                  }
                </p>
                {!searchQuery && filterRole === 'all' && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg text-sm"
                  >
                    <Plus size={18} />
                    <span>Add Your First Family Member</span>
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterRole('all');
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 text-sm"
                  >
                    <span>Clear Search</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredUsers.map(user => {
                const roleInfo = getRoleInfo(user.role);
                
                return (
                  <div key={user.id} className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-5 hover:border-blue-500 hover:shadow-xl">
                    {/* Avatar */}
                    <div className="relative mb-4">
                      <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
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
                      <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 truncate">{user.name}</h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-3 truncate">{user.email}</p>
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border-2 border-blue-200">
                        <span>{roleInfo.icon}</span>
                        <span>{roleInfo.name}</span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-lg font-bold text-gray-900">{user.momentsCount || 0}</div>
                        <div className="text-gray-600 text-xs">Moments</div>
                      </div>
                      <div className="text-center p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-lg font-bold text-gray-900">{user.storiesCount || 0}</div>
                        <div className="text-gray-600 text-xs">Stories</div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl border-2 border-blue-200 hover:border-blue-300 font-medium text-sm"
                      >
                        <Eye size={16} />
                        <span>View Profile</span>
                      </button>
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg border-2 border-gray-200 hover:border-gray-300"
                          title="Send Message"
                        >
                          <MessageCircle size={16} />
                        </button>
                        <button 
                          className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border-2 border-red-200 hover:border-red-300"
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
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Family Tree</h2>
          <FamilyTreeVisualization />
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowCreateForm(false)}>
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Add Family Member</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 md:p-6">
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">{selectedUser.name}</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 md:p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-xl overflow-hidden flex items-center justify-center mb-4 bg-gradient-to-br from-blue-600 to-purple-600">
                  {selectedUser.profilePicture ? (
                    <img src={selectedUser.profilePicture} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl md:text-3xl font-bold">{getInitials(selectedUser.name)}</span>
                  )}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{selectedUser.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{selectedUser.email}</p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium border-2 border-blue-200">
                  <span>{getRoleInfo(selectedUser.role).icon}</span>
                  <span>{getRoleInfo(selectedUser.role).name}</span>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="mb-6 pb-6 border-b-2 border-gray-200">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">About</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{selectedUser.bio}</p>
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

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md hover:shadow-lg font-semibold text-sm"
                >
                  <Heart size={18} />
                  <span>View Moments</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-semibold text-sm">
                  <MessageCircle size={18} />
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
