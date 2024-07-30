// NotFound.tsx
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const NotFound: React.FC = () => {
  return (
    <Box textAlign="center" mt={8}>
      <Text fontSize="2xl">404 - Page Not Found</Text>
    </Box>
  );
};

export default NotFound;
