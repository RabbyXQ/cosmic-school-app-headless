// Dashboard.tsx
import React from 'react';
import { Grid, GridItem, Box, Text, useColorModeValue, Badge } from '@chakra-ui/react';
import { MdSubject,MdClass, MdGroup, MdPeople, MdSchool, MdAnnouncement, MdLibraryBooks, MdPhoto, MdEvent, MdInsertDriveFile, MdQuiz, MdSchedule, MdPayments, MdWork, MdCalendarToday } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const dashboardItems = [
  { name: 'Admissions', icon: MdGroup, count: 120 },
  { name: 'Attendances', icon: MdCalendarToday, count: 120 },
  { name: 'Classes', icon: MdClass, count: 45 },
  { name: 'Employees', icon: MdWork, count: 30 },
  { name: 'Events', icon: MdEvent, count: 12 },
  { name: 'Exams', icon: MdQuiz, count: 5 },
  { name: 'Files', icon: MdInsertDriveFile, count: 78 },
  { name: 'Notices', icon: MdAnnouncement, count: 34 },
  { name: 'Payments', icon: MdPayments, count: 56 },
  { name: 'Students', icon: MdPeople, count: 350 },
  { name: 'Teachers', icon: MdSchool, count: 22 },
  { name: 'Gallery', icon: MdPhoto, count: 88 },
  { name: 'Routines', icon: MdSchedule, count: 16 },
  { name: 'Sections', icon: MdGroup, count: 9 },
  { name: 'News', icon: MdLibraryBooks, count: 67 },
  { name: 'Subjects', icon: MdSubject, count: 120 }

];

// Sample data for graphs
const graphData = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
  { name: 'Jul', value: 3490 }
];

const Dashboard: React.FC = () => {
  const bgColor = useColorModeValue('white.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const iconColor = useColorModeValue('teal.500', 'teal.300');
  const cardBgColor = useColorModeValue('white', 'gray.900');

  // Sort items alphabetically
  const sortedItems = [...dashboardItems].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <Box p={4} bg={bgColor} color={textColor}>
      <Grid
        templateColumns={{ base: 'repeat(auto-fill, minmax(120px, 1fr))', md: 'repeat(auto-fill, minmax(150px, 1fr))' }}
        gap={4}
        mb={6}
      >
        {sortedItems.map((item) => (
          <GridItem key={item.name} display="flex" flexDirection="column" alignItems="center" p={4} borderRadius="md" bg={cardBgColor} boxShadow="md">
            <Box as={item.icon} boxSize={8} color={iconColor} mb={2} />
            <Text fontSize="sm" fontWeight="medium" mb={1}>{item.name}</Text>
            <Badge colorScheme="teal">{item.count}</Badge>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
