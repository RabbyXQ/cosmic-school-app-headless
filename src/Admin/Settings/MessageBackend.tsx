import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  Image,
  VStack,
} from '@chakra-ui/react';
import { SettingMenu } from './Settings';

interface MessageData {
  imageUrl: string;
  title: string;
  message: string;
  link: string;
}

const MessageBackend: React.FC = () => {
  const [principalHead, setPrincipalHead] = useState<MessageData>({
    imageUrl: '',
    title: 'Principal Head',
    message: '',
    link: '/pages/head',
  });

  const [assistantHead, setAssistantHead] = useState<MessageData>({
    imageUrl: '',
    title: 'Assistant Head',
    message: '',
    link: '/pages/ast',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'principalHead' | 'assistantHead') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'principalHead') {
          setPrincipalHead(prev => ({ ...prev, imageUrl: reader.result as string }));
        } else {
          setAssistantHead(prev => ({ ...prev, imageUrl: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, type: 'principalHead' | 'assistantHead', field: keyof MessageData) => {
    const value = e.target.value;
    if (type === 'principalHead') {
      setPrincipalHead(prev => ({ ...prev, [field]: value }));
    } else {
      setAssistantHead(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    // Here you would typically handle form submission, e.g., sending data to the backend
    console.log('Principal Head Message:', principalHead);
    console.log('Assistant Head Message:', assistantHead);
  };

  return (
    <Box p={5}>
      <VStack spacing={5}>
        <Box w="full">
          <SettingMenu/>
          <Heading size="lg" mb={4}>Principal Head</Heading>
          <FormControl mb={4}>
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'principalHead')}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Message Title</FormLabel>
            <Input
              value={principalHead.title}
              onChange={(e) => handleChange(e, 'principalHead', 'title')}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Message</FormLabel>
            <Textarea
              value={principalHead.message}
              onChange={(e) => handleChange(e, 'principalHead', 'message')}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>More Link</FormLabel>
            <Input
              value={principalHead.link}
              isReadOnly
            />
          </FormControl>
          {principalHead.imageUrl && (
            <Image
              src={principalHead.imageUrl}
              alt="Principal Head"
              boxSize="150px"
              objectFit="cover"
            />
          )}
        </Box>

        <Box w="full">
          <Heading mb={4}>Assistant Head</Heading>
          <FormControl mb={4}>
            <FormLabel>Upload Image</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'assistantHead')}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Message Title</FormLabel>
            <Input
              value={assistantHead.title}
              onChange={(e) => handleChange(e, 'assistantHead', 'title')}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Message</FormLabel>
            <Textarea
              value={assistantHead.message}
              onChange={(e) => handleChange(e, 'assistantHead', 'message')}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>More Link</FormLabel>
            <Input
              value={assistantHead.link}
              isReadOnly
            />
          </FormControl>
          {assistantHead.imageUrl && (
            <Image
              src={assistantHead.imageUrl}
              alt="Assistant Head"
              boxSize="150px"
              objectFit="cover"
            />
          )}
        </Box>

        <Button colorScheme="teal" onClick={handleSubmit}>
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default MessageBackend;
