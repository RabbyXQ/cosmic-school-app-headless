import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Spinner, Text, useToast, Flex } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

type Page = {
  id: number;
  title: string;
  slug: string;
  content: string;
};

const ViewPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/pages/slug/${slug}`);
        setPage(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching page');
        setLoading(false);
        toast({ title: 'Error fetching page.', status: 'error', duration: 3000, isClosable: true });
      }
    };

    if (slug) {
      fetchPage();
    }
  }, [slug, toast]);

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
        {page ? (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {page.title}
            </Text>
            <Box textAlign="justify">
              <ReactMarkdown
    
                children={page.content}
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

export default ViewPage;
