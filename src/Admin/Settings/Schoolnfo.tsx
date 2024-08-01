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
import { LOGO_UPLOAD, SITE_INFO } from '../../API';
import { API_BASE_URL } from '../../API';

type SchoolInfoType = {
  site_name: string;
  description: string;
  email: string;
  phone: string | null;
  address: string | null;
  logo: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
};

// Fetch school information
const fetchSchoolInfo = async (): Promise<SchoolInfoType> => {
  try {
    const response = await fetch(SITE_INFO, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Fetch Error:', message);
    throw new Error(message);
  }
};

// Save school information
const saveSchoolInfo = async (info: SchoolInfoType) => {
  try {
    const response = await fetch(SITE_INFO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(info),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Save Error:', message);
    throw new Error(message);
  }
};

// Upload logo image
const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(LOGO_UPLOAD, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (!data.status) {
      throw new Error('Upload failed.');
    }

    return data.url;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error('Upload Error:', message);
    throw new Error(message);
  }
};

const SchoolInfo: React.FC = () => {
  const [siteName, setSiteName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [facebook, setFacebook] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string | null>(null);
  const [instagram, setInstagram] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const toast = useToast();

  // Load school information on component mount
  useEffect(() => {
    const loadSchoolInfo = async () => {
      try {
        const info = await fetchSchoolInfo();
        setSiteName(info.site_name);
        setDescription(info.description);
        setEmail(info.email);
        setPhone(info.phone);
        setAddress(info.address);
        setLogo(info.logo);
        setFacebook(info.facebook);
        setTwitter(info.twitter);
        setInstagram(info.instagram);
        setLinkedin(info.linkedin);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load school information.';
        toast({
          title: 'Fetch Error',
          description: `Failed to load school information: ${message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadSchoolInfo();
  }, [toast]);

  // Handle logo upload
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadImage(file);
        setLogo(url);
        toast({
          title: 'Upload Successful',
          description: 'Logo has been uploaded successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to upload logo.';
        toast({
          title: 'Upload Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setUploading(false);
      }
    }
  };

  // Handle saving school information
  const handleSave = async () => {
    if (siteName.trim() && email.trim() && phone && address) {
      try {
        await saveSchoolInfo({
          site_name: siteName,
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
          title: 'Information Saved',
          description: 'School information has been saved successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to save school information.';
        toast({
          title: 'Save Error',
          description: message,
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
              value={phone || ''}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
            />
          </FormControl>
          <FormControl id="address" mb={4}>
            <FormLabel>Address</FormLabel>
            <Input
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </FormControl>
          <FormControl id="logo" mb={4}>
            <FormLabel>Logo</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
            {uploading && <p>Uploading...</p>}
            {logo && <Image src={API_BASE_URL+logo} alt="Logo" boxSize="150px" />}
          </FormControl>
          <FormControl id="facebook" mb={4}>
            <FormLabel>Facebook URL</FormLabel>
            <Input
              value={facebook || ''}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Enter Facebook URL"
            />
          </FormControl>
          <FormControl id="twitter" mb={4}>
            <FormLabel>Twitter URL</FormLabel>
            <Input
              value={twitter || ''}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="Enter Twitter URL"
            />
          </FormControl>
          <FormControl id="instagram" mb={4}>
            <FormLabel>Instagram URL</FormLabel>
            <Input
              value={instagram || ''}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Enter Instagram URL"
            />
          </FormControl>
          <FormControl id="linkedin" mb={4}>
            <FormLabel>LinkedIn URL</FormLabel>
            <Input
              value={linkedin || ''}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="Enter LinkedIn URL"
            />
          </FormControl>
          <Button colorScheme="teal" onClick={handleSave}>Save</Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SchoolInfo;
