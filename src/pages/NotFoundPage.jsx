import React from 'react';
import { useNavigate } from 'react-router-dom';
import { View, Button, Heading, Text } from '@aws-amplify/ui-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <View className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="amw-container">
        <div className="text-center max-w-2xl mx-auto">
          <div className="mb-8">
            <span className="text-8xl font-bold text-primary-600 block mb-4">404</span>
          </div>
          
          <Heading level={1} className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </Heading>
          
          <Text className="text-lg text-gray-600 mb-8 leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </Text>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variation="primary" 
              onClick={handleGoHome}
              className="btn-primary px-6 py-3 text-lg font-medium rounded-lg transition-colors duration-200"
            >
              Go to Home
            </Button>
            <Button 
              variation="link" 
              onClick={handleGoBack}
              className="btn-secondary px-6 py-3 text-lg font-medium rounded-lg transition-colors duration-200"
            >
              Go Back
            </Button>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <svg 
            width="300" 
            height="200" 
            viewBox="0 0 300 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="opacity-60"
          >
            {/* Simple illustration of a broken page */}
            <rect x="50" y="40" width="200" height="120" rx="8" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="2"/>
            <rect x="70" y="60" width="160" height="8" rx="4" fill="#e5e7eb"/>
            <rect x="70" y="80" width="120" height="8" rx="4" fill="#e5e7eb"/>
            <rect x="70" y="100" width="140" height="8" rx="4" fill="#e5e7eb"/>
            
            {/* Broken/crack effect */}
            <path d="M150 40 L180 80 L150 120 L120 80 Z" fill="#ef4444" opacity="0.2"/>
            <path d="M150 40 L180 80 L150 120 L120 80 Z" stroke="#ef4444" strokeWidth="2" fill="none"/>
            
            {/* X mark */}
            <path d="M140 70 L160 90 M160 70 L140 90" stroke="#ef4444" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </View>
  );
};

export default NotFoundPage;