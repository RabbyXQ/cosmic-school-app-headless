import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HStack,
  Button,
  IconButton,
  useDisclosure,
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
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import { API_BASE_URL, SITE_INFO } from './API';

const Header: React.FC = () => {
  const [logo, setLogo] = useState<string>('');
  const [schoolInfo, setSchoolInfo] = useState<any>(null);

  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const theme = useTheme();

  const bgColor = useColorModeValue(theme.colors.gray[100], theme.colors.gray[900]);
  const borderColor = useColorModeValue(theme.colors.gray[200], theme.colors.gray[700]);
  const textColor = useColorModeValue('teal.600', 'teal.300');
  const schoolNameColor = useColorModeValue('blue.500', 'teal.300');

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const response = await fetch(SITE_INFO);
        const data = await response.json();
        setSchoolInfo(data);
        setLogo(data.logo);
      } catch (error) {
        console.error('Error fetching school info:', error);
      }
    };

    fetchSchoolInfo();
  }, []);

  if (!schoolInfo) return null;

  return (
    <header>
      <Flex
        px="4"
        py={{ base: '2', md: 'none' }}
        alignItems="center"
        justifyContent="space-between"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        shadow="md"
        position="relative"
        wrap="wrap"
      >
        <Button
          display={{ base: 'block', md: 'none' }}
          onClick={onOpen}
          aria-label="Open Menu"
          position="relative"
          zIndex="1"
        >
          <HamburgerIcon color={textColor} />
        </Button>

        <Box display="flex" alignItems="center" flex="1" flexDirection="row" gap="4">
          <Link to="/">
            <Image
              src={API_BASE_URL+logo}
              alt="Logo"
              boxSize={{ base: '50px', md: '90px' }}
              objectFit="contain"
            />
          </Link>
          <Box>
            <Heading
              display={{ base: 'none', md: 'flex' }}
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="bold"
              color={schoolNameColor}
              whiteSpace="normal"
              textAlign="left"
              maxW={{ base: '150px', md: '200px' }}
              overflowWrap="break-word"
              lineHeight="1.2"
            >
              {schoolInfo.site_name}
            </Heading>
          </Box>
        </Box>

        <Box px="5" alignItems="center" gap="4">
          <VStack spacing="2" align="end" textAlign="right">
            <Tooltip label="Email">
              <HStack spacing="1" alignItems="center">
                <Icon as={EmailIcon} color={textColor} />
                <Text color={textColor} fontSize="sm">{schoolInfo.email}</Text>
              </HStack>
            </Tooltip>
            <Tooltip label="Phone">
              <HStack spacing="1" alignItems="center">
                <Icon as={PhoneIcon} color={textColor} />
                <Text color={textColor} fontSize="sm">{schoolInfo.phone}</Text>
              </HStack>
            </Tooltip>
          </VStack>
        </Box>

        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon color="blue.500" /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="lg"
          isRound
        />
      </Flex>

      <MobileMenu isOpen={isOpen} onClose={onClose} />
      <DesktopMenu />
    </header>
  );
};

export default Header;
