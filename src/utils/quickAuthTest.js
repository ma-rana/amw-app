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
      // In offline/dev environments, network errors are expected. Keep logs quiet.
      const isNetworkError = /NetworkError|network error|fetch failed|ERR_FAILED/i.test(error?.message || '')
      const msg = isNetworkError ? '⚠️ Cognito not reachable (dev/offline). Skipping.' : '❌ AWS Cognito connection failed:'
      console[isNetworkError ? 'warn' : 'error'](msg, error);
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
  
  // Skip Cognito test if user pool is clearly not configured
  const userPoolConfigured = !!config.aws_user_pools_id && !String(config.aws_user_pools_id).includes('xxxxxxxx');
  if (!userPoolConfigured) {
    console.log('ℹ️ Skipping Cognito connection test: User Pool not configured.');
    return true;
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
  // Do not auto-run in dev to avoid noisy logs when offline
}
