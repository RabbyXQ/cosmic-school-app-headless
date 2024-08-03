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
  Checkbox,
  Spinner,
  useToast
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../API';

interface Event {
  id: number;
  title: string;
  event_date: string; // Updated to event_date field
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Event[];
}

const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [eventsData, setEventsData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/events?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`);
      const data: PaginatedResponse = await response.json();
      setEventsData(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (id: number) => {
    setSelectedEvents(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(eventId => eventId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (eventsData?.items?.length === selectedEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(eventsData?.items.map(event => event.id) || []);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (ids.length === 0) return;

    try {
      const deletePromises = ids.map(id =>
        fetch(`${API_BASE_URL}/events/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);

      toast({
        title: 'Events deleted.',
        description: `Successfully deleted ${ids.length} event(s).`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedEvents([]);
      fetchEvents(); // Refresh the page list
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'Failed to delete events.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={6}>
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (!eventsData || eventsData.items.length === 0) {
    return (
      <Container maxW="container" py={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">Events Overview</Text>
          <Link to="/admin/events/add-event">
            <Button colorScheme="teal">Add Event</Button>
          </Link>
        </Flex>
        <Text>No events found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container" py={4}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Events Overview</Text>
        <Link to="/admin/events/add-event">
          <Button colorScheme="teal">Add Event</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search Events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox
          isChecked={selectedEvents.length === eventsData.items.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>
        {selectedEvents.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedEvents)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {eventsData.items.map(event => (
          <Box key={event.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex direction="column" mb={2}>
              <HStack spacing={2}>
                <Checkbox
                  isChecked={selectedEvents.includes(event.id)}
                  onChange={() => handleSelectEvent(event.id)}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {event.title}
                </Text>
              </HStack>
              <Text fontSize="md" color="gray.600">{event.event_date}</Text>
              <HStack spacing={2} mt={2}>
                <Link to={`/admin/events/edit-event/${event.id}`}>
                  <Button size="sm" colorScheme="teal">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete([event.id])}
                >
                  Delete
                </Button>
              </HStack>
            </Flex>
          </Box>
        ))}
      </Stack>
      <Flex justify="space-between" align="center" mt={4}>
        <HStack>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text>
            Page {eventsData.currentPage} of {eventsData.totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, eventsData.totalPages))}
            disabled={currentPage === eventsData.totalPages}
          >
            Next
          </Button>
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
    </Container>
  );
};

export default Events;
