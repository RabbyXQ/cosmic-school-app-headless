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
  Spinner,
  useToast,
  useColorModeValue,
  Link as ChakraLink,
  Heading,
  Tag,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './API';
import { MdNotifications } from 'react-icons/md';

const getDateColor = (id: number) => {
  if (id % 6 === 0) return 'green.200';
  if (id % 2 === 0) return 'blue.200';
  if (id % 3 === 0) return 'yellow.200';
  if (id % 4 === 0) return 'gray.200';
  if (id % 5 === 0) return 'orange.200';
  return 'red.200';
};

interface News {
  id: number;
  news_date: string; // Changed to string for API compatibility
  title: string;
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: News[];
}

interface NewsBoardProps {
  showPaging: boolean;
  showAll: boolean;
  pageSize?: number;
}

const NewsBoard: React.FC<NewsBoardProps> = ({
  showPaging,
  showAll,
  pageSize = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [newsData, setNewsData] = useState<PaginatedResponse | null>(null);
  const [filteredNews, setFilteredNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('red.400', 'red.400');
  const linkColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('white.50', 'gray.900');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/news?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: PaginatedResponse = await response.json();
        setNewsData(data);
        setFilteredNews(data.items); // Initialize filtered news
      } catch (error) {
        setError('Failed to fetch news');
        console.error('Error fetching news:', error);
        toast({
          title: 'Fetch Error',
          description: 'Failed to fetch news.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (newsData) {
      const filtered = newsData.items.filter(news =>
        news.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    }
  }, [searchQuery, newsData]);

  if (loading) {
    return (<></>
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
          <MdNotifications />
          News
        </Heading>
        {showAll && (
          <Link to="/news">
            <ChakraLink fontWeight="bold" color={linkColor} fontSize="md">
              Show All
            </ChakraLink>
          </Link>
        )}
      </Flex>
      {showPaging && (
        <Box mb={4}>
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
      )}
      <Stack spacing={1}>
        {filteredNews.map(news => (
          <Box
            key={news.id}
            p={4}
            borderRadius="md"
            borderWidth={1}
            borderColor={borderColor}
            bg={cardBgColor}
          >
            <Flex direction="row" align="center" mb={2}>
              <Tag bg={getDateColor(news.id)} variant="solid" mr={1}>
                {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(news.news_date))}
              </Tag>
              <Text fontSize="lg" fontWeight="bold">
                <Link to={`/news/${news.id}`}>
                  <ChakraLink
                    color={linkColor}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {news.title}
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
            {newsData && (
              <Text>
                Page {newsData.currentPage} of {newsData.totalPages}
              </Text>
            )}
            {newsData && (
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, newsData.totalPages))}
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

export default NewsBoard;
