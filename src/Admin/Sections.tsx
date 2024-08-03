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
  Select,
  Stack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';

// Define the types
interface Class {
  id: number;
  name: string;
}

interface Section {
  id: number;
  class_id: number;
  name: string;
  shift: string;
}

const apiUrl = 'http://localhost:4000/sections'; // Update with your API URL
const classesApiUrl = 'http://localhost:4000/classes'; // API URL for classes

const shifts = ['Morning', 'Afternoon', 'Evening'];

const Sections: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<Section | null>(null);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedShift, setSelectedShift] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchSections();
    fetchClasses();
  }, []);

  const fetchSections = async () => {
    try {
      const { data } = await axios.get<Section[]>(apiUrl);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get<Class[]>(classesApiUrl);
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSelect = (id: number) => {
    setSelectedSections(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddSection = async () => {
    console.log('Adding section:', {
      name: newSectionName,
      class_id: selectedClassId,
      shift: selectedShift
    });

    if (newSectionName.trim() && selectedClassId !== null && selectedShift) {
      try {
        await axios.post(apiUrl, {
          name: newSectionName,
          class_id: selectedClassId,
          shift: selectedShift
        });
        fetchSections();
        setNewSectionName('');
        setSelectedClassId(null);
        setSelectedShift(null);
        toast({
          title: 'Section added.',
          description: `The section "${newSectionName}" has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        console.error('Error adding section:', error);
        toast({
          title: 'Error adding section.',
          description: 'There was an error adding the section.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleEditSection = async () => {
    console.log('Updating section:', {
      id: currentSection?.id,
      name: newSectionName,
      class_id: selectedClassId,
      shift: selectedShift
    });

    if (currentSection && newSectionName.trim() && selectedClassId !== null && selectedShift) {
      try {
        await axios.put(`${apiUrl}/${currentSection.id}`, {
          name: newSectionName,
          class_id: selectedClassId,
          shift: selectedShift
        });
        fetchSections();
        setCurrentSection(null);
        setNewSectionName('');
        setSelectedClassId(null);
        setSelectedShift(null);
        setIsEditing(false);
        toast({
          title: 'Section updated.',
          description: `The section "${newSectionName}" has been updated.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onClose();
      } catch (error) {
        console.error('Error updating section:', error);
        toast({
          title: 'Error updating section.',
          description: 'There was an error updating the section.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteSections = async () => {
    try {
      await Promise.all(selectedSections.map(id => axios.delete(`${apiUrl}/${id}`)));
      fetchSections();
      setSelectedSections([]);
      toast({
        title: 'Sections deleted.',
        description: 'Selected sections have been deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting sections:', error);
      toast({
        title: 'Error deleting sections.',
        description: 'There was an error deleting the sections.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openEditModal = (sec: Section) => {
    setCurrentSection(sec);
    setNewSectionName(sec.name);
    setSelectedClassId(sec.class_id);
    setSelectedShift(sec.shift);
    setIsEditing(true);
    onOpen();
  };

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">List of Sections</Text>
        <Button colorScheme="teal" onClick={() => { setIsEditing(false); onOpen(); }}>Add Section</Button>
      </Flex>
      <Stack spacing={4} mb={4}>
        {sections.map(sec => (
          <Flex key={sec.id} align="center">
            <Checkbox
              isChecked={selectedSections.includes(sec.id)}
              onChange={() => handleSelect(sec.id)}
              mr={3}
            />
            <Text flex="1">{sec.name}</Text>
            <Text flex="1">Class: {classes.find(cls => cls.id === sec.class_id)?.name}</Text>
            <Text flex="1">Shift: {sec.shift}</Text>
            <Button colorScheme="blue" onClick={() => openEditModal(sec)}>Edit</Button>
          </Flex>
        ))}
      </Stack>
      <Button
        colorScheme="red"
        onClick={handleDeleteSections}
        isDisabled={selectedSections.length === 0}
      >
        Delete Selected
      </Button>

      {/* Modal for Add/Edit Section */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Section' : 'Add Section'}</ModalHeader>
          <ModalBody>
            <FormControl id="section-name" mb={4}>
              <FormLabel>Section Name</FormLabel>
              <Input
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                placeholder="Enter section name"
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
            <FormControl id="shift-select" mb={4}>
              <FormLabel>Select Shift</FormLabel>
              <Select
                placeholder="Select shift"
                value={selectedShift ?? ''}
                onChange={(e) => setSelectedShift(e.target.value)}
              >
                {shifts.map(shift => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={isEditing ? handleEditSection : handleAddSection}>
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

export default Sections;
