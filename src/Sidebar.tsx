// Sidebar.tsx
import React from 'react';
import { Box, SlideFade } from '@chakra-ui/react';
import SearchWithGoogle from './SearchWithGoogle';

const Sidebar: React.FC = () => {
  return (
    <Box display="flex" bg = "transparent" 
      width="30%" 
      p={4}
      flexDirection="column"
    >
      <SearchWithGoogle/>
        
    </Box>
  );
};

export default Sidebar;
