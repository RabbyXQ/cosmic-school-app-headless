import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Configuration for the color modes
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// Custom theme
const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
      },
      a: {
        _hover: {
          color: 'teal.300', 
        },
      },
    }),
  },
  components: {
    // Customize components if needed
  },
});

export default theme;
