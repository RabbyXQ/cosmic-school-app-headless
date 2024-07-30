// src/pages/AddNewsPage.tsx
import React, { useState } from 'react';
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

// Simulated upload functions
const uploadImage = async (file: File): Promise<{ url: string }> => {
  const imageUrl = URL.createObjectURL(file); // Replace with actual upload logic
  return { url: imageUrl };
};

const mdParser = new MarkdownIt();

const AddNewsPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();

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

  const handleAdd = () => {
    if (title.trim() && content.trim()) {
      toast({
        title: 'News added.',
        description: `The news "${title}" has been added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTitle('');
      setContent('');
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
      <Heading mb={6}>Add New News</Heading>
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
          <Button colorScheme="teal" onClick={handleAdd} isDisabled={uploading}>
            Add News
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddNewsPage;
