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
import { SettingMenu } from './Settings';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Page[];
}

const Pages: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pagesData, setPagesData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchPages();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/pages/get-all?page=${currentPage}&limit=${itemsPerPage}`);
      const data: PaginatedResponse = await response.json();
      setPagesData(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (id: number) => {
    setSelectedPages(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(pageId => pageId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedPages.length === (pagesData?.items.length || 0)) {
      setSelectedPages([]);
    } else {
      setSelectedPages(pagesData?.items.map(page => page.id) || []);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (ids.length === 0) return;
    
    try {
      const deletePromises = ids.map(id => 
        fetch(`http://localhost:4000/pages/delete/${id}`, {
          method: 'DELETE',
        })
      );
      
      await Promise.all(deletePromises);

      toast({
        title: 'Pages deleted.',
        description: `Successfully deleted ${ids.length} page(s).`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedPages([]);
      fetchPages(); // Refresh the page list
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'Failed to delete pages.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={6}>
        <SettingMenu />
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      </Container>
    );
  }

  if (!pagesData || pagesData.items.length === 0) {
    return (
      <Container maxW="container" py={6}>
        <SettingMenu />
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">Pages Overview</Text>
          <Link to="/admin/settings/add-page">
            <Button colorScheme="teal">Add Page</Button>
          </Link>
        </Flex>
        <Text>No pages found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container" py={4}>
      <SettingMenu />
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
        <Checkbox
          isChecked={selectedPages.length === pagesData.items.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>
        {selectedPages.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedPages)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {pagesData.items.map(page => (
          <Box key={page.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedPages.includes(page.id)}
                  onChange={() => handleSelectPage(page.id)}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {page.title}
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
            Page {pagesData.currentPage} of {pagesData.totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagesData.totalPages))}
            disabled={currentPage === pagesData.totalPages}
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
