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
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0" style={{ background: 'var(--color-background-alt)', opacity: 0.3 }}></div>
      
      <div className="relative">
        {/* Page Header */}
        <div className="backdrop-blur-lg border-b sticky top-0 z-40" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'var(--amw-primary)' }}>
                  <Users size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Our Family</h1>
                  <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Connect with your loved ones and build lasting memories together</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
              <span className="text-red-200">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-200 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Controls Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
                {/* Search */}
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    placeholder="Search family members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {/* Role Filter */}
                <div className="relative">
                  <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
                  >
                    <option value="all" className="bg-slate-800">All Roles</option>
                    {familyRoles.map(role => (
                      <option key={role.id} value={role.id} className="bg-slate-800">
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Add Member Button */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2 px-6 py-3 text-white rounded-xl transition-all duration-200"
                style={{ 
                  backgroundColor: 'var(--amw-primary)', 
                  border: '1px solid var(--amw-primary)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'var(--amw-primary-dark)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'var(--amw-primary)';
                }}
              >
                <Plus size={20} />
                <span>Add Family Member</span>
              </button>
            </div>
          </div>

          {/* Family Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                  <Users size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{users.length}</div>
                  <div className="text-white/70">Total Members</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-success)', border: '1px solid var(--amw-success)' }}>
                  <UserCheck size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{users.filter(u => u.isActive).length}</div>
                  <div className="text-white/70">Active Members</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-secondary)', border: '1px solid var(--amw-secondary)' }}>
                  <Crown size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{new Set(users.map(u => u.role)).size}</div>
                  <div className="text-white/70">Different Roles</div>
                </div>
              </div>
            </div>
          </div>

          {/* Family Grid */}
          <div className="mb-8">
            {filteredUsers.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-12 text-center">
                <div className="text-6xl mb-6">👨‍👩‍👧‍👦</div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {searchQuery || filterRole !== 'all' 
                    ? 'No family members found' 
                    : 'No family members yet'
                  }
                </h3>
                <p className="text-white/70 mb-6">
                  {searchQuery || filterRole !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'Add your first family member to start building your family tree!'
                  }
                </p>
                {!searchQuery && filterRole === 'all' && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-8 py-3 text-white rounded-xl transition-all duration-200"
                    style={{ 
                      backgroundColor: 'var(--amw-primary)', 
                      border: '1px solid var(--amw-primary)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--amw-primary-dark)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'var(--amw-primary)';
                    }}
                  >
                    Add Your First Family Member
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map(user => {
                  const roleInfo = getRoleInfo(user.role);
                  
                  return (
                    <div key={user.id} className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6 hover:bg-white/15 transition-all duration-200">
                      {/* Avatar */}
                      <div className="relative mb-4">
                        <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-xl font-bold">{getInitials(user.name)}</span>
                          )}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white ${user.isActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                      </div>
                      
                      {/* Member Info */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-white mb-1">{user.name}</h3>
                        <p className="text-white/70 text-sm mb-3">{user.email}</p>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-white text-sm font-medium" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                          <span>{roleInfo.icon}</span>
                          <span>{roleInfo.name}</span>
                        </div>
                      </div>
                      
                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">{user.momentsCount || 0}</div>
                          <div className="text-white/70 text-xs">Moments</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-white">{user.storiesCount || 0}</div>
                          <div className="text-white/70 text-xs">Stories</div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30"
                        >
                          <Eye size={16} />
                          <span>View Profile</span>
                        </button>
                        <div className="flex space-x-2">
                          <button 
                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl transition-all duration-200 border border-blue-500/30"
                            title="Send Message"
                          >
                            <MessageCircle size={16} />
                          </button>
                          <button 
                            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl transition-all duration-200 border border-red-500/30"
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--amw-success)', border: '1px solid var(--amw-success)' }}>
                <Users size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">Family Tree</h2>
            </div>
            <FamilyTreeVisualization />
          </div>
        </div>
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/20 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Add Family Member</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={24} className="text-white" />
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
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/20 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                  {selectedUser.profilePicture ? (
                    <img src={selectedUser.profilePicture} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">{getInitials(selectedUser.name)}</span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedUser.name}</h3>
                <p className="text-white/70 mb-4">{selectedUser.email}</p>
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full text-white font-medium" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                  <span>{getRoleInfo(selectedUser.role).icon}</span>
                  <span>{getRoleInfo(selectedUser.role).name}</span>
                </div>
              </div>

              {selectedUser.bio && (
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-2">About</h4>
                  <p className="text-white/70">{selectedUser.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Heart size={20} className="text-pink-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedUser.momentsCount || 0}</div>
                  <div className="text-white/70 text-sm">Moments</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen size={20} className="text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedUser.storiesCount || 0}</div>
                  <div className="text-white/70 text-sm">Stories</div>
                </div>
                <div className="text-center p-4 bg-white/10 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <HelpCircle size={20} className="text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">{selectedUser.questionsAnswered || 0}</div>
                  <div className="text-white/70 text-sm">Questions</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 text-white rounded-xl transition-all duration-200"
                  style={{ 
                    backgroundColor: 'var(--amw-primary)', 
                    border: '1px solid var(--amw-primary)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--amw-primary-dark)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--amw-primary)';
                  }}
                >
                  <Heart size={20} />
                  <span>View Moments</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-200 border border-white/20 hover:border-white/30">
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