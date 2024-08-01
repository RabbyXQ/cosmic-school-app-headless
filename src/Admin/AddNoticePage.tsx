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
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { SettingMenu } from './Settings/Settings';
import { API_BASE_URL } from '../API';
const mdParser = new MarkdownIt();

const uploadImage = async (file: File): Promise<{ url: string }> => {

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_BASE_URL+'/pages/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return { url: API_BASE_URL+data.url };
};

const AddNoticePage: React.FC = () => {
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

  const handleAdd = async () => {
    if (title.trim() && content.trim()) {
      setUploading(true);
      try {
        const response = await fetch(API_BASE_URL+'/notices/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add page');
        }

        toast({
          title: 'Page added.',
          description: `The page "${title}" has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setTitle('');
        setContent('');
      } catch (error) {
        toast({
          title: 'Add Error',
          description: 'Failed to add the page.',
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
        description: 'Title, slug, and content are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container" py={6}>
      <Heading size="lg" mb={6}>Add New Notice</Heading>
      <Box p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="page-title" mb={4}>
            <FormLabel>Title</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
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
            {uploading ? 'Adding...' : 'Add Page'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddNoticePage;
