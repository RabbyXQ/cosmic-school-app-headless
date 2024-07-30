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

const initialClasses = [
  { id: 1, name: 'Math 101' },
  { id: 2, name: 'English Literature' },
  { id: 3, name: 'History 202' }
];

const Classes: React.FC = () => {
  const [classes, setClasses] = useState(initialClasses);
  const [selectedClasses, setSelectedClasses] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentClass, setCurrentClass] = useState<{ id: number; name: string } | null>(null);
  const [newClassName, setNewClassName] = useState<string>('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSelect = (id: number) => {
    setSelectedClasses(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddClass = () => {
    if (newClassName.trim()) {
      setClasses([...classes, { id: Date.now(), name: newClassName }]);
      setNewClassName('');
      toast({
        title: 'Class added.',
        description: `The class "${newClassName}" has been added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditClass = () => {
    if (currentClass && newClassName.trim()) {
      setClasses(classes.map(cls =>
        cls.id === currentClass.id
          ? { ...cls, name: newClassName }
          : cls
      ));
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
    }
  };

  const handleDeleteClasses = () => {
    setClasses(classes.filter(cls => !selectedClasses.includes(cls.id)));
    setSelectedClasses([]);
    toast({
      title: 'Classes deleted.',
      description: 'Selected classes have been deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
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
