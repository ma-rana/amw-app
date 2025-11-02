import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Card,
  Flex,
  SelectField,
  SwitchField,
  Button,
  Divider,
  Badge,
  Alert,
  Loader
} from '@aws-amplify/ui-react';
import { API } from 'aws-amplify';
import { updateMoment, updateStory } from '../../graphql/mutations';
import { getMoment, getStory, listUsers } from '../../graphql/queries';
import { useAuth } from '../../contexts/AuthContext';
import UserSelector from './UserSelector';


const PrivacySettings = ({ 
  type = 'moment', // 'moment' or 'story'
  itemId,
  onSettingsChange,
  showAdvanced = true 
}) => {
  const { user: currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Privacy settings state
  const [settings, setSettings] = useState({
    visibility: type === 'moment' ? 'STORY_MEMBERS' : 'PRIVATE',
    allowComments: true,
    allowDownload: true,
    allowSharing: true,
    viewableByUserIds: [],
    restrictedUserIds: [],
    isPrivate: false,
    requiresApproval: false,
    // Story-specific settings
    isPublic: false,
    allowInvites: true,
    allowMemberInvites: false,
    requireApprovalToJoin: true,
    allowGuestViewing: false,
    defaultMomentVisibility: 'STORY_MEMBERS'
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [userSelectorType, setUserSelectorType] = useState('viewable'); // 'viewable' or 'restricted'

  const visibilityOptions = type === 'moment' 
    ? [
        { value: 'PUBLIC', label: 'Public - Anyone can see' },
        { value: 'FAMILY_ONLY', label: 'Family Only - Family members only' },
        { value: 'STORY_MEMBERS', label: 'Story Members - Members of this story' },
        { value: 'SELECTED_USERS', label: 'Selected Users - Choose specific users' },
        { value: 'PRIVATE', label: 'Private - Only you can see' }
      ]
    : [
        { value: 'PUBLIC', label: 'Public - Anyone can find and join' },
        { value: 'INVITE_ONLY', label: 'Invite Only - Requires invitation' },
        { value: 'FAMILY_ONLY', label: 'Family Only - Family members only' },
        { value: 'PRIVATE', label: 'Private - Hidden from search' }
      ];

  useEffect(() => {
    loadSettings();
    loadAvailableUsers();
  }, [itemId, type]);

  const loadSettings = async () => {
    if (!itemId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const query = type === 'moment' ? getMoment : getStory;
      const result = await API.graphql({
        query,
        variables: { id: itemId }
      });
      
      const item = result.data[type === 'moment' ? 'getMoment' : 'getStory'];
      
      if (item) {
        setSettings(prevSettings => ({
          ...prevSettings,
          visibility: item.visibility || prevSettings.visibility,
          allowComments: item.allowComments !== undefined ? item.allowComments : prevSettings.allowComments,
          allowDownload: item.allowDownload !== undefined ? item.allowDownload : prevSettings.allowDownload,
          allowSharing: item.allowSharing !== undefined ? item.allowSharing : prevSettings.allowSharing,
          viewableByUserIds: item.viewableByUserIds || [],
          restrictedUserIds: item.restrictedUserIds || [],
          isPrivate: item.isPrivate || false,
          requiresApproval: item.requiresApproval || false,
          // Story-specific
          isPublic: item.isPublic || false,
          allowInvites: item.allowInvites !== undefined ? item.allowInvites : prevSettings.allowInvites,
          allowMemberInvites: item.allowMemberInvites || false,
          requireApprovalToJoin: item.requireApprovalToJoin !== undefined ? item.requireApprovalToJoin : prevSettings.requireApprovalToJoin,
          allowGuestViewing: item.allowGuestViewing || false,
          defaultMomentVisibility: item.defaultMomentVisibility || 'STORY_MEMBERS'
        }));
      }
    } catch (err) {
      console.error('Error loading privacy settings:', err);
      setError('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableUsers = async () => {
    try {
      const result = await API.graphql({ query: listUsers });
      const users = result.data.listUsers.items.filter(user => user.id !== currentUser?.id);
      setAvailableUsers(users);
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value };
      
      // Auto-adjust related settings
      if (key === 'visibility') {
        if (value === 'PRIVATE') {
          newSettings.isPrivate = true;
          newSettings.viewableByUserIds = [];
        } else if (value === 'SELECTED_USERS') {
          newSettings.isPrivate = false;
          setShowUserSelector(true);
          setUserSelectorType('viewable');
        } else {
          newSettings.isPrivate = false;
        }
      }
      
      return newSettings;
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const mutation = type === 'moment' ? updateMoment : updateStory;
      const input = {
        id: itemId,
        ...settings
      };
      
      await API.graphql({
        query: mutation,
        variables: { input }
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      if (onSettingsChange) {
        onSettingsChange(settings);
      }
    } catch (err) {
      console.error('Error saving privacy settings:', err);
      setError('Failed to save privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const handleUserSelection = (selectedUserIds) => {
    if (userSelectorType === 'viewable') {
      setSettings(prev => ({ ...prev, viewableByUserIds: selectedUserIds }));
    } else {
      setSettings(prev => ({ ...prev, restrictedUserIds: selectedUserIds }));
    }
    setShowUserSelector(false);
  };

  const getSelectedUsers = (userIds) => {
    return availableUsers.filter(user => userIds.includes(user.id));
  };

  if (loading) {
    return (
      <Card>
        <Flex direction="column" alignItems="center" padding="large">
          <Loader size="large" />
          <Text>Loading privacy settings...</Text>
        </Flex>
      </Card>
    );
  }

  return (
    <div className="privacy-settings">
      <Card>
        <View padding="large">
          <Text fontSize="large" fontWeight="bold" marginBottom="medium">
            Privacy Settings
          </Text>
          
          {error && (
            <Alert variation="error" marginBottom="medium">
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variation="success" marginBottom="medium">
              Privacy settings saved successfully!
            </Alert>
          )}

          {/* Visibility Setting */}
          <SelectField
            label="Visibility"
            value={settings.visibility}
            onChange={(e) => handleSettingChange('visibility', e.target.value)}
            marginBottom="medium"
          >
            {visibilityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>

          {/* Selected Users Display */}
          {settings.visibility === 'SELECTED_USERS' && (
            <View marginBottom="medium">
              <Text fontSize="medium" fontWeight="semibold" marginBottom="small">
                Viewable by Selected Users
              </Text>
              <Flex direction="row" wrap="wrap" gap="small" marginBottom="small">
                {getSelectedUsers(settings.viewableByUserIds).map(user => (
                  <Badge key={user.id} variation="info">
                    {user.name} {user.lastName}
                  </Badge>
                ))}
                {settings.viewableByUserIds.length === 0 && (
                  <Text color="neutral.60">No users selected</Text>
                )}
              </Flex>
              <Button
                size="small"
                onClick={() => {
                  setUserSelectorType('viewable');
                  setShowUserSelector(true);
                }}
              >
                Select Users
              </Button>
            </View>
          )}

          {type === 'moment' && (
            <>
              <Divider marginTop="medium" marginBottom="medium" />
              
              {/* Moment-specific settings */}
              <Text fontSize="medium" fontWeight="semibold" marginBottom="medium">
                Interaction Settings
              </Text>
              
              <SwitchField
                label="Allow Comments"
                isChecked={settings.allowComments}
                onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                marginBottom="small"
              />
              
              <SwitchField
                label="Allow Download"
                isChecked={settings.allowDownload}
                onChange={(e) => handleSettingChange('allowDownload', e.target.checked)}
                marginBottom="small"
              />
              
              <SwitchField
                label="Allow Sharing"
                isChecked={settings.allowSharing}
                onChange={(e) => handleSettingChange('allowSharing', e.target.checked)}
                marginBottom="small"
              />
              
              {showAdvanced && (
                <>
                  <SwitchField
                    label="Requires Approval to View"
                    isChecked={settings.requiresApproval}
                    onChange={(e) => handleSettingChange('requiresApproval', e.target.checked)}
                    marginBottom="small"
                  />
                </>
              )}
            </>
          )}

          {type === 'story' && (
            <>
              <Divider marginTop="medium" marginBottom="medium" />
              
              {/* Story-specific settings */}
              <Text fontSize="medium" fontWeight="semibold" marginBottom="medium">
                Story Settings
              </Text>
              
              <SwitchField
                label="Allow Invitations"
                isChecked={settings.allowInvites}
                onChange={(e) => handleSettingChange('allowInvites', e.target.checked)}
                marginBottom="small"
              />
              
              <SwitchField
                label="Allow Members to Invite Others"
                isChecked={settings.allowMemberInvites}
                onChange={(e) => handleSettingChange('allowMemberInvites', e.target.checked)}
                marginBottom="small"
              />
              
              <SwitchField
                label="Require Approval to Join"
                isChecked={settings.requireApprovalToJoin}
                onChange={(e) => handleSettingChange('requireApprovalToJoin', e.target.checked)}
                marginBottom="small"
              />
              
              <SwitchField
                label="Allow Guest Viewing"
                isChecked={settings.allowGuestViewing}
                onChange={(e) => handleSettingChange('allowGuestViewing', e.target.checked)}
                marginBottom="small"
              />

              <SelectField
                label="Default Moment Visibility"
                value={settings.defaultMomentVisibility}
                onChange={(e) => handleSettingChange('defaultMomentVisibility', e.target.value)}
                marginBottom="medium"
              >
                <option value="PUBLIC">Public</option>
                <option value="FAMILY_ONLY">Family Only</option>
                <option value="STORY_MEMBERS">Story Members</option>
                <option value="PRIVATE">Private</option>
              </SelectField>
            </>
          )}

          {showAdvanced && (
            <>
              <Divider marginTop="medium" marginBottom="medium" />
              
              {/* Restricted Users */}
              <View marginBottom="medium">
                <Text fontSize="medium" fontWeight="semibold" marginBottom="small">
                  Restricted Users
                </Text>
                <Text fontSize="small" color="neutral.60" marginBottom="small">
                  These users will not be able to see this {type}
                </Text>
                <Flex direction="row" wrap="wrap" gap="small" marginBottom="small">
                  {getSelectedUsers(settings.restrictedUserIds).map(user => (
                    <Badge key={user.id} variation="warning">
                      {user.name} {user.lastName}
                    </Badge>
                  ))}
                  {settings.restrictedUserIds.length === 0 && (
                    <Text color="neutral.60">No restricted users</Text>
                  )}
                </Flex>
                <Button
                  size="small"
                  variation="outline"
                  onClick={() => {
                    setUserSelectorType('restricted');
                    setShowUserSelector(true);
                  }}
                >
                  Manage Restricted Users
                </Button>
              </View>
            </>
          )}

          <Divider marginTop="medium" marginBottom="medium" />
          
          <Flex direction="row" justifyContent="flex-end" gap="small">
            <Button
              variation="primary"
              onClick={handleSave}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Settings
            </Button>
          </Flex>
        </View>
      </Card>

      {/* User Selector Modal */}
      {showUserSelector && (
        <UserSelector
          users={availableUsers}
          selectedUserIds={
            userSelectorType === 'viewable' 
              ? settings.viewableByUserIds 
              : settings.restrictedUserIds
          }
          onSelectionChange={handleUserSelection}
          onClose={() => setShowUserSelector(false)}
          title={
            userSelectorType === 'viewable' 
              ? 'Select Users Who Can View' 
              : 'Select Restricted Users'
          }
        />
      )}
    </div>
  );
};

export default PrivacySettings;