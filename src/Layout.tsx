// Layout.tsx
import React from 'react';
import { Flex, Box, useBreakpointValue, Grid} from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SearchWithGoogle from './SearchWithGoogle';
import SliderComponent from './Slider';

interface LayoutProps {
    children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({children}) => {
    const isMobile = useBreakpointValue({ base: true, xm: true, md: false, lg: false });
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
      <SliderComponent/>
      <Box maxW="container">
      <Grid
        templateColumns={isMobile ? '1fr' : '65fr 35fr'} // Single column on mobile, two columns on larger screens
        gap={2}
      >
        <Box>
          {children}
        </Box>
        <Box>
            <SearchWithGoogle/>
        </Box>
      </Grid>

    </Box>

      <Footer />
    </Flex>
  );
};

export default Layout;
