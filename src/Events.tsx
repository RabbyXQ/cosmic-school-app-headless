import React from 'react';
import { Box, Container, Heading, Link, List, ListItem, Flex, Text, useColorModeValue, Image } from '@chakra-ui/react';
import { FaCalendarAlt } from 'react-icons/fa';

const eventItems = [
  { date: '01-12-2024', href: 'page.php?id=400', text: 'College Annual Day Celebration' },
  { date: '15-11-2024', href: 'page.php?id=401', text: 'Inter-College Sports Meet' },
  { date: '05-10-2024', href: 'page.php?id=402', text: 'Cultural Fest' },
  { date: '20-09-2024', href: 'page.php?id=403', text: 'Faculty Orientation Program' },
  { date: '10-08-2024', href: 'page.php?id=404', text: 'Alumni Meet & Greet' },
];

const Events: React.FC = () => {
  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('orange.400', 'orange.400');
  const linkColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('white.50', 'gray.900');
  
  return (
    <Box bg={bgColor} py={8} px={4}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h5" size="md" color={textColor} display="flex" alignItems="center">
            <FaCalendarAlt style={{ marginRight: '8px' }} />
            Upcoming Events
          </Heading>
          <Link href="events.php" color={linkColor} fontSize="sm">
            Event Archive
          </Link>
        </Flex>
        <List spacing={3}>
          {eventItems.map((event, index) => (
            <ListItem key={index} p={4} borderRadius="md" borderWidth={1} borderColor={borderColor} bg={cardBgColor}>
              <Flex direction="row" align="center">
                <Box mr={4}>
                  <Text fontSize="sm" fontWeight="bold">{event.date}</Text>
                </Box>
                <Box flex="1">
                  <Text fontSize="lg" fontWeight="bold">
                    <Link href={event.href} color={linkColor} _hover={{ textDecoration: 'underline' }}>
                      {event.text}
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

export default Events;
