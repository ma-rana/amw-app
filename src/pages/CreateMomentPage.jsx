import React, { useState, useRef } from 'react';
import MultiMediaUpload from '../components/MultiMediaUpload';
import RichTextEditor from '../components/RichTextEditor';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { X, Zap, Camera, MapPin, Tag, Users, Globe, Lock, ChevronLeft, ChevronRight, Sparkles, Eye } from 'lucide-react';

const CreateMomentPage = ({ onSave, onCancel }) => {
  const { showSuccess, showError, sendMomentNotification } = useNotifications();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    tags: '',
    mediaFiles: [],
    privacy: 'public',
    mood: '',
    quickShare: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const titleInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  const handleMediaChange = (files) => {
    setFormData(prev => ({
      ...prev,
      mediaFiles: files
    }));
  };

  const handleCameraCapture = () => {
    // Trigger the hidden camera input
    cameraInputRef.current?.click();
  };

  const handleCameraFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Convert FileList to array and add to existing media files
      const newFiles = Array.from(files);
      const currentFiles = formData.mediaFiles || [];
      
      // Create file objects with required properties for MultiMediaUpload
      const processedFiles = newFiles.map(file => ({
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        file: file
      }));
      
      // Add new files to existing ones
      const updatedFiles = [...currentFiles, ...processedFiles];
      handleMediaChange(updatedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleQuickShare = async () => {
    if (!formData.title.trim()) {
      titleInputRef.current?.focus();
      setError('Please add a title for your moment');
      return;
    }
    
    setFormData(prev => ({ ...prev, quickShare: true }));
    await handleSubmit();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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

      // Create moment object
      const newMoment = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        tags: tagsArray,
        mediaUrls: mediaUrls,
        privacy: formData.privacy,
        mood: formData.mood,
        createdAt: new Date().toISOString(),
        userId: user?.id || '1'
      };

      // Call the onSave callback
      if (onSave) {
        await onSave(newMoment);
        
        // Show success notification
        const message = formData.quickShare 
          ? 'Moment shared instantly! 🚀' 
          : 'Moment created successfully! ✨';
        showSuccess(message);
        
        // Send moment notification to other users
        sendMomentNotification(newMoment, 'new');
      }

    } catch (error) {
      console.error('Error creating moment:', error);
      const errorMessage = error.message || 'Failed to create moment';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const moods = [
    { emoji: '😊', label: 'Happy', value: 'happy' },
    { emoji: '😍', label: 'Excited', value: 'excited' },
    { emoji: '🥰', label: 'Loved', value: 'loved' },
    { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
    { emoji: '🤗', label: 'Grateful', value: 'grateful' },
    { emoji: '🎉', label: 'Celebrating', value: 'celebrating' },
    { emoji: '😎', label: 'Cool', value: 'cool' },
    { emoji: '🤔', label: 'Thoughtful', value: 'thoughtful' }
  ];

  const quickTags = [
    'family', 'friends', 'travel', 'food', 'nature', 'celebration', 
    'work', 'hobby', 'fitness', 'art', 'music', 'pets'
  ];

  const addQuickTag = (tag) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--color-background)' }}>
      {/* Background Effects */}
      <div className="absolute inset-0" style={{ background: 'var(--color-background-alt)', opacity: 0.5 }}></div>
      <div className="absolute inset-0" style={{ background: 'rgba(255, 255, 255, 0.02)' }}></div>
      
      {/* Header with progress */}
      <div className="relative z-10 p-6 border-b" style={{ background: 'var(--color-surface)', backdropFilter: 'blur(10px)', borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <button 
            onClick={onCancel} 
            className="group flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200"
            style={{ 
              background: 'var(--color-background-alt)', 
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-hover)';
              e.target.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-background-alt)';
              e.target.style.color = 'var(--color-text-secondary)';
            }}
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl border" style={{ background: 'var(--amw-primary-light)', borderColor: 'var(--amw-primary)' }}>
              <Camera className="w-6 h-6" style={{ color: 'var(--amw-primary)' }} />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
              Create Moment
            </h1>
          </div>
          
          <button 
            onClick={handleQuickShare}
            className="group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: 'var(--amw-success)', 
              color: 'white',
              border: '1px solid var(--amw-success)'
            }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.background = 'var(--amw-success-dark)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.background = 'var(--amw-success)';
              }
            }}
            disabled={isSubmitting || !formData.title.trim()}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            )}
            <span className="font-medium">Quick Share</span>
          </button>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mt-6">
          <div className={`flex items-center space-x-3 ${currentStep >= 1 ? 'text-blue-400' : 'text-slate-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              currentStep >= 1 
                ? 'bg-blue-500/20 border-blue-400 text-blue-400' 
                : 'border-slate-600 text-slate-500'
            }`}>
              <span className="text-sm font-medium">1</span>
            </div>
            <span className="text-sm font-medium">Content</span>
          </div>
          
          <div className={`w-12 h-0.5 ${currentStep >= 2 ? 'bg-blue-400' : 'bg-slate-600'} transition-colors duration-200`}></div>
          
          <div className={`flex items-center space-x-3 ${currentStep >= 2 ? 'text-blue-400' : 'text-slate-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              currentStep >= 2 
                ? 'bg-blue-500/20 border-blue-400 text-blue-400' 
                : 'border-slate-600 text-slate-500'
            }`}>
              <span className="text-sm font-medium">2</span>
            </div>
            <span className="text-sm font-medium">Media</span>
          </div>
          
          <div className={`w-12 h-0.5 ${currentStep >= 3 ? 'bg-blue-400' : 'bg-slate-600'} transition-colors duration-200`}></div>
          
          <div className={`flex items-center space-x-3 ${currentStep >= 3 ? 'text-blue-400' : 'text-slate-500'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
              currentStep >= 3 
                ? 'bg-blue-500/20 border-blue-400 text-blue-400' 
                : 'border-slate-600 text-slate-500'
            }`}>
              <span className="text-sm font-medium">3</span>
            </div>
            <span className="text-sm font-medium">Details</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="relative z-10 mx-6 mt-4">
          <div className="max-w-4xl mx-auto p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex items-center space-x-3 text-red-400">
              <div className="flex-shrink-0 w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-xs">⚠</span>
              </div>
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Step 1: Content */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <input
                      ref={titleInputRef}
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What's this moment about?"
                      className="w-full text-2xl font-bold bg-transparent border-none text-white placeholder-slate-400 focus:outline-none focus:ring-0 resize-none"
                      maxLength={100}
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-slate-400">{formData.title.length}/100</span>
                    </div>
                    <div className="h-px" style={{ background: 'var(--color-border)' }}></div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-slate-300">Tell your story</label>
                    <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl overflow-hidden">
                      <RichTextEditor
                         value={formData.description}
                         onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                         placeholder="Share the story behind this moment..."
                       />
                    </div>
                  </div>

                  {/* Mood Selector */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>How are you feeling?</label>
                    <div className="grid grid-cols-4 gap-3">
                      {moods.map((mood) => (
                        <button
                          key={mood.value}
                          type="button"
                          className="group flex flex-col items-center space-y-2 p-4 rounded-xl border transition-all duration-200"
                          style={{
                            background: formData.mood === mood.value ? 'var(--amw-primary-light)' : 'var(--color-background-alt)',
                            borderColor: formData.mood === mood.value ? 'var(--amw-primary)' : 'var(--color-border)',
                            color: formData.mood === mood.value ? 'var(--amw-primary)' : 'var(--color-text-secondary)'
                          }}
                          onMouseEnter={(e) => {
                            if (formData.mood !== mood.value) {
                              e.target.style.background = 'var(--color-hover)';
                              e.target.style.borderColor = 'var(--color-border-hover)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (formData.mood !== mood.value) {
                              e.target.style.background = 'var(--color-background-alt)';
                              e.target.style.borderColor = 'var(--color-border)';
                            }
                          }}
                          onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                        >
                          <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{mood.emoji}</span>
                          <span className="text-xs font-medium">{mood.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Media */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="rounded-2xl p-8 border" style={{ background: 'var(--color-surface)', backdropFilter: 'blur(10px)', borderColor: 'var(--color-border)' }}>
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center space-x-4">
                      <button
                        type="button"
                        onClick={handleCameraCapture}
                        className="p-3 rounded-xl border transition-all duration-200 cursor-pointer group"
                        style={{ 
                          background: 'var(--amw-primary-light)', 
                          borderColor: 'var(--amw-primary)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = 'var(--amw-primary)';
                          e.target.style.borderColor = 'var(--amw-primary-dark)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'var(--amw-primary-light)';
                          e.target.style.borderColor = 'var(--amw-primary)';
                        }}
                        title="Open Camera"
                      >
                        <Camera className="w-6 h-6 transition-colors duration-200" style={{ color: 'var(--amw-primary)' }} />
                      </button>
                      <h3 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Add Photos & Videos</h3>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Make your moment come alive with media or use the camera</p>
                  </div>
                  
                  {/* Hidden camera input */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*,video/*"
                    capture="environment"
                    multiple
                    onChange={handleCameraFileSelect}
                    style={{ display: 'none' }}
                  />
                  
                  <div className="bg-slate-800/50 border border-slate-600/50 rounded-xl overflow-hidden">
                    <MultiMediaUpload
                      onFilesChange={handleMediaChange}
                      acceptedTypes={['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt']}
                      maxFiles={10}
                      maxFileSize={50 * 1024 * 1024} // 50MB
                      initialFiles={formData.mediaFiles}
                    />
                  </div>
                  
                  {formData.mediaFiles.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-blue-400" />
                        <h4 className="text-sm font-medium text-slate-300">
                          Preview ({formData.mediaFiles.length} files)
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.mediaFiles.slice(0, 4).map((file, index) => (
                          <div key={index} className="group relative aspect-square bg-slate-800/50 border border-slate-600/50 rounded-xl overflow-hidden hover:border-slate-500/50 transition-colors duration-200">
                            {file.type?.startsWith('image/') ? (
                              <img 
                                src={file.url} 
                                alt={`Preview ${index + 1}`} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-4xl">
                                📹
                              </div>
                            )}
                          </div>
                        ))}
                        {formData.mediaFiles.length > 4 && (
                          <div className="flex items-center justify-center aspect-square bg-slate-800/50 border border-slate-600/50 rounded-xl text-slate-300">
                            <div className="text-center">
                              <div className="text-2xl font-bold">+{formData.mediaFiles.length - 4}</div>
                              <div className="text-xs">more</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                <div className="space-y-8">
                  {/* Location Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--amw-success-light)', border: '1px solid var(--amw-success)' }}>
                        <MapPin className="w-5 h-5" style={{ color: 'var(--amw-success)' }} />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Location</h3>
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Where did this happen?"
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-200"
                    />
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--amw-primary-light)', border: '1px solid var(--amw-primary)' }}>
                        <Tag className="w-5 h-5" style={{ color: 'var(--amw-primary)' }} />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Tags</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {quickTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => addQuickTag(tag)}
                            className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                            style={formData.tags.split(',').map(t => t.trim()).includes(tag) ? {
                              backgroundColor: 'var(--amw-primary)',
                              color: 'white',
                              border: '1px solid var(--amw-primary)'
                            } : {
                              backgroundColor: 'var(--color-surface)',
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-secondary)'
                            }}
                            onMouseEnter={(e) => {
                              if (!formData.tags.split(',').map(t => t.trim()).includes(tag)) {
                                e.target.style.borderColor = 'var(--amw-primary)';
                                e.target.style.color = 'var(--amw-primary)';
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!formData.tags.split(',').map(t => t.trim()).includes(tag)) {
                                e.target.style.borderColor = 'var(--color-border)';
                                e.target.style.color = 'var(--color-text-secondary)';
                              }
                            }}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                      
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="Add custom tags (comma separated)"
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Privacy Section */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--amw-secondary-light)', border: '1px solid var(--amw-secondary)' }}>
                        <Lock className="w-5 h-5" style={{ color: 'var(--amw-secondary)' }} />
                      </div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Privacy</h3>
                    </div>
                    
                    <div className="grid gap-3">
                      <label 
                        className="flex items-center space-x-4 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                        style={formData.privacy === 'public' ? {
                          backgroundColor: 'var(--amw-success-light)',
                          borderColor: 'var(--amw-success)'
                        } : {
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.privacy !== 'public') {
                            e.target.style.borderColor = 'var(--amw-success)';
                            e.target.style.backgroundColor = 'var(--amw-success-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.privacy !== 'public') {
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.backgroundColor = 'var(--color-surface)';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="public"
                          checked={formData.privacy === 'public'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="p-2 bg-green-500/20 rounded-lg">
                          <Globe className="w-5 h-5 text-green-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-white">Public</div>
                          <div className="text-sm text-slate-400">Everyone can see this moment</div>
                        </div>
                      </label>
                      
                      <label 
                        className="flex items-center space-x-4 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                        style={formData.privacy === 'family' ? {
                          backgroundColor: 'var(--amw-primary-light)',
                          borderColor: 'var(--amw-primary)'
                        } : {
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.privacy !== 'family') {
                            e.target.style.borderColor = 'var(--amw-primary)';
                            e.target.style.backgroundColor = 'var(--amw-primary-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.privacy !== 'family') {
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.backgroundColor = 'var(--color-surface)';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="family"
                          checked={formData.privacy === 'family'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-white">Family Only</div>
                          <div className="text-sm text-slate-400">Only family members can see</div>
                        </div>
                      </label>
                      
                      <label 
                        className="flex items-center space-x-4 p-4 rounded-xl border cursor-pointer transition-all duration-200"
                        style={formData.privacy === 'private' ? {
                          backgroundColor: 'var(--amw-secondary-light)',
                          borderColor: 'var(--amw-secondary)'
                        } : {
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)'
                        }}
                        onMouseEnter={(e) => {
                          if (formData.privacy !== 'private') {
                            e.target.style.borderColor = 'var(--amw-secondary)';
                            e.target.style.backgroundColor = 'var(--amw-secondary-light)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (formData.privacy !== 'private') {
                            e.target.style.borderColor = 'var(--color-border)';
                            e.target.style.backgroundColor = 'var(--color-surface)';
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name="privacy"
                          value="private"
                          checked={formData.privacy === 'private'}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <Lock className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-white">Private</div>
                          <div className="text-sm text-slate-400">Only you can see this moment</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="relative z-10 p-6 bg-slate-900/50 backdrop-blur-sm border-t border-slate-700/50">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {currentStep > 1 ? (
            <button 
              onClick={prevStep}
              className="group flex items-center space-x-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50 rounded-xl transition-all duration-200"
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Previous</span>
            </button>
          ) : (
            <div></div>
          )}
          
          <div className="flex items-center space-x-2 px-4 py-2 bg-slate-800/30 border border-slate-600/50 rounded-xl">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm font-medium text-slate-300">Step {currentStep} of 3</span>
          </div>
          
          {currentStep < 3 ? (
            <button 
              onClick={nextStep}
              className="group flex items-center space-x-2 px-6 py-3 text-white border rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--amw-primary)',
                borderColor: 'var(--amw-primary)'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--amw-primary-dark)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--amw-primary)';
                }
              }}
              disabled={currentStep === 1 && !formData.title.trim()}
            >
              <span className="font-medium">Next</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="group flex items-center space-x-2 px-6 py-3 text-white border rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--amw-success)',
                borderColor: 'var(--amw-success)'
              }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--amw-success-dark)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'var(--amw-success)';
                }
              }}
              disabled={isSubmitting || !formData.title.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="font-medium">Creating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium">Create Moment</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Preview Your Moment</h3>
              </div>
              <button 
                onClick={() => setShowPreview(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="text-center py-12">
                <div className="p-4 rounded-2xl inline-block mb-4" style={{ backgroundColor: 'var(--amw-primary)', border: '1px solid var(--amw-primary)' }}>
                  <Sparkles className="w-12 h-12 text-blue-400" />
                </div>
                <p className="text-slate-300 text-lg">Preview functionality coming soon!</p>
                <p className="text-slate-500 text-sm mt-2">We're working on bringing you an amazing preview experience.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMomentPage;