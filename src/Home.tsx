import React from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './Header';
import Footer from './Footer';
import Layout from './Layout';
import { Box, Grid, Heading, Slide, useBreakpointValue } from '@chakra-ui/react';
import SearchWithGoogle from './SearchWithGoogle';
import SliderComponent from './Slider';
import Mission from './Mission';
import Update from './Update';
import Brief from './Brief';
import Message from './Message';
import NoticeBoard from './NoticeBoard';
import News from './News';
import Events from './Events';
import { mission } from './mocks/mission';


function Home() {
  const isMobile = useBreakpointValue({ base: true, xm: true, md: false, lg: false });

  return (
    <>
      <Layout>
      
      <Box maxW="container">
        <SliderComponent/>
        <Mission items={mission}/>
        <Update/>
        <Brief/>
        <Grid
        templateColumns={isMobile ? '1fr' : '50fr 50fr'} // Single column on mobile, two columns on larger screens
        gap={2}
      >
        <Box>
         <NoticeBoard/>
        </Box>
        <Box>
        <SearchWithGoogle/>
        </Box>
      </Grid>
        <Message/>
        <Grid
        templateColumns={isMobile ? '1fr' : '50fr 50fr'} // Single column on mobile, two columns on larger screens
        gap={2}
      >
        <Box>
         <News/>
        </Box>
        <Box>
        <Events/>
        </Box>
      </Grid>
    </Box>

      </Layout>
    </>
  );
}

export default Home;
