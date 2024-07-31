import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Select,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  InputGroup,
  InputLeftElement,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

// Sample data for classes, sections, and students
interface Student {
  id: string;
  name: string;
  sectionId: string;
}

interface Section {
  id: string;
  name: string;
  classId: string;
}

interface Class {
  id: string;
  name: string;
  sections: Section[];
}

const classes: Class[] = [
  {
    id: 'class1',
    name: 'Class 1',
    sections: [
      { id: 'section1', name: 'Section A', classId: 'class1' },
      { id: 'section2', name: 'Section B', classId: 'class1' }
    ]
  },
  {
    id: 'class2',
    name: 'Class 2',
    sections: [
      { id: 'section3', name: 'Section A', classId: 'class2' },
      { id: 'section4', name: 'Section B', classId: 'class2' }
    ]
  }
];

// Mock data for attendance records
const attendanceRecords: { [date: string]: { [sectionId: string]: Set<string> } } = {
  '2024-07-30': {
    'section1': new Set(['230101001', '230101002']),
    'section2': new Set(['230101003']),
  },
  // More dates and sections...
};

const initialStudents: Student[] = [
  { id: '230101001', name: 'John Doe', sectionId: 'section1' },
  { id: '230101002', name: 'Jane Smith', sectionId: 'section1' },
  { id: '230101003', name: 'Jim Brown', sectionId: 'section2' },
  { id: '230101004', name: 'Emily Davis', sectionId: 'section3' },
  { id: '230101005', name: 'John Doe', sectionId: 'section1' },
  { id: '230101006', name: 'Jane Smith', sectionId: 'section1' },
  { id: '230101007', name: 'Jim Brown', sectionId: 'section2' },
  { id: '230101008', name: 'Emily Davis', sectionId: 'section3' },
  { id: '230101009', name: 'John Doe', sectionId: 'section1' },
  { id: '230101010', name: 'Jane Smith', sectionId: 'section1' },
  { id: '230101011', name: 'Jim Brown', sectionId: 'section2' },
  { id: '230101012', name: 'Emily Davis', sectionId: 'section3' },
  { id: '230101013', name: 'John Doe', sectionId: 'section1' },
  { id: '230101014', name: 'Jane Smith', sectionId: 'section1' },
  { id: '230101015', name: 'Jim Brown', sectionId: 'section2' },
  { id: '230101016', name: 'Emily Davis', sectionId: 'section3' },
  { id: '230101017', name: 'John Doe', sectionId: 'section1' },
  { id: '230101018', name: 'Jane Smith', sectionId: 'section1' },
  { id: '230101019', name: 'Jim Brown', sectionId: 'section2' },
  { id: '230101020', name: 'Emily Davis', sectionId: 'section3' },
  { id: '230101021', name: 'John Doe', sectionId: 'section1' },
  { id: '230101022', name: 'Jane Smith', sectionId: 'section1' },
  { id: '230101023', name: 'Jim Brown', sectionId: 'section2' },
  { id: '230101024', name: 'Emily Davis', sectionId: 'section3' }
];

const Attendances: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>(classes[0].id);
  const [selectedSection, setSelectedSection] = useState<string>(classes[0].sections[0].id);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]); // Default to today
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Set<string>>(new Set());
  const [searchId, setSearchId] = useState<string>('');

  const selectedClassObj = classes.find(cls => cls.id === selectedClass);
  const sections = selectedClassObj?.sections || [];

  useEffect(() => {
    if (selectedSection && selectedDate) {
      const filtered = students.filter(student => student.sectionId === selectedSection);
      const presentStudents = attendanceRecords[selectedDate]?.[selectedSection] || new Set<string>();
      setFilteredStudents(filtered);
      setAttendance(presentStudents);
    } else {
      setFilteredStudents([]);
    }
  }, [selectedSection, selectedDate, students]);

  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(event.target.value);
    const firstSection = classes.find(cls => cls.id === event.target.value)?.sections[0].id || '';
    setSelectedSection(firstSection);
  };

  const handleSectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(event.target.value);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const id = event.target.value;
    setSearchId(id);
    const filtered = students.filter(student => student.id.includes(id) && student.sectionId === selectedSection);
    setFilteredStudents(filtered);
  };

  const toggleAttendance = (studentId: string) => {
    setAttendance(prev => {
      const newAttendance = new Set(prev);
      if (newAttendance.has(studentId)) {
        newAttendance.delete(studentId);
      } else {
        newAttendance.add(studentId);
      }
      return newAttendance;
    });
  };

  const isFormValid = selectedClass && selectedSection && selectedDate;

  return (
    <Box p={5}>
      <FormControl mb={4}>
        <FormLabel>Class</FormLabel>
        <Select value={selectedClass} onChange={handleClassChange}>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Section</FormLabel>
        <Select value={selectedSection} onChange={handleSectionChange}>
          {sections.map((section) => (
            <option key={section.id} value={section.id}>{section.name}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Date</FormLabel>
        <Input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </FormControl>

      <FormControl mb={4}>
        <FormLabel>Search by ID</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search ID"
            value={searchId}
            onChange={handleSearchChange}
          />
        </InputGroup>
      </FormControl>

      {isFormValid && (
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {filteredStudents.map((student) => (
            <Box
              key={student.id}
              p={3}
              border="1px"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bg={attendance.has(student.id) ? 'green.300' : 'red.300'}
              cursor="pointer"
              onClick={() => toggleAttendance(student.id)} // Toggle on click
            >
              <Box>
                <Box fontWeight="bold">{student.name}</Box>
                <Box fontSize="sm">{student.id}</Box>
              </Box>
              <Checkbox
                isChecked={attendance.has(student.id)}
                onChange={() => toggleAttendance(student.id)}
                colorScheme="teal"
              />
            </Box>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Attendances;
