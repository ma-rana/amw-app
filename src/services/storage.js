/**
 * Mock S3 Storage Service
 * This service simulates AWS S3 storage functionality using localStorage
 */

// Initialize storage in localStorage if it doesn't exist
const initStorage = () => {
  if (!localStorage.getItem('amw_storage')) {
    localStorage.setItem('amw_storage', JSON.stringify({}));
  }
};

// Convert file to base64 for storage
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Generate a unique key for the file
const generateKey = (prefix, fileName) => {
  const timestamp = new Date().getTime();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split('.').pop();
  return `${prefix}/${timestamp}-${randomStr}.${extension}`;
};

// Store a file in mock S3
const uploadFile = async (file, prefix = 'uploads') => {
  try {
    initStorage();
    
    // Convert file to base64
    const base64Data = await fileToBase64(file);
    
    // Generate a unique key
    const key = generateKey(prefix, file.name);
    
    // Get current storage
    const storage = JSON.parse(localStorage.getItem('amw_storage'));
    
    // Add file to storage
    storage[key] = {
      data: base64Data,
      contentType: file.type,
      lastModified: new Date().toISOString()
    };
    
    // Update storage
    localStorage.setItem('amw_storage', JSON.stringify(storage));
    
    // Return the key (URL) to the stored file
    return key;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// Get a file from mock S3
const getFile = (key) => {
  try {
    initStorage();
    
    // Get current storage
    const storage = JSON.parse(localStorage.getItem('amw_storage'));
    
    // Return the file data
    return storage[key]?.data || null;
  } catch (error) {
    console.error('Error getting file:', error);
    return null;
  }
};

// Delete a file from mock S3
const deleteFile = (key) => {
  try {
    initStorage();
    
    // Get current storage
    const storage = JSON.parse(localStorage.getItem('amw_storage'));
    
    // Delete the file
    if (storage[key]) {
      delete storage[key];
      localStorage.setItem('amw_storage', JSON.stringify(storage));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// List all files in a prefix
const listFiles = (prefix = '') => {
  try {
    initStorage();
    
    // Get current storage
    const storage = JSON.parse(localStorage.getItem('amw_storage'));
    
    // Filter files by prefix
    const files = Object.keys(storage)
      .filter(key => key.startsWith(prefix))
      .map(key => ({
        key,
        lastModified: storage[key].lastModified,
        contentType: storage[key].contentType
      }));
    
    return files;
  } catch (error) {
    console.error('Error listing files:', error);
    return [];
  }
};

export default {
  uploadFile,
  getFile,
  deleteFile,
  listFiles
};