import React, { useState, useRef, useCallback } from 'react';
import { Button, Flex, Text, View, Alert } from '@aws-amplify/ui-react';
import { Upload, X, Image, Video, FileText, Music } from 'lucide-react';
import mediaService from '../services/mediaService';


const MultiMediaUpload = ({ 
  onFilesChange, 
  acceptedTypes = ['image/*', 'video/*', 'audio/*', '.pdf', '.doc', '.docx', '.txt'],
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  maxFiles = 10,
  initialFiles = [],
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [previews, setPreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Get file type icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image size={24} />;
    if (fileType.startsWith('video/')) return <Video size={24} />;
    if (fileType.startsWith('audio/')) return <Music size={24} />;
    return <FileText size={24} />;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    const errors = [];
    
    // Check file size
    if (file.size > maxFileSize) {
      errors.push(`File "${file.name}" is too large. Maximum size is ${formatFileSize(maxFileSize)}.`);
    }
    
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''));
      }
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    });
    
    if (!isValidType) {
      errors.push(`File "${file.name}" is not a supported file type.`);
    }
    
    return { isValid: errors.length === 0, errors };
  };

  // Create preview for file
  const createPreview = async (file) => {
    const preview = {
      id: Math.random().toString(36).substring(2, 15),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null
    };

    // Generate preview for images and videos
    if (file.type.startsWith('image/')) {
      try {
        const previewUrl = await mediaService.generatePreview(file);
        preview.preview = previewUrl;
      } catch (error) {
        console.warn('Failed to generate image preview:', error);
      }
    } else if (file.type.startsWith('video/')) {
      try {
        const previewUrl = await mediaService.generateVideoThumbnail(file);
        preview.preview = previewUrl;
      } catch (error) {
        console.warn('Failed to generate video thumbnail:', error);
      }
    }

    return preview;
  };

  // Upload file
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

  // Process selected files
  const processFiles = async (fileList) => {
    const files = Array.from(fileList);
    const newErrors = [];
    
    // Check total files limit
    if (files.length + uploadedFiles.length > maxFiles) {
      newErrors.push(`You can only upload up to ${maxFiles} files total.`);
      setErrors(newErrors);
      return;
    }
    
    setIsUploading(true);
    setErrors([]);
    
    try {
      const validFiles = [];
      
      // Validate all files first
      for (const file of files) {
        const validation = validateFile(file);
        if (!validation.isValid) {
          newErrors.push(...validation.errors);
        } else {
          validFiles.push(file);
        }
      }
      
      if (newErrors.length > 0) {
        setErrors(newErrors);
        setIsUploading(false);
        return;
      }
      
      // Create previews for valid files
      const previewPromises = validFiles.map(createPreview);
      const newPreviews = await Promise.all(previewPromises);
      setPreviews(prev => [...prev, ...newPreviews]);
      
      // Upload files one by one
      const uploadResults = [];
      for (const file of validFiles) {
        try {
          const result = await uploadFile(file);
          uploadResults.push(result);
          
          // Remove preview and add to uploaded files
          setPreviews(prev => prev.filter(p => p.file.name !== file.name));
          setUploadedFiles(prev => {
            const updated = [...prev, result];
            onFilesChange?.(updated);
            return updated;
          });
        } catch (error) {
          newErrors.push(`Failed to upload "${file.name}": ${error.message}`);
        }
      }
      
      if (newErrors.length > 0) {
        setErrors(newErrors);
      }
      
    } catch (error) {
      console.error('Error processing files:', error);
      setErrors([error.message]);
    } finally {
      setIsUploading(false);
      setUploadProgress({});
    }
  };

  // Drag and drop handlers
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
      processFiles(files);
    }
  }, [uploadedFiles.length]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  // Remove uploaded file
  const removeUploadedFile = (fileId) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== fileId);
      onFilesChange?.(updated);
      return updated;
    });
  };

  // Remove preview
  const removePreview = (previewId) => {
    setPreviews(prev => prev.filter(p => p.id !== previewId));
  };

  const hasActiveUploads = Object.keys(uploadProgress).length > 0;
  const canUploadMore = uploadedFiles.length + previews.length < maxFiles;

  return (
    <div className={`multi-media-upload ${className}`}>
      {/* Upload Zone */}
      {canUploadMore && (
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
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          <div className="upload-content">
            <Upload size={48} className="upload-icon" />
            <Text variation="primary" fontSize="large" fontWeight="bold">
              Upload Media Files
            </Text>
            <Text color="neutral.60">
              Drag and drop files here, or click to select
            </Text>
            <Text fontSize="small" color="neutral.40">
              Supports: Images, Videos, Audio, Documents • Max: {formatFileSize(maxFileSize)} per file
            </Text>
            <Text fontSize="small" color="neutral.40">
              {uploadedFiles.length + previews.length}/{maxFiles} files
            </Text>
          </div>
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variation="error" className="upload-errors">
          <Text fontWeight="bold">Upload Errors:</Text>
          {errors.map((error, index) => (
            <Text key={index} fontSize="small">{error}</Text>
          ))}
        </Alert>
      )}

      {/* Upload Progress */}
      {hasActiveUploads && (
        <View className="upload-progress-section">
          <Text fontWeight="bold" marginBottom="small">Uploading...</Text>
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="progress-item">
              <Text fontSize="small" className="progress-filename">{fileName}</Text>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Text fontSize="small" className="progress-text">{progress}%</Text>
            </div>
          ))}
        </View>
      )}

      {/* Previews (files being processed) */}
      {previews.length > 0 && (
        <View className="preview-section">
          <Text fontWeight="bold" marginBottom="small">Processing...</Text>
          <div className="media-grid">
            {previews.map((preview) => (
              <div key={preview.id} className="media-item preview-item">
                <div className="media-content">
                  {preview.preview ? (
                    <img src={preview.preview} alt={preview.name} className="media-preview" />
                  ) : (
                    <div className="file-icon-container">
                      {getFileIcon(preview.type)}
                    </div>
                  )}
                  <div className="media-overlay">
                    <Button
                      size="small"
                      variation="primary"
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePreview(preview.id);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <div className="media-info">
                  <Text fontSize="small" className="media-name">{preview.name}</Text>
                  <Text fontSize="small" color="neutral.60">{formatFileSize(preview.size)}</Text>
                </div>
              </div>
            ))}
          </div>
        </View>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <View className="uploaded-section">
          <Flex justifyContent="space-between" alignItems="center" marginBottom="small">
            <Text fontWeight="bold">Attached Files ({uploadedFiles.length})</Text>
            {uploadedFiles.length >= maxFiles && (
              <Text fontSize="small" color="orange.60">Maximum files reached</Text>
            )}
          </Flex>
          <div className="media-grid">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="media-item uploaded-item">
                <div className="media-content">
                  {file.type?.startsWith('image/') && file.url ? (
                    <img src={file.url} alt={file.name} className="media-preview" />
                  ) : file.type?.startsWith('video/') && file.thumbnailUrl ? (
                    <img src={file.thumbnailUrl} alt={`${file.name} thumbnail`} className="media-preview" />
                  ) : (
                    <div className="file-icon-container">
                      {getFileIcon(file.type || 'application/octet-stream')}
                    </div>
                  )}
                  <div className="media-overlay">
                    <Button
                      size="small"
                      variation="destructive"
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeUploadedFile(file.id);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
                <div className="media-info">
                  <Text fontSize="small" className="media-name">{file.name}</Text>
                  <Text fontSize="small" color="neutral.60">{formatFileSize(file.size)}</Text>
                </div>
              </div>
            ))}
          </div>
        </View>
      )}
    </div>
  );
};

export default MultiMediaUpload;