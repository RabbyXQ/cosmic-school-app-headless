import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Spinner, Text, useToast, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

type Patron = {
  id: number;
  type: 'head' | 'asst' | 'sect';
  name: string;
  content: string;
};

const ViewPatron: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Use `id` from URL params
  const [patron, setPatron] = useState<Patron | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPatron = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/patrons/${id}`); // Updated endpoint
        setPatron(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching patron details');
        setLoading(false);
        toast({ title: 'Error fetching patron details.', status: 'error', duration: 3000, isClosable: true });
      }
    };

    if (id) {
      fetchPatron();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Spinner />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Box>{error}</Box>
      </Flex>
    );
  }

  return (
    <Flex justify="center" p={4}>
      <Box
        maxW="container.lg"
        p={6}
        borderRadius="md"
        bg="white"
        boxShadow="md"
        _dark={{ bg: 'gray.800', boxShadow: 'md' }} // Dark mode styles
        overflowY="auto" // Enable vertical scrolling if content exceeds max height
      >
        {patron ? (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {patron.name}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Designation: {patron.type === 'head' ? 'Head' : patron.type === 'asst' ? 'Assistant Head' : 'Secretary'}
            </Text>
            <Box textAlign="justify">
              <ReactMarkdown
                children={patron.content}
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      style={{ maxWidth: '50%', height: 'auto', borderRadius: '8px' }}
                      alt={props.alt || ''}
                    />
                  ),
                  a: ({ node, ...props }) => (
                    <a
                      {...props}
                      style={{ color: 'red', textDecoration: 'underline' }} // Style links
                      target="_blank" // Open links in a new tab
                      rel="noopener noreferrer" // Security feature
                    />
                  ),
                }}
              />
            </Box>
          </>
        ) : (
          <Text>No content available</Text>
        )}
      </Box>
    </Flex>
  );
};

export default ViewPatron;
