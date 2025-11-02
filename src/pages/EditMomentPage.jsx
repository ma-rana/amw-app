import React, { useState, useEffect } from 'react';
import MultiMediaUpload from '../components/MultiMediaUpload';
import RichTextEditor from '../components/RichTextEditor';
import { useNotifications } from '../contexts/NotificationContext';

const EditMomentPage = ({ moment, onSave, onCancel }) => {
  const { sendMomentNotification } = useNotifications();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    tags: '',
    mediaFiles: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Initialize form data when moment prop changes
  useEffect(() => {
    if (moment) {
      setFormData({
        title: moment.title || '',
        description: moment.description || '',
        location: moment.location || '',
        tags: moment.tags ? moment.tags.join(', ') : '',
        mediaFiles: moment.mediaUrls ? moment.mediaUrls.map((url, index) => ({
          id: `existing-${index}`,
          url: url,
          name: `Media ${index + 1}`,
          type: url.includes('.mp4') || url.includes('.mov') ? 'video' : 'image'
        })) : []
      });
    }
  }, [moment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }));
  };

  const handleMediaChange = (files) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Convert tags string to array
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Get media URLs from uploaded files
      const mediaUrls = formData.mediaFiles.map(file => file.url);

      // Create updated moment object
      const updatedMoment = {
        ...moment,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        tags: tagsArray,
        mediaUrls: mediaUrls,
        updatedAt: new Date().toISOString()
      };

      // Call the onSave callback
      if (onSave) {
        await onSave(updatedMoment);
        
        // Send moment notification to other users
        sendMomentNotification(updatedMoment, 'updated');
      }

    } catch (error) {
      console.error('Error updating moment:', error);
      const errorMessage = error.message || 'Failed to update moment';
      setError(errorMessage);
      // Error notification is handled by App.jsx
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!moment) {
    return (
      <div className="page-container">
        <div className="alert alert-error">
          No moment selected for editing.
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Edit Moment</h1>
        <p className="page-subtitle">Update your special memory</p>
      </div>
      
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title" className="form-label">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Give your moment a title..."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Describe your moment... Use markdown for rich formatting!"
              height={250}
              preview="edit"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="location" className="form-label">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="form-input"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where did this happen?"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags" className="form-label">Tags</label>
            <input
              type="text"
              id="tags"
              name="tags"
              className="form-input"
              value={formData.tags}
              onChange={handleChange}
              placeholder="Add tags separated by commas (e.g., family, vacation, birthday)"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Media</label>
            <MultiMediaUpload
              onFilesChange={handleMediaChange}
              acceptedTypes={['image/*', 'video/*']}
              maxFiles={5}
              maxFileSize={50 * 1024 * 1024} // 50MB
              initialFiles={formData.mediaFiles}
            />
          </div>
          
          <div className="card-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Moment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMomentPage;