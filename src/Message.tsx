import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, GridItem, Heading, Text, Image, Flex, useColorModeValue, Link, Icon } from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from 'axios';
import { FaUserTie, FaUserGraduate } from 'react-icons/fa';

const MAX_TEXT_LENGTH = 300; // Maximum length of text to show before truncation

const Message: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const [headRes, asstRes] = await Promise.all([
          axios.get('http://localhost:4000/patrons/active/head'),
          axios.get('http://localhost:4000/patrons/active/asst'),
        ]);
        setMessages([headRes.data, asstRes.data]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const processMarkdown = (markdown: string) => {
    // Regular expression to find image URLs
    const imageMatch = markdown.match(/!\[.*?\]\((.*?)\)/);
    const firstImage = imageMatch ? imageMatch[1] : '';

    // Remove all links
    const trimmedContent = markdown.replace(/\[.*?\]\(.*?\)/g, '');

    return { image: firstImage, content: trimmedContent };
  };

  const truncateText = (text: string) => {
    // Split text into lines
    const lines = text.split('\n');

    // Remove lines with a single word
    const filteredLines = lines.filter(line => line.trim().split(' ').length > 1);

    // Join the lines back together
    const filteredText = filteredLines.join('\n');

    // Truncate if necessary
    return filteredText.length > MAX_TEXT_LENGTH
      ? filteredText.substring(0, MAX_TEXT_LENGTH) + '...'
      : filteredText;
  };

  const getTitleStyle = (type: string) => {
    return type === 'head'
      ? { fontSize: 'lg', fontWeight: 'bold', color: 'green.400' }
      : { fontSize: 'md', fontWeight: 'semibold', color: 'blue.400' };
  };

  const getIcon = (type: string) => {
    return type === 'head'
      ? <Icon as={FaUserTie} size="24px" color="green.400" />
      : <Icon as={FaUserGraduate} size="24px" color="blue.400" />;
  };

  return (
    <Box id="say" bg={bgColor} py={8}>
      <Container maxW="container.lg">
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
          {messages.map((message) => {
            const { image, content } = processMarkdown(message.content);
            return (
              <GridItem key={message.id}>
                <Flex direction="row" align="center" gap={4}>
                  {image && (
                    <Image
                      src={image}
                      alt={message.type === 'head' ? 'Head' : 'Assistant Head'}
                      borderRadius="md"
                      boxSize="150px"
                      objectFit="cover"
                    />
                  )}
                  <Box>
                    <Flex align="center" mb={2}>
                      {getIcon(message.type)}
                      <Heading as="h3" size="md" ml={3} {...getTitleStyle(message.type)}>
                        {message.type === 'head' ? 'MESSAGE OF THE HEAD' : 'MESSAGE OF THE ASSISTANT HEAD'}
                      </Heading>
                    </Flex>
                    <Text color={textColor} textAlign="justify">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {truncateText(content)}
                      </ReactMarkdown>
                    </Text>
                    <Link 
                      href={`/patrons/active/${message.type}`} 
                      color="teal.500" 
                      _hover={{ textDecoration: 'underline' }}
                    >
                      Read more
                    </Link>
                  </Box>
                </Flex>
              </GridItem>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default Message;
