import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading, Image, Text, View } from '@aws-amplify/ui-react';
import { useAuth } from '../contexts/AuthContext';
import { getUrl } from 'aws-amplify/storage';

const MomentDetailPage = ({ moment, onBack, _onUpdate, onDelete, onEdit }) => {
  const { user, isAuthenticated } = useAuth();
  const [imageData, setImageData] = useState(null);
  
  const isOwner = user?.id === moment?.userId;
  
  // Load image from storage when component mounts
  useEffect(() => {
    const loadImage = async () => {
      // Only try to load from S3 if user is authenticated
      if (isAuthenticated && moment?.imageUrl && moment.imageUrl.startsWith('moments/')) {
        try {
          const { url } = await getUrl({ key: moment.imageUrl, options: { level: 'public' } });
          setImageData(url.toString());
        } catch (err) {
          console.error('Failed to load image from S3:', err);
          setImageData(null);
        }
      } else {
        setImageData(null);
      }
    };
    loadImage();
  }, [moment?.imageUrl, isAuthenticated]);
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(moment);
    }
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this moment? This action cannot be undone.')) {
      onDelete(moment.id);
    }
  };
  // If no moment is provided, show a placeholder
  if (!moment) {
    return (
      <View className="page-container">
        <Flex direction="column" alignItems="center" justifyContent="center" padding="2rem">
          <Heading level={3}>Moment not found</Heading>
          <Button variation="primary" onClick={onBack}>Back to Moments</Button>
        </Flex>
      </View>
    );
  }

  return (
    <View className="page-container moment-detail-page">
      <Flex direction="column" gap="1rem">
        <Button variation="link" onClick={onBack} className="back-button">
          &larr; Back to Moments
        </Button>
        
        <Heading level={2}>{moment.title}</Heading>
        
        <Flex className="moment-detail-content" direction={{ base: 'column', large: 'row' }} gap="2rem">
          <View className="moment-detail-image-container">
            <Image
              src={imageData || moment.imageUrl || 'https://placehold.co/600x400?text=Moment+Image'}
              alt={moment.title}
              className="moment-detail-image"
            />
          </View>
          
          <Flex direction="column" gap="1rem" className="moment-detail-info">
            <View className="moment-metadata">
              <Text className="moment-date">Created: {moment.date}</Text>
              <Text className="moment-author">By: {moment.author}</Text>
            </View>
            
            <View className="moment-description">
              <Heading level={4}>Description</Heading>
              <Text>{moment.description}</Text>
            </View>
            
            <View className="moment-location">
              <Heading level={4}>Location</Heading>
              <Text>{moment.location || 'No location specified'}</Text>
            </View>
            
            <View className="moment-tags">
              <Heading level={4}>Tags</Heading>
              <Flex wrap="wrap" gap="0.5rem">
                {moment.tags && moment.tags.map((tag, index) => (
                  <Text key={index} className="tag">#{tag}</Text>
                ))}
                {(!moment.tags || moment.tags.length === 0) && <Text>No tags</Text>}
              </Flex>
            </View>
            
            {isOwner && (
              <Flex gap="1rem" marginTop="1rem">
                <Button variation="primary" onClick={handleEdit}>Edit Moment</Button>
                <Button variation="destructive" onClick={handleDelete}>Delete Moment</Button>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </View>
  );
};

export default MomentDetailPage;