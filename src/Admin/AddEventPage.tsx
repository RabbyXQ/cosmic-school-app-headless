import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Heading,
  Stack,
  Select,
} from '@chakra-ui/react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { SettingMenu } from './Settings/Settings';
import { API_BASE_URL } from '../API';

const mdParser = new MarkdownIt();

const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_BASE_URL+"/pages/upload", {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return { url: API_BASE_URL + data.url };
};

const AddEventPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [galleryId, setGalleryId] = useState<string>('');
  const [galleries, setGalleries] = useState<{ id: number; name: string }[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await fetch(API_BASE_URL+"/gallery/categories/");
        if (!response.ok) {
          throw new Error('Failed to fetch gallery categories');
        }
        const data = await response.json();
        setGalleries(data);
      } catch (error) {
        toast({
          title: 'Fetch Error',
          description: 'Failed to fetch gallery categories.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchGalleries();
  }, [toast]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      return url;
    } catch (error) {
      toast({
        title: 'Upload Error',
        description: 'Failed to upload image.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (title.trim() && content.trim() && galleryId.trim()) {
      setUploading(true);
      try {
        const response = await fetch(API_BASE_URL+"/events/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
            gallery_id: galleryId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add event');
        }

        toast({
          title: 'Event added.',
          description: `The event "${title}" has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setTitle('');
        setContent('');
        setGalleryId('');
      } catch (error) {
        toast({
          title: 'Add Error',
          description: 'Failed to add the event.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
      }
    } else {
      toast({
        title: 'Input Error',
        description: 'Title, content, and gallery ID are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container" py={6}>
      <Heading size="lg" mb={6}>Add New Event</Heading>
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="event-title" mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </FormControl>
          <FormControl id="event-content" mb={4}>
            <FormLabel>Content</FormLabel>
            <MarkdownEditor
              value={content}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }: { text: string }) => setContent(text)}
              placeholder="Enter event content"
              onImageUpload={handleImageUpload}
            />
          </FormControl>
          <FormControl id="event-gallery-id" mb={4}>
            <FormLabel>Gallery</FormLabel>
            <Select
              placeholder="Select gallery"
              value={galleryId}
              onChange={(e) => setGalleryId(e.target.value)}
            >
              {galleries.map((gallery) => (
                <option key={gallery.id} value={gallery.id}>
                  {gallery.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button colorScheme="teal" onClick={handleAdd} isDisabled={uploading}>
            {uploading ? 'Adding...' : 'Add Event'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddEventPage;
