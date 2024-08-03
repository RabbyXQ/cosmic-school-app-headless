import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Stack,
  Button,
  IconButton,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import axios from 'axios';

interface RoutineEntry {
  id: number;
  day: string;
  subject: string;
  time_From: string;
  time_To: string;
  class_id: number;
  section_id: number;
}

interface ClassSection {
  id: number;
  name: string;
  class_id?: number;
}

interface Subject {
  id: number;
  name: string;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const Routine: React.FC = () => {
  const [routineEntries, setRoutineEntries] = useState<RoutineEntry[]>([]);
  const [classes, setClasses] = useState<ClassSection[]>([]);
  const [sections, setSections] = useState<ClassSection[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSections, setFilteredSections] = useState<ClassSection[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedSection, setSelectedSection] = useState<number | ''>('');
  const [selectedSubject, setSelectedSubject] = useState<number | ''>('');
  const [selectedEntry, setSelectedEntry] = useState<RoutineEntry | null>(null);
  const [timeFrom, setTimeFrom] = useState<string>('');
  const [timeTo, setTimeTo] = useState<string>('');
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
  });
  const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();

  useEffect(() => {
    // Fetch routine entries
    const fetchRoutineEntries = async () => {
      try {
        const response = await axios.get('http://localhost:4000/routines');
        setRoutineEntries(response.data.items || []);
        setPagination({
          totalItems: response.data.totalItems,
          totalPages: response.data.totalPages,
          currentPage: response.data.currentPage,
        });
      } catch (error) {
        console.error('Error fetching routine entries:', error);
        setRoutineEntries([]);
      }
    };
    fetchRoutineEntries();
  }, []);

  useEffect(() => {
    // Fetch classes and sections
    const fetchClassesAndSections = async () => {
      try {
        const classesResponse = await axios.get('http://localhost:4000/classes');
        const sectionsResponse = await axios.get('http://localhost:4000/sections');
        setClasses(classesResponse.data || []);
        setSections(sectionsResponse.data || []);
      } catch (error) {
        console.error('Error fetching classes or sections:', error);
        setClasses([]);
        setSections([]);
      }
    };
    fetchClassesAndSections();
  }, []);

  useEffect(() => {
    // Fetch subjects
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://localhost:4000/subjects');
        setSubjects(response.data || []);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setSubjects([]);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    // Filter sections based on the selected class
    if (selectedClass) {
      const filtered = sections.filter(section => section.class_id === selectedClass);
      setFilteredSections(filtered);
    } else {
      setFilteredSections([]);
    }
  }, [selectedClass, sections]);


  const filteredEntries = routineEntries.filter((entry) =>
    (selectedDay ? entry.day === selectedDay : true) &&
    (selectedClass ? entry.class_id === selectedClass : true) &&
    (selectedSection ? entry.section_id === selectedSection : true)
  );

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Text fontSize="2xl" mb={4}>Routine</Text>
      
      {/* Filters */}
      <Stack spacing={4} mb={4}>
        <FormControl>
          <FormLabel>Select Day</FormLabel>
          <Select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            placeholder="Select day"
          >
            {daysOfWeek.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Select Class</FormLabel>
          <Select
            value={selectedClass}
            onChange={(e) => {
              const classId = Number(e.target.value);
              setSelectedClass(classId);
              setSelectedSection(''); // Reset section when class changes
            }}
            placeholder="Select class"
          >
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Select Section</FormLabel>
          <Select
            value={selectedSection}
            onChange={(e) => setSelectedSection(Number(e.target.value))}
            placeholder="Select section"
          >
            {filteredSections.map(sec => (
              <option key={sec.id} value={sec.id}>{sec.name}</option>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {selectedClass && selectedSection && (
        <>
          <Button colorScheme="blue" leftIcon={<AddIcon />} onClick={openAddModal}>
            Add Entry
          </Button>

          <Table variant="simple" mt={4}>
            <Thead>
              <Tr>
                <Th>Day</Th>
                <Th>Subject</Th>
                <Th>Time From</Th>
                <Th>Time To</Th>
                <Th>Class</Th>
                <Th>Section</Th>
                
              </Tr>
            </Thead>
            <Tbody>
              {filteredEntries.map((entry) => (
                <Tr key={entry.id}>
                  <Td>{entry.day}</Td>
                  <Td>{entry.subject}</Td>
                  <Td>{entry.time_From}</Td>
                  <Td>{entry.time_To}</Td>
                  <Td>{classes.find(cls => cls.id === entry.class_id)?.name}</Td>
                  <Td>{sections.find(sec => sec.id === entry.section_id)?.name}</Td>
                  
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}


    </Box>
  );
};

export default Routine;
