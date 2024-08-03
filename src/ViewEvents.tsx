import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Box, Text, Flex, useToast, SimpleGrid, Image } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import remarkGfm from 'remark-gfm';

type Event = {
  id: number;
  title: string;
  content: string;
  event_date: string;
  gallery_id: number; // Added gallery_id field
};

type GalleryImage = {
  id: number;
  gallery_id: number;
  image: string;
};

const ViewEvents: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Use `id` from URL params
  const [event, setEvent] = useState<Event | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/events/${id}`); // Updated endpoint
        setEvent(response.data);
        if (response.data.gallery_id) {
          const galleryResponse = await axios.get(`http://localhost:4000/gallery/items/category/${response.data.gallery_id}`);
          setGalleryImages(galleryResponse.data);
        }
        setLoading(false);
      } catch (error) {
        setError('Error fetching event');
        setLoading(false);
        toast({ title: 'Error fetching event.', status: 'error', duration: 3000, isClosable: true });
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, toast]);

  if (loading) {
    return (
      <Flex align="center" justify="center" height="100vh">
        <Text>Loading...</Text>
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
        {event ? (
          <>
            <Text fontSize="2xl" fontWeight="bold" mb={2}>
              {event.title}
            </Text>
            <Text fontSize="sm" color="gray.500" mb={4}>
              {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(event.event_date))}
            </Text>
            <Box textAlign="justify" mb={6}>
              <ReactMarkdown
                children={event.content}
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
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
            <Text fontSize="lg" fontWeight="bold" mb={4}>Gallery</Text>
            {galleryImages.length > 0 ? (
              <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
                {galleryImages.map(image => (
                  <Image
                    key={image.id}
                    src={`http://localhost:4000${image.image}`}
                    alt={`Gallery image ${image.id}`}
                    borderRadius="md"
                    boxShadow="md"
                    objectFit="cover"
                    height="200px"
                    width="100%"
                  />
                ))}
              </SimpleGrid>
            ) : (
              <Text>No images available</Text>
            )}
          </>
        ) : (
          <Text>No content available</Text>
        )}
      </Box>
    </Flex>
  );
};

export default ViewEvents;
