import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  VStack,
  useToast,
  Select,
  IconButton,
  Checkbox,
  Stack,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useDisclosure } from '@chakra-ui/react';
import { MdAdd } from 'react-icons/md';

interface Student {
  id: number;
  name: string;
  grade: string;
  section: string;
  year: string;
  bloodGroup: string;
  photoUrl?: string;
}

const mockData: Student[] = [
  { id: 1, name: 'John Doe', grade: '6th', section: 'A', year: '2024', bloodGroup: 'A+', photoUrl: '' },
  { id: 2, name: 'Jane Smith', grade: '7th', section: 'B', year: '2024', bloodGroup: 'B-', photoUrl: '' },
  // Add more mock data here
];

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockData);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(students);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [newStudent, setNewStudent] = useState<Student>({
    id: -1, name: '', grade: '', section: '', year: '', bloodGroup: '', photoUrl: ''
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedClass, selectedSection, selectedYear]);

  const filterStudents = () => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedClass === '' || student.grade === selectedClass) &&
      (selectedSection === '' || student.section === selectedSection) &&
      (selectedYear === '' || student.year === selectedYear)
    );
    setFilteredStudents(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClass(e.target.value);
  };

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSection(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleSelectStudent = (id: number) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: number) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    filterStudents();
    toast({
      title: 'Student Deleted',
      description: `Student with ID ${id} has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleMultipleDelete = () => {
    setStudents(prev => prev.filter(student => !selectedStudents.includes(student.id)));
    setSelectedStudents([]);
    filterStudents();
    toast({
      title: 'Students Deleted',
      description: 'Selected students have been deleted.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddOrEditStudent = () => {
    if (editStudent) {
      // Edit existing student
      setStudents(prev =>
        prev.map(student =>
          student.id === editStudent.id ? { ...editStudent } : student
        )
      );
      toast({
        title: 'Student Updated',
        description: 'Student details have been updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      // Add new student
      setStudents(prev => [
        ...prev,
        { ...newStudent, id: Math.max(...prev.map(s => s.id), 0) + 1 }
      ]);
      toast({
        title: 'Student Added',
        description: 'New student has been added.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
    setShowModal(false);
    setNewStudent({
      id: -1, name: '', grade: '', section: '', year: '', bloodGroup: '', photoUrl: ''
    });
    setEditStudent(null);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <VStack spacing={5} align="flex-start">
        <Heading mb={4}>Students List</Heading>

        <HStack spacing={4} mb={4}>
          <Input
            placeholder="Search by student name..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Select placeholder="Select Class" value={selectedClass} onChange={handleClassChange}>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
            {/* Add more options as needed */}
          </Select>
          <Select placeholder="Select Section" value={selectedSection} onChange={handleSectionChange}>
            <option value="A">A</option>
            <option value="B">B</option>
            {/* Add more options as needed */}
          </Select>
          <Select placeholder="Select Year" value={selectedYear} onChange={handleYearChange}>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            {/* Add more options as needed */}
          </Select>
          <Button colorScheme="teal" onClick={() => {
            setEditStudent(null);
            setShowModal(true);
          }}>
            <AddIcon/>
          </Button>
          <Button
            colorScheme="red"
            onClick={handleMultipleDelete}
            disabled={selectedStudents.length === 0}
          >
            <DeleteIcon/>
          </Button>
        </HStack>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Select</Th>
              <Th>Name</Th>
              <Th>Grade</Th>
              <Th>Section</Th>
              <Th>Year</Th>
              <Th>Blood Group</Th>
              <Th>Photo</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {paginatedStudents.map(student => (
              <Tr key={student.id}>
                <Td>
                  <Checkbox
                    isChecked={selectedStudents.includes(student.id)}
                    onChange={() => handleSelectStudent(student.id)}
                  />
                </Td>
                <Td>{student.name}</Td>
                <Td>{student.grade}</Td>
                <Td>{student.section}</Td>
                <Td>{student.year}</Td>
                <Td>{student.bloodGroup}</Td>
                <Td>
                  {student.photoUrl ? (
                    <img src={student.photoUrl} alt={student.name} width="50" />
                  ) : (
                    'No Photo'
                  )}
                </Td>
                <Td>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={() => {
                      setEditStudent(student);
                      setShowModal(true);
                    }}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    onClick={() => handleDelete(student.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <HStack spacing={4} mt={4}>
          <FormControl>
            <FormLabel>Items per page</FormLabel>
            <Select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Select>
          </FormControl>
          <Button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text>Page {currentPage} of {totalPages}</Text>
          <Button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      </VStack>

      {/* Modal for Add/Edit Student */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editStudent ? 'Edit Student' : 'Add Student'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                value={editStudent?.name || newStudent.name}
                onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Grade</FormLabel>
              <Input
                value={editStudent?.grade || newStudent.grade}
                onChange={(e) => setNewStudent(prev => ({ ...prev, grade: e.target.value }))}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Section</FormLabel>
              <Input
                value={editStudent?.section || newStudent.section}
                onChange={(e) => setNewStudent(prev => ({ ...prev, section: e.target.value }))}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Year</FormLabel>
              <Input
                value={editStudent?.year || newStudent.year}
                onChange={(e) => setNewStudent(prev => ({ ...prev, year: e.target.value }))}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Blood Group</FormLabel>
              <Input
                value={editStudent?.bloodGroup || newStudent.bloodGroup}
                onChange={(e) => setNewStudent(prev => ({ ...prev, bloodGroup: e.target.value }))}
              />
            </FormControl>
            {/* Add more fields as necessary */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddOrEditStudent}>
              {editStudent ? 'Save Changes' : 'Add Student'}
            </Button>
            <Button variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Students;
