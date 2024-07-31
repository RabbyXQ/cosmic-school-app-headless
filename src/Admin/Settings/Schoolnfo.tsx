import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  useToast,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { SettingMenu } from './Settings';

// Mock data for the school information
const mockSchoolInfo = {
  siteName: 'Sample School',
  description: 'A sample school description',
  email: 'info@sample.school',
  phone: '+1234567890',
  address: '123 Sample Street, Sample City, SC 12345',
  logo: 'https://via.placeholder.com/150', // Placeholder logo URL
  facebook: 'https://facebook.com/sample',
  twitter: 'https://twitter.com/sample',
  instagram: 'https://instagram.com/sample',
  linkedin: 'https://linkedin.com/company/sample',
};

// Mock functions to simulate API calls
const fetchSchoolInfo = async () => {
  return new Promise<typeof mockSchoolInfo>((resolve) => {
    setTimeout(() => resolve(mockSchoolInfo), 1000); // Simulate network delay
  });
};

const saveSchoolInfo = async (info: typeof mockSchoolInfo) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('Saved data:', info); // Simulate saving data
      resolve();
    }, 1000); // Simulate network delay
  });
};

const uploadImage = async (file: File): Promise<{ url: string }> => {
  const imageUrl = URL.createObjectURL(file); // Simulate image upload
  return { url: imageUrl };
};

const SchoolInfo: React.FC = () => {
  const [siteName, setSiteName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [logo, setLogo] = useState<string>('');
  const [facebook, setFacebook] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [instagram, setInstagram] = useState<string>('');
  const [linkedin, setLinkedin] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const loadSchoolInfo = async () => {
      const info = await fetchSchoolInfo();
      setSiteName(info.siteName);
      setDescription(info.description);
      setEmail(info.email);
      setPhone(info.phone);
      setAddress(info.address);
      setLogo(info.logo);
      setFacebook(info.facebook);
      setTwitter(info.twitter);
      setInstagram(info.instagram);
      setLinkedin(info.linkedin);
    };

    loadSchoolInfo();
  }, []);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const { url } = await uploadImage(file);
        setLogo(url);
      } catch (error) {
        toast({
          title: 'Upload Error',
          description: 'Failed to upload logo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (siteName.trim() && email.trim() && phone.trim() && address.trim()) {
      try {
        await saveSchoolInfo({
          siteName,
          description,
          email,
          phone,
          address,
          logo,
          facebook,
          twitter,
          instagram,
          linkedin,
        });
        toast({
          title: 'Information Saved.',
          description: 'School information has been saved successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: 'Save Error',
          description: 'Failed to save school information.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Input Error',
        description: 'Site name, email, phone, and address are required.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container" py={6}>
      <SettingMenu/>
      <Heading mb={6}>School Information</Heading>
      <Box p={6} borderRadius="md" boxShadow="md">
        <Stack spacing={4}>
          <FormControl id="site-name" mb={4}>
            <FormLabel>Site Name</FormLabel>
            <Input
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              placeholder="Enter site name"
            />
          </FormControl>
          <FormControl id="description" mb={4}>
            <FormLabel>Description</FormLabel>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </FormControl>
          <FormControl id="email" mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </FormControl>
          <FormControl id="phone" mb={4}>
            <FormLabel>Phone</FormLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </FormControl>
          <FormControl id="address" mb={4}>
            <FormLabel>Address</FormLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </FormControl>
          <FormControl id="logo" mb={4}>
            <FormLabel>Logo</FormLabel>
            <Input type="file" accept="image/*" onChange={handleLogoUpload} />
            {logo && <Image src={logo} alt="Logo Preview" mt={4} />}
          </FormControl>
          <FormControl id="facebook" mb={4}>
            <FormLabel>Facebook</FormLabel>
            <Input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Enter Facebook profile URL"
            />
          </FormControl>
          <FormControl id="twitter" mb={4}>
            <FormLabel>Twitter</FormLabel>
            <Input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="Enter Twitter profile URL"
            />
          </FormControl>
          <FormControl id="instagram" mb={4}>
            <FormLabel>Instagram</FormLabel>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Enter Instagram profile URL"
            />
          </FormControl>
          <FormControl id="linkedin" mb={4}>
            <FormLabel>LinkedIn</FormLabel>
            <Input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="Enter LinkedIn profile URL"
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSave} isDisabled={uploading}>
            Save Information
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SchoolInfo;
