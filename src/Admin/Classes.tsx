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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react';

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentClass, setCurrentClass] = useState<{ id: number; name: string } | null>(null);
  const [newClassName, setNewClassName] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch classes from the API
  const fetchClasses = async () => {
    try {
      const response = await fetch('http://localhost:4000/classes');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast({
        title: 'Error fetching classes.',
        description: 'There was an error fetching the list of classes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const handleSelect = (id: number) => {
    setSelectedClasses(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddClass = async () => {
    if (newClassName.trim()) {
      try {
        await fetch('http://localhost:4000/classes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newClassName }),
        });

        await fetchClasses(); // Refresh the list of classes
        setNewClassName('');
        toast({
          title: 'Class added.',
          description: `The class "${newClassName}" has been added.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error adding class:', error);
        toast({
          title: 'Error adding class.',
          description: 'There was an error adding the class.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleEditClass = async () => {
    if (currentClass && newClassName.trim()) {
      try {
        await fetch(`http://localhost:4000/classes/${currentClass.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newClassName }),
        });

        await fetchClasses(); // Refresh the list of classes
        setCurrentClass(null);
        setNewClassName('');
        setIsEditing(false);
        toast({
          title: 'Class updated.',
          description: `The class "${newClassName}" has been updated.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (error) {
        console.error('Error updating class:', error);
        toast({
          title: 'Error updating class.',
          description: 'There was an error updating the class.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteClasses = async () => {
    try {
      await fetch('http://localhost:4000/classes', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedClasses }),
      });

      await fetchClasses(); // Refresh the list of classes
      setSelectedClasses([]);
      toast({
        title: 'Classes deleted.',
        description: 'Selected classes have been deleted.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting classes:', error);
      toast({
        title: 'Error deleting classes.',
        description: 'There was an error deleting the classes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const openEditModal = (cls: { id: number; name: string }) => {
    setCurrentClass(cls);
    setNewClassName(cls.name);
    setIsEditing(true);
    onOpen();
  };

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">List of Classes</Text>
        <Button colorScheme="teal" onClick={() => { setIsEditing(false); onOpen(); }}>Add Class</Button>
      </Flex>
      <Stack spacing={4} mb={4}>
        {classes.map(cls => (
          <Flex key={cls.id} align="center">
            <Checkbox
              isChecked={selectedClasses.includes(cls.id)}
              onChange={() => handleSelect(cls.id)}
              mr={3}
            />
            <Text flex="1">{cls.name}</Text>
            <Button colorScheme="blue" onClick={() => openEditModal(cls)}>Edit</Button>
          </Flex>
        ))}
      </Stack>
      <Button
        colorScheme="red"
        onClick={handleDeleteClasses}
        isDisabled={selectedClasses.length === 0}
      >
        Delete Selected
      </Button>

      {/* Modal for Add/Edit Class */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Class' : 'Add Class'}</ModalHeader>
          <ModalBody>
            <FormControl id="class-name" mb={4}>
              <FormLabel>Class Name</FormLabel>
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter class name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={isEditing ? handleEditClass : handleAddClass}>
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

export default Classes;
