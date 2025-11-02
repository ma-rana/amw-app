import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Card,
  Flex,
  Button,
  CheckboxField,
  SearchField,
  Image,
  Badge,
  Divider
} from '@aws-amplify/ui-react';


const UserSelector = ({ 
  users = [], 
  selectedUserIds = [], 
  onSelectionChange, 
  onClose, 
  title = 'Select Users',
  maxSelections = null,
  showSearch = true 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedIds, setLocalSelectedIds] = useState(selectedUserIds);
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setLocalSelectedIds(selectedUserIds);
  }, [selectedUserIds]);

  useEffect(() => {
    const filtered = users.filter(user => {
      const fullName = `${user.name || ''} ${user.lastName || ''}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  const handleUserToggle = (userId) => {
    setLocalSelectedIds(prev => {
      const isSelected = prev.includes(userId);
      
      if (isSelected) {
        return prev.filter(id => id !== userId);
      } else {
        if (maxSelections && prev.length >= maxSelections) {
          return prev; // Don't add if max reached
        }
        return [...prev, userId];
      }
    });
  };

  const handleSelectAll = () => {
    const allUserIds = filteredUsers.map(user => user.id);
    setLocalSelectedIds(allUserIds);
  };

  const handleClearAll = () => {
    setLocalSelectedIds([]);
  };

  const handleSave = () => {
    onSelectionChange(localSelectedIds);
  };

  const handleCancel = () => {
    setLocalSelectedIds(selectedUserIds);
    onClose();
  };

  const getSelectedUsers = () => {
    return users.filter(user => localSelectedIds.includes(user.id));
  };

  return (
    <div className="user-selector-overlay">
      <div className="user-selector-modal">
        <Card>
          <View padding="large">
            {/* Header */}
            <Flex direction="row" justifyContent="space-between" alignItems="center" marginBottom="medium">
              <Text fontSize="large" fontWeight="bold">
                {title}
              </Text>
              <Button
                variation="link"
                onClick={onClose}
                size="small"
              >
                ✕
              </Button>
            </Flex>

            {/* Search */}
            {showSearch && (
              <SearchField
                label="Search users"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                marginBottom="medium"
              />
            )}

            {/* Selection Summary */}
            <Flex direction="row" justifyContent="space-between" alignItems="center" marginBottom="medium">
              <Text fontSize="small" color="neutral.60">
                {localSelectedIds.length} of {filteredUsers.length} users selected
                {maxSelections && ` (max: ${maxSelections})`}
              </Text>
              <Flex direction="row" gap="small">
                <Button
                  size="small"
                  variation="link"
                  onClick={handleSelectAll}
                  isDisabled={maxSelections && filteredUsers.length > maxSelections}
                >
                  Select All
                </Button>
                <Button
                  size="small"
                  variation="link"
                  onClick={handleClearAll}
                >
                  Clear All
                </Button>
              </Flex>
            </Flex>

            {/* Selected Users Preview */}
            {localSelectedIds.length > 0 && (
              <View marginBottom="medium">
                <Text fontSize="small" fontWeight="semibold" marginBottom="small">
                  Selected Users:
                </Text>
                <Flex direction="row" wrap="wrap" gap="small">
                  {getSelectedUsers().map(user => (
                    <Badge key={user.id} variation="info">
                      {user.name} {user.lastName}
                    </Badge>
                  ))}
                </Flex>
              </View>
            )}

            <Divider marginBottom="medium" />

            {/* User List */}
            <View className="user-list" maxHeight="400px" overflow="auto">
              {filteredUsers.length === 0 ? (
                <Text color="neutral.60" textAlign="center" padding="large">
                  {searchTerm ? 'No users found matching your search.' : 'No users available.'}
                </Text>
              ) : (
                filteredUsers.map(user => (
                  <div key={user.id} className="user-item">
                    <CheckboxField
                      label=""
                      value={user.id}
                      checked={localSelectedIds.includes(user.id)}
                      onChange={() => handleUserToggle(user.id)}
                      disabled={
                        maxSelections && 
                        !localSelectedIds.includes(user.id) && 
                        localSelectedIds.length >= maxSelections
                      }
                    />
                    <Flex direction="row" alignItems="center" gap="medium" flex="1">
                      {user.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={`${user.name} ${user.lastName}`}
                          width="40px"
                          height="40px"
                          borderRadius="50%"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {(user.name?.[0] || '?').toUpperCase()}
                        </div>
                      )}
                      <View flex="1">
                        <Text fontWeight="semibold">
                          {user.name} {user.lastName}
                        </Text>
                        {user.bio && (
                          <Text fontSize="small" color="neutral.60">
                            {user.bio.length > 50 ? `${user.bio.substring(0, 50)}...` : user.bio}
                          </Text>
                        )}
                      </View>
                    </Flex>
                  </div>
                ))
              )}
            </View>

            {/* Actions */}
            <Divider marginTop="medium" marginBottom="medium" />
            <Flex direction="row" justifyContent="flex-end" gap="medium">
              <Button
                variation="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variation="primary"
                onClick={handleSave}
              >
                Save Selection
              </Button>
            </Flex>
          </View>
        </Card>
      </div>
    </div>
  );
};

export default UserSelector;