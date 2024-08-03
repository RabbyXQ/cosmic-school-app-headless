import React, {useEffect, useState} from 'react';
import { Image, Box, Flex, Text, Link, Stack, useColorModeValue, Divider, Input, Button } from '@chakra-ui/react';
import { EmailIcon, PhoneIcon, ViewIcon } from '@chakra-ui/icons';
import { API_BASE_URL } from './API';

const FooterAbout: React.FC = () => {
  const [schoolInfo, setSchoolInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const response = await fetch('http://localhost:4000/school-info');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSchoolInfo(data);
      } catch (error) {
        setError('Failed to fetch school information');
        console.error('Error fetching school info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchoolInfo();
  }, []);

  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const cardBgColor = useColorModeValue('white.50', 'gray.900');

  if (loading) {
    return (
      <Box px={5} py={5} flex="1" minW={{ base: 'full', md: '23%' }} mb={{ base: '4', md: '0' }}>
        
      </Box>
    );
  }

  if (error) {
    return (
      <Box px={5} py={5} flex="1" minW={{ base: 'full', md: '23%' }} mb={{ base: '4', md: '0' }}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box px={5} py={5} flex="1" minW={{ base: 'full', md: '23%' }} mb={{ base: '4', md: '0' }} bg={cardBgColor}>
      <Text fontSize="lg" fontWeight="bold" mb="4">About Us</Text>
      <Text mb="4">{schoolInfo?.description || 'No description available.'}</Text>
      <Flex align="center" mb="2">
        <ViewIcon mr="2" />
        <Text>{schoolInfo?.address || 'Address not available'}</Text>
      </Flex>
      <Flex align="center" mb="2">
        <PhoneIcon mr="2" />
        <Text>{schoolInfo?.phone || 'Phone number not available'}</Text>
      </Flex>
      <Flex align="center" mb="2">
        <EmailIcon mr="2" />
        <Text>{schoolInfo?.email || 'Email not available'}</Text>
      </Flex>
      {schoolInfo?.logo && (
        <Image src={API_BASE_URL+schoolInfo.logo} alt="School Logo" mt={4} boxSize="100px" objectFit="cover" />
      )}
    </Box>
  );
};




const Footer: React.FC = () => {
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const linkColor = useColorModeValue('teal.500', 'teal.300');

  return (
    <Box as="footer" bg={bgColor} color={textColor}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        wrap="wrap"
        mb="6"
      >
        
        <FooterAbout/>
        
        <Box px={5} py={5} flex="1" minW={{ base: 'full', md: '23%' }} mb={{ base: '4', md: '0' }}>
          <Text fontSize="lg" fontWeight="bold" mb="4">Quick Links</Text>
          <Stack spacing="2">
            <Link href="/" color={linkColor}>Home</Link>
            <Link href="/about" color={linkColor}>About</Link>
            <Link href="/services" color={linkColor}>Services</Link>
            <Link href="/contact" color={linkColor}>Contact</Link>
          </Stack>
        </Box>

        <Box px={5} py={5} flex="1" minW={{ base: 'full', md: '23%' }} mb={{ base: '4', md: '0' }}>
          <Text fontSize="lg" fontWeight="bold" mb="4">Follow Us</Text>
          <Stack spacing="2">
            <Link href="https://facebook.com" color={linkColor} isExternal>Facebook</Link>
            <Link href="https://twitter.com" color={linkColor} isExternal>Twitter</Link>
            <Link href="https://instagram.com" color={linkColor} isExternal>Instagram</Link>
            <Link href="https://linkedin.com" color={linkColor} isExternal>LinkedIn</Link>
          </Stack>
        </Box>

        <Box px={5} py={5} flex="1" minW={{ base: 'full', md: '23%' }} mb={{ base: '4', md: '0' }}>
          <Text fontSize="lg" fontWeight="bold" mb="4">Newsletter Signup</Text>
          <Stack spacing="3">
            <Input placeholder="Enter your email" size="sm" />
            <Button colorScheme="teal" size="sm">Subscribe</Button>
          </Stack>
        </Box>
      </Flex>
      <Box bg="green.500" w="100%" alignItems="center" alignContent="center" height={50} maxW="container">
        <Text color='white' textAlign="center" fontSize="md">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Text>
      </Box>
    </Box>
  );
};

export default Footer;
