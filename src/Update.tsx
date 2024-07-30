import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, IconButton, useColorModeValue } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

// Example JSON-like data embedded directly in the file
const newsData = [
  {
    id: 1,
    text: '২০২৪-২০২৫ শিক্ষাবর্ষে একাদশ শ্রেণির ভর্তি আগামী ১৬-০৭-২০২৪ তারিখ থেকে ২১-০৭-২০২৪ তারিখ পর্যন্ত সকাল ১০:০০ টা থেকে দুপুর ২:০০ টা পর্যন্ত চলবে',
    link: '#'
  }
];

const Update: React.FC = () => {
  const tickerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tickerRef.current) {
      tickerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(scrollRight, 3000);
    return () => clearInterval(interval);
  }, []);

  const buttonColor = useColorModeValue('teal.500', 'teal.300');

  return (
    <section>
      <Box paddingRight={0} paddingLeft={0} maxW="container.lg" mx="auto">
        <Box
          style={{
            color: 'teal',
            height: '40px',
            lineHeight: '38px',
            borderRadius: '2px',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            style={{
              background: 'teal',
              color: 'white',
              padding: '0 8px',
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Text fontWeight="bold">UPDATE</Text>
          </Box>
          <Box
            ref={tickerRef}
            style={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              paddingLeft: '100px',
              overflow: 'hidden',
              width: 'calc(100% - 60px)' // Adjust width to fit your design
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '10px'
              }}
            >
              {newsData.map(item => (
                <a
                  key={item.id}
                  href={item.link}
                  style={{
                    color: 'teal',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    marginRight: '20px'
                  }}
                >
                  {item.text}
                </a>
              ))}
            </Box>
          </Box>
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <IconButton
              aria-label="Scroll left"
              icon={<ChevronLeftIcon />}
              onClick={scrollLeft}
              colorScheme="teal"
              size="sm"
              variant="solid"
              marginRight="2"
            />
            <IconButton
              aria-label="Scroll right"
              icon={<ChevronRightIcon />}
              onClick={scrollRight}
              colorScheme="teal"
              size="sm"
              variant="solid"
            />
          </Box>
        </Box>
      </Box>
    </section>
  );
};

export default Update;
