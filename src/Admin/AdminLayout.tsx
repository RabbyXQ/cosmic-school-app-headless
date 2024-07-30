import React, { ReactNode, useState } from 'react';
import { Box, Flex, IconButton, useColorMode, useColorModeValue, VStack, HStack, Text } from '@chakra-ui/react';
import { SunIcon, MoonIcon, InfoOutlineIcon, SettingsIcon } from '@chakra-ui/icons';
import AdminSideBar from './AdminSideBar';
import SideItem from './SideItem';
import MobileAdminHeader from './MobileAdminHeader';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [activeLink, setActiveLink] = useState<string>('Home'); // Manage active link state
  const bg = useColorModeValue('gray.100', 'gray.900');
  const color = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Flex minHeight="100vh">
      <Box
        display={{base: "none", md: "block"}}
        w="250px"
        bg={bg}
        color={color}
        p={5}
        borderRight="1px"
        borderColor={borderColor}
      >
        <AdminSideBar/>
      </Box>
      <Box flex="1" p={5} bg={useColorModeValue('white', 'gray.800')}>
        <MobileAdminHeader/>
        {children}
      </Box>
    </Flex>
  );
};

export default AdminLayout;