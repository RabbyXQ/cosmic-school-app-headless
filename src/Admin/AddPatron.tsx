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
  Select,
} from '@chakra-ui/react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { API_BASE_URL } from '../API';

const mdParser = new MarkdownIt();

const uploadImage = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(API_BASE_URL + '/pages/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  const data = await response.json();
  return { url: API_BASE_URL + data.url };
};

const AddPatron: React.FC = () => {
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
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
    if (type.trim() && name.trim() && content.trim()) {
      setUploading(true);
      try {
        const response = await fetch(API_BASE_URL + '/patrons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type,
            name,
            content,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add patron');
        }
        
        toast({
          title: 'Patron added.',
          description: `The patron "${name}" has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });

        setType('');
        setName('');
        setContent('');
      } catch (error) {
        toast({
          title: 'Add Error',
          description: 'Failed to add the patron.',
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
        description: 'Type, name, and content are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container" py={6}>
      <Heading size="lg" mb={6}>Add New Patron</Heading>
      <Box p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="patron-type" mb={4}>
            <FormLabel>Type</FormLabel>
            <Select
              placeholder="Select type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="head">Head</option>
              <option value="asst">Assistant Head</option>
              <option value="sect">Secretary</option>
            </Select>
          </FormControl>
          <FormControl id="patron-name" mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter patron name"
            />
          </FormControl>
          <FormControl id="patron-content" mb={4}>
            <FormLabel>Content</FormLabel>
            <MarkdownEditor
              value={content}
              renderHTML={(text) => mdParser.render(text)}
              onChange={({ text }: { text: string }) => setContent(text)}
              placeholder="Enter patron content"
              onImageUpload={handleImageUpload}
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleAdd} isDisabled={uploading}>
            {uploading ? 'Adding...' : 'Add Patron'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default AddPatron;
