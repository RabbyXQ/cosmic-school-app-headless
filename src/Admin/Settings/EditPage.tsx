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
import { SettingMenu } from './Settings';

// Simulated API calls
const fetchPageById = async (id: string) => {
  return {
    id,
    title: 'Sample Page Title',
    slug: 'sample-page-slug',
    content: 'Sample page content',
  };
};

const updatePage = async (id: string, updatedPage: { title: string; slug: string; content: string }) => {
  // Replace with actual update logic
  console.log('Updated page:', id, updatedPage);
};

const uploadImage = async (file: File): Promise<{ url: string }> => {
  const imageUrl = URL.createObjectURL(file); // Replace with actual upload logic
  return { url: imageUrl };
};

const mdParser = new MarkdownIt();

const EditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPage = async () => {
      if (id) {
        const page = await fetchPageById(id);
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content);
      }
    };

    loadPage();
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
    if (title.trim() && slug.trim() && content.trim()) {
      if (id) {
        await updatePage(id, { title, slug, content });
        toast({
          title: 'Page updated.',
          description: `The page "${title}" has been updated.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/pages'); // Redirect to the pages list page
      }
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
      <Heading size="lg" mb={6}>Edit Page</Heading>
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
          <Button colorScheme="teal" onClick={handleUpdate} isDisabled={uploading}>
            Update Page
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditPage;
