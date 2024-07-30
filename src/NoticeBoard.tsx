import React from 'react';
import { Box, Container, Heading, Link, List, ListItem, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { FaBullhorn } from 'react-icons/fa';

const notices = [
  { date: '28 Jul 24', href: 'page.php?id=355', text: '২০২৪-২০২৫ শিক্ষাবর্ষের একাদশ শ্রেণির ভর্তি ও ক্লাস শুরুর নোটিশ' },
  { date: '15 Jul 24', href: 'page.php?id=354', text: '২০২৪-২০২৫ একাদশ শ্রেণির ভর্তির নোটিশ (সংশোধিত)' },
  { date: '10 Jul 24', href: 'page.php?id=351', text: 'পৌর মেয়র বৃত্তি -২০২৪ আবেদন ফরম ও প্রবেশপত্র' },
  { date: '23 May 24', href: 'page.php?id=350', text: '২০২৪-২০২৫ শিক্ষাবর্ষে একাদশ শ্রেণির ভর্তির নোটিশ' },
  { date: '22 Apr 24', href: 'page.php?id=349', text: 'জনাব মোহাম্মদ আছাদল হক সহকারী অধ্যাপক হিসাববিজ্ঞান NOC' },
];

const NoticeBoard: React.FC = () => {
  const bgColor = useColorModeValue('white.50', 'gray.900');
  const textColor = useColorModeValue('red.400', 'red.400');
  const linkColor = useColorModeValue('teal.500', 'teal.300');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box bg={bgColor} py={8} px={4}>
      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" mb={4}>
          <Heading as="h5" size="md" color={textColor} display="flex" alignItems="center">
            <FaBullhorn style={{ marginRight: '8px' }} />
            NOTICE BOARD
          </Heading>
          <Link href="all_notice.php" color={linkColor} fontSize="sm">
            All Notice
          </Link>
        </Flex>
        <List spacing={3}>
          {notices.map((notice, index) => (
            <ListItem key={index} p={4} borderRadius="md" borderWidth={1} borderColor={borderColor} bg={bgColor}>
              <Flex direction="row" justify="space-between" align="center">
                <Box>
                  <Text fontSize="sm" fontWeight="bold">{notice.date}</Text>
                </Box>
                <Box flex="1" ml={4}>
                  <Text fontSize="md">
                    <Link href={notice.href} color={linkColor} _hover={{ textDecoration: 'underline' }}>
                      {notice.text}
                    </Link>
                  </Text>
                </Box>
              </Flex>
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default NoticeBoard;
