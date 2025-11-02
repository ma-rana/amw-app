import React, { useState, useEffect, useRef, useCallback } from 'react';
import API from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import {
  View,
  Text,
  Button,
  Card,
  Badge,
  Loader,
  Alert,
  SelectField,
  TextField,
  Flex,
  Divider,
  Icon
} from '@aws-amplify/ui-react';


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
  const [viewMode, setViewMode] = useState('tree'); // 'tree', 'network', 'list'
  const [centerUser, setCenterUser] = useState(null);
  const svgRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Relationship types with icons and colors
  const relationshipTypes = [
    { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧‍👦', color: '#3498db' },
    { value: 'child', label: 'Child', icon: '👶', color: '#e74c3c' },
    { value: 'spouse', label: 'Spouse/Partner', icon: '💑', color: '#e91e63' },
    { value: 'sibling', label: 'Sibling', icon: '👫', color: '#f39c12' },
    { value: 'grandparent', label: 'Grandparent', icon: '👴', color: '#9b59b6' },
    { value: 'grandchild', label: 'Grandchild', icon: '👶', color: '#ff9800' },
    { value: 'aunt_uncle', label: 'Aunt/Uncle', icon: '👨‍👩‍👧', color: '#4caf50' },
    { value: 'niece_nephew', label: 'Niece/Nephew', icon: '👧👦', color: '#00bcd4' },
    { value: 'cousin', label: 'Cousin', icon: '👥', color: '#795548' },
    { value: 'friend', label: 'Family Friend', icon: '🤝', color: '#607d8b' }
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
        const rect = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width: Math.max(800, rect.width - 40),
          height: Math.max(600, rect.height - 40)
        });
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
      
      // Set current user as center by default
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
    if (!centerUser || users.length === 0) return;

    const nodes = new Map();
    const links = [];

    // Create nodes for all users
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

    // Add relationships as links
    relationships.forEach(rel => {
      const sourceNode = nodes.get(rel.user?.id);
      const targetNode = nodes.get(rel.withUser);
      
      if (sourceNode && targetNode) {
        const relationshipType = relationshipTypes.find(rt => rt.value === rel.relation) || 
                                { value: rel.relation, label: rel.relation, icon: '👥', color: '#95a5a6' };
        
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

    // Calculate positions based on relationships
    calculateNodePositions(nodes, links, centerUser.id);

    setTreeData({
      nodes: Array.from(nodes.values()),
      links
    });
  }, [users, relationships, centerUser, relationshipTypes]);

  const calculateNodePositions = (nodes, links, centerId) => {
    const centerNode = nodes.get(centerId);
    if (!centerNode) return;

    // Set center position
    centerNode.x = dimensions.width / 2;
    centerNode.y = dimensions.height / 2;
    centerNode.level = 0;

    const visited = new Set([centerId]);
    const queue = [{ nodeId: centerId, level: 0 }];

    // BFS to assign levels
    while (queue.length > 0) {
      const { nodeId, level } = queue.shift();
      const _currentNode = nodes.get(nodeId);

      // Find connected nodes
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

    // Position nodes in concentric circles
    const levelGroups = new Map();
    nodes.forEach(node => {
      if (!levelGroups.has(node.level)) {
        levelGroups.set(node.level, []);
      }
      levelGroups.get(node.level).push(node);
    });

    levelGroups.forEach((nodesInLevel, level) => {
      if (level === 0) return; // Center node already positioned

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

  const handleDeleteRelationship = async (relationshipId) => {
    if (!window.confirm('Are you sure you want to remove this relationship?')) {
      return;
    }

    try {
      await API.deleteRelationship(relationshipId);
      await loadFamilyData();
    } catch (err) {
      setError('Failed to remove relationship');
      console.error('Error removing relationship:', err);
    }
  };

  const getRelationshipInfo = (relation) => {
    return relationshipTypes.find(rt => rt.value === relation) || 
           { value: relation, label: relation, icon: '👥', color: '#95a5a6' };
  };

  const renderTreeView = () => {
    if (!treeData) return null;

    return (
      <div className="tree-visualization">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="family-tree-svg"
        >
          {/* Render links */}
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
                  className="relationship-line"
                />
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2}
                  textAnchor="middle"
                  className="relationship-label"
                  fill={link.relationshipType.color}
                >
                  {link.relationshipType.icon}
                </text>
              </g>
            );
          })}

          {/* Render nodes */}
          {treeData.nodes.map(node => (
            <g key={node.id} className="tree-node">
              <circle
                cx={node.x}
                cy={node.y}
                r={node.isCenter ? 35 : 25}
                fill={node.isCenter ? '#3498db' : '#ecf0f1'}
                stroke={node.isCenter ? '#2980b9' : '#bdc3c7'}
                strokeWidth="2"
                className="node-circle"
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              />
              <text
                x={node.x}
                y={node.y - 40}
                textAnchor="middle"
                className="node-name"
                fill="#2c3e50"
              >
                {node.name}
              </text>
              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                className="node-initials"
                fill={node.isCenter ? 'white' : '#2c3e50'}
              >
                {node.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  };

  const renderNetworkView = () => {
    return (
      <div className="network-view">
        <div className="network-grid">
          {users.map(user => {
            const userRelationships = relationships.filter(rel => 
              rel.user?.id === user.id || rel.withUser === user.id
            );

            return (
              <Card key={user.id} className="network-card">
                <Flex direction="column" alignItems="center" gap="small">
                  <div className="user-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                      </div>
                    )}
                  </div>
                  
                  <Text fontWeight="bold">{user.name || user.email}</Text>
                  
                  <div className="user-relationships">
                    {userRelationships.map(rel => {
                      const relInfo = getRelationshipInfo(rel.relation);
                      const relatedUser = users.find(u => 
                        u.id === (rel.user?.id === user.id ? rel.withUser : rel.user?.id)
                      );
                      
                      return (
                        <Badge
                          key={rel.id}
                          backgroundColor={relInfo.color}
                          color="white"
                          size="small"
                        >
                          {relInfo.icon} {relInfo.label}
                          {relatedUser && ` (${relatedUser.name})`}
                        </Badge>
                      );
                    })}
                  </div>
                  
                  <Button
                    size="small"
                    onClick={() => setCenterUser(user)}
                  >
                    Center Tree
                  </Button>
                </Flex>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="list-view">
        {relationships.map(rel => {
          const relInfo = getRelationshipInfo(rel.relation);
          const sourceUser = users.find(u => u.id === rel.user?.id);
          const targetUser = users.find(u => u.id === rel.withUser);

          return (
            <Card key={rel.id} className="relationship-card">
              <Flex justifyContent="space-between" alignItems="center">
                <Flex alignItems="center" gap="medium">
                  <Badge backgroundColor={relInfo.color} color="white">
                    {relInfo.icon} {relInfo.label}
                  </Badge>
                  <Text>
                    <strong>{sourceUser?.name || 'Unknown'}</strong> → <strong>{targetUser?.name || 'Unknown'}</strong>
                  </Text>
                </Flex>
                
                <Button
                  size="small"
                  variation="destructive"
                  onClick={() => handleDeleteRelationship(rel.id)}
                >
                  Remove
                </Button>
              </Flex>
            </Card>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <View className="family-tree-container">
        <Flex direction="column" alignItems="center" gap="large">
          <Loader size="large" />
          <Text>Loading family tree...</Text>
        </Flex>
      </View>
    );
  }

  return (
    <View className="family-tree-container">
      {error && (
        <Alert variation="error" isDismissible onDismiss={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="family-tree-header">
        <Flex justifyContent="space-between" alignItems="center" wrap="wrap" gap="medium">
          <div>
            <Text fontSize="xl" fontWeight="bold">Family Tree Visualization</Text>
            <Text color="neutral.60">
              Explore your family connections and relationships
            </Text>
          </div>
          
          <Flex gap="small" wrap="wrap">
            <SelectField
              label="View Mode"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              size="small"
            >
              <option value="tree">Tree View</option>
              <option value="network">Network View</option>
              <option value="list">List View</option>
            </SelectField>
            
            <Button
              onClick={() => setShowAddRelationship(true)}
              size="small"
            >
              Add Relationship
            </Button>
          </Flex>
        </Flex>
      </div>

      <Divider />

      {centerUser && viewMode === 'tree' && (
        <div className="center-user-info">
          <Text fontSize="small" color="neutral.60">
            Centered on: <strong>{centerUser.name || centerUser.email}</strong>
          </Text>
        </div>
      )}

      <div className="family-tree-content">
        {viewMode === 'tree' && renderTreeView()}
        {viewMode === 'network' && renderNetworkView()}
        {viewMode === 'list' && renderListView()}
      </div>

      {/* Add Relationship Modal */}
      {showAddRelationship && (
        <div className="modal-overlay">
          <Card className="add-relationship-modal">
            <Text fontSize="large" fontWeight="bold">Add New Relationship</Text>
            
            <SelectField
              label="Select Family Member"
              value={newRelationship.withUser}
              onChange={(e) => setNewRelationship(prev => ({ ...prev, withUser: e.target.value }))}
            >
              <option value="">Choose a family member...</option>
              {users.filter(u => u.id !== currentUser?.id).map(user => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </SelectField>

            <SelectField
              label="Relationship Type"
              value={newRelationship.relation}
              onChange={(e) => setNewRelationship(prev => ({ ...prev, relation: e.target.value }))}
            >
              <option value="">Choose relationship...</option>
              {relationshipTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </SelectField>

            <Flex gap="small" justifyContent="flex-end">
              <Button
                onClick={() => setShowAddRelationship(false)}
                variation="link"
              >
                Cancel
              </Button>
              <Button onClick={handleAddRelationship}>
                Add Relationship
              </Button>
            </Flex>
          </Card>
        </div>
      )}

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="modal-overlay">
          <Card className="node-details-modal">
            <Flex justifyContent="space-between" alignItems="flex-start">
              <div>
                <Text fontSize="large" fontWeight="bold">{selectedNode.name}</Text>
                <Text color="neutral.60">{selectedNode.email}</Text>
              </div>
              <Button
                size="small"
                variation="link"
                onClick={() => setSelectedNode(null)}
              >
                ✕
              </Button>
            </Flex>

            <Divider />

            <div className="node-relationships">
              <Text fontWeight="bold">Relationships:</Text>
              {selectedNode.relationships.length > 0 ? (
                selectedNode.relationships.map((rel, index) => {
                  const relatedUser = users.find(u => u.id === rel.userId);
                  return (
                    <Flex key={index} alignItems="center" gap="small">
                      <Badge backgroundColor={rel.type.color} color="white">
                        {rel.type.icon} {rel.type.label}
                      </Badge>
                      <Text>{relatedUser?.name || 'Unknown User'}</Text>
                    </Flex>
                  );
                })
              ) : (
                <Text color="neutral.60">No relationships defined</Text>
              )}
            </div>

            <Button
              onClick={() => setCenterUser(selectedNode)}
              size="small"
            >
              Center Tree on {selectedNode.name}
            </Button>
          </Card>
        </div>
      )}
    </View>
  );
};

export default FamilyTreeVisualization;