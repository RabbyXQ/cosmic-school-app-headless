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
import { SettingMenu } from './Settings';

const mdParser = new MarkdownIt();

// Simulated upload functions
const uploadImage = async (file: File): Promise<{ url: string }> => {
  const imageUrl = URL.createObjectURL(file); // Replace with actual upload logic
  return { url: imageUrl };
};

const AddPage: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
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
    if (title.trim() && slug.trim() && content.trim()) {
      toast({
        title: 'Page added.',
        description: `The page "${title}" has been added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setTitle('');
      setSlug('');
      setContent('');
    } else {
      toast({
        title: 'Input Error',
        description: 'Title, slug, and content are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container" py={6}>
      <SettingMenu/>
      <Heading size="lg" mb={6}>Add New Page</Heading>
      <Box bg="white" p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="page-title" mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
            />
          </FormControl>
          <FormControl id="page-slug" mb={4}>
            <FormLabel>Slug</FormLabel>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Enter page slug (e.g., /new-page)"
            />
          </FormControl>
          <FormControl id="page-content" mb={4}>
            <FormLabel>Content</FormLabel>
            <MarkdownEditor
              value={content}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }: { text: string }) => setContent(text)}
              placeholder="Enter page content"
              onImageUpload={handleImageUpload}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleAdd} isDisabled={uploading}>
            Add Page
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddPage;
