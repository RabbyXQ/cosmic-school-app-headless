import React from 'react';
import { Box, Container, Grid, GridItem, Heading, Text, Image, Link, Flex, useColorModeValue } from '@chakra-ui/react';
import { FaArrowCircleRight } from 'react-icons/fa';

const Message: React.FC = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  return (
    <Box id="say" bg={bgColor} py={8}>
      <Container maxW="container.lg">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          <GridItem>
            <Flex direction="row" align="center" gap={4}>
              <Image 
                src="https://www.noakhalicoll.gov.bd/midea/featuredimage/featuredimage2023-08-04-13-28-46_64ccfd0e21233.jpg" 
                alt="Principal" 
                borderRadius="md"
                boxSize="150px"
                objectFit="cover"
              />
              <Box>
                <Heading as="h3" size="md" mb={2}>
                  MESSAGE OF THE PRINCIPAL
                </Heading>
                <Text color={textColor} textAlign="justify">
                  I welcome you all faculty members, prospective & current students as well as stakeholders and alumni to these pages of the college website for needful information in the way of digital Bangladesh. 
                  <Link href="page.php?id=14" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                    More <FaArrowCircleRight />
                  </Link>
                </Text>
              </Box>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex direction="row" align="center" gap={4}>
              <Image 
                src="https://www.noakhalicoll.gov.bd/midea/featuredimage/featuredimage2023-07-26-13-48-43_64c1243b5617c.jpg" 
                alt="Vice Principal" 
                borderRadius="md"
                boxSize="150px"
                objectFit="cover"
              />
              <Box>
                <Heading as="h3" size="md" mb={2}>
                  MESSAGE OF THE VICE-PRINCIPAL
                </Heading>
                <Text color={textColor} textAlign="justify">
                  We extend a heartfelt welcome to all of you as you explore the pages of our college website, where you can access essential information about our institution's role in advancing the concept of a digital Bangladesh. 
                  <Link href="page.php?id=15" color="teal.500" _hover={{ textDecoration: 'underline' }}>
                    More <FaArrowCircleRight />
                  </Link>
                </Text>
              </Box>
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

export default Message;
