// Test script for AWS Cognito Authentication
import { signUp as amplifySignUp, signIn as amplifySignIn, signOut as amplifySignOut } from 'aws-amplify/auth';

// Test user credentials
const TEST_USER = {
  email: 'test@amwapp.com',
  password: 'TestPassword123!',
  name: 'Test User',
  phone: '+1234567890'
};

// Test user registration
export const testUserRegistration = async () => {
  console.log('🔐 Testing user registration with AWS Cognito...');
  
  try {
    const result = await amplifySignUp({
      username: TEST_USER.email,
      password: TEST_USER.password,
      attributes: {
        email: TEST_USER.email,
        name: TEST_USER.name,
        phone_number: TEST_USER.phone
      }
    });
    
    console.log('✅ User registration successful:', result);
    console.log('📧 Check email for verification code');
    return result;
  } catch (error) {
    console.error('❌ User registration failed:', error);
    if (error.name === 'UsernameExistsException') {
      console.log('ℹ️ User already exists, proceeding to sign in test...');
      return { userSub: 'existing-user' };
    }
    throw error;
  }
};

// Test user sign in
export const testUserSignIn = async () => {
  console.log('🔐 Testing user sign in with AWS Cognito...');
  
  try {
    const result = await amplifySignIn({
      username: TEST_USER.email,
      password: TEST_USER.password
    });
    
    console.log('✅ User sign in successful:', result);
    return result;
  } catch (error) {
    console.error('❌ User sign in failed:', error);
    throw error;
  }
};

// Test user sign out
export const testUserSignOut = async () => {
  console.log('🔐 Testing user sign out with AWS Cognito...');
  
  try {
    await amplifySignOut();
    console.log('✅ User sign out successful');
  } catch (error) {
    console.error('❌ User sign out failed:', error);
    throw error;
  }
};

// Run all authentication tests
export const runAuthTests = async () => {
  console.log('🚀 Starting AWS Cognito Authentication Tests...');
  
  try {
    // Test 1: User Registration
    await testUserRegistration();
    
    // Test 2: User Sign In (if registration was successful or user exists)
    await testUserSignIn();
    
    // Test 3: User Sign Out
    await testUserSignOut();
    
    console.log('✅ All authentication tests completed successfully!');
  } catch (error) {
    console.error('❌ Authentication tests failed:', error);
  }
};

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  window.testAuth = {
    testUserRegistration,
    testUserSignIn,
    testUserSignOut,
    runAuthTests
  };
  
  console.log('🔧 Authentication test functions available:');
  console.log('- window.testAuth.runAuthTests() - Run all tests');
  console.log('- window.testAuth.testUserRegistration() - Test registration');
  console.log('- window.testAuth.testUserSignIn() - Test sign in');
  console.log('- window.testAuth.testUserSignOut() - Test sign out');
}