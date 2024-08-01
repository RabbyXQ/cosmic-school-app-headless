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
  Icon,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from './API';
import { FaArrowRight } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';

const arrowColor = (id: number) => {
  if (id % 6 === 0) return 'green.500';
  if (id % 2 === 0) return 'blue.500';
  if (id % 3 === 0) return 'yellow.500';
  if (id % 4 === 0) return 'gray.500';
  if (id % 5 === 0) return 'orange.500';
  return 'red.500';
};

interface Notice {
  id: number;
  title: string;
}

interface PaginatedResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: Notice[];
}

interface NoticeBoardProps {
  showPaging: boolean;
  showAll: boolean;
  pageSize?: number;
}

const NoticeBoard: React.FC<NoticeBoardProps> = ({
  showPaging,
  showAll,
  pageSize = 10,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [noticesData, setNoticesData] = useState<PaginatedResponse | null>(null);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('red.400', 'red.400');
  const linkColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const cardBgColor = useColorModeValue('white.50', 'gray.900');

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/notices?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: PaginatedResponse = await response.json();
        setNoticesData(data);
        setFilteredNotices(data.items); // Initialize filtered notices
      } catch (error) {
        setError('Failed to fetch notices');
        console.error('Error fetching notices:', error);
        toast({
          title: 'Fetch Error',
          description: 'Failed to fetch notices.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    if (noticesData) {
      const filtered = noticesData.items.filter(notice =>
        notice.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotices(filtered);
    }
  }, [searchQuery, noticesData]);

  if (loading) {
    return (
      <Container maxW="container.lg" py={6}>
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
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
          <MdNotifications />
          Notices
        </Heading>        
        {showAll && (
          <Link to="/notices">
            <ChakraLink fontWeight="bold" color={linkColor} fontSize="md">
              Show All
            </ChakraLink>
          </Link>
        )}
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search notices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Stack spacing={4}>
        {filteredNotices.map(notice => (
          <Box
            key={notice.id}
            p={4}
            borderRadius="md"
            borderWidth={1}
            borderColor={borderColor}
            bg={cardBgColor}
          >
            <Flex direction="row" align="center">
              <Icon mx="3" as={FaArrowRight} color={arrowColor(notice.id)} />
              <Text fontSize="lg" fontWeight="bold">
                <Link to={`/notices/${notice.id}`}>
                  <ChakraLink
                    color={linkColor}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    {notice.title}
                  </ChakraLink>
                </Link>
              </Text>
            </Flex>
          </Box>
        ))}
      </Stack>
      {showPaging  && (
        <Flex justify="space-between" align="center" mt={4}>
          <HStack>
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {noticesData && (<Text>
              Page {noticesData.currentPage} of {noticesData.totalPages}
            </Text>)}
           {noticesData && (<Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, noticesData.totalPages))}
            >
              Next
            </Button>)}
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

export default NoticeBoard;
