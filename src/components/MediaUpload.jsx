import React, { useState, useRef, useCallback } from 'react';
import mediaService from '../services/mediaService';

const MediaUpload = ({ 
  onUploadComplete, 
  onUploadError, 
  acceptedTypes = ['image/*', 'video/*'],
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  maxFiles: _maxFiles = 10,
  multiple = false,
  className = '',
  onFilesChange: _onFilesChange = () => {}
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previews, setPreviews] = useState([]);
  const [_uploadedFiles, _setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Validate file using media service
  const _validateFile = (file) => {
    return mediaService.validateFile(file, maxFileSize, acceptedTypes);
  };

  // Generate preview using media service
  const _generatePreview = (file) => {
    return mediaService.generatePreview(file);
  };

  const createPreview = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          id: Math.random().toString(36).substring(2, 15),
          file,
          preview: e.target.result,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name,
          size: file.size
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload file using media service
  const uploadFile = async (file) => {
    try {
      return await mediaService.uploadFile(file, 'moments', (progress) => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      onUploadError?.(new Error('Only one file is allowed'));
      return;
    }

    setIsUploading(true);

    try {
      // Create previews
      const previewPromises = fileArray.map(createPreview);
      const newPreviews = await Promise.all(previewPromises);
      setPreviews(prev => multiple ? [...prev, ...newPreviews] : newPreviews);

      // Upload files
      const uploadPromises = fileArray.map(uploadFile);
      const uploadResults = await Promise.all(uploadPromises);

      onUploadComplete?.(multiple ? uploadResults : uploadResults[0]);
    } catch (error) {
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, []);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const removePreview = (previewId) => {
    setPreviews(prev => prev.filter(p => p.id !== previewId));
  };

  // Format file size using media service
  const formatFileSize = (bytes) => {
    return mediaService.formatFileSize(bytes);
  };

  const hasActiveUploads = Object.keys(uploadProgress).length > 0;

  return (
    <div className={`media-upload ${className}`}>
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${isUploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7,10 12,15 17,10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <h3>Upload Media</h3>
          <p>Drag and drop files here, or click to select</p>
          <p className="upload-hint">
            Supports: {acceptedTypes.join(', ')} • Max size: {Math.round(maxFileSize / (1024 * 1024))}MB
          </p>
        </div>
      </div>

      {/* Upload Progress */}
      {hasActiveUploads && (
        <div className="upload-progress-section">
          <h4>Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="progress-item">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Previews */}
      {previews.length > 0 && (
        <div className="preview-section">
          <h4>Selected Files</h4>
          <div className="preview-grid">
            {previews.map((preview) => (
              <div key={preview.id} className="preview-item">
                <div className="preview-content">
                  {preview.type.startsWith('image/') ? (
                    <img src={preview.preview} alt={preview.name} />
                  ) : preview.type.startsWith('video/') ? (
                    preview.preview ? (
                      <img src={preview.preview} alt={`${preview.name} thumbnail`} />
                    ) : (
                      <video controls>
                        <source src={URL.createObjectURL(preview.file)} type={preview.type} />
                        Your browser does not support the video tag.
                      </video>
                    )
                  ) : (
                    <div className="file-icon">📄</div>
                  )}
                  <div className="preview-overlay">
                    <button
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(preview.id);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="preview-info">
                  <p className="preview-name">{preview.name}</p>
                  <p className="preview-size">{formatFileSize(preview.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUpload;