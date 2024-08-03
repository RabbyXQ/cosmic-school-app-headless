import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
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

interface Subject {
  id: number;
  name: string;
}

const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [newSubjectName, setNewSubjectName] = useState<string>('');
  const [filterName, setFilterName] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    // Fetch subjects from the API on component mount
    const fetchSubjects = async () => {
      try {
        const response = await fetch('http://localhost:4000/subjects');
        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedSubjects(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddSubject = async () => {
    if (newSubjectName.trim()) {
      try {
        const response = await fetch('http://localhost:4000/subjects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newSubjectName }),
        });
        const data: Subject = await response.json();
        setSubjects([...subjects, data]);
        setNewSubjectName('');
        toast({
          title: 'Subject added.',
          description: `The subject "${newSubjectName}" has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        console.error('Error adding subject:', error);
      }
    }
  };

  const handleEditSubject = async () => {
    if (currentSubject && newSubjectName.trim()) {
      try {
        await fetch(`http://localhost:4000/subjects/${currentSubject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newSubjectName }),
        });
        setSubjects(subjects.map(sub =>
          sub.id === currentSubject.id
            ? { ...sub, name: newSubjectName }
            : sub
        ));
        setCurrentSubject(null);
        setNewSubjectName('');
        setIsEditing(false);
        toast({
          title: 'Subject updated.',
          description: `The subject "${newSubjectName}" has been updated.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        console.error('Error updating subject:', error);
      }
    }
  };

  const handleDeleteSubjects = async () => {
    try {
      await Promise.all(selectedSubjects.map(id =>
        fetch(`http://localhost:4000/subjects/${id}`, { method: 'DELETE' })
      ));
      setSubjects(subjects.filter(sub => !selectedSubjects.includes(sub.id)));
      setSelectedSubjects([]);
      toast({
        title: 'Subjects deleted.',
        description: 'Selected subjects have been deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting subjects:', error);
    }
  };

  const openEditModal = (sub: Subject) => {
    setCurrentSubject(sub);
    setNewSubjectName(sub.name);
    setIsEditing(true);
    onOpen();
  };

  const filteredSubjects = filterName
    ? subjects.filter(sub => sub.name.toLowerCase().includes(filterName.toLowerCase()))
    : subjects;

  const bgColor = useColorModeValue('white', 'gray.700');
  const boxShadowColor = useColorModeValue('md', 'lg');

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">List of Subjects</Text>
        <Button colorScheme="teal" onClick={() => { setIsEditing(false); onOpen(); }}>Add Subject</Button>
      </Flex>
      <FormControl id="filter-name" mb={4}>
        <FormLabel>Filter by Name</FormLabel>
        <Input
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          placeholder="Enter subject name"
        />
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
