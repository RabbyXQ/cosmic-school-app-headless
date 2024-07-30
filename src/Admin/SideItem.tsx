// SideItem.tsx
import React from 'react';
import { Flex, Text, Box, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom'; // Import Link from React Router

interface SideItemProps {
  name: string;
  icon: React.ElementType; // Icon should be of type React.ElementType
  url: string;
  isActive: boolean;
  onClick?: () => void; // Make onClick optional if not always needed
}

const useThemeColors = () => {
  return {
    sideItemBg: useColorModeValue('teal.100', 'teal.700'), // Background color for active item
    sideItemhoverBg: useColorModeValue('teal.200', 'teal.800'), // Background color on hover
    sideItemtextColor: useColorModeValue('gray.800', 'gray.200'), // Text color
  };
};

const SideItem: React.FC<SideItemProps> = ({ name, icon: Icon, url, isActive, onClick }) => {
  const { sideItemBg, sideItemhoverBg, sideItemtextColor } = useThemeColors(); // Use custom hook to get theme colors

  return (
    <Link to={url} onClick={onClick} style={{ textDecoration: 'none' }}> {/* Use Link for client-side routing */}
      <Flex
        alignItems="center"
        p={3}
        borderRadius="md"
        bg={isActive ? sideItemBg : 'transparent'}
        _hover={{ bg: sideItemhoverBg }}
      >
        <Box as="span" mr={3}>
          <Icon boxSize={5} color={sideItemtextColor} /> {/* Render the icon component with a color */}
        </Box>
        <Text fontWeight={isActive ? 'bold' : 'normal'} color={sideItemtextColor}>
          {name}
        </Text>
      </Flex>
    </Link>
  );
};

export default SideItem;
