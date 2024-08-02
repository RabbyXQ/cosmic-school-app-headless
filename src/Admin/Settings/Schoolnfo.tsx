import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Select,
  useToast,
  Heading,
  Stack,
} from '@chakra-ui/react';
import { API_BASE_URL, LOGO_UPLOAD, SITE_INFO } from '../../API';
import { SettingMenu } from './Settings';

type SchoolInfoType = {
  site_name: string;
  description: string;
  long_description: string;
  email: string;
  phone: string | null;
  address: string | null;
  logo: string | null;
  image: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  brief_section: number | null;
  slider_gallery: number | null;
};

type MenuItemType = {
  menu_id: number;
  menu_name: string;
  sections: {
    section_id: number;
    section_type: string;
    section_name: string;
    section_value: string;
  }[];
};

type MenuType = {
  menu_type: string;
  menus: MenuItemType[];
};

type SliderOptionType = {
  id: number;
  name: string;
};

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

const fetchMenuData = async (): Promise<MenuType[]> => {
  try {
    const response = await fetch('http://localhost:4000/menus/sections/grouped', {
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

const fetchSliderData = async (): Promise<SliderOptionType[]> => {
  try {
    const response = await fetch('http://localhost:4000/gallery/categories', {
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

const SchoolInfo: React.FC = () => {
  const [siteName, setSiteName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [long_description, setLongDescription] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [facebook, setFacebook] = useState<string | null>(null);
  const [twitter, setTwitter] = useState<string | null>(null);
  const [instagram, setInstagram] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState<string | null>(null);
  const [briefSection, setBriefSection] = useState<number | null>(null);
  const [sliderGallery, setSliderGallery] = useState<number | null>(null);
  const [menuData, setMenuData] = useState<MenuItemType[]>([]);
  const [sliderOptions, setSliderOptions] = useState<SliderOptionType[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const toast = useToast();

  useEffect(() => {
    const loadSchoolInfo = async () => {
      try {
        const info = await fetchSchoolInfo();
        console.log('Fetched School Info:', info); // Debug log
        setSiteName(info.site_name);
        setDescription(info.description);
        setLongDescription(info.long_description);
        setEmail(info.email);
        setPhone(info.phone);
        setAddress(info.address);
        setLogo(info.logo);
        setImage(info.image);
        setFacebook(info.facebook);
        setTwitter(info.twitter);
        setInstagram(info.instagram);
        setLinkedin(info.linkedin);
        setBriefSection(info.brief_section);
        setSliderGallery(info.slider_gallery);
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

    const loadMenuData = async () => {
      try {
        const data = await fetchMenuData();
        console.log('Fetched Menu Data:', data); // Debug log
        const midMenus = data.filter((menu: MenuType) => menu.menu_type === 'mid');
        const transformedItems = midMenus.flatMap((menu) =>
          menu.menus.map((subMenu) => ({
            menu_id: subMenu.menu_id,
            menu_name: subMenu.menu_name,
            sections: subMenu.sections,
          }))
        );
        setMenuData(transformedItems);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load menu data.';
        toast({
          title: 'Fetch Error',
          description: `Failed to load menu data: ${message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    const loadSliderData = async () => {
      try {
        const data = await fetchSliderData();
        console.log('Fetched Slider Data:', data); // Debug log
        setSliderOptions(data);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to load slider data.';
        toast({
          title: 'Fetch Error',
          description: `Failed to load slider data: ${message}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    loadSchoolInfo();
    loadMenuData();
    loadSliderData();
  }, [toast]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading(true);
      try {
        const url = await uploadImage(file);
        setLogo(url);
        setUploading(false);
        toast({
          title: 'Success',
          description: 'Logo uploaded successfully.',
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
        setUploading(false);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUploading(true);
      try {
        const url = await uploadImage(file);
        setImage(url);
        setImageUploading(false);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to upload image.';
        toast({
          title: 'Upload Error',
          description: message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setImageUploading(false);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const updatedInfo: SchoolInfoType = {
      site_name: siteName,
      description,
      long_description,
      email,
      phone,
      address,
      logo,
      image,
      facebook,
      twitter,
      instagram,
      linkedin,
      brief_section: briefSection,
      slider_gallery: sliderGallery,
    };

    try {
      await saveSchoolInfo(updatedInfo);
      toast({
        title: 'Success',
        description: 'School information updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update school information.';
      toast({
        title: 'Save Error',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container" p={4}>
      <SettingMenu/>
      <Box as="form" onSubmit={handleSubmit}>
        <Heading mb={4}>Update School Information</Heading>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel>Site Name</FormLabel>
            <Input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Long Description</FormLabel>
            <Input
              type="text"
              value={long_description}
              onChange={(e) => setLongDescription(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input
              type="text"
              value={phone || ''}
              onChange={(e) => setPhone(e.target.value || null)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value || null)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Logo</FormLabel>
            <Input type="file" onChange={handleLogoUpload} />
            {logo && <Image src={API_BASE_URL+logo} alt="Logo" boxSize="100px" mt={2} />}
            {uploading && <p>Uploading logo...</p>}
          </FormControl>
          <FormControl>
            <FormLabel>Image</FormLabel>
            <Input type="file" onChange={handleImageUpload} />
            {image && <Image src={API_BASE_URL+image} alt="Image" boxSize="100px" mt={2} />}
            {imageUploading && <p>Uploading image...</p>}
          </FormControl>
          <FormControl>
            <FormLabel>Facebook</FormLabel>
            <Input
              type="text"
              value={facebook || ''}
              onChange={(e) => setFacebook(e.target.value || null)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Twitter</FormLabel>
            <Input
              type="text"
              value={twitter || ''}
              onChange={(e) => setTwitter(e.target.value || null)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Instagram</FormLabel>
            <Input
              type="text"
              value={instagram || ''}
              onChange={(e) => setInstagram(e.target.value || null)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>LinkedIn</FormLabel>
            <Input
              type="text"
              value={linkedin || ''}
              onChange={(e) => setLinkedin(e.target.value || null)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Brief Section</FormLabel>
            <Select
              placeholder="Select Brief Section"
              value={briefSection || ''}
              onChange={(e) => setBriefSection(Number(e.target.value))}
            >
              {menuData.map((item) => (
                <option key={item.menu_id} value={item.menu_id}>
                  {item.menu_name}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Slider Gallery</FormLabel>
            <Select
              placeholder="Select Slider Gallery"
              value={sliderGallery || ''}
              onChange={(e) => setSliderGallery(Number(e.target.value))}
            >
              {sliderOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="teal">
            Save Changes
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default SchoolInfo;
