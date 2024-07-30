// src/pages/Subjects.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react';

// Sample data
const classes = [
  { id: 1, name: 'Class 1' },
  { id: 2, name: 'Class 2' },
  { id: 3, name: 'Class 3' }
];

const initialSubjects = [
  { id: 1, name: 'Math', classId: 1 },
  { id: 2, name: 'English', classId: 2 },
  { id: 3, name: 'History', classId: 3 }
];

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] = useState<{ id: number; name: string; classId: number } | null>(null);
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [filterClassId, setFilterClassId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSelect = (id: number) => {
    setSelectedSubjects(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddSubject = () => {
    if (newSubjectName.trim() && selectedClassId !== null) {
      setSubjects([...subjects, { id: Date.now(), name: newSubjectName, classId: selectedClassId }]);
      setNewSubjectName('');
      setSelectedClassId(null);
      toast({
        title: 'Subject added.',
        description: `The subject "${newSubjectName}" has been added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditSubject = () => {
    if (currentSubject && newSubjectName.trim() && selectedClassId !== null) {
      setSubjects(subjects.map(sub =>
        sub.id === currentSubject.id
          ? { ...sub, name: newSubjectName, classId: selectedClassId }
          : sub
      ));
      setCurrentSubject(null);
      setNewSubjectName('');
      setSelectedClassId(null);
      setIsEditing(false);
      toast({
        title: 'Subject updated.',
        description: `The subject "${newSubjectName}" has been updated.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSubjects = () => {
    setSubjects(subjects.filter(sub => !selectedSubjects.includes(sub.id)));
    setSelectedSubjects([]);
    toast({
      title: 'Subjects deleted.',
      description: 'Selected subjects have been deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const openEditModal = (sub: { id: number; name: string; classId: number }) => {
    setCurrentSubject(sub);
    setNewSubjectName(sub.name);
    setSelectedClassId(sub.classId);
    setIsEditing(true);
    onOpen();
  };

  const filteredSubjects = filterClassId
    ? subjects.filter(sub => sub.classId === filterClassId)
    : subjects;

  const bgColor = useColorModeValue('white', 'gray.700');
  const boxShadowColor = useColorModeValue('md', 'lg');

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">List of Subjects</Text>
        <Button colorScheme="teal" onClick={() => { setIsEditing(false); onOpen(); }}>Add Subject</Button>
      </Flex>
      <FormControl id="filter-class" mb={4}>
        <FormLabel>Filter by Class</FormLabel>
        <Select
          placeholder="Select class"
          value={filterClassId ?? ''}
          onChange={(e) => setFilterClassId(Number(e.target.value))}
        >
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <Stack spacing={4} mb={4}>
        {filteredSubjects.map(sub => (
          <Flex key={sub.id} align="center" bg={bgColor} p={4} boxShadow={boxShadowColor} borderRadius="md">
            <Checkbox
              isChecked={selectedSubjects.includes(sub.id)}
              onChange={() => handleSelect(sub.id)}
              mr={3}
            />
            <Text flex="1">{sub.name}</Text>
            <Text flex="1">Class: {classes.find(cls => cls.id === sub.classId)?.name}</Text>
            <Button colorScheme="blue" onClick={() => openEditModal(sub)}>Edit</Button>
          </Flex>
        ))}
      </Stack>
      <Button
        colorScheme="red"
        onClick={handleDeleteSubjects}
        isDisabled={selectedSubjects.length === 0}
      >
        Delete Selected
      </Button>

      {/* Modal for Add/Edit Subject */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Subject' : 'Add Subject'}</ModalHeader>
          <ModalBody>
            <FormControl id="subject-name" mb={4}>
              <FormLabel>Subject Name</FormLabel>
              <Input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Enter subject name"
              />
            </FormControl>
            <FormControl id="class-select" mb={4}>
              <FormLabel>Select Class</FormLabel>
              <Select
                placeholder="Select class"
                value={selectedClassId ?? ''}
                onChange={(e) => setSelectedClassId(Number(e.target.value))}
              >
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={isEditing ? handleEditSubject : handleAddSubject}>
              {isEditing ? 'Update' : 'Add'}
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Subjects;
