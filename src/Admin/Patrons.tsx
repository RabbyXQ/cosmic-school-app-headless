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

interface Patron {
  id: number;
  type: string;
  name: string;
  content: string;
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Patron[];
}

const Patrons: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedPatrons, setSelectedPatrons] = useState<number[]>([]);
  const [patronsData, setPatronsData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchPatrons();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchPatrons = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/patrons?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`);
      const data: PaginatedResponse = await response.json();
      setPatronsData(data);
    } catch (error) {
      console.error('Error fetching Patrons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPatron = (id: number) => {
    setSelectedPatrons(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(patronId => patronId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (patronsData?.items?.length === selectedPatrons.length) {
      setSelectedPatrons([]);
    } else {
      setSelectedPatrons(patronsData?.items.map(patron => patron.id) || []);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (ids.length === 0) return;

    try {
      const deletePromises = ids.map(id =>
        fetch(`${API_BASE_URL}/patrons/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);

      toast({
        title: 'Patrons deleted.',
        description: `Successfully deleted ${ids.length} patron(s).`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedPatrons([]);
      fetchPatrons(); // Refresh the page list
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'Failed to delete Patrons.',
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

  if (!patronsData || patronsData.items.length === 0) {
    return (
      <Container maxW="container" py={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">Patrons Overview</Text>
          <Link to="/admin/patrons/add-patron">
            <Button colorScheme="teal">Add Patron</Button>
          </Link>
        </Flex>
        <Text>No Patrons found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container" py={4}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Patrons Overview</Text>
        <Link to="/admin/patrons/add-patron">
          <Button colorScheme="teal">Add Patron</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search Patrons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox
          isChecked={selectedPatrons.length === patronsData.items.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>
        {selectedPatrons.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedPatrons)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {patronsData.items.map(patron => (
          <Box key={patron.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedPatrons.includes(patron.id)}
                  onChange={() => handleSelectPatron(patron.id)}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {patron.name}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Link to={`/admin/patrons/edit-patron/${patron.id}`}>
                  <Button size="sm" colorScheme="teal">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete([patron.id])}
                >
                  Delete
                </Button>
              </HStack>
            </Flex>
            <Text>{patron.content}</Text>
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
            Page {patronsData.currentPage} of {patronsData.totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, patronsData.totalPages))}
            disabled={currentPage === patronsData.totalPages}
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

export default Patrons;
