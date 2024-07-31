import React, { useState } from 'react';
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
  HStack,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';

interface RoutineEntry {
  id: number;
  day: string;
  subject: string;
  timeFrom: string;
  timeTo: string;
  classId: number;
  sectionId: number;
}

interface ClassSection {
  id: number;
  name: string;
}

const classes: ClassSection[] = [
  { id: 1, name: 'Class 1' },
  { id: 2, name: 'Class 2' },
  { id: 3, name: 'Class 3' },
];

const sections: ClassSection[] = [
  { id: 1, name: 'Section A' },
  { id: 2, name: 'Section B' },
  { id: 3, name: 'Section C' },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

const initialRoutine: RoutineEntry[] = [
    {
      id: 1,
      day: 'Monday',
      subject: 'Mathematics',
      timeFrom: '09:00',
      timeTo: '10:00',
      classId: 1,
      sectionId: 1,
    },
    {
      id: 2,
      day: 'Monday',
      subject: 'English',
      timeFrom: '10:00',
      timeTo: '11:00',
      classId: 1,
      sectionId: 2,
    },
    {
      id: 3,
      day: 'Tuesday',
      subject: 'Science',
      timeFrom: '11:00',
      timeTo: '12:00',
      classId: 2,
      sectionId: 1,
    },
    {
      id: 4,
      day: 'Wednesday',
      subject: 'History',
      timeFrom: '09:00',
      timeTo: '10:30',
      classId: 3,
      sectionId: 3,
    },
    {
      id: 5,
      day: 'Thursday',
      subject: 'Geography',
      timeFrom: '14:00',
      timeTo: '15:00',
      classId: 2,
      sectionId: 2,
    },
  ];
  
const Routine: React.FC = () => {
  const [routineEntries, setRoutineEntries] = useState<RoutineEntry[]>(initialRoutine);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<number | ''>('');
  const [selectedSection, setSelectedSection] = useState<number | ''>('');
  const [selectedEntry, setSelectedEntry] = useState<RoutineEntry | null>(null);
  const [filterDay, setFilterDay] = useState<string>('');
  const [filterClass, setFilterClass] = useState<number | ''>('');
  const [filterSection, setFilterSection] = useState<number | ''>('');

  const [timeFrom, setTimeFrom] = useState<string>('');
  const [timeTo, setTimeTo] = useState<string>('');
  const { isOpen: isAddModalOpen, onOpen: openAddModal, onClose: closeAddModal } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: openEditModal, onClose: closeEditModal } = useDisclosure();

  const handleAddEntry = () => {
    if (selectedDay && selectedClass !== '' && selectedSection !== '') {
      const newEntry: RoutineEntry = {
        id: routineEntries.length + 1,
        day: selectedDay,
        subject: '',
        timeFrom,
        timeTo,
        classId: Number(selectedClass),
        sectionId: Number(selectedSection),
      };
      setRoutineEntries((prev) => [...prev, newEntry]);
      setSelectedEntry(null);
      setTimeFrom('');
      setTimeTo('');
      setSelectedDay('');
      setSelectedClass('');
      setSelectedSection('');
      closeAddModal();
    }
  };

  const handleEditEntry = () => {
    if (selectedEntry) {
      setRoutineEntries((prev) =>
        prev.map((entry) =>
          entry.id === selectedEntry.id ? selectedEntry : entry
        )
      );
      setSelectedEntry(null);
      closeEditModal();
    }
  };

  const handleDeleteEntry = (id: number) => {
    setRoutineEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const handleOpenEditModal = (entry: RoutineEntry) => {
    setSelectedEntry(entry);
    setSelectedDay(entry.day);
    setSelectedClass(entry.classId);
    setSelectedSection(entry.sectionId);
    setTimeFrom(entry.timeFrom);
    setTimeTo(entry.timeTo);
    openEditModal();
  };

  const filteredEntries = routineEntries.filter((entry) =>
    (filterDay ? entry.day === filterDay : true) &&
    (filterClass ? entry.classId === filterClass : true) &&
    (filterSection ? entry.sectionId === filterSection : true)
  );

  return (
    <Box p={5} maxW="1200px" mx="auto">
      <Text fontSize="2xl" mb={4}>Routine</Text>
      
      {/* Class and Section Selection */}
      <Stack spacing={4} mb={4}>
        <FormControl>
          <FormLabel>Select Class</FormLabel>
          <Select
            value={selectedClass}
            onChange={(e) => {
              const classId = Number(e.target.value);
              setSelectedClass(classId);
              setSelectedSection('');
              setFilterSection('');
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
            onChange={(e) => {
              setSelectedSection(Number(e.target.value));
            }}
            placeholder="Select section"
          >
            {sections.map(sec => (
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
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredEntries.map((entry) => (
                <Tr key={entry.id}>
                  <Td>{entry.day}</Td>
                  <Td>{entry.subject}</Td>
                  <Td>{entry.timeFrom}</Td>
                  <Td>{entry.timeTo}</Td>
                  <Td>{classes.find(c => c.id === entry.classId)?.name}</Td>
                  <Td>{sections.find(s => s.id === entry.sectionId)?.name}</Td>
                  <Td>
                    <IconButton
                      colorScheme="blue"
                      aria-label="Edit"
                      icon={<EditIcon />}
                      onClick={() => handleOpenEditModal(entry)}
                      mr={2}
                    />
                    <IconButton
                      colorScheme="red"
                      aria-label="Delete"
                      icon={<DeleteIcon />}
                      onClick={() => handleDeleteEntry(entry.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}

      {/* Add Entry Modal */}
      <Modal isOpen={isAddModalOpen} onClose={closeAddModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Routine Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Day</FormLabel>
                <Select
                  placeholder="Select day"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Subject</FormLabel>
                <Input
                  placeholder="Subject"
                  value={selectedEntry?.subject || ''}
                  onChange={(e) =>
                    setSelectedEntry(prev => prev ? { ...prev, subject: e.target.value } : prev)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Time From</FormLabel>
                <Input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Time To</FormLabel>
                <Input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Class</FormLabel>
                <Select
                  placeholder="Select class"
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(Number(e.target.value))
                  }
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Section</FormLabel>
                <Select
                  placeholder="Select section"
                  value={selectedSection}
                  onChange={(e) =>
                    setSelectedSection(Number(e.target.value))
                  }
                >
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddEntry}>Add</Button>
            <Button ml={3} onClick={closeAddModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Entry Modal */}
      <Modal isOpen={isEditModalOpen} onClose={closeEditModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Routine Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Day</FormLabel>
                <Select
                  placeholder="Select day"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Subject</FormLabel>
                <Input
                  placeholder="Subject"
                  value={selectedEntry?.subject || ''}
                  onChange={(e) =>
                    setSelectedEntry(prev => prev ? { ...prev, subject: e.target.value } : prev)
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Time From</FormLabel>
                <Input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Time To</FormLabel>
                <Input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Class</FormLabel>
                <Select
                  placeholder="Select class"
                  value={selectedClass}
                  onChange={(e) =>
                    setSelectedClass(Number(e.target.value))
                  }
                >
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Section</FormLabel>
                <Select
                  placeholder="Select section"
                  value={selectedSection}
                  onChange={(e) =>
                    setSelectedSection(Number(e.target.value))
                  }
                >
                  {sections.map(sec => (
                    <option key={sec.id} value={sec.id}>{sec.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditEntry}>Save</Button>
            <Button ml={3} onClick={closeEditModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Routine;
