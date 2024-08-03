import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, GridItem, Heading, Text, Image, Icon, Flex, useColorModeValue } from '@chakra-ui/react';
import { FaPaintBrush, FaBook, FaUser, FaCalendarAlt, FaGraduationCap, FaClock, FaArrowRight, FaHandPointer, FaInfoCircle } from 'react-icons/fa'; // Additional icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { API_BASE_URL } from './API';

// Define TypeScript interfaces for API data
interface SchoolInfo {
  id: number;
  site_name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  long_description: string;
  image: string;
  brief_section: number;
}

interface Section {
  id: number;
  class_id: number;
  type: string;
  name: string;
  value: string;
}

// Map numbers to icons
const iconMapping: { [key: number]: React.ElementType } = {
  1: FaArrowRight,
  2: FaHandPointer,
  3: FaInfoCircle,
  4: FaPaintBrush,
  5: FaBook,
  6: FaUser,
  7: FaCalendarAlt,
  8: FaGraduationCap,
  9: FaClock,
};

const getRandomColor = () => {
  const colors = ['red', 'green', 'blue', 'orange', 'purple', 'pink', 'cyan'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const Brief: React.FC = () => {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null);
  const [sections, setSections] = useState<Section[]>([]);

  const navigate = useNavigate(); // Initialize navigate
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  useEffect(() => {
    const fetchSchoolInfo = async () => {
      try {
        const response = await fetch('http://localhost:4000/school-info');
        const data: SchoolInfo = await response.json();
        setSchoolInfo(data);
        
        const sectionsResponse = await fetch(`http://localhost:4000/menus/classes/${data.brief_section}/sections`);
        const sectionsData: Section[] = await sectionsResponse.json();
        setSections(sectionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSchoolInfo();
  }, []);

  if (!schoolInfo) return <div></div>;

  return (
    <Box bg={bgColor} py={8}>
      <Container maxW="container.lg">
        <Box textAlign="justify" mb={8} px={{ base: 4, md: 0 }}>
          <Heading colorScheme='teal' as="h1" size="xl" mb={4}>
            {schoolInfo.site_name}
          </Heading>
          <Text fontWeight="bold" fontSize="lg" color={textColor} mb={6}>
            {schoolInfo.long_description}
          </Text>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6}>
          <GridItem>
            <Image
              src={API_BASE_URL + schoolInfo.image}
              alt="School Image"
              borderRadius="md"
              boxSize={{ base: '100%', md: '200px' }} // Adjusted size for responsiveness
              objectFit="cover"
            />
          </GridItem>
          <GridItem>
            <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
              {sections.map((section, index) => {
                const IconComponent = iconMapping[(index % Object.keys(iconMapping).length) + 1] || FaPaintBrush; // Map numbers to icons
                const leftBorderColor = index % 2 === 0 ? getRandomColor() : 'transparent'; // Random color for left border
                const rightBorderColor = index % 2 === 1 ? getRandomColor() : 'transparent'; // Random color for right border
                
                // Modify href based on section type
                const handleClick = () => {
                  const path = section.type === 'page' ? `/pages/${section.value}` : section.value;
                  navigate(path); // Navigate programmatically
                };

                return (
                  <GridItem key={section.id} borderRight={`4px solid ${rightBorderColor}`} borderLeft={`4px solid ${leftBorderColor}`}>
                    <Flex
                      align="center"
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      _hover={{ bg: 'teal.50' }}
                      onClick={handleClick} // Handle click
                      cursor="pointer" // Show pointer cursor
                    >
                      <Icon as={IconComponent} boxSize={4} color="teal.500" /> {/* Reduced icon size */}
                      <Box ml={2}>
                        <Heading as="h3" fontWeight="bold" size="md" color={textColor}> {/* Reduced heading size */}
                          {section.name}
                        </Heading>
                        <Text fontSize="xs" color={textColor} mt={1}> {/* Reduced text size */}
                          {/* Optional description */}
                        </Text>
                      </Box>
                    </Flex>
                  </GridItem>
                );
              })}
            </Grid>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Brief;
