import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Flex,
  Stack,
  Text,
  Button,
  Input,
  Select,
  HStack,
  useToast,
  useColorModeValue,
  Link as ChakraLink,
  Heading,
  Tag,
} from '@chakra-ui/react';

import { Link } from 'react-router-dom';
import { API_BASE_URL } from './API';
import { MdCalendarViewDay, MdEvent } from 'react-icons/md';
import { FaCalendar } from 'react-icons/fa';
import { randomInt } from 'crypto';

const getDateColor = (id: number) => {
    id = ((id * 182)/2)+331;
  if (id % 6 === 0) return 'green.200';
  if (id % 2 === 0) return 'blue.200';
  if (id % 3 === 0) return 'yellow.200';
  if (id % 4 === 0) return 'gray.200';
  if (id % 5 === 0) return 'orange.200';
  return 'red.200';
};

interface Event {
  id: number;
  event_date: string;
  title: string;
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Event[];
}

interface EventsBoardProps {
  showPaging: boolean;
  showAll: boolean;
  pageSize?: number;
}

const EventsBoard: React.FC<EventsBoardProps> = ({
  showPaging,
  showAll,
  pageSize = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [eventsData, setEventsData] = useState<PaginatedResponse | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('red.400', 'red.400');
  const linkColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('white.50', 'gray.900');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/events?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: PaginatedResponse = await response.json();
        setEventsData(data);
        setFilteredEvents(data.items);
      } catch (error) {
        setError('Failed to fetch events');
        console.error('Error fetching events:', error);
        toast({
          title: 'Fetch Error',
          description: 'Failed to fetch events.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, itemsPerPage, toast]);

  useEffect(() => {
    if (eventsData) {
      const filtered = eventsData.items.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, eventsData]);

  if (loading) {
    return (
      <Container maxW="container.lg" py={6}>
        <Flex align="center" justify="center" height="100vh">
          <Text>Loading...</Text>
        </Flex>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.lg" py={6}>
        <Text color="red.500" fontSize="lg" textAlign="center">
          {error}
        </Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={4}>
      <Flex justify="space-between" mb={4}>
        <Heading as="h5" size="md" color={textColor} display="flex" alignItems="center">
          <MdEvent />
          Events
        </Heading>
        {showAll && (
          <Link to="/events">
            <ChakraLink fontWeight="bold" color={linkColor} fontSize="md">
              Show All
            </ChakraLink>
          </Link>
        )}
      </Flex>
      {showPaging && (
        <Box mb={4}>
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      )}
      <Stack spacing={1}>
        {filteredEvents.map(event => (
          <Box
            key={event.id}
            p={4}
            borderRadius="md"
            borderWidth={1}
            borderColor={borderColor}
            bg={cardBgColor}
          >
            <Flex direction="row" align="center" mb={2}>
              <Tag bg={getDateColor(event.id)} variant="solid" mr={1}>
                <FaCalendar/>
              </Tag>
              <Text fontSize="lg" fontWeight="bold">
                <Link to={`/events/${event.id}`}>
                  <ChakraLink
                    color={linkColor}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {event.title}
                  </ChakraLink>
                </Link>
              </Text>
            </Flex>
          </Box>
        ))}
      </Stack>
      {showPaging && (
        <Flex justify="space-between" align="center" mt={4}>
          <HStack>
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {eventsData && (
              <Text>
                Page {eventsData.currentPage} of {eventsData.totalPages}
              </Text>
            )}
            {eventsData && (
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, eventsData.totalPages))}
              >
                Next
              </Button>
            )}
          </HStack>
          <Select
            width="auto"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5 items per page</option>
            <option value={10}>10 items per page</option>
            <option value={15}>15 items per page</option>
          </Select>
        </Flex>
      )}
    </Container>
  );
};

export default EventsBoard;
