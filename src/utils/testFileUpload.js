// Test script for AWS S3 File Upload functionality
import { uploadData, getUrl, list } from 'aws-amplify/storage';

// Create a test file blob
const createTestFile = (name = 'test-image.jpg', type = 'image/jpeg', size = 1024) => {
  // Create a simple test image data (1x1 pixel JPEG)
  const testImageData = new Uint8Array([
    0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
    0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
    0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
    0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
    0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
    0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
    0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
    0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
    0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
    0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0xB2, 0xC0,
    0x07, 0xFF, 0xD9
  ]);
  
  return new File([testImageData], name, { type });
};

// Test S3 upload functionality
export const testS3Upload = async () => {
  console.log('📁 Testing AWS S3 file upload...');
  
  try {
    // Create a test file
    const testFile = createTestFile('test-upload.jpg', 'image/jpeg');
    console.log('📄 Created test file:', testFile.name, testFile.size, 'bytes');
    
    // Generate unique key
    const timestamp = Date.now();
    const key = `test-uploads/${timestamp}_${testFile.name}`;
    
    console.log('⬆️ Uploading to S3 with key:', key);
    
    // Upload to S3
    const uploadResult = await uploadData({
      key,
      data: testFile,
      options: {
        contentType: testFile.type,
        metadata: {
          originalName: testFile.name,
          uploadedAt: new Date().toISOString(),
          testUpload: 'true'
        }
      }
    }).result;
    
    console.log('✅ Upload successful:', uploadResult);
    
    // Get the public URL
    const urlResult = await getUrl({ key: uploadResult.key });
    console.log('🔗 File URL:', urlResult.url.toString());
    
    return {
      success: true,
      key: uploadResult.key,
      url: urlResult.url.toString(),
      file: testFile
    };
    
  } catch (error) {
    console.error('❌ S3 upload failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test listing files in S3
export const testS3List = async () => {
  console.log('📋 Testing AWS S3 file listing...');
  
  try {
    const listResult = await list({
      prefix: 'test-uploads/',
      options: {
        listAll: true
      }
    });
    
    console.log('✅ S3 listing successful:', listResult);
    console.log('📁 Found', listResult.items.length, 'files in test-uploads/');
    
    listResult.items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.key} (${item.size} bytes, modified: ${item.lastModified})`);
    });
    
    return {
      success: true,
      items: listResult.items
    };
    
  } catch (error) {
    console.error('❌ S3 listing failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Test S3 configuration
export const testS3Config = async () => {
  console.log('🔧 Testing AWS S3 configuration...');
  
  try {
    const { default: config } = await import('../aws-exports.js');
    
    const s3Config = {
      region: config.aws_project_region,
      bucket: config.aws_user_files_s3_bucket,
      bucketRegion: config.aws_user_files_s3_bucket_region
    };
    
    console.log('✅ S3 configuration loaded:', s3Config);
    
    if (!s3Config.bucket) {
      console.warn('⚠️ S3 bucket not configured');
      return { success: false, error: 'S3 bucket not configured' };
    }
    
    return {
      success: true,
      config: s3Config
    };
    
  } catch (error) {
    console.error('❌ S3 configuration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Run all S3 tests
export const runS3Tests = async () => {
  console.log('🚀 Starting AWS S3 Storage Tests...');
  
  try {
    // Test 1: S3 Configuration
    const configTest = await testS3Config();
    if (!configTest.success) {
      console.error('❌ S3 configuration test failed, skipping other tests');
      return false;
    }
    
    // Test 2: File Upload
    const uploadTest = await testS3Upload();
    if (!uploadTest.success) {
      console.error('❌ S3 upload test failed');
      return false;
    }
    
    // Test 3: File Listing
    const listTest = await testS3List();
    if (!listTest.success) {
      console.error('❌ S3 listing test failed');
      return false;
    }
    
    console.log('✅ All S3 tests completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ S3 tests failed:', error);
    return false;
  }
};

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  window.testS3 = {
    testS3Upload,
    testS3List,
    testS3Config,
    runS3Tests,
    createTestFile
  };
  
  console.log('🔧 S3 test functions available:');
  console.log('- window.testS3.runS3Tests() - Run all S3 tests');
  console.log('- window.testS3.testS3Upload() - Test file upload');
  console.log('- window.testS3.testS3List() - Test file listing');
  console.log('- window.testS3.testS3Config() - Test S3 configuration');
}