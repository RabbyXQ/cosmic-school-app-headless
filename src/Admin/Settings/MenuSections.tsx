import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Spinner,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  Select,
  HStack,
} from '@chakra-ui/react';
import axios from 'axios';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

type Section = {
  id?: number;
  classId: number;
  type: 'link' | 'page';
  name: string;
  value: string;
};

type Page = {
  id: number;
  title: string;
  slug: string;
};

type MenuSectionsProps = {
  classId: number;
};

const MenuSections: React.FC<MenuSectionsProps> = ({ classId }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newSection, setNewSection] = useState<Section>({ classId, type: 'link', name: '', value: '' });
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // State for expand/collapse
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/menus/classes/${classId}/sections`);
        setSections(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching sections');
        setLoading(false);
      }
    };

    const fetchPages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/pages/get-all');
        setPages(response.data.items); // Adjust if the response structure is different
      } catch (error) {
        setError('Error fetching pages');
      }
    };

    fetchSections();
    fetchPages();
  }, [classId]);

  const handleSave = async () => {
    try {
      if (editingSection) {
        await axios.put(`http://localhost:4000/menus/classes/sections/${editingSection.id}`, {
          ...newSection,
        });
        setSections((prevSections) =>
          prevSections.map((section) => (section.id === editingSection.id ? newSection : section))
        );
        toast({ title: 'Section updated.', status: 'success', duration: 3000, isClosable: true });
      } else {
        const response = await axios.post(`http://localhost:4000/menus/classes/sections`, newSection);
        setSections([...sections, response.data]);
        toast({ title: 'Section added.', status: 'success', duration: 3000, isClosable: true });
      }
      onClose();
    } catch (error) {
      toast({ title: 'Error saving section.', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/menus/classes/sections/${id}`);
      setSections(sections.filter((section) => section.id !== id));
      toast({ title: 'Section deleted.', status: 'success', duration: 3000, isClosable: true });
    } catch (error) {
      toast({ title: 'Error deleting section.', status: 'error', duration: 3000, isClosable: true });
    }
  };

  const handleOpenModal = (section?: Section) => {
    setNewSection(section ? { ...section } : { classId, type: 'link', name: '', value: '' });
    setEditingSection(section ?? null);
    onOpen();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Box>{error}</Box>;
  }

  return (
    <Box>
      <HStack>
        <Button colorScheme='green' onClick={() => handleOpenModal()} mt={4}>Add Section</Button>
         <Button colorScheme={isExpanded ? "green" : "red"} px="2" onClick={toggleExpand} mt={4}>
        {isExpanded ? 'Collapse List' : 'Expand Items'}
      </Button>
      </HStack>
      {isExpanded && (
        <Table variant="simple" mt={4}>
          <TableCaption>Menu Sections</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Value</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sections.map((section) => (
              <Tr key={section.id}>
                <Td>{section.name}</Td>
                <Td>{section.type}</Td>
                <Td>{section.value}</Td>
                <Td>
                  <IconButton
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={() => handleOpenModal(section)}
                    mr={2}
                  />
                  <IconButton
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                    onClick={() => handleDelete(section.id!)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editingSection ? 'Edit Section' : 'Add Section'}</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={newSection.name}
                onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Type</FormLabel>
              <Select
                value={newSection.type}
                onChange={(e) => setNewSection({ ...newSection, type: e.target.value as 'link' | 'page' })}
              >
                <option value="link">Link</option>
                <option value="page">Page</option>
              </Select>
            </FormControl>
            {newSection.type === 'page' && (
            <FormControl mt={4}>
                <FormLabel>Page</FormLabel>
                <Select
                value={newSection.value}
                onChange={(e) => {
                    const selectedValue = e.target.value;
                    const selectedPage = pages.find(page => page.slug === selectedValue);

                    setNewSection(prev => ({
                    ...prev,
                    value: selectedValue,
                    name: selectedPage ? selectedPage.title : '',
                    }));
                }}
                >
                {pages.map((page) => (
                    <option key={page.id} value={page.slug}>
                    {page.title}
                    </option>
                ))}
                </Select>
                <Input
                  mt={2}
                  value={newSection.value}
                  hidden={true}
                  placeholder="Value will be auto-filled based on the selected page"
                />
              </FormControl>
            )}
            {newSection.type === 'link' && (
              <FormControl mt={4}>
                <FormLabel>Value</FormLabel>
                <Input
                  value={newSection.value}
                  onChange={(e) => setNewSection({ ...newSection, value: e.target.value })}
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSave}>{editingSection ? 'Update' : 'Add'}</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MenuSections;
