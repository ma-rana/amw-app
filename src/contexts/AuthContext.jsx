import React, { createContext, useState, useContext, useEffect } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, confirmSignUp as amplifyConfirmSignUp, getCurrentUser, updateUserAttributes, updatePassword as amplifyChangePassword } from 'aws-amplify/auth';

// Create the authentication context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [_useAWS, _setUseAWS] = useState(true) // Enable real AWS authentication
  const [isEmailVerified, setIsEmailVerified] = useState(true) // Default to true for mock users;

  // Check for existing authenticated user session on component mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      setIsLoading(true);
      console.log('🔐 Checking for authenticated user...');
      
      try {
        const currentUser = await getCurrentUser();
        console.log('✅ User is authenticated:', currentUser.username);
        setUser({
          id: currentUser.userId,
          username: currentUser.username,
          email: currentUser.signInDetails?.loginId || currentUser.username,
          name: currentUser.username, // Can be updated with user attributes
          role: 'parent' // Default role, can be customized based on user attributes
        });
        setIsEmailVerified(true);
      } catch (error) {
        console.log('ℹ️ No authenticated user found');
        setUser(null);
      }
      
      setIsLoading(false);
    };
    loadCurrentUser();
  }, []);

  // Sign in function
  const signIn = async (username, password) => {
    setIsLoading(true);
    console.log('🔐 Sign In Attempt:', { username });
    try {
      // Use AWS Cognito authentication
      const signInResult = await amplifySignIn({ username, password });
      console.log('✅ Sign in successful:', signInResult);
      
      // Get the current user details
      const currentUser = await getCurrentUser();
      const userData = {
        id: currentUser.userId,
        username: currentUser.username,
        email: currentUser.signInDetails?.loginId || currentUser.username,
        name: currentUser.username,
        role: 'parent' // Default role
      };
      
      setUser(userData);
      setIsEmailVerified(true);
      return userData;
    } catch (error) {
      console.error('❌ Sign in error:', error);
      
      // Check if error is due to unverified email (AWS Cognito specific errors)
      if (error.name === 'UserNotConfirmedException' || 
          error.code === 'UserNotConfirmedException' ||
          error.message?.includes('User is not confirmed') ||
          error.message?.includes('confirm') ||
          error.message?.includes('User needs to be authenticated to call this API') ||
          error.message?.includes('not confirmed')) {
        console.log('🔍 Detected unconfirmed user error for:', username);
        const confirmationError = new Error('Please confirm your email address to continue');
        confirmationError.type = 'EMAIL_NOT_CONFIRMED';
        confirmationError.username = username;
        throw confirmationError;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email, password, name, phone) => {
    setIsLoading(true);
    try {
      // Use AWS Cognito user registration
      console.log('🔐 Registering user:', { email, name, phone });
      const signUpResult = await amplifySignUp({
        username: email,
        password,
        attributes: {
          email,
          name,
          phone_number: phone
        }
      });
      
      console.log('✅ User registration successful:', signUpResult);
      return { 
        success: true, 
        message: 'User registered successfully. Please check your email for verification code.',
        userId: signUpResult.userId,
        nextStep: signUpResult.nextStep
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm sign up with verification code
  const confirmSignUp = async (username, confirmationCode) => {
    setIsLoading(true);
    try {
      // Use AWS Cognito email verification
      console.log('🔐 Confirming email for:', username);
      const confirmResult = await amplifyConfirmSignUp({
        username,
        confirmationCode
      });
      
      console.log('✅ Email confirmation successful:', confirmResult);
      setIsEmailVerified(true);
      return { success: true, message: 'Email confirmed successfully. You can now sign in.' };
    } catch (error) {
      console.error('❌ Email confirmation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Allow user to continue without verification
  const continueWithoutVerification = (userData) => {
    setUser(userData);
    setIsEmailVerified(false);
  };

  // Sign out function
  const signOut = async () => {
    setIsLoading(true);
    try {
      console.log('🔐 Signing out user...');
      await amplifySignOut();
      console.log('✅ User signed out successfully');
      setUser(null);
      setIsEmailVerified(true);
    } catch (error) {
      console.error('❌ Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedInfo) => {
    setIsLoading(true);
    try {
      console.log('🔐 Updating user profile:', updatedInfo);
      
      // Update user attributes in AWS Cognito
      const attributesToUpdate = {};
      if (updatedInfo.name) attributesToUpdate.name = updatedInfo.name;
      if (updatedInfo.phone) attributesToUpdate.phone_number = updatedInfo.phone;
      if (updatedInfo.email) attributesToUpdate.email = updatedInfo.email;
      
      if (Object.keys(attributesToUpdate).length > 0) {
        await updateUserAttributes({ userAttributes: attributesToUpdate });
      }
      
      // Update local user state
      const updatedUser = { ...user, ...updatedInfo };
      setUser(updatedUser);
      
      console.log('✅ Profile updated successfully');
      return { success: true, message: 'Profile updated successfully' };
    } catch (error) {
      console.error('❌ Profile update failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (oldPassword, newPassword) => {
    setIsLoading(true);
    try {
      console.log('🔐 Changing password...');
      await amplifyChangePassword({ oldPassword, newPassword });
      console.log('✅ Password changed successfully');
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      console.error('❌ Password change failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isEmailVerified,
    signIn,
    signUp,
    confirmSignUp,
    signOut,
    updateUserProfile,
    changePassword,
    continueWithoutVerification
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};