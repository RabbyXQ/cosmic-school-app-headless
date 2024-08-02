import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Icon, Heading, VStack, Button } from '@chakra-ui/react';
import { FaHandPointRight, FaCloudDownloadAlt, FaCertificate } from 'react-icons/fa';

interface CardMenuProps {
  index: number;
  item: {
    id: number;
    title: string;
    icon: string;
    links: {
      title: string;
      link: string;
    }[];
  };
}

interface MenuCardProps {
  items: {
    id: number;
    title: string;
    icon: string;
    links: {
      title: string;
      link: string;
    }[];
  }[];
}

function getSectionIcon(index: number) {
  const icons = [FaHandPointRight, FaCloudDownloadAlt, FaCertificate];
  return icons[index % icons.length];
}

function getBgColor(index: number) {
  const colors = ["red.400", "green.400", "blue.300"];
  return colors[index % colors.length];
}

const CardMenu: React.FC<CardMenuProps> = ({ item, index }) => {
  return (
    <GridItem bg={getBgColor(index)} p={4} borderRadius="md">
      <Grid templateColumns="auto 1fr" gap={5} alignItems="start">
        <Icon as={getSectionIcon(index)} boxSize={6} />
        <Box>
          <Heading as="h4" size="md">{item.title}</Heading>
          <VStack align="start" spacing={3} mt={4}>
            {item.links.map((link, linkIndex) => (
              <Button
                key={linkIndex}
                as="a"
                href={link.link}
                variant='link'
                colorScheme="white"
                sx={{
                  textDecoration: 'none',
                  _hover: { color: 'blue.200' },
                }}
              >
                {link.title}
              </Button>
            ))}
          </VStack>
        </Box>
      </Grid>
    </GridItem>
  );
}

const Mission: React.FC<MenuCardProps> = ({ items }) => {
  return (
    <Box id="mission" padding={5}>
      <Box maxW="container.lg" mx="auto">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          {items.map((item, index) => (
            <CardMenu key={item.id} item={item} index={index} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

const MidMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuCardProps["items"]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/menus/sections/grouped');
        const data = await response.json();
        const midMenus = data.filter((menu: any) => menu.menu_type === 'mid');
        const transformedItems = midMenus.flatMap((menu: any) =>
          menu.menus.map((subMenu: any) => ({
            id: subMenu.menu_id,
            title: subMenu.menu_name,
            icon: '', // assuming the icon will be determined dynamically
            links: subMenu.sections.map((section: any) => ({
              title: section.section_name,
              link: section.section_type === 'page' ? `/pages/${section.section_value}` : section.section_value
            }))
          }))
        );
        setMenuItems(transformedItems.slice(0, 3)); // Limit to 3 items
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return <Mission items={menuItems} />;
};

export default MidMenu;
