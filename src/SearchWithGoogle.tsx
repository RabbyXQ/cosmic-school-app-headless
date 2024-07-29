import React, { useState } from 'react';
import axios from 'axios';
import { Box, Input, Button, List, ListItem, Text, Heading, useColorModeValue, Collapse, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const GOOGLE_API_KEY = 'AIzaSyAODLd7G4ClBIrM-_1dalfYS9LYUG5rfgw';
const SEARCH_ENGINE_ID = '44267b1e30ffd4699';

const SearchWithGoogle: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isResultsVisible, setIsResultsVisible] = useState(true);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://www.googleapis.com/customsearch/v1`,
        {
          params: {
            key: GOOGLE_API_KEY,
            cx: SEARCH_ENGINE_ID,
            q: query,
          },
        }
      );
      setResults(response.data.items || []);
    } catch (err) {
      setError('An error occurred while fetching search results.');
    }
    setLoading(false);
  };

  const bgColor = useColorModeValue('white.50', 'gray.900');
  const inputBgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const linkColor = useColorModeValue('blue.500', 'blue.300');
  const borderColor = useColorModeValue('gray.300', 'transparent');
  const resultContainerBg = useColorModeValue('white.50', 'gray.900');

  return (
    <Box bg={bgColor} p={4} borderRadius="md" boxShadow="md">
      <Heading size="md" mb={4} color={textColor}>Google Search</Heading>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        mb={2}
        bg={inputBgColor}
        color={textColor}
        borderColor={borderColor}
        _placeholder={{ color: useColorModeValue('gray.500', 'gray.400') }}
        _focus={{ borderColor: useColorModeValue('blue.500', 'blue.300') }}
      />
      <Button 
        onClick={handleSearch} 
        isLoading={loading} 
        colorScheme="teal"
        mb={2}
      >
        Search
      </Button>
      {error && <Text color="red.500" mt={2}>{error}</Text>}
      <IconButton
        mx="5"
        aria-label={isResultsVisible ? 'Collapse Results' : 'Expand Results'}
        icon={isResultsVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
        onClick={() => setIsResultsVisible(!isResultsVisible)}
        colorScheme="teal"
        mb={2}
      />
      <Collapse in={isResultsVisible}>
        <Box
          bg={resultContainerBg}
          p={4}
          borderRadius="md"
          maxH="400px"
          overflowY="auto"
        >
          <List spacing={3}>
            {results.map((result, index) => (
              <ListItem key={index}>
                <a href={result.link} target="_blank" rel="noopener noreferrer">
                  <Text fontWeight="bold" color={linkColor}>{result.title}</Text>
                  <Text color={textColor}>{result.snippet}</Text>
                </a>
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Box>
  );
};

export default SearchWithGoogle;
