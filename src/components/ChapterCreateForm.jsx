import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';


const ChapterCreateForm = ({ onSubmit, onCancel, storyId }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 1 : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Chapter title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Chapter description is required';
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.order < 1) {
      newErrors.order = 'Order must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const chapterData = {
        ...formData,
        storyId: storyId || 'default',
        userId: user?.id || '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSubmit(chapterData);
      onCancel(); // Close the form after successful submission
    } catch (error) {
      console.error('Error creating chapter:', error);
      setErrors({ submit: 'Failed to create chapter. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chapter-create-form">
      <div className="form-group">
        <label htmlFor="title">Chapter Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter chapter title..."
          className={errors.title ? 'error' : ''}
          maxLength={100}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe this chapter..."
          rows={4}
          className={errors.description ? 'error' : ''}
          maxLength={500}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
        <small className="char-count">{formData.description.length}/500</small>
      </div>

      <div className="form-group">
        <label htmlFor="order">Chapter Order</label>
        <input
          type="number"
          id="order"
          name="order"
          value={formData.order}
          onChange={handleChange}
          min="1"
          className={errors.order ? 'error' : ''}
        />
        {errors.order && <span className="error-text">{errors.order}</span>}
        <small className="help-text">The order in which this chapter appears in the story</small>
      </div>

      {errors.submit && (
        <div className="error-message">
          {errors.submit}
        </div>
      )}

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="cancel-btn"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Chapter'}
        </button>
      </div>
    </form>
  );
};

export default ChapterCreateForm;