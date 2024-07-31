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
import { SettingMenu } from './Settings';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

const initialPages: Page[] = [
  { id: 1, title: 'Notices', slug: '/notices', content: 'A page to manage and view notices.' },
  { id: 2, title: 'Payments', slug: '/payments', content: 'A page to manage and view payments.' },
  { id: 3, title: 'Dashboard', slug: '/dashboard', content: 'A summary page displaying various metrics.' },
  { id: 4, title: 'Reports', slug: '/reports', content: 'A page to generate and view reports.' },
  { id: 5, title: 'Settings', slug: '/settings', content: 'A page to configure application settings.' },
  { id: 6, title: 'Users', slug: '/users', content: 'A page to manage user accounts.' },
  { id: 7, title: 'Help', slug: '/help', content: 'A page to provide help and support information.' },
  { id: 8, title: 'Feedback', slug: '/feedback', content: 'A page to collect user feedback.' },
  { id: 9, title: 'Announcements', slug: '/announcements', content: 'A page for company announcements.' },
  { id: 10, title: 'Events', slug: '/events', content: 'A page to manage and view events.' },
];

const Pages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const filteredPages = initialPages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPages = filteredPages.slice(startIndex, startIndex + itemsPerPage);

  const handleSelectPage = (id: number) => {
    setSelectedPages(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(pageId => pageId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === filteredPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(filteredPages.map(page => page.id));
    }
  };

  const handleDelete = (ids: number[]) => {
    // Implement delete functionality here
    console.log('Deleting pages with ids:', ids);
    setSelectedPages([]);
  };

  return (
    <Container maxW="container.lg" py={6}>
      <SettingMenu/>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Pages Overview</Text>
        <Link to="/admin/settings/add-page">
          <Button colorScheme="teal">Add Page</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox isChecked={selectedPages.length === filteredPages.length} onChange={handleSelectAll}>
          Select All
        </Checkbox>
        {selectedPages.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedPages)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {currentPages.map(page => (
          <Box key={page.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedPages.includes(page.id)}
                  onChange={() => handleSelectPage(page.id)}
                />
                <Text fontSize="xl" fontWeight="bold">
                  <Link to={page.slug}>{page.title}</Link>
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Link to={`/admin/settings/edit-page/${page.id}`}>
                  <Button size="sm" colorScheme="teal">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete([page.id])}
                >
                  Delete
                </Button>
              </HStack>
            </Flex>
            <Text>{page.content}</Text>
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

export default Pages;
