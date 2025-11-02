import React, { useState, useEffect } from 'react';
import { Card, Image, Text, Flex, Button, View, Badge } from '@aws-amplify/ui-react';
import { getUrl } from 'aws-amplify/storage';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './ShareModal';
import CommentSection from './Comment/CommentSection';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-markdown-preview/markdown.css';

const MomentDetailView = ({ 
  moment, 
  onEdit, 
  onDelete, 
  onClose, 
  story,
  showActions = true 
}) => {
  const [imageData, setImageData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadImage = async () => {
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this moment? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        if (onDelete) {
          await onDelete(moment);
        }
      } catch (_error) {
        console.error('Error deleting moment:', _error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (!moment) {
    return (
      <View className="moment-detail-empty">
        <Text>No moment selected</Text>
      </View>
    );
  }

  return (
    <div className="moment-detail-view">
      <Card
        variation="elevated"
        borderRadius="medium"
        padding="0"
        className="moment-detail-card"
      >
        {/* Header with close button */}
        {onClose && (
          <Flex 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            padding="medium"
            borderBottom="1px solid var(--amplify-colors-border-primary)"
          >
            <Text fontSize="large" fontWeight="bold">Moment Details</Text>
            <Button
              variation="link"
              size="small"
              onClick={onClose}
              style={{ fontSize: '20px', padding: '4px 8px' }}
            >
              ×
            </Button>
          </Flex>
        )}

        {/* Main image */}
        {(imageData || moment.imageUrl) && (
          <Image
            src={imageData || moment.imageUrl || 'https://placehold.co/600x400?text=Moment'}
            alt={moment.title}
            width="100%"
            height="300px"
            objectFit="cover"
          />
        )}

        {/* Content */}
        <View padding="large">
          {/* Title and date */}
          <Flex direction="column" gap="small" marginBottom="medium">
            <Text fontSize="xl" fontWeight="bold">{moment.title}</Text>
            <Text color="neutral.80" fontSize="small">
              {formatDate(moment.createdAt || moment.date)}
            </Text>
          </Flex>

          {/* Location */}
          {moment.location && (
            <Flex direction="row" alignItems="center" gap="small" marginBottom="medium">
              <Text fontSize="small" color="neutral.80">📍</Text>
              <Text fontSize="small" color="neutral.80">{moment.location}</Text>
            </Flex>
          )}

          {/* Tags */}
          {moment.tags && moment.tags.length > 0 && (
            <Flex direction="row" gap="small" marginBottom="medium" wrap="wrap">
              {moment.tags.map((tag, index) => (
                <Badge key={index} variation="info" size="small">
                  {tag}
                </Badge>
              ))}
            </Flex>
          )}

          {/* Rich text description */}
          {moment.description && (
            <View marginBottom="large">
              <Text fontSize="medium" fontWeight="semibold" marginBottom="small">
                Description
              </Text>
              <div className="moment-description">
                <MDEditor.Markdown 
                  source={moment.description} 
                  style={{ 
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>
            </View>
          )}

          {/* Media gallery */}
          {moment.mediaUrls && moment.mediaUrls.length > 0 && (
            <View marginBottom="large">
              <Text fontSize="medium" fontWeight="semibold" marginBottom="small">
                Media Attachments ({moment.mediaUrls.length})
              </Text>
              <Flex direction="column" gap="medium">
                {moment.mediaUrls.map((url, index) => {
                  const fileName = url.split('/').pop() || `media-${index + 1}`;
                  const fileExtension = fileName.split('.').pop()?.toLowerCase();
                  
                  // Determine media type
                  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExtension);
                  const isVideo = ['mp4', 'webm', 'ogg', 'mov', 'avi'].includes(fileExtension);
                  const isAudio = ['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(fileExtension);
                  const isDocument = ['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(fileExtension);

                  return (
                    <View key={index} padding="small" backgroundColor="neutral.10" borderRadius="small">
                      {isImage && (
                        <Image
                          src={url}
                          alt={`Media ${index + 1}`}
                          width="100%"
                          maxWidth="400px"
                          height="auto"
                          objectFit="contain"
                          borderRadius="small"
                          style={{ cursor: 'pointer' }}
                          onClick={() => window.open(url, '_blank')}
                        />
                      )}
                      
                      {isVideo && (
                        <View>
                          <video 
                            controls 
                            style={{ 
                              width: '100%', 
                              maxWidth: '400px', 
                              height: 'auto',
                              borderRadius: '4px'
                            }}
                          >
                            <source src={url} type={`video/${fileExtension}`} />
                            Your browser does not support the video tag.
                          </video>
                          <Text fontSize="small" color="neutral.80" marginTop="small">
                            📹 Video: {fileName}
                          </Text>
                        </View>
                      )}
                      
                      {isAudio && (
                        <View>
                          <Flex direction="row" alignItems="center" gap="small" marginBottom="small">
                            <Text fontSize="large">🎵</Text>
                            <View>
                              <Text fontSize="small" fontWeight="semibold">{fileName}</Text>
                              <Text fontSize="small" color="neutral.80">Audio File</Text>
                            </View>
                          </Flex>
                          <audio 
                            controls 
                            style={{ width: '100%', maxWidth: '400px' }}
                          >
                            <source src={url} type={`audio/${fileExtension}`} />
                            Your browser does not support the audio tag.
                          </audio>
                        </View>
                      )}
                      
                      {isDocument && (
                        <Flex direction="row" alignItems="center" justifyContent="space-between">
                          <Flex direction="row" alignItems="center" gap="small">
                            <Text fontSize="large">📄</Text>
                            <View>
                              <Text fontSize="small" fontWeight="semibold">{fileName}</Text>
                              <Text fontSize="small" color="neutral.80">
                                {fileExtension.toUpperCase()} Document
                              </Text>
                            </View>
                          </Flex>
                          <Button
                            variation="outline"
                            size="small"
                            onClick={() => window.open(url, '_blank')}
                          >
                            View
                          </Button>
                        </Flex>
                      )}
                      
                      {!isImage && !isVideo && !isAudio && !isDocument && (
                        <Flex direction="row" alignItems="center" justifyContent="space-between">
                          <Flex direction="row" alignItems="center" gap="small">
                            <Text fontSize="large">📎</Text>
                            <View>
                              <Text fontSize="small" fontWeight="semibold">{fileName}</Text>
                              <Text fontSize="small" color="neutral.80">File</Text>
                            </View>
                          </Flex>
                          <Button
                            variation="outline"
                            size="small"
                            onClick={() => window.open(url, '_blank')}
                          >
                            Download
                          </Button>
                        </Flex>
                      )}
                    </View>
                  );
                })}
              </Flex>
            </View>
          )}

          {/* Actions */}
          {showActions && (
            <Flex direction="row" gap="small" justifyContent="flex-end">
              <Button 
                variation="outline" 
                size="small"
                onClick={() => setShowShareModal(true)}
              >
                Share
              </Button>
              {onEdit && (
                <Button 
                  variation="primary" 
                  size="small"
                  onClick={() => onEdit(moment)}
                >
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  variation="destructive" 
                  size="small"
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                >
                  Delete
                </Button>
              )}
            </Flex>
          )}
        </View>
      </Card>

      {/* Comments Section */}
      <CommentSection momentId={moment.id} />

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          story={story}
          onClose={() => setShowShareModal(false)}
          shareType="moment"
          momentTitle={moment.title}
        />
      )}

      <style jsx>{`
        .moment-detail-view {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .moment-detail-card {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .moment-description {
          background-color: #f8f9fa;
          border-radius: 8px;
          padding: 16px;
          border: 1px solid #e9ecef;
        }
        
        .moment-description .w-md-editor-preview {
          background-color: transparent !important;
          padding: 0 !important;
        }
        
        .moment-description .w-md-editor-preview h1,
        .moment-description .w-md-editor-preview h2,
        .moment-description .w-md-editor-preview h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
        }
        
        .moment-description .w-md-editor-preview p {
          margin-bottom: 0.75rem;
        }
        
        .moment-description .w-md-editor-preview ul,
        .moment-description .w-md-editor-preview ol {
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        
        .moment-description .w-md-editor-preview blockquote {
          border-left: 4px solid #007bff;
          padding-left: 1rem;
          margin: 0.75rem 0;
          color: #6c757d;
          font-style: italic;
        }
        
        .moment-description .w-md-editor-preview code {
          background-color: #e9ecef;
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 0.875em;
        }
        
        .moment-description .w-md-editor-preview pre {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          padding: 0.75rem;
          overflow-x: auto;
        }
        
        .moment-detail-empty {
          text-align: center;
          padding: 2rem;
          color: #6c757d;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .moment-detail-view {
            margin: 0;
            padding: 0 1rem;
          }
          
          .moment-detail-card {
            border-radius: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MomentDetailView;