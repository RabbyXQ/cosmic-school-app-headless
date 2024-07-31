import React from 'react';
import { Box, Grid, GridItem, Icon, Heading, VStack, Button } from '@chakra-ui/react';
import { FaHandPointRight, FaCloudDownloadAlt, FaCertificate } from 'react-icons/fa';


interface CardMenuProps{
  index: number,
  item: {
     id: number; 
     title: string; 
     icon: string; 
     links: { 
      title: string; 
      link: string; 
    } [];
  }
}


interface MenuCardProps{
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




function getSectionIcon(index: number){
  let N = 3;
  if(index % N === 0){
    return FaHandPointRight;
  }else if(index % N === 1){
    return FaCloudDownloadAlt;
  }else if(index % N === 2){
    return FaCertificate;
  }
} 

function getBgColor(index: number){
  if(index % 3 === 0){
    return "red.400"
  }else if(index % 3 === 1){
    return "green.400";
  }else if(index % 3 === 2){
    return "blue.300";
  }
}

const CardMenu: React.FC<CardMenuProps> = ({item, index}) => {
  return (
    <GridItem bg={getBgColor(index)} p={4} borderRadius="md">
            <Grid templateColumns="auto 1fr" gap={5} alignItems="start">
            <Icon as={getSectionIcon(index)} boxSize={6} />
              <Box>
                <Heading as="h4" size="md">{item.title}</Heading>
                <VStack align="start" spacing={3} mt={4}>
                  {
                    item.links.map((link)=>(
                      <Button
                        as="a"
                        href={link.link}
                        variant='link'
                        colorScheme="white"
                        sx={{
                          textDecoration: 'none',
                          _hover: { color: 'blue.200'},
                        }}
                      >
                        {link.title}
                      </Button>
                    ))
                  }
                </VStack>
              </Box>
            </Grid>
          </GridItem>
  )
}

const Mission: React.FC<MenuCardProps> = ({items}) => {
  return (
    <Box id="mission" padding={5}>
      <Box maxW="container.lg" mx="auto">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          {
            items.map((item, index) => (
            <CardMenu item={item} index={index}/>
            ))
          }
        </Grid>
      </Box>
    </Box>
  );
};

export default Mission;
