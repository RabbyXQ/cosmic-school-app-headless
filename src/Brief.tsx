import React from 'react';
import { Box, Container, Flex, Grid, GridItem, Heading, Text, Image, Link, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaPaintBrush, FaBook, FaUser, FaCalendarAlt, FaGraduationCap, FaClock } from 'react-icons/fa';

const Brief: React.FC = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  
  return (
    <Box bg={bgColor} py={8}>
      <Container maxW="container.lg">
        <Box textAlign="justify" mb={8}>
          <Heading colorScheme='teal' as="h1" size="xl" mb={4}>
            Brief of History
          </Heading>
          <Text fontSize="lg" color={textColor}>
            Noakhali Government College was established in 1963, making it one of the oldest and most prestigious educational institutions in Noakhali district, Bangladesh. The college was founded with the vision of providing quality higher education to students from the region and beyond. Initially, the college started its journey as an intermediate college offering education up to the intermediate level. Over the years, it gradually expanded its academic programs and facilities to cater to the growing needs of students seeking higher education.
          </Text>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <GridItem>
            <Image src="https://www.noakhalicoll.gov.bd/midea/featuredimage/featuredimage2023-08-04-13-16-10_64ccfa1a4eee0.jpg" alt="College Image" borderRadius="md" />
          </GridItem>
          <GridItem>
            <Flex direction="column" gap={4}>
              <Link href="page.php?id=1" _hover={{ textDecoration: 'none' }}>
                <Flex align="center" mb={2}>
                  <Icon as={FaPaintBrush} boxSize={6} color="teal.500" />
                  <Box ml={3}>
                    <Heading as="h3" size="md">
                      At a Glance
                    </Heading>
                    <Text fontSize="sm">Programs, faculty, students, achievements, campus, facilities, history.</Text>
                  </Box>
                </Flex>
              </Link>
              <Link href="page.php?id=3" _hover={{ textDecoration: 'none' }}>
                <Flex align="center" mb={2}>
                  <Icon as={FaBook} boxSize={6} color="teal.500" />
                  <Box ml={3}>
                    <Heading as="h3" size="md">
                      Mission & Vision
                    </Heading>
                    <Text fontSize="sm">Educate, inspire, empower, excellence, innovation, community, leadership.</Text>
                  </Box>
                </Flex>
              </Link>
              <Link href="page.php?id=5" _hover={{ textDecoration: 'none' }}>
                <Flex align="center">
                  <Icon as={FaUser} boxSize={6} color="teal.500" />
                  <Box ml={3}>
                    <Heading as="h3" size="md">
                      Infrastructure
                    </Heading>
                    <Text fontSize="sm">Classrooms, labs, library, dorms, sports facilities.</Text>
                  </Box>
                </Flex>
              </Link>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex direction="column" gap={4}>
              <Link href="page.php?id=2" _hover={{ textDecoration: 'none' }}>
                <Flex align="center" mb={2}>
                  <Icon as={FaCalendarAlt} boxSize={6} color="teal.500" />
                  <Box ml={3}>
                    <Heading as="h3" size="md">
                      Brief of History
                    </Heading>
                    <Text fontSize="sm">Established, growth, achievements, challenges, leadership, legacy.</Text>
                  </Box>
                </Flex>
              </Link>
              <Link href="page.php?id=4" _hover={{ textDecoration: 'none' }}>
                <Flex align="center" mb={2}>
                  <Icon as={FaGraduationCap} boxSize={6} color="teal.500" />
                  <Box ml={3}>
                    <Heading as="h3" size="md">
                      Rules & Regulation
                    </Heading>
                    <Text fontSize="sm">Conduct, academics, attendance, consequences.</Text>
                  </Box>
                </Flex>
              </Link>
              <Link href="page.php?id=6" _hover={{ textDecoration: 'none' }}>
                <Flex align="center">
                  <Icon as={FaClock} boxSize={6} color="teal.500" />
                  <Box ml={3}>
                    <Heading as="h3" size="md">
                      Facilities
                    </Heading>
                    <Text fontSize="sm">Campus, classrooms, library, labs, dorms, recreational areas, sports facilities.</Text>
                  </Box>
                </Flex>
              </Link>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Brief;
