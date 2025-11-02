import React, { useState } from 'react';
import { Alert, Button, Flex, Text } from '@aws-amplify/ui-react';

const VerificationBanner = ({ onNavigateToConfirmation, onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (isDismissed) return null;

  return (
    <Alert variation="warning" marginBottom="1rem">
      <Flex direction="row" alignItems="center" justifyContent="space-between">
        <Flex direction="column" flex="1">
          <Text fontWeight="bold" fontSize="0.9rem">
            Email not verified
          </Text>
          <Text fontSize="0.8rem">
            Verify your email to unlock all features and secure your account
          </Text>
        </Flex>
        <Flex direction="row" gap="0.5rem">
          <Button
            size="small"
            variation="primary"
            onClick={onNavigateToConfirmation}
          >
            Verify Now
          </Button>
          <Button
            size="small"
            variation="link"
            onClick={handleDismiss}
          >
            Dismiss
          </Button>
        </Flex>
      </Flex>
    </Alert>
  );
};

export default VerificationBanner;