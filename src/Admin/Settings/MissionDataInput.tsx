import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  useToast,
  IconButton,
  Select,
  HStack,
  Tag,
  TagCloseButton,
  TagLabel,
} from '@chakra-ui/react';
import { MdAddCircle, MdRemoveCircle } from 'react-icons/md';
import { FaBeer, FaApple, FaAndroid, FaMusic, FaVideo } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { SettingMenu } from './Settings';

interface MissionFormValues {
  title: string;
  description: string;
  imageUrl: string;
  links: { title: string; url: string; icon: IconType }[];
}

const iconOptions: { label: string; icon: IconType }[] = [
  { label: 'Beer', icon: FaBeer },
  { label: 'Apple', icon: FaApple },
  { label: 'Android', icon: FaAndroid },
  { label: 'Music', icon: FaMusic },
  { label: 'Video', icon: FaVideo },
];

const MissionDataInput: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<{ title: string; url: string; icon: IconType }[]>([]);
  const [selectedIcon, setSelectedIcon] = useState<IconType>(FaBeer);
  const [iconLabel, setIconLabel] = useState<string>('Beer');
  const toast = useToast();

  const handleAddLink = () => {
    if (title && url) {
      setLinks([...links, { title, url, icon: selectedIcon }]);
      setTitle('');
      setUrl('');
      setSelectedIcon(FaBeer); // Reset to default icon
      setIconLabel('Beer'); // Reset to default icon label
    } else {
      toast({
        title: 'Error',
        description: 'Title and URL are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const onSubmit = () => {
    // Simulating API response
    setTimeout(() => {
      console.log('Mock API response with data:', { title, description, imageUrl, links });

      toast({
        title: 'Success!',
        description: 'Mission data has been submitted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 1000); // Simulate a network delay
  };

  return (
    <Box padding={5}>
      <SettingMenu/>
      <Box maxW="container.md" mx="auto">
        <Heading mb={4}>Mission Data Input</Heading>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <VStack spacing={4} align="start">
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>
            <FormControl id="description" isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
            <FormControl id="imageUrl">
              <FormLabel>Image URL</FormLabel>
              <Input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </FormControl>
            <FormControl id="links">
              <FormLabel>Links</FormLabel>
              <HStack spacing={4}>
                <Input
                  type="text"
                  placeholder="Link title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="Link URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Select
                  placeholder="Select icon"
                  value={iconLabel}
                  onChange={(e) => {
                    const selected = iconOptions.find(opt => opt.label === e.target.value);
                    if (selected) {
                      setSelectedIcon(selected.icon);
                      setIconLabel(selected.label);
                    }
                  }}
                >
                  {iconOptions.map((opt) => (
                    <option key={opt.label} value={opt.label}>{opt.label}</option>
                  ))}
                </Select>
                <IconButton
                  icon={<MdAddCircle />}
                  colorScheme="teal"
                  aria-label="Add link"
                  onClick={handleAddLink}
                />
              </HStack>
              <VStack align="start" spacing={2} mt={4}>
                {links.map((link, index) => (
                  <HStack key={index} spacing={3} align="center">
                    <Box as={link.icon} boxSize={6} />
                    <Tag size="lg" variant="solid" colorScheme="teal">
                      <TagLabel>{link.title}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveLink(index)} />
                    </Tag>
                  </HStack>
                ))}
              </VStack>
            </FormControl>
            <Button type="submit" colorScheme="teal">
              Submit
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};

export default MissionDataInput;
