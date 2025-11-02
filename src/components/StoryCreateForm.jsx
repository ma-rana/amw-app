import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Tag, Image, Lock, Users, Globe } from 'lucide-react';


const StoryCreateForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: 'family',
    tags: '',
    imageUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      newErrors.title = 'Story title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Story description is required';
    }
    
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
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
      const storyData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        userId: user?.id || '1',
        userIds: [user?.id || '1'], // Include creator in the story
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        inviteCode: generateInviteCode()
      };
      
      await onSubmit(storyData);
      onCancel(); // Close the form after successful submission
    } catch (error) {
      console.error('Error creating story:', error);
      setErrors({ submit: 'Failed to create story. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 p-6 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
      <div className="space-y-2">
        <label htmlFor="title" className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <div className="p-1.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
            <BookOpen className="w-4 h-4 text-blue-400" />
          </div>
          <span>Story Title *</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter story title..."
          className={`w-full p-3 bg-slate-800/50 border ${errors.title ? 'border-red-500/50 focus:border-red-400' : 'border-slate-600/50 focus:border-blue-400'} rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
          maxLength={100}
        />
        {errors.title && <span className="text-red-400 text-sm flex items-center space-x-1">
          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
          <span>{errors.title}</span>
        </span>}
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <div className="p-1.5 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
            <BookOpen className="w-4 h-4 text-green-400" />
          </div>
          <span>Description *</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your story..."
          rows={4}
          className={`w-full p-3 bg-slate-800/50 border ${errors.description ? 'border-red-500/50 focus:border-red-400' : 'border-slate-600/50 focus:border-blue-400'} rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 resize-none`}
          maxLength={500}
        />
        <div className="flex items-center justify-between">
          {errors.description && <span className="text-red-400 text-sm flex items-center space-x-1">
            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
            <span>{errors.description}</span>
          </span>}
          <small className="text-slate-400 text-xs ml-auto">{formData.description.length}/500</small>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="privacy" className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <div className="p-1.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
            <Lock className="w-4 h-4 text-purple-400" />
          </div>
          <span>Privacy Setting</span>
        </label>
        <div className="relative">
          <select
            id="privacy"
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            className="w-full p-3 bg-slate-800/50 border border-slate-600/50 focus:border-blue-400 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="family" className="bg-slate-800 text-white">👨‍👩‍👧‍👦 Family Only</option>
            <option value="private" className="bg-slate-800 text-white">🔒 Private</option>
            <option value="public" className="bg-slate-800 text-white">🌍 Public</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="tags" className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <div className="p-1.5 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
            <Tag className="w-4 h-4 text-orange-400" />
          </div>
          <span>Tags (optional)</span>
        </label>
        <input
          type="text"
          id="tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas..."
          className="w-full p-3 bg-slate-800/50 border border-slate-600/50 focus:border-blue-400 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
        <small className="text-slate-400 text-xs">Separate multiple tags with commas</small>
      </div>

      <div className="space-y-2">
        <label htmlFor="imageUrl" className="flex items-center space-x-2 text-sm font-medium text-slate-300">
          <div className="p-1.5 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg border border-cyan-500/30">
            <Image className="w-4 h-4 text-cyan-400" />
          </div>
          <span>Cover Image URL (optional)</span>
        </label>
        <input
          type="url"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full p-3 bg-slate-800/50 border border-slate-600/50 focus:border-blue-400 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
        />
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <div className="flex items-center space-x-2 text-red-400">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-sm font-medium">{errors.submit}</span>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3 pt-4 border-t border-slate-700/30">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 group flex items-center justify-center space-x-2 p-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-200"
          disabled={isSubmitting}
        >
          <span className="font-medium">Cancel</span>
        </button>
        <button
          type="submit"
          className="flex-1 group flex items-center justify-center space-x-2 p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border border-blue-500/50 hover:border-blue-400/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="font-medium">Creating...</span>
            </>
          ) : (
            <>
              <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Create Story</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StoryCreateForm;