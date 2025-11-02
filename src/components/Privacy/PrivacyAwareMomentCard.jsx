import React, { useState, useEffect } from 'react';
import {
  Card,
  Image,
  Text,
  Button,
  Flex,
  Badge,
  Icon,
  Loader,
  Alert
} from '@aws-amplify/ui-react';
import { usePrivacy } from '../../contexts/PrivacyContext';
import { useAuth } from '../../contexts/AuthContext';
import PrivacySettings from './PrivacySettings';


const PrivacyAwareMomentCard = ({ 
  moment, 
  onView, 
  onEdit, 
  onDelete, 
  onShare,
  onDownload,
  showPrivacySettings = false 
}) => {
  const { user } = useAuth();
  const {
    canViewMoment,
    canCommentOnMoment,
    canDownloadMoment,
    canShareMoment,
    getMomentPrivacy
  } = usePrivacy();

  const [privacySettings, setPrivacySettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrivacySettings();
  }, [moment.id]);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const settings = await getMomentPrivacy(moment.id);
      setPrivacySettings(settings);
    } catch (err) {
      console.error('Error loading privacy settings:', err);
      setError('Failed to load privacy settings');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can view this moment
  const canView = canViewMoment(moment);
  const canComment = canCommentOnMoment(moment);
  const canDownload = canDownloadMoment(moment);
  const canShare = canShareMoment(moment);
  const isOwner = user && moment.userId === user.userId;

  // If user can't view the moment, show restricted access message
  if (!canView) {
    return (
      <Card className="privacy-aware-moment-card restricted">
        <Flex direction="column" alignItems="center" padding="2rem">
          <Icon name="lock" size="large" color="var(--amplify-colors-neutral-60)" />
          <Text variation="primary" fontSize="1.1rem" fontWeight="600" marginTop="1rem">
            Private Moment
          </Text>
          <Text variation="secondary" textAlign="center" marginTop="0.5rem">
            You don't have permission to view this moment.
          </Text>
        </Flex>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="privacy-aware-moment-card loading">
        <Flex justifyContent="center" padding="2rem">
          <Loader size="large" />
        </Flex>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="privacy-aware-moment-card error">
        <Alert variation="error" hasIcon>
          {error}
        </Alert>
      </Card>
    );
  }

  const getVisibilityBadge = () => {
    if (!privacySettings) return null;

    const visibilityConfig = {
      PUBLIC: { color: 'success', text: 'Public' },
      FAMILY_ONLY: { color: 'info', text: 'Family Only' },
      SELECTED_USERS: { color: 'warning', text: 'Selected Users' },
      PRIVATE: { color: 'error', text: 'Private' },
      STORY_MEMBERS: { color: 'info', text: 'Story Members' }
    };

    const config = visibilityConfig[privacySettings.visibility] || { color: 'neutral', text: 'Unknown' };

    return (
      <Badge variation={config.color} size="small">
        {config.text}
      </Badge>
    );
  };

  const handlePrivacySettingsUpdate = (newSettings) => {
    setPrivacySettings(newSettings);
    setShowSettings(false);
  };

  return (
    <>
      <Card className="privacy-aware-moment-card">
        {/* Header with title and privacy badge */}
        <Flex justifyContent="space-between" alignItems="center" marginBottom="1rem">
          <Text variation="primary" fontSize="1.2rem" fontWeight="600">
            {moment.title}
          </Text>
          <Flex alignItems="center" gap="0.5rem">
            {getVisibilityBadge()}
            {isOwner && showPrivacySettings && (
              <Button
                variation="link"
                size="small"
                onClick={() => setShowSettings(true)}
              >
                <Icon name="settings" />
              </Button>
            )}
          </Flex>
        </Flex>

        {/* Moment content */}
        {moment.media && moment.media.imageUrl && (
          <Image
            src={moment.media.imageUrl}
            alt={moment.title}
            className="moment-image"
            onClick={() => onView && onView(moment)}
          />
        )}

        {moment.description && (
          <Text variation="secondary" marginTop="1rem">
            {moment.description}
          </Text>
        )}

        {/* Privacy restrictions notice */}
        {privacySettings && (
          <Flex direction="column" gap="0.5rem" marginTop="1rem">
            {!canComment && (
              <Alert variation="info" hasIcon={false} size="small">
                Comments are disabled for this moment
              </Alert>
            )}
            {!canDownload && (
              <Alert variation="info" hasIcon={false} size="small">
                Downloads are disabled for this moment
              </Alert>
            )}
            {!canShare && (
              <Alert variation="info" hasIcon={false} size="small">
                Sharing is disabled for this moment
              </Alert>
            )}
          </Flex>
        )}

        {/* Action buttons */}
        <Flex justifyContent="space-between" alignItems="center" marginTop="1.5rem">
          <Flex gap="0.5rem">
            <Button
              variation="primary"
              size="small"
              onClick={() => onView && onView(moment)}
            >
              View
            </Button>
            
            {canComment && (
              <Button
                variation="outline"
                size="small"
                onClick={() => onView && onView(moment, 'comments')}
              >
                <Icon name="comment" />
                Comment
              </Button>
            )}
          </Flex>

          <Flex gap="0.5rem">
            {canShare && onShare && (
              <Button
                variation="link"
                size="small"
                onClick={() => onShare(moment)}
              >
                <Icon name="share" />
              </Button>
            )}
            
            {canDownload && onDownload && (
              <Button
                variation="link"
                size="small"
                onClick={() => onDownload(moment)}
              >
                <Icon name="download" />
              </Button>
            )}
            
            {isOwner && onEdit && (
              <Button
                variation="link"
                size="small"
                onClick={() => onEdit(moment)}
              >
                <Icon name="edit" />
              </Button>
            )}
            
            {isOwner && onDelete && (
              <Button
                variation="link"
                size="small"
                colorTheme="error"
                onClick={() => onDelete(moment)}
              >
                <Icon name="delete" />
              </Button>
            )}
          </Flex>
        </Flex>

        {/* Metadata */}
        <Flex justifyContent="space-between" alignItems="center" marginTop="1rem">
          <Text variation="tertiary" fontSize="0.85rem">
            {moment.user?.name || 'Unknown User'}
          </Text>
          <Text variation="tertiary" fontSize="0.85rem">
            {new Date(moment.timestamp || moment.createdAt).toLocaleDateString()}
          </Text>
        </Flex>
      </Card>

      {/* Privacy Settings Modal */}
      {showSettings && (
        <PrivacySettings
          type="moment"
          itemId={moment.id}
          currentSettings={privacySettings}
          onSave={handlePrivacySettingsUpdate}
          onCancel={() => setShowSettings(false)}
        />
      )}
    </>
  );
};

export default PrivacyAwareMomentCard;