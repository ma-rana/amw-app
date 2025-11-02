import React, { useState, useEffect, useRef, useCallback } from 'react';
import API from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Loader2, X, Plus, GitBranch, Network, List, Settings2 } from 'lucide-react';

const FamilyTreeVisualization = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [relationships, setRelationships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddRelationship, setShowAddRelationship] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    withUser: '',
    relation: ''
  });
  const [treeData, setTreeData] = useState(null);
  const [viewMode, setViewMode] = useState('tree');
  const [centerUser, setCenterUser] = useState(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const relationshipTypes = [
    { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦', color: '#2563eb' },
    { value: 'child', label: 'Child', icon: '👶', color: '#dc2626' },
    { value: 'spouse', label: 'Spouse/Partner', icon: '💑', color: '#ec4899' },
    { value: 'sibling', label: 'Sibling', icon: '👫', color: '#f59e0b' },
    { value: 'grandparent', label: 'Grandparent', icon: '👴', color: '#9333ea' },
    { value: 'grandchild', label: 'Grandchild', icon: '👶', color: '#ea580c' },
    { value: 'aunt_uncle', label: 'Aunt/Uncle', icon: '👨‍👩‍👧', color: '#16a34a' },
    { value: 'niece_nephew', label: 'Niece/Nephew', icon: '👧👦', color: '#0891b2' },
    { value: 'cousin', label: 'Cousin', icon: '👥', color: '#78716c' },
    { value: 'friend', label: 'Family Friend', icon: '🤝', color: '#64748b' }
  ];

  useEffect(() => {
    loadFamilyData();
  }, []);

  useEffect(() => {
    if (users.length > 0 && relationships.length >= 0) {
      buildTreeData();
    }
  }, [users, relationships, centerUser]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.parentElement?.getBoundingClientRect();
        if (rect) {
          setDimensions({
            width: Math.max(800, rect.width - 40),
            height: Math.max(600, rect.height - 40)
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadFamilyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [usersData, relationshipsData] = await Promise.all([
        API.listUsers(),
        API.listRelationships()
      ]);

      setUsers(usersData || []);
      setRelationships(relationshipsData || []);
      
      if (currentUser && usersData) {
        const currentUserData = usersData.find(u => u.id === currentUser.id);
        setCenterUser(currentUserData || usersData[0]);
      }
    } catch (err) {
      setError('Failed to load family data');
      console.error('Error loading family data:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildTreeData = useCallback(() => {
    if (!centerUser || users.length === 0) {
      setTreeData({ nodes: [], links: [] });
      return;
    }

    const nodes = new Map();
    const links = [];

    users.forEach(user => {
      nodes.set(user.id, {
        id: user.id,
        name: user.name || user.email,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isCenter: user.id === centerUser.id,
        x: 0,
        y: 0,
        level: 0,
        relationships: []
      });
    });

    relationships.forEach(rel => {
      const sourceNode = nodes.get(rel.user?.id);
      const targetNode = nodes.get(rel.withUser);
      
      if (sourceNode && targetNode) {
        const relationshipType = relationshipTypes.find(rt => rt.value === rel.relation) || 
                                { value: rel.relation, label: rel.relation, icon: '👥', color: '#94a3b8' };
        
        links.push({
          source: rel.user.id,
          target: rel.withUser,
          relation: rel.relation,
          relationshipType,
          id: rel.id
        });

        sourceNode.relationships.push({
          userId: rel.withUser,
          relation: rel.relation,
          type: relationshipType
        });
      }
    });

    calculateNodePositions(nodes, links, centerUser.id);

    setTreeData({
      nodes: Array.from(nodes.values()),
      links
    });
  }, [users, relationships, centerUser]);

  const calculateNodePositions = (nodes, links, centerId) => {
    const centerNode = nodes.get(centerId);
    if (!centerNode) return;

    centerNode.x = dimensions.width / 2;
    centerNode.y = dimensions.height / 2;
    centerNode.level = 0;

    const visited = new Set([centerId]);
    const queue = [{ nodeId: centerId, level: 0 }];

    while (queue.length > 0) {
      const { nodeId, level } = queue.shift();
      const connectedLinks = links.filter(link => 
        link.source === nodeId || link.target === nodeId
      );

      connectedLinks.forEach(link => {
        const connectedId = link.source === nodeId ? link.target : link.source;
        const connectedNode = nodes.get(connectedId);

        if (connectedNode && !visited.has(connectedId)) {
          visited.add(connectedId);
          connectedNode.level = level + 1;
          queue.push({ nodeId: connectedId, level: level + 1 });
        }
      });
    }

    const levelGroups = new Map();
    nodes.forEach(node => {
      if (!levelGroups.has(node.level)) {
        levelGroups.set(node.level, []);
      }
      levelGroups.get(node.level).push(node);
    });

    levelGroups.forEach((nodesInLevel, level) => {
      if (level === 0) return;

      const radius = Math.min(dimensions.width, dimensions.height) * 0.15 * level;
      const angleStep = (2 * Math.PI) / nodesInLevel.length;

      nodesInLevel.forEach((node, index) => {
        const angle = index * angleStep;
        node.x = centerNode.x + radius * Math.cos(angle);
        node.y = centerNode.y + radius * Math.sin(angle);
      });
    });
  };

  const handleAddRelationship = async () => {
    if (!newRelationship.withUser || !newRelationship.relation) {
      setError('Please select a user and relationship type');
      return;
    }

    try {
      const relationshipData = {
        relation: newRelationship.relation,
        withUser: newRelationship.withUser,
        userRelationsId: currentUser.id
      };

      await API.createRelationship(relationshipData);
      await loadFamilyData();
      
      setShowAddRelationship(false);
      setNewRelationship({ withUser: '', relation: '' });
    } catch (err) {
      setError('Failed to add relationship');
      console.error('Error adding relationship:', err);
    }
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  const getRelationshipInfo = (relation) => {
    return relationshipTypes.find(rt => rt.value === relation) || 
           { value: relation, label: relation, icon: '👥', color: '#94a3b8' };
  };

  const renderTreeView = () => {
    if (!treeData || treeData.nodes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <GitBranch size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Family Tree Data</h3>
          <p className="text-gray-600 text-sm text-center max-w-md mb-6">
            Add family members and relationships to visualize your family tree.
          </p>
          <button
            onClick={() => setShowAddRelationship(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            <Plus size={16} />
            <span>Add Relationship</span>
          </button>
        </div>
      );
    }

    return (
      <div className="tree-visualization bg-gray-50 rounded-xl border-2 border-gray-200 p-4 overflow-auto">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="w-full"
        >
          {treeData.links.map((link, index) => {
            const sourceNode = treeData.nodes.find(n => n.id === link.source);
            const targetNode = treeData.nodes.find(n => n.id === link.target);
            
            if (!sourceNode || !targetNode) return null;

            return (
              <g key={`link-${index}`}>
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={link.relationshipType.color}
                  strokeWidth="2"
                  opacity="0.6"
                />
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2}
                  textAnchor="middle"
                  fontSize="16"
                  fill={link.relationshipType.color}
                >
                  {link.relationshipType.icon}
                </text>
              </g>
            );
          })}

          {treeData.nodes.map(node => (
            <g key={node.id} className="cursor-pointer" onClick={() => setSelectedNode(node)}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.isCenter ? 30 : 22}
                fill={node.isCenter ? '#2563eb' : '#ffffff'}
                stroke={node.isCenter ? '#1d4ed8' : '#e5e7eb'}
                strokeWidth="3"
              />
              <text
                x={node.x}
                y={node.y - 35}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                fill="#111827"
              >
                {node.name}
              </text>
              <text
                x={node.x}
                y={node.y + 5}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={node.isCenter ? '#ffffff' : '#111827'}
              >
                {getInitials(node.name)}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderNetworkView = () => {
    if (users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <Network size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Family Members</h3>
          <p className="text-gray-600 text-sm text-center max-w-md">
            Add family members to see them in network view.
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => {
          const userRelationships = relationships.filter(rel => 
            rel.user?.id === user.id || rel.withUser === user.id
          );

          return (
            <div key={user.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-4">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden flex items-center justify-center mb-3 bg-gradient-to-br from-blue-600 to-purple-600">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-lg font-bold">{getInitials(user.name)}</span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{user.name || user.email}</h4>
                {user.email && <p className="text-gray-600 text-xs">{user.email}</p>}
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Relationships:</p>
                {userRelationships.length > 0 ? (
                  userRelationships.map(rel => {
                    const relInfo = getRelationshipInfo(rel.relation);
                    const relatedUser = users.find(u => 
                      u.id === (rel.user?.id === user.id ? rel.withUser : rel.user?.id)
                    );
                    
                    return (
                      <div key={rel.id} className="flex items-center space-x-2 text-xs">
                        <span className="text-base">{relInfo.icon}</span>
                        <span className="text-gray-600">{relInfo.label}</span>
                        {relatedUser && (
                          <span className="text-gray-500">• {relatedUser.name}</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500">No relationships</p>
                )}
              </div>
              
              <button
                onClick={() => setCenterUser(user)}
                className="w-full px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 font-medium text-xs"
              >
                Center Tree
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    if (relationships.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
            <List size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No Relationships</h3>
          <p className="text-gray-600 text-sm text-center max-w-md mb-6">
            Add relationships between family members to see them listed here.
          </p>
          <button
            onClick={() => setShowAddRelationship(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            <Plus size={16} />
            <span>Add Relationship</span>
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {relationships.map(rel => {
          const relInfo = getRelationshipInfo(rel.relation);
          const sourceUser = users.find(u => u.id === rel.user?.id);
          const targetUser = users.find(u => u.id === rel.withUser);

          return (
            <div key={rel.id} className="bg-white rounded-xl border-2 border-gray-200 shadow-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
                  <span className="text-lg">{relInfo.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {sourceUser?.name || 'Unknown'} <span className="text-gray-400">→</span> {targetUser?.name || 'Unknown'}
                  </p>
                  <p className="text-xs text-gray-600">{relInfo.label}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Remove this relationship?')) {
                    API.deleteRelationship(rel.id).then(() => loadFamilyData());
                  }
                }}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-all duration-200 border-2 border-red-200 hover:border-red-300 text-xs font-medium"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600 font-medium text-sm">Loading family tree...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 flex items-center justify-between">
          <span className="text-red-800 text-sm font-medium">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Controls */}
      <div className="w-full pb-4 border-b-2 border-gray-200 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
          {/* Left Side - View Mode Buttons */}
          <div className="flex bg-gray-100 rounded-xl p-1.5 border-2 border-gray-200 gap-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'tree' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <GitBranch size={16} className="inline mr-1.5" />
              Tree
            </button>
            <button
              onClick={() => setViewMode('network')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'network' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <Network size={16} className="inline mr-1.5" />
              Network
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'list' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              <List size={16} className="inline mr-1.5" />
              List
            </button>
          </div>
          
          {/* Right Side - Add Relationship Button */}
          <div className="flex items-center gap-3">
            {centerUser && (
              <div className="text-sm text-gray-600 hidden sm:block">
                Centered on: <span className="font-semibold text-gray-900">{centerUser.name || centerUser.email}</span>
              </div>
            )}
            <button
              onClick={() => setShowAddRelationship(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 text-sm shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Add Relationship</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {viewMode === 'tree' && renderTreeView()}
        {viewMode === 'network' && renderNetworkView()}
        {viewMode === 'list' && renderListView()}
      </div>

      {/* Add Relationship Modal */}
      {showAddRelationship && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowAddRelationship(false)}>
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">Add Relationship</h2>
              <button
                onClick={() => setShowAddRelationship(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Family Member</label>
                <select
                  value={newRelationship.withUser}
                  onChange={(e) => setNewRelationship(prev => ({ ...prev, withUser: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Choose a family member...</option>
                  {users.filter(u => u.id !== currentUser?.id).map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship Type</label>
                <select
                  value={newRelationship.relation}
                  onChange={(e) => setNewRelationship(prev => ({ ...prev, relation: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Choose relationship...</option>
                  {relationshipTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  onClick={() => setShowAddRelationship(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 border-2 border-gray-200 hover:border-gray-300 font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddRelationship}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
                >
                  Add Relationship
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Details Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSelectedNode(null)}>
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 md:p-6 border-b-2 border-gray-200 flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-900">{selectedNode.name}</h2>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 md:p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">{selectedNode.email}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-3">Relationships:</h4>
                {selectedNode.relationships.length > 0 ? (
                  <div className="space-y-2">
                    {selectedNode.relationships.map((rel, index) => {
                      const relatedUser = users.find(u => u.id === rel.userId);
                      return (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                          <span className="text-base">{rel.type.icon}</span>
                          <span className="text-sm font-medium text-gray-700">{rel.type.label}</span>
                          <span className="text-sm text-gray-600">• {relatedUser?.name || 'Unknown'}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No relationships defined</p>
                )}
              </div>

              <button
                onClick={() => {
                  setCenterUser(selectedNode);
                  setSelectedNode(null);
                }}
                className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                Center Tree on {selectedNode.name}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeVisualization;
