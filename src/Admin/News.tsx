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

interface News {
  id: number;
  title: string;
  news_date: string; // Added news_date field
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: News[];
}

const News: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);
  const [newsData, setNewsData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchNews();
  }, [currentPage, itemsPerPage, searchQuery]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/news?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`);
      const data: PaginatedResponse = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching News:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (id: number) => {
    setSelectedNews(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(newsId => newsId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (newsData?.items?.length === selectedNews.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(newsData?.items.map(news => news.id) || []);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (ids.length === 0) return;

    try {
      const deletePromises = ids.map(id =>
        fetch(`${API_BASE_URL}/news/${id}`, {
          method: 'DELETE',
        })
      );

      await Promise.all(deletePromises);

      toast({
        title: 'News deleted.',
        description: `Successfully deleted ${ids.length} news item(s).`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setSelectedNews([]);
      fetchNews(); // Refresh the page list
    } catch (error) {
      toast({
        title: 'Delete Error',
        description: 'Failed to delete News.',
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

  if (!newsData || newsData.items.length === 0) {
    return (
      <Container maxW="container" py={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">News Overview</Text>
          <Link to="/admin/news/add-news">
            <Button colorScheme="teal">Add News</Button>
          </Link>
        </Flex>
        <Text>No News found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container" py={4}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">News Overview</Text>
        <Link to="/admin/news/add-news">
          <Button colorScheme="teal">Add News</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search News..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox
          isChecked={selectedNews.length === newsData.items.length}
          onChange={handleSelectAll}
        >
          Select All
        </Checkbox>
        {selectedNews.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedNews)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {newsData.items.map(news => (
          <Box key={news.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex direction="column" mb={2}>
              <HStack spacing={2}>
                <Checkbox
                  isChecked={selectedNews.includes(news.id)}
                  onChange={() => handleSelectPage(news.id)}
                />
                <Text fontSize="xl" fontWeight="bold">
                  {news.title}
                </Text>
              </HStack>
              <Text fontSize="md" color="gray.600">{news.news_date}</Text>
              <HStack spacing={2} mt={2}>
                <Link to={`/admin/news/edit-news/${news.id}`}>
                  <Button size="sm" colorScheme="teal">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDelete([news.id])}
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
            Page {newsData.currentPage} of {newsData.totalPages}
          </Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, newsData.totalPages))}
            disabled={currentPage === newsData.totalPages}
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

export default News;
