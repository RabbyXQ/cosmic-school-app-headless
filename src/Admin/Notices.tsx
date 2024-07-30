// src/pages/Notices.tsx
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

const initialNotices = [
  { id: 1, title: 'Important Update', content: '<p>This is an <strong>important</strong> update!</p>' },
  { id: 2, title: 'Reminder', content: '<ul><li>Don\'t forget the meeting tomorrow.</li><li>Check your email for details.</li></ul>' },
  { id: 3, title: 'Event Announcement', content: '<p>We have an upcoming event.</p>' },
  { id: 4, title: 'Holiday Notice', content: '<p>We will have a holiday on Friday.</p>' },
  { id: 5, title: 'Policy Update', content: '<p>New policy changes have been implemented.</p>' },
  { id: 6, title: 'Meeting Minutes', content: '<p>Here are the minutes of the last meeting.</p>' },
  { id: 7, title: 'Safety Guidelines', content: '<p>Updated safety guidelines.</p>' },
  { id: 8, title: 'Project Update', content: '<p>Project progress update.</p>' },
  { id: 9, title: 'Training Session', content: '<p>Details about the training session.</p>' },
  { id: 10, title: 'New Joinee', content: '<p>Welcome to our new team member.</p>' },
];

const Notices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [notices, setNotices] = useState(initialNotices);
  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);

  const handleDelete = (ids: number[]) => {
    setNotices(notices.filter(notice => !ids.includes(notice.id)));
    setSelectedNotices([]);
  };

  const handleSelectNotice = (id: number) => {
    setSelectedNotices(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(noticeId => noticeId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotices.length === filteredNotices.length) {
      setSelectedNotices([]);
    } else {
      setSelectedNotices(filteredNotices.map(notice => notice.id));
    }
  };

  const filteredNotices = notices.filter(notice =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = filteredNotices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Notices</Text>
        <Link to="/admin/add-notice">
          <Button colorScheme="teal">Add Notice</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search notices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox isChecked={selectedNotices.length === filteredNotices.length} onChange={handleSelectAll}>
          Select All
        </Checkbox>
        {selectedNotices.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedNotices)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {currentNotices.map(notice => (
          <Box key={notice.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedNotices.includes(notice.id)}
                  onChange={() => handleSelectNotice(notice.id)}
                />
                <Text fontSize="xl" fontWeight="bold">{notice.title}</Text>
              </HStack>
              <HStack spacing={2}>
                <Link to={`/admin/edit-notice/${notice.id}`}>
                  <Button size="sm" colorScheme="teal">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete([notice.id])}
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

export default Notices;
