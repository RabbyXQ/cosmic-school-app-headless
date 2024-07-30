// Layout.tsx
import React from 'react';
import { Flex, Box, useBreakpointValue, Grid} from '@chakra-ui/react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import SearchWithGoogle from './SearchWithGoogle';

interface LayoutProps {
    children: React.ReactNode;
}
const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <Flex direction="column" minHeight="100vh">
      <Header />
        {children}
      <Footer />
    </Flex>
  );
};

export default Layout;
