import React, { useState } from 'react';
import { Button, TextField, Heading, Flex, Text, Link, Alert } from '@aws-amplify/ui-react';
import { useAuth } from '../contexts/AuthContext';

const SignupPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { signUp, isLoading } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const { email, password, confirmPassword, name, phone } = formData;
    
    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      const result = await signUp(email, password, name, phone);
      setSuccess(result.message);
      
      // Clear form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
      });
      
      // Redirect to email confirmation after 2 seconds
      setTimeout(() => {
        onNavigate('email-confirmation', { email });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    }
  };

  return (
    <div className="auth-page">
      <Flex direction="column" alignItems="center" className="auth-container">
        <Heading level={2} marginBottom="1.5rem">Create Account</Heading>
        
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
          <TextField
            label="Full Name"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            marginBottom="1rem"
            required
          />
          
          <TextField
            label="Email"
            name="email"
            placeholder="Enter your email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            marginBottom="1rem"
            required
          />
          
          <TextField
            label="Phone Number"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            marginBottom="1rem"
            required
          />
          
          <TextField
            label="Password"
            name="password"
            placeholder="Create a password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            marginBottom="1rem"
            required
          />
          
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            marginBottom="1.5rem"
            required
          />
          
          <Button
            type="submit"
            variation="primary"
            isFullWidth
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Create Account
          </Button>
        </form>
        
        <Flex direction="column" alignItems="center" marginTop="2rem">
          <Text>Already have an account?</Text>
          <Link onClick={() => onNavigate('login')} fontSize="0.9rem">
            Sign in
          </Link>
        </Flex>
      </Flex>
    </div>
  );
};

export default SignupPage;