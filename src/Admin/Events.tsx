// src/pages/Events.tsx
import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const initialEvents = [
  { id: 1, title: 'Company Meeting', content: 'Details of the company meeting.' },
  { id: 2, title: 'Team Building Event', content: 'Details of the team building event.' },
  { id: 3, title: 'Annual Party', content: 'Details of the annual party.' },
];

const Events: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);

  const handleDelete = (ids: number[]) => {
    setEvents(events.filter(item => !ids.includes(item.id)));
    setSelectedEvents([]);
  };

  const handleSelectEvent = (id: number) => {
    setSelectedEvents(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(eventId => eventId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map(item => item.id));
    }
  };

  const filteredEvents = events.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Events</Text>
        <Link to="/admin/add-event">
          <Button colorScheme="teal">Add Event</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox isChecked={selectedEvents.length === filteredEvents.length} onChange={handleSelectAll}>
          Select All
        </Checkbox>
        {selectedEvents.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedEvents)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {currentEvents.map(item => (
          <Box key={item.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedEvents.includes(item.id)}
                  onChange={() => handleSelectEvent(item.id)}
                />
                <Text fontSize="xl" fontWeight="bold">{item.title}</Text>
              </HStack>
              <HStack spacing={2}>
                <Link to={`/admin/edit-event/${item.id}`}>
                  <Button size="sm" colorScheme="teal">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete([item.id])}
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
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
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
