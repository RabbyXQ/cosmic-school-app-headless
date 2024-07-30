// src/pages/News.tsx
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

const initialNews = [
  { id: 1, title: 'Breaking News', content: 'Important news content goes here.' },
  { id: 2, title: 'Daily Update', content: 'Today’s news update.' },
  { id: 3, title: 'Weekly Roundup', content: 'Summary of the week’s news.' },
];

const News: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [news, setNews] = useState(initialNews);
  const [selectedNews, setSelectedNews] = useState<number[]>([]);

  const handleDelete = (ids: number[]) => {
    setNews(news.filter(item => !ids.includes(item.id)));
    setSelectedNews([]);
  };

  const handleSelectNews = (id: number) => {
    setSelectedNews(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(newsId => newsId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNews.length === filteredNews.length) {
      setSelectedNews([]);
    } else {
      setSelectedNews(filteredNews.map(item => item.id));
    }
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">News</Text>
        <Link to="/admin/add-news">
          <Button colorScheme="teal">Add News</Button>
        </Link>
      </Flex>
      <Box mb={4}>
        <Input
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>
      <Flex justify="space-between" mb={4}>
        <Checkbox isChecked={selectedNews.length === filteredNews.length} onChange={handleSelectAll}>
          Select All
        </Checkbox>
        {selectedNews.length > 0 && (
          <Button colorScheme="red" onClick={() => handleDelete(selectedNews)}>
            Delete Selected
          </Button>
        )}
      </Flex>
      <Stack spacing={4}>
        {currentNews.map(item => (
          <Box key={item.id} p={4} borderWidth={1} borderRadius="md" boxShadow="md">
            <Flex justify="space-between" mb={2}>
              <HStack>
                <Checkbox
                  isChecked={selectedNews.includes(item.id)}
                  onChange={() => handleSelectNews(item.id)}
                />
                <Text fontSize="xl" fontWeight="bold">{item.title}</Text>
              </HStack>
              <HStack spacing={2}>
                <Link to={`/admin/edit-news/${item.id}`}>
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

export default News;
