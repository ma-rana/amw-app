// Debug script to test AWS configuration
import awsExports from '../aws-exports.js';

export const debugAWSConfig = () => {
  console.log('=== AWS Configuration Debug ===');
  console.log('Full config:', awsExports);
  console.log('User Pool ID:', awsExports.aws_user_pools_id);
  console.log('Has placeholder check:', awsExports.aws_user_pools_id?.includes('xxxxxxxx'));
  console.log('Is configured:', awsExports.aws_user_pools_id && !awsExports.aws_user_pools_id.includes('xxxxxxxx'));
  
  // Test the same logic as isAWSConfigured
  try {
    const config = awsExports;
    const result = config.aws_user_pools_id && !config.aws_user_pools_id.includes('xxxxxxxx');
    console.log('isAWSConfigured result:', result);
    return result;
  } catch (error) {
    console.error('Error in isAWSConfigured:', error);
    return false;
  }
};