import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUrl } from 'aws-amplify/storage';
import API from '../services/api';
import { ArrowLeft, Calendar, User, MapPin, Tag, Edit, Trash2, Loader2 } from 'lucide-react';
import MomentDetailView from '../components/MomentDetailView';

const MomentDetailPage = ({ moment: propMoment, onBack, onUpdate, onDelete, onEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [moment, setMoment] = useState(propMoment || null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(!propMoment);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If moment is passed as prop, use it directly
    if (propMoment) {
      setMoment(propMoment);
      setLoading(false);
      return;
    }

    const loadMoment = async () => {
      if (!id) {
        setError('No moment ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await API.getMoment(id);
        setMoment(data);
      } catch (err) {
        console.error('Error loading moment:', err);
        setError('Failed to load moment');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      loadMoment();
    }
  }, [id, isAuthenticated, propMoment]);

  // Load image from storage
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
    
    if (moment) {
      loadImage();
    }
  }, [moment?.imageUrl, isAuthenticated, moment]);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(moment);
    } else {
      navigate(`/edit-moment/${moment.id}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this moment? This action cannot be undone.')) {
      if (onDelete) {
        onDelete(moment.id);
      } else {
        try {
          await API.deleteMoment(moment.id);
          navigate('/moments');
        } catch (err) {
          console.error('Error deleting moment:', err);
          alert('Failed to delete moment');
        }
      }
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/moments');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading moment...</p>
        </div>
      </div>
    );
  }

  if (error || !moment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Moment Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'This moment could not be found.'}</p>
          <button
            onClick={() => navigate('/moments')}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Moments
          </button>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === moment?.userId;
  const displayImage = imageData || moment?.imageUrl || moment?.media?.imageUrl;
  const displayVideo = moment?.videoUrl || moment?.media?.videoUrl;

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-8 px-4 pb-24 lg:pb-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Moments</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
          {/* Image/Video Section */}
          {displayImage && (
            <div className="w-full aspect-video overflow-hidden bg-gray-100">
              <img
                src={displayImage}
                alt={moment.title || 'Moment'}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {displayVideo && (
            <div className="w-full aspect-video bg-gray-900">
              <video
                src={displayVideo}
                controls
                className="w-full h-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Content Section */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {moment.title || 'Untitled Moment'}
              </h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(moment.createdAt || moment.date)}</span>
                </div>
                {moment.author && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{moment.author}</span>
                  </div>
                )}
                {moment.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{moment.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {moment.description && (
              <div className="border-t-2 border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {moment.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {moment.tags && moment.tags.length > 0 && (
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Tags</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {moment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons (Owner Only) */}
            {isOwner && (
              <div className="border-t-2 border-gray-200 pt-6 flex flex-wrap gap-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Moment</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Delete Moment</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomentDetailPage;
