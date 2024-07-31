import React from 'react';
import { Box, Container, Flex, Grid, GridItem, Heading, Text, Image, Link, Icon, useColorModeValue } from '@chakra-ui/react';
import { FaPaintBrush, FaBook, FaUser, FaCalendarAlt, FaGraduationCap, FaClock } from 'react-icons/fa';
import { title } from 'process';

const brief = 
{
  title: "বিস্তর বর্ণনা",
  description: "১৯৯৩ সালে প্রতিষ্ঠিত ভোগাইল বগাদি মাধ্যমিক বিদ্যালয়, আলমডাঙ্গা উপজেলার মধ্যে অন্যতম স্বনামধন্য একটি প্রতিষ্ঠান । বিদ্যালয়টি সংশ্লিষ্ট এলাকায় মাধ্যমিক শিক্ষা নিশ্চিত করার লক্ষে প্রতিষ্টিত হয়। প্রাথমিক ভাবে খুব সীমিত সংখ্যক ছাত্রছাত্রী নিয়ে বিদ্যালয়টি যাত্রা শুরু করলেও বর্তমানে প্রতিষ্ঠানটিতে প্রতি বছর ২০০+ ছাত্রছাত্রী ভর্তি হয়।  বর্তমানে বিদ্যালয়টিতে মহেশপুর, খোরোদ, গৌরীহ্রদ ও ভোগাইল বগাদি থেকে ছাত্রছাত্রী পড়তে আসে।",
  image: "https://www.noakhalicoll.gov.bd/midea/featuredimage/featuredimage2023-08-04-13-16-10_64ccfa1a4eee0.jpg",
  links: {
      title:  "এক ঝলক",
      description: "",
      link: ""
  }
}

const Brief: React.FC = () => {
  const bgColor = useColorModeValue('gray.100', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  
  return (
    <Box bg={bgColor} py={8}>
      <Container maxW="container.lg">
        <Box textAlign="justify" mb={8}>
          <Heading colorScheme='teal' as="h1" size="xl" mb={4}>
            {brief.title}
          </Heading>
          <Text fontWeight="bold" fontSize="lg" color={textColor}>
          {brief.description}
          </Text>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <GridItem>
            <Image src={brief.image} alt="College Image" borderRadius="md" />
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
