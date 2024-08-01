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

interface Page {
  id: number;
  title: string;
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Page[];
}

const Notices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedNotices, setSelectedNotices] = useState<number[]>([]);
  const [noticesData, setNoticesData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchNotices();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL + `/notices?page=${currentPage}&limit=${itemsPerPage}`);
      const data: PaginatedResponse = await response.json();
      setNoticesData(data);
    } catch (error) {
      console.error('Error fetching Notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (id: number) => {
    setSelectedNotices(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(pageId => pageId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (noticesData?.items?.length === selectedNotices.length) {
      setSelectedNotices([]);
    } else {
      setSelectedNotices(noticesData?.items.map(page => page.id) || []);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (ids.length === 0) return;

    try {
      const deletePromises = ids.map(id =>
        fetch(API_BASE_URL + `/notices/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);

      toast({
        title: 'Notices deleted.',
        description: `Successfully deleted ${ids.length} notice(s).`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedNotices([]);
      fetchNotices(); // Refresh the page list
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'Failed to delete Notices.',
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

  if (!noticesData || noticesData.items.length === 0) {
    return (
      <Container maxW="container" py={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">Notices Overview</Text>
          <Link to="/admin/notices/add-notice">
            <Button colorScheme="teal">Add Notice</Button>
          </Link>
        </Flex>
        <Text>No Notices found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container" py={4}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Notices Overview</Text>
        <Link to="/admin/notices/add-notice">
          <Button colorScheme="teal">Add Notice</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search Notices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox
          isChecked={selectedNotices.length === noticesData.items.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>
        {selectedNotices.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedNotices)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {noticesData.items.map(page => (
          <Box key={page.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedNotices.includes(page.id)}
                  onChange={() => handleSelectPage(page.id)}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {page.title}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Link to={`/admin/notices/edit-notice/${page.id}`}>
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
            Page {noticesData.currentPage} of {noticesData.totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, noticesData.totalPages))}
            disabled={currentPage === noticesData.totalPages}
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
