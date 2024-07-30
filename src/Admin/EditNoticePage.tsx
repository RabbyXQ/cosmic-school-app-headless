// src/pages/EditNoticePage.tsx
import React, { useState, useEffect } from 'react';
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
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css'; // Import Markdown editor styles
import MarkdownIt from 'markdown-it'; // For rendering Markdown to HTML

// Simulated API calls
const fetchNoticeById = async (id: string) => {
  return {
    id,
    title: 'Sample Notice Title',
    content: 'Sample notice content',
  };
};

const updateNotice = async (id: string, updatedNotice: { title: string; content: string }) => {
  // Replace with actual update logic
  console.log('Updated notice:', id, updatedNotice);
};

const uploadImage = async (file: File): Promise<{ url: string }> => {
  const imageUrl = URL.createObjectURL(file); // Replace with actual upload logic
  return { url: imageUrl };
};

const mdParser = new MarkdownIt();

const EditNoticePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadNotice = async () => {
      if (id) {
        const notice = await fetchNoticeById(id);
        setTitle(notice.title);
        setContent(notice.content);
      }
    };

    loadNotice();
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
      if (id) {
        await updateNotice(id, { title, content });
        toast({
          title: 'Notice updated.',
          description: `The notice "${title}" has been updated.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/notices'); // Redirect to the notices list page
      }
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
      <Heading mb={6}>Edit Notice</Heading>
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="notice-title" mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter notice title"
            />
          </FormControl>
          <FormControl id="notice-content" mb={4}>
            <FormLabel>Content</FormLabel>
            <MarkdownEditor
              value={content}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }: { text: string }) => setContent(text)}
              placeholder="Enter notice content"
              onImageUpload={handleImageUpload}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleUpdate} isDisabled={uploading}>
            Update Notice
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditNoticePage;
