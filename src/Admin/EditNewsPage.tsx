// src/pages/EditNewsPage.tsx
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
} from '@chakra-ui/react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import Markdown editor styles
import MarkdownIt from 'markdown-it'; // For rendering Markdown to HTML
import { useParams, useNavigate } from 'react-router-dom';

// Simulated fetch and update functions
const fetchNewsById = async (id: string): Promise<{ title: string, content: string }> => {
  // Replace with actual fetch logic
  return { title: 'Sample News', content: 'This is a sample news content' };
};

const updateNews = async (id: string, data: { title: string, content: string }) => {
  // Replace with actual update logic
};

const uploadImage = async (file: File): Promise<{ url: string }> => {
  const imageUrl = URL.createObjectURL(file); // Replace with actual upload logic
  return { url: imageUrl };
};

const mdParser = new MarkdownIt();

const EditNewsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadNews = async () => {
      const news = await fetchNewsById(id as string);
      setTitle(news.title);
      setContent(news.content);
    };

    loadNews();
  }, [id]);

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

  const handleUpdate = async () => {
    if (title.trim() && content.trim()) {
      await updateNews(id as string, { title, content });
      toast({
        title: 'News updated.',
        description: `The news "${title}" has been updated.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/news');
    } else {
      toast({
        title: 'Input Error',
        description: 'Both title and content are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={6}>
      <Heading mb={6}>Edit News</Heading>
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="news-title" mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter news title"
            />
          </FormControl>
          <FormControl id="news-content" mb={4}>
            <FormLabel>Content</FormLabel>
            <MarkdownEditor
              value={content}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }: { text: string }) => setContent(text)}
              placeholder="Enter news content"
              onImageUpload={handleImageUpload}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleUpdate} isDisabled={uploading}>
            Update News
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditNewsPage;
