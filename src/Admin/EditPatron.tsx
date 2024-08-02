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
  Select,
} from '@chakra-ui/react';
import MarkdownEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { useParams } from 'react-router-dom';
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

const EditPatron: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the ID from the URL
  const [type, setType] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const fetchPatron = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/patrons/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error('Failed to fetch patron details');
        }

        setType(data.type);
        setName(data.name);
        setContent(data.content);
      } catch (error) {
        toast({
          title: 'Fetch Error',
          description: 'Failed to fetch patron details.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPatron();
  }, [id, toast]);

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
    if (type.trim() && name.trim() && content.trim()) {
      setUploading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/patrons/${id}`, {
          method: 'PUT',
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
          throw new Error('Failed to update patron');
        }

        toast({
          title: 'Patron updated.',
          description: `The patron "${name}" has been updated.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Update Error',
          description: 'Failed to update the patron.',
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

  if (loading) {
    return (
      <Container maxW="container" py={6}>
        <Heading size="lg" mb={6}>Edit Patron</Heading>
        <Box p={6} borderRadius="md" boxShadow="md">
          <Stack spacing={4}>
            <FormControl id="patron-type" mb={4}>
              <FormLabel>Type</FormLabel>
              <Select placeholder="Loading..." isDisabled>
                <option value="head">Head</option>
                <option value="asst">Assistant Head</option>
                <option value="sect">Secretary</option>
              </Select>
            </FormControl>
            <FormControl id="patron-name" mb={4}>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Loading..." isDisabled />
            </FormControl>
            <FormControl id="patron-content" mb={4}>
              <FormLabel>Content</FormLabel>
              <MarkdownEditor
                value={content}
                renderHTML={(text) => mdParser.render(text)}
                onChange={({ text }: { text: string }) => setContent(text)}
                placeholder="Loading..."
                onImageUpload={handleImageUpload}
                readOnly
              />
            </FormControl>
            <Button colorScheme="teal" isDisabled>
              {uploading ? 'Updating...' : 'Update Patron'}
            </Button>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container" py={6}>
      <Heading size="lg" mb={6}>Edit Patron</Heading>
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
          <Button colorScheme="teal" onClick={handleUpdate} isDisabled={uploading}>
            {uploading ? 'Updating...' : 'Update Patron'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditPatron;
