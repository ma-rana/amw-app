import React, { useState, useEffect } from 'react';
import { getUrl } from 'aws-amplify/storage';
import { useAuth } from '../contexts/AuthContext';
import ShareModal from './ShareModal';

const MomentCard = ({ title, imageUrl, date, onClick, moment, story }) => {
  const [imageData, setImageData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Get media info for display
  const mediaUrls = moment?.mediaUrls || [];
  const hasMultipleMedia = mediaUrls.length > 1;
  const primaryMediaUrl = mediaUrls.length > 0 ? mediaUrls[0] : (imageData || imageUrl);
  
  // Determine if primary media is an image
  const isPrimaryImage = () => {
    if (!primaryMediaUrl) return true; // Default to image placeholder
    const extension = primaryMediaUrl.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension);
  };
  
  useEffect(() => {
    const loadImage = async () => {
      // Load primary media from S3 if authenticated
      if (isAuthenticated && primaryMediaUrl && primaryMediaUrl.startsWith('moments/')) {
        try {
          const { url } = await getUrl({ key: primaryMediaUrl, options: { level: 'public' } });
          setImageData(url.toString());
        } catch (err) {
          console.error('Failed to load media from S3:', err);
          setImageData(null);
        }
      } else {
        setImageData(null);
      }
    };
    loadImage();
  }, [primaryMediaUrl, isAuthenticated]);
  const canShare = moment?.allowSharing !== false;

  return (
    <div className="card group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="relative overflow-hidden rounded-t-lg">
        {isPrimaryImage() ? (
          <img
            src={imageData || primaryMediaUrl || 'https://placehold.co/300x200?text=Moment'}
            alt={title}
            className="w-full h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-56 md:h-64 flex flex-col items-center justify-center" style={{ backgroundColor: 'var(--color-background-alt)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: 'var(--color-hover)' }}>
              <span className="text-2xl">📎</span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              Media File
            </p>
          </div>
        )}
        
        {/* Media counter overlay */}
        {hasMultipleMedia && (
          <div className="absolute top-3 right-3 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
            +{mediaUrls.length - 1} more
          </div>
        )}
        
        {/* Hover overlay for better text readability */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}></div>
      </div>
      
      <div className="card-content">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-gray-500 font-medium">
            {date}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="btn btn-primary flex-1 text-sm font-medium"
            onClick={onClick}
          >
            View Details
          </button>
          {canShare && (
            <button 
              className="btn btn-outline text-sm font-medium px-4"
              onClick={() => setShowShareModal(true)}
            >
              Share
            </button>
          )}
        </div>
      </div>
      
      {showShareModal && (
        <ShareModal
          story={story}
          moment={moment}
          onClose={() => setShowShareModal(false)}
          shareType="moment"
          momentTitle={title}
        />
      )}
    </div>
  );
};

export default MomentCard;
