import React from 'react';
import { Box, Button, Input, Select, Textarea, VStack, FormControl, FormLabel, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { SettingMenu } from './Settings';


const dropdownData = {
    "atGlance": [
      {"value": "page1", "label": "Page 1"},
      {"value": "page2", "label": "Page 2"},
      {"value": "page3", "label": "Page 3"}
    ],
    "missionAndVision": [
      {"value": "page1", "label": "Page 1"},
      {"value": "page2", "label": "Page 2"},
      {"value": "page3", "label": "Page 3"}
    ],
    "infrastructure": [
      {"value": "page1", "label": "Page 1"},
      {"value": "page2", "label": "Page 2"},
      {"value": "page3", "label": "Page 3"}
    ],
    "briefHistory": [
      {"value": "page1", "label": "Page 1"},
      {"value": "page2", "label": "Page 2"},
      {"value": "page3", "label": "Page 3"}
    ],
    "rulesAndRegulation": [
      {"value": "page1", "label": "Page 1"},
      {"value": "page2", "label": "Page 2"},
      {"value": "page3", "label": "Page 3"}
    ],
    "facilities": [
      {"value": "page1", "label": "Page 1"},
      {"value": "page2", "label": "Page 2"},
      {"value": "page3", "label": "Page 3"}
    ]
  }
  

const BriefEdit: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  // Set colors based on the current color mode
  const backgroundColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('black', 'white');
  const buttonColor = useColorModeValue('teal', 'orange');
  const borderColor = useColorModeValue('gray.300', 'gray.600');

  return (
    <Box
      p={4}
      borderWidth={1}
      borderRadius="md"
      boxShadow="md"
      backgroundColor={backgroundColor}
      color={textColor}
    >
      <SettingMenu/>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <Input id="title" placeholder="Enter title" borderColor={borderColor} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="description">Description</FormLabel>
          <Textarea id="description" placeholder="Enter description" borderColor={borderColor} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="imageurl">Image URL</FormLabel>
          <Input id="imageurl" placeholder="Enter image URL" borderColor={borderColor} />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="atGlance">At A Glance</FormLabel>
          <Select id="atGlance" borderColor={borderColor}>
            {dropdownData.atGlance.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="missionAndVision">Mission And Vision</FormLabel>
          <Select id="missionAndVision" borderColor={borderColor}>
            {dropdownData.missionAndVision.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="infrastructure">Infrastructure</FormLabel>
          <Select id="infrastructure" borderColor={borderColor}>
            {dropdownData.infrastructure.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="briefHistory">Brief History</FormLabel>
          <Select id="briefHistory" borderColor={borderColor}>
            {dropdownData.briefHistory.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="rulesAndRegulation">Rules and Regulation</FormLabel>
          <Select id="rulesAndRegulation" borderColor={borderColor}>
            {dropdownData.rulesAndRegulation.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="facilities">Facilities</FormLabel>
          <Select id="facilities" borderColor={borderColor}>
            {dropdownData.facilities.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        <Button w="20" maxW="xs" type="submit" colorScheme={buttonColor}>
          Submit
        </Button>
      </VStack>
    </Box>
  );
};

export default BriefEdit;
