import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HStack,
  Button,
  IconButton,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useColorMode,
  useColorModeValue,
  Image,
  Box,
  Text,
  Flex,
  VStack,
  Icon,
  Tooltip,
  Heading,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon, HamburgerIcon, PhoneIcon, EmailIcon } from '@chakra-ui/icons';
import { useTheme } from '@chakra-ui/react';
import { createBucketClient } from '@cosmicjs/sdk';
import DesktopMenu from './DesktopMenu';

const cosmic = createBucketClient({
  bucketSlug: 'bbhss-production',
  readKey: '03yvDMKwn7se777PUBvEOgYyGZk3nG7MfU26f8cXVhWCFDEScx',
});

const fetchSiteMetadata = async () => {
  try {
    const response = await cosmic.objects.findOne({
      type: 'site-meta',
      slug: 'bhogail-bagadi-secondary-school-alamdanga',
    }).props('slug,title,metadata').depth(1);

    return response.object.metadata;
  } catch (error) {
    console.error('Error fetching site metadata:', error);
    return null;
  }
};

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useTheme();
  
  const [metadata, setMetadata] = useState<any>(null);

  useEffect(() => {
    const getMetadata = async () => {
      const data = await fetchSiteMetadata();
      setMetadata(data);
    };

    getMetadata();
  }, []);

  const bgColor = useColorModeValue(theme.colors.gray[100], theme.colors.gray[900]);
  const borderColor = useColorModeValue(theme.colors.gray[200], theme.colors.gray[700]);
  const textColor = useColorModeValue('teal.500', 'teal.300');

  return (
    <header>
      <Flex
        px="4"
        alignItems="center"
        justifyContent="space-between"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        shadow="md"
        position="relative"
        wrap="wrap"
      >
        {/* Hamburger Menu Button */}
        <Button
          display={{ base: 'block', md: 'none' }}
          onClick={onOpen}
          aria-label="Open Menu"
          position="relative"
          zIndex="1"
        >
          <HamburgerIcon />
        </Button>

        {/* Logo and Name */}
        <Box display="flex" alignItems="center" flex="1" flexDirection="row" gap="4">
          <Link to="/">
            <Image
              src={metadata?.logo?.url || '/logo_192.png'}
              alt="Logo"
              boxSize={{ base: '50px', md: '90px' }}
              objectFit="contain"
            />
          </Link>
          <Box>
            {metadata?.name && (
              <Heading
                display={{ base: 'none', md: 'flex' }}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="bold"
                color={textColor}
                whiteSpace="normal"
                textAlign="left"
                maxW={{ base: '150px', md: '200px' }}
                overflowWrap="break-word"
                lineHeight="1.2"
              >
                {metadata.name}
              </Heading>
              
            )}
          </Box>
        </Box>

        {/* Contact Info */}
        <Box px="5"  alignItems="center" gap="4">
          <VStack spacing="2" align="end" textAlign="right">
            <Tooltip label="Email">
              <HStack spacing="1" alignItems="center">
                <Icon as={EmailIcon} color={textColor} />
                <Text color={textColor} fontSize="sm">info@example.com</Text>
              </HStack>
            </Tooltip>
            <Tooltip label="Phone">
              <HStack spacing="1" alignItems="center">
                <Icon as={PhoneIcon} color={textColor} />
                <Text color={textColor} fontSize="sm">+1 (555) 123-4567</Text>
              </HStack>
            </Tooltip>
          </VStack>
        </Box>

        {/* Theme Toggle Button */}
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="lg"
          isRound
        />
      </Flex>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Menu</DrawerHeader>
            <DrawerBody>
              <HStack as="nav" spacing="4" direction="column" align="start">
                <Link to="/" onClick={onClose}>Home</Link>
                <Link to="/about" onClick={onClose}>About</Link>
                <Link to="/contact" onClick={onClose}>Contact</Link>
              </HStack>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <DesktopMenu/>
    </header>
  );
};

export default Header;
