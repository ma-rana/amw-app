import React, { useState } from 'react';
import { Button, TextField, Heading, Flex, Text, Link, Alert } from '@aws-amplify/ui-react';
import { useAuth } from '../contexts/AuthContext';

const EmailConfirmationPage = ({ onNavigate, email }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [userEmail, setUserEmail] = useState(email || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { confirmSignUp, isLoading, continueWithoutVerification } = useAuth();

  const handleSkip = () => {
    // Create a basic user object for unverified access
    const unverifiedUser = {
      id: 'unverified_' + Date.now(),
      username: userEmail,
      email: userEmail,
      name: userEmail.split('@')[0],
      verified: false
    };
    
    // Allow user to continue without verification
    continueWithoutVerification(unverifiedUser);
    onNavigate('home');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!userEmail.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!confirmationCode.trim()) {
      setError('Please enter the confirmation code');
      return;
    }
    
    try {
      const result = await confirmSignUp(userEmail, confirmationCode);
      setSuccess(result.message);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to confirm email');
    }
  };

  return (
    <div className="auth-page">
      <Flex direction="column" alignItems="center" className="auth-container">
        <Heading level={2} marginBottom="1.5rem">Confirm Your Email</Heading>
        
        <Text marginBottom="1.5rem" textAlign="center">
          {email ? (
            <>We've sent a verification code to <strong>{email}</strong>. 
            Please check your email and enter the code below.</>
          ) : (
            <>Please enter your email address and the verification code you received.</>
          )}
        </Text>
        
        {error && (
          <Alert variation="error" marginBottom="1rem" width="100%">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variation="success" marginBottom="1rem" width="100%">
            {success}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {!email && (
            <TextField
              label="Email Address"
              name="email"
              placeholder="Enter your email address"
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              marginBottom="1rem"
              required
            />
          )}
          
          <TextField
            label="Verification Code"
            name="confirmationCode"
            placeholder="Enter the 6-digit code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            marginBottom="1.5rem"
            required
            autoComplete="one-time-code"
          />
          
          <Button
            type="submit"
            variation="primary"
            isFullWidth
            isLoading={isLoading}
            loadingText="Confirming..."
            marginBottom="1rem"
          >
            Confirm Email
          </Button>
          
          <Button
            variation="link"
            isFullWidth
            onClick={handleSkip}
          >
            Skip for now - Use app without verification
          </Button>
        </form>
        
        <Flex direction="column" alignItems="center" marginTop="2rem">
          <Text fontSize="0.9rem" marginBottom="0.5rem" textAlign="center">
            Didn't receive the code?
          </Text>
          <Link onClick={() => onNavigate('signup')} fontSize="0.9rem">
            Go back to signup
          </Link>
        </Flex>
      </Flex>
    </div>
  );
};

export default EmailConfirmationPage;