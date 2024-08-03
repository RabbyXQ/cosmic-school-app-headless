import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Flex,
  Box,
  useToast,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  useDisclosure
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SyllabusManager = () => {
  const [syllabi, setSyllabi] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedSyllabus, setSelectedSyllabus] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [class_id, setClassId] = useState('');
  const [year, setYear] = useState('');
  const [page_slug, setPageSlug] = useState('');
  const [pages, setPages] = useState<any[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSyllabi();
    fetchPages();
  }, [page, search]);

  const fetchSyllabi = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/syllabi', {
        params: {
          page,
          limit: perPage,
          search
        }
      });
      setSyllabi(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching syllabi:', error);
      toast({
        title: 'Error fetching syllabi',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const fetchPages = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/pages/get-all');
      setPages(data.items);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: 'Error fetching pages',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/syllabus/${id}`);
      toast({
        title: 'Syllabus deleted',
        status: 'success',
        duration: 5000,
        isClosable: true
      });
      fetchSyllabi();
    } catch (error) {
      console.error('Error deleting syllabus:', error);
      toast({
        title: 'Error deleting syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleEdit = async (id: number) => {
    try {
      const { data } = await axios.get(`http://localhost:4000/syllabus/${id}`);
      setSelectedSyllabus(data);
      setClassId(data.class_id);
      setYear(data.year);
      setPageSlug(data.page_slug);
      setIsEditing(true);
      onOpen();
    } catch (error) {
      console.error('Error fetching syllabus:', error);
      toast({
        title: 'Error fetching syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:4000/syllabus/${selectedSyllabus.id}`, { class_id, year, page_slug });
        toast({
          title: 'Syllabus updated',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      } else {
        await axios.post('http://localhost:4000/syllabus', { class_id, year, page_slug });
        toast({
          title: 'Syllabus added',
          status: 'success',
          duration: 5000,
          isClosable: true
        });
      }
      navigate('/admin/syllabus');
      fetchSyllabi();
      onClose();
    } catch (error) {
      console.error('Error saving syllabus:', error);
      toast({
        title: 'Error saving syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  // Generate years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <Box p={4}>
      <Flex mb={4} align="center" justify="space-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mb={4}
        />
        <Button colorScheme="teal" onClick={() => {
          setSelectedSyllabus(null);
          setClassId('');
          setYear('');
          setPageSlug('');
          setIsEditing(false);
          onOpen();
        }}>
          Add New
        </Button>
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Class ID</Th>
            <Th>Year</Th>
            <Th>Page Slug</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {syllabi.map((syllabus: any) => (
            <Tr key={syllabus.id}>
              <Td>{syllabus.id}</Td>
              <Td>{syllabus.class_id}</Td>
              <Td>{syllabus.year}</Td>
              <Td>{syllabus.page_slug}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => handleEdit(syllabus.id)}
                  mr={2}>
                    <EditIcon/>
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDelete(syllabus.id)}><DeleteIcon /></Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Flex mt={4} justify="space-between">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </Flex>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Syllabus' : 'Add New Syllabus'}</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Class ID</FormLabel>
              <Input
                value={class_id}
                onChange={(e) => setClassId(e.target.value)}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Year</FormLabel>
              <Select
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                {years.map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Page Slug</FormLabel>
              <Select
                value={page_slug}
                onChange={(e) => setPageSlug(e.target.value)}
              >
                {pages.map((page) => (
                  <option key={page.id} value={page.slug}>{page.title}</option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Add Syllabus'}
            </Button>
            <Button ml={3} onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SyllabusManager;
