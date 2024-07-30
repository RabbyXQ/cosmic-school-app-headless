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
import { MdClass, MdPerson, MdSchedule } from 'react-icons/md';

// Sample data
const classes = [
  { id: 1, name: 'Math 101' },
  { id: 2, name: 'English Literature' },
  { id: 3, name: 'History 202' }
];

const teachers = [
  { id: 1, name: 'Ms. Smith' },
  { id: 2, name: 'Mr. Johnson' },
  { id: 3, name: 'Dr. Brown' }
];

const shifts = [
  { id: 1, name: 'Morning' },
  { id: 2, name: 'Afternoon' },
  { id: 3, name: 'Evening' }
];

const initialSections = [
  { id: 1, name: 'A', classId: 1, teacherId: 1, shiftId: 1 },
  { id: 2, name: 'B', classId: 2, teacherId: 2, shiftId: 2 }
];

const Sections: React.FC = () => {
  const [sections, setSections] = useState(initialSections);
  const [selectedSections, setSelectedSections] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<{ id: number; name: string; classId: number; teacherId: number; shiftId: number } | null>(null);
  const [newSectionName, setNewSectionName] = useState<string>('');
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);
  const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSelect = (id: number) => {
    setSelectedSections(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddSection = () => {
    if (newSectionName.trim() && selectedClassId !== null && selectedTeacherId !== null && selectedShiftId !== null) {
      setSections([...sections, { id: Date.now(), name: newSectionName, classId: selectedClassId, teacherId: selectedTeacherId, shiftId: selectedShiftId }]);
      setNewSectionName('');
      setSelectedClassId(null);
      setSelectedTeacherId(null);
      setSelectedShiftId(null);
      toast({
        title: 'Section added.',
        description: `The section "${newSectionName}" has been added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditSection = () => {
    if (currentSection && newSectionName.trim() && selectedClassId !== null && selectedTeacherId !== null && selectedShiftId !== null) {
      setSections(sections.map(sec =>
        sec.id === currentSection.id
          ? { ...sec, name: newSectionName, classId: selectedClassId, teacherId: selectedTeacherId, shiftId: selectedShiftId }
          : sec
      ));
      setCurrentSection(null);
      setNewSectionName('');
      setSelectedClassId(null);
      setSelectedTeacherId(null);
      setSelectedShiftId(null);
      setIsEditing(false);
      toast({
        title: 'Section updated.',
        description: `The section "${newSectionName}" has been updated.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSections = () => {
    setSections(sections.filter(sec => !selectedSections.includes(sec.id)));
    setSelectedSections([]);
    toast({
      title: 'Sections deleted.',
      description: 'Selected sections have been deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const openEditModal = (sec: { id: number; name: string; classId: number; teacherId: number; shiftId: number }) => {
    setCurrentSection(sec);
    setNewSectionName(sec.name);
    setSelectedClassId(sec.classId);
    setSelectedTeacherId(sec.teacherId);
    setSelectedShiftId(sec.shiftId);
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
            <Text flex="1">Class: {classes.find(cls => cls.id === sec.classId)?.name}</Text>
            <Text flex="1">Teacher: {teachers.find(teacher => teacher.id === sec.teacherId)?.name}</Text>
            <Text flex="1">Shift: {shifts.find(shift => shift.id === sec.shiftId)?.name}</Text>
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
            <FormControl id="teacher-select" mb={4}>
              <FormLabel>Select Teacher</FormLabel>
              <Select
                placeholder="Select teacher"
                value={selectedTeacherId ?? ''}
                onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
              >
                {teachers.map(teacher => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="shift-select" mb={4}>
              <FormLabel>Select Shift</FormLabel>
              <Select
                placeholder="Select shift"
                value={selectedShiftId ?? ''}
                onChange={(e) => setSelectedShiftId(Number(e.target.value))}
              >
                {shifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
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
