// Quick authentication test for browser console
import { getCurrentUser } from 'aws-amplify/auth';

// Test AWS Cognito connection
export const testCognitoConnection = async () => {
  console.log('🔐 Testing AWS Cognito connection...');
  
  try {
    // Try to get current user (will fail if not authenticated, but connection works)
    await getCurrentUser();
    console.log('✅ AWS Cognito connection successful - User is authenticated');
    return true;
  } catch (error) {
    if (error.name === 'UserUnAuthenticatedError' || 
        error.name === 'UserUnAuthenticatedException' ||
        error.message.includes('not authenticated') ||
        error.message.includes('User needs to be authenticated')) {
      console.log('✅ AWS Cognito connection successful - No user authenticated (expected)');
      return true;
    } else {
      console.error('❌ AWS Cognito connection failed:', error);
      return false;
    }
  }
};

// Test AWS configuration
export const testAWSConfig = async () => {
  console.log('🔧 Testing AWS configuration...');
  
  try {
    const { default: config } = await import('../aws-exports.js');
    console.log('✅ AWS configuration loaded:', {
      region: config.aws_project_region,
      userPoolId: config.aws_user_pools_id ? 'Configured' : 'Not configured',
      userPoolWebClientId: config.aws_user_pools_web_client_id ? 'Configured' : 'Not configured',
      apiEndpoint: config.aws_appsync_graphqlEndpoint ? 'Configured' : 'Not configured'
    });
    return config;
  } catch (error) {
    console.error('❌ AWS configuration failed to load:', error);
    return null;
  }
};

// Run quick tests
export const runQuickTests = async () => {
  console.log('🚀 Running quick AWS Cognito tests...');
  
  const config = await testAWSConfig();
  if (!config) {
    console.error('❌ Cannot proceed without AWS configuration');
    return false;
  }
  
  const connectionTest = await testCognitoConnection();
  
  if (connectionTest) {
    console.log('✅ All quick tests passed! AWS Cognito is properly configured.');
    console.log('💡 You can now test authentication by:');
    console.log('   1. Going to /signup to create a new account');
    console.log('   2. Going to /login to sign in');
    console.log('   3. Using window.testAuth.runAuthTests() for automated testing');
  }
  
  return connectionTest;
};

// Make available globally
if (typeof window !== 'undefined') {
  window.quickAuthTest = {
    testCognitoConnection,
    testAWSConfig,
    runQuickTests
  };
  
  // Auto-run quick tests
  setTimeout(() => {
    runQuickTests();
  }, 1000);
}