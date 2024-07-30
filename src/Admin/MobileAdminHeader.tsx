// MobileAdminHeader.tsx
import React from 'react';
import {
  HStack,
  IconButton,
  Text,
  useColorMode,
  useDisclosure,
  Box
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import MobileAdminSideBar from './MobileAdminSideBar'; // Adjust the import path as needed

const MobileAdminHeader: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <HStack
        display={{ base: 'flex', md: 'none' }} // Show only on mobile
        justifyContent="space-between"
        p={2}
        bg={colorMode === 'light' ? 'gray.100' : 'gray.700'} // Background color
        color={colorMode === 'light' ? 'gray.800' : 'gray.200'} // Text color
        boxShadow="md"
        position="sticky"
        top={0}
        zIndex={20} // Ensure header is above sidebar
      >
        <IconButton
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          onClick={isOpen ? onClose : onOpen}
        />
        <Text fontSize="xl" fontWeight="bold">
          Admin Panel
        </Text>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
        />
      </HStack>
      <MobileAdminSideBar isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default MobileAdminHeader;
