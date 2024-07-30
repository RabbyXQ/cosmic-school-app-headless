import React from 'react';
import { Box, Grid, GridItem, Icon, Heading, VStack, Button } from '@chakra-ui/react';
import { FaHandPointRight, FaCloudDownloadAlt, FaCertificate } from 'react-icons/fa';

const Mission: React.FC = () => {
  return (
    <Box id="mission" padding={5}>
      <Box maxW="container.lg" mx="auto">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <GridItem bg="blue.200" p={4} borderRadius="md">
            <Grid templateColumns="auto 1fr" gap={3} alignItems="center">
              <Icon as={FaHandPointRight} boxSize={6} />
              <Box>
                <Heading as="h4" size="md">Administration</Heading>
                <VStack align="start" spacing={2} mt={4}>
                  <Button
                    as="a"
                    href="principal.php"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'blue.600',
                      _hover: { color: 'blue.800', textDecoration: 'none' },
                    }}
                  >
                    Principal
                  </Button>
                  <Button
                    as="a"
                    href="cc.php"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'blue.600',
                      _hover: { color: 'blue.800', textDecoration: 'none' },
                    }}
                  >
                    Citizen Charter
                  </Button>
                  <Button
                    as="a"
                    href="post_osd.php"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'blue.600',
                      _hover: { color: 'blue.800', textDecoration: 'none' },
                    }}
                  >
                    OSD Teachers
                  </Button>
                  <Button
                    as="a"
                    href="post_insitu.php"
                    variant="link"
                    colorScheme="blue"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'blue.600',
                      _hover: { color: 'blue.800', textDecoration: 'none' },
                    }}
                  >
                    Insitu Teachers
                  </Button>
                </VStack>
              </Box>
            </Grid>
          </GridItem>
          <GridItem bg="green.200" p={4} borderRadius="md">
            <Grid templateColumns="auto 1fr" gap={3} alignItems="center">
              <Icon as={FaCloudDownloadAlt} boxSize={6} />
              <Box>
                <Heading as="h4" size="md">Update</Heading>
                <VStack align="start" spacing={2} mt={4}>
                  <Button
                    as="a"
                    href="all_notice.php"
                    variant="link"
                    colorScheme="green"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'green.600',
                      _hover: { color: 'green.800', textDecoration: 'none' },
                    }}
                  >
                    Notice
                  </Button>
                  <Button
                    as="a"
                    href="news.php"
                    variant="link"
                    colorScheme="green"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'green.600',
                      _hover: { color: 'green.800', textDecoration: 'none' },
                    }}
                  >
                    News
                  </Button>
                  <Button
                    as="a"
                    href="link_page.php?linkto=Office%20Order"
                    variant="link"
                    colorScheme="green"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'green.600',
                      _hover: { color: 'green.800', textDecoration: 'none' },
                    }}
                  >
                    Office Order
                  </Button>
                  <Button
                    as="a"
                    href="link_page.php?linkto=apa"
                    variant="link"
                    colorScheme="green"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'green.600',
                      _hover: { color: 'green.800', textDecoration: 'none' },
                    }}
                  >
                    APA
                  </Button>
                </VStack>
              </Box>
            </Grid>
          </GridItem>
          <GridItem bg="teal.300" p={4} borderRadius="md">
            <Grid templateColumns="auto 1fr" gap={3} alignItems="center">
              <Icon as={FaCertificate} boxSize={6} />
              <Box>
                <Heading as="h4" size="md">Misc</Heading>
                <VStack align="start" spacing={2} mt={4}>
                  <Button
                    as="a"
                    href="link_page.php?linkto=Admission"
                    variant="link"
                    colorScheme="teal"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'teal.600',
                      _hover: { color: 'teal.800', textDecoration: 'none' },
                    }}
                  >
                    Admission
                  </Button>
                  <Button
                    as="a"
                    href="link_page.php?linkto=Exam%20Routine"
                    variant="link"
                    colorScheme="teal"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'teal.600',
                      _hover: { color: 'teal.800', textDecoration: 'none' },
                    }}
                  >
                    Result
                  </Button>
                  <Button
                    as="a"
                    href="link_page.php?linkto=Class%20Routine"
                    variant="link"
                    colorScheme="teal"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'teal.600',
                      _hover: { color: 'teal.800', textDecoration: 'none' },
                    }}
                  >
                    Class Routine
                  </Button>
                  <Button
                    as="a"
                    href="department_list.php"
                    variant="link"
                    colorScheme="teal"
                    size="sm"
                    sx={{
                      textDecoration: 'none',
                      color: 'teal.600',
                      _hover: { color: 'teal.800', textDecoration: 'none' },
                    }}
                  >
                    Department
                  </Button>
                </VStack>
              </Box>
            </Grid>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Mission;
