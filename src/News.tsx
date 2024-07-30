import React from 'react';
import { Box, Container, Heading, Link, List, ListItem, Flex, Text, useColorModeValue, Image } from '@chakra-ui/react';
import { FaNewspaper } from 'react-icons/fa';

const newsItems = [
  { date: '23-01-2024', href: 'page.php?id=338', text: '২০২২-২০২৩ শিক্ষাবর্ষে দ্বাদশ শ্রেণির নির্বাচনী' },
  { date: '09-01-2024', href: 'page.php?id=335', text: 'সেবা প্রদানের প্রতিশ্রুতি কলেজের প্রশাসনিক কার' },
  { date: '30-11-2023', href: 'page.php?id=327', text: '২০২৩-২০২৪ অর্থ বছরের এপিএ (APA) রিপোর্ট' },
  { date: '20-08-2023', href: 'page.php?id=300', text: 'একাদশ শ্রেণির বার্ষিক পরীক্ষা ২০২৩ এর রুটিন' },
  { date: '22-06-2021', href: 'page.php?id=183', text: 'KAMRUN NAHAR BEGUM NOC' },
];

const News: React.FC = () => {
  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('red.400', 'red.400');
  const linkColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('white.50', 'gray.900');
  
  return (
    <Box bg={bgColor} py={8} px={4}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h5" size="md" color={textColor} display="flex" alignItems="center">
            <FaNewspaper style={{ marginRight: '8px' }} />
            NEWS &amp; Update
          </Heading>
          <Link href="news.php" color={linkColor} fontSize="sm">
            News Archive
          </Link>
        </Flex>
        <List spacing={3}>
          {newsItems.map((news, index) => (
            <ListItem key={index} p={4} borderRadius="md" borderWidth={1} borderColor={borderColor} bg={cardBgColor}>
              <Flex direction="row" align="center">
                <Box mr={4}>
                <Text fontSize="sm" fontWeight="bold">{news.date}</Text>
                </Box>
                <Box flex="1">
                  <Text fontSize="lg" fontWeight="bold">
                    <Link href={news.href} color={linkColor} _hover={{ textDecoration: 'underline' }}>
                      {news.text}
                    </Link>
                  </Text>
                  
                </Box>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default News;
