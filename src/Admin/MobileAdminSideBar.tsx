// MobileAdminSideBar.tsx
import React from 'react';
import {
  VStack,
  HStack,
  Box,
  IconButton,
  Text,
  Button,
  useColorMode
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import SideItem from './SideItem'; // Adjust the import path as needed
import { adminSidebarItems } from './AdminMenuItems';

interface MobileAdminSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileAdminSideBar: React.FC<MobileAdminSideBarProps> = ({ isOpen, onClose }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeLink, setActiveLink] = React.useState('Dashboard'); // Default active link

  return (
    <Box
    my="20"
      display={{ base: isOpen ? 'block' : 'none', md: 'none' }} // Show only on mobile
      position="fixed"
      top={0}
      left={0}
      width="250px"
      height="100vh"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      color={colorMode === 'light' ? 'gray.800' : 'gray.200'}
      p={4}
      boxShadow="md"
      zIndex={10}
    >
      <VStack align="stretch" spacing={3}>
        {adminSidebarItems.map(({ name, icon: Icon, url }) => (
          <SideItem
            key={name}
            name={name}
            icon={Icon}
            url={url}
            isActive={activeLink === name}
            onClick={() => {
              setActiveLink(name);
              onClose(); // Close sidebar on item click
            }}
          />
        ))}
      </VStack>
    </Box>
  );
};

export default MobileAdminSideBar;
