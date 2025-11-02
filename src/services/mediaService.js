import { uploadData, getUrl } from 'aws-amplify/storage';

class MediaService {
  constructor() {
    this.supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    this.supportedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
    this.maxFileSize = 50 * 1024 * 1024; // 50MB default
  }

  /**
   * Validate file type and size
   */
  validateFile(file, maxSize = this.maxFileSize, acceptedTypes = null) {
    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${this.formatFileSize(maxSize)}`);
    }

    // Check file type
    if (acceptedTypes && acceptedTypes.length > 0) {
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          const baseType = type.split('/')[0];
          return file.type.startsWith(baseType + '/');
        }
        return file.type === type;
      });

      if (!isValidType) {
        errors.push(`File type ${file.type} is not supported`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate file preview
   */
  generatePreview(file) {
    return new Promise((resolve, reject) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Generate video thumbnail
   */
  generateVideoThumbnail(file) {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('video/')) {
        resolve(null);
        return;
      }

      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.onloadedmetadata = () => {
        // Set canvas size to video dimensions (with max width/height for performance)
        const maxSize = 300;
        const aspectRatio = video.videoWidth / video.videoHeight;
        
        if (video.videoWidth > video.videoHeight) {
          canvas.width = Math.min(maxSize, video.videoWidth);
          canvas.height = canvas.width / aspectRatio;
        } else {
          canvas.height = Math.min(maxSize, video.videoHeight);
          canvas.width = canvas.height * aspectRatio;
        }
        
        // Seek to 1 second for thumbnail (or 10% of duration if shorter)
        video.currentTime = Math.min(1, video.duration * 0.1);
      };
      
      video.onseeked = () => {
        try {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          URL.revokeObjectURL(video.src); // Clean up
          resolve(dataURL);
        } catch (error) {
          reject(error);
        }
      };
      
      video.onerror = (error) => {
        URL.revokeObjectURL(video.src); // Clean up
        reject(error);
      };
      
      video.src = URL.createObjectURL(file);
      video.load();
    });
  }

  /**
   * Upload file to S3
   */
  async uploadFile(file, folder = 'media', onProgress = null) {
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const key = `${folder}/${timestamp}_${sanitizedName}`;

      const result = await uploadData({
        key,
        data: file,
        options: {
          contentType: file.type,
          onProgress: (progress) => {
            if (onProgress) {
              const percent = Math.round((progress.transferredBytes / progress.totalBytes) * 100);
              onProgress(percent);
            }
          },
          metadata: {
            originalName: file.name,
            uploadedAt: new Date().toISOString(),
            fileSize: file.size.toString(),
            contentType: file.type
          }
        }
      }).result;

      // Get the public URL
      const urlResult = await getUrl({ key: result.key });
      
      return {
        key: result.key,
        url: urlResult.url.toString(),
        originalName: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }
  }

  /**
   * Upload multiple files
   */
  async uploadFiles(files, folder = 'media', onProgress = null) {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(files[i], folder, (progress) => {
          if (onProgress) {
            onProgress(i, progress, files[i].name);
          }
        });
        results.push(result);
      } catch (error) {
        errors.push({
          file: files[i].name,
          error: error.message
        });
      }
    }

    return { results, errors };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file type category
   */
  getFileCategory(file) {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'other';
  }

  /**
   * Check if file type is supported
   */
  isFileTypeSupported(file) {
    return this.supportedImageTypes.includes(file.type) || 
           this.supportedVideoTypes.includes(file.type);
  }

  /**
   * Get supported file types for input accept attribute
   */
  getSupportedTypes() {
    return [...this.supportedImageTypes, ...this.supportedVideoTypes].join(',');
  }
}

export default new MediaService();