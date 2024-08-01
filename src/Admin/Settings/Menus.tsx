import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Spinner,
  Input,
  HStack,
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
} from '@chakra-ui/react';
import axios from 'axios';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import MenuSections from './MenuSections';
import { SettingMenu } from './Settings';

type Menu = {
  id: number;
  name: string;
  menu_type: string;
};

const Menus: React.FC = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setFilteredMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(5);
  const [filterType, setFilterType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [newMenu, setNewMenu] = useState<{ name: string; menu_type: string }>({ name: '', menu_type: '' });
  const toast = useToast(); // Corrected usage
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Menu[]>('http://localhost:4000/menus/classes');
        setMenus(response.data);
        setFilteredMenus(response.data);
      } catch (err) {
        setError('Failed to fetch menus.');
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  useEffect(() => {
    let filtered = menus.filter(menu =>
      menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType) {
      filtered = filtered.filter(menu => menu.menu_type === filterType);
    }

    setFilteredMenus(filtered);
  }, [filterType, searchTerm, menus]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = (menu?: Menu) => {
    setModalMode(menu ? 'edit' : 'add');
    setNewMenu(menu ? { name: menu.name, menu_type: menu.menu_type } : { name: '', menu_type: '' });
    setEditingMenu(menu ?? null);
    onOpen();
  };

  const handleCloseModal = () => {
    onClose();
    setEditingMenu(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMenu(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSaveMenu = async () => {
    try {
      if (modalMode === 'add') {
        await axios.post('http://localhost:4000/menus/classes', newMenu);
        toast({ title: "Menu added.", status: "success" });
      } else if (modalMode === 'edit' && editingMenu) {
        await axios.put(`http://localhost:4000/menus/classes/${editingMenu.id}`, newMenu);
        toast({ title: "Menu updated.", status: "success" });
      }
      handleCloseModal();
      const response = await axios.get<Menu[]>('http://localhost:4000/menus/classes');
      setMenus(response.data);
    } catch (error) {
      toast({ title: "An error occurred.", status: "error" });
    }
  };

  const handleDeleteMenu = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/menus/classes/${id}`);
      setMenus(prev => prev.filter(menu => menu.id !== id));
      toast({ title: "Menu deleted.", status: "success" });
    } catch (error) {
      toast({ title: "An error occurred.", status: "error" });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenus.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageCount = Math.ceil(filteredMenus.length / itemsPerPage);

  return (
    <Box p={4}>
        <SettingMenu/>
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
        <Input
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearchChange}
          width="auto"
        />
        <Select placeholder="Filter Position" onChange={handleFilterChange} value={filterType} width="auto">
          <option value="">All</option>
          <option value="top">Top</option>
          <option value="mid">Middle</option>
          <option value="bot">Bottom</option>
          {/* Add more options as needed */}
        </Select>
        <Button onClick={() => handleOpenModal()} colorScheme="teal">Add Menu</Button>
      </Box>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Box color="red.500">{error}</Box>
      ) : (
        <Table variant="simple">
          <TableCaption>Menus</TableCaption>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Name</Th>
              <Th>Position</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((menu) => (
            <>
              <Tr key={menu.id}>
                <Td>{menu.id}</Td>
                <Td>{menu.name}</Td>
                <Td>{menu.menu_type}</Td>
                <Td>
                  <IconButton
                    icon={<EditIcon />}
                    onClick={() => handleOpenModal(menu)}
                    colorScheme="blue"
                    aria-label="Edit"
                    mr={2}
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    onClick={() => handleDeleteMenu(menu.id)}
                    colorScheme="red"
                    aria-label="Delete"
                  />
                </Td>
              </Tr>
              <Tr>
              <MenuSections classId={menu.id}/>
              </Tr>
              </>
            ))}
          </Tbody>
        </Table>
      )}
      <HStack spacing={2} mt={4}>
        {Array.from({ length: pageCount }, (_, index) => (
          <Button
            key={index}
            onClick={() => paginate(index + 1)}
            colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
          >
            {index + 1}
          </Button>
        ))}
      </HStack>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalMode === 'add' ? 'Add Menu' : 'Edit Menu'}</ModalHeader>
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={newMenu.name}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Type</FormLabel>
              <Select
                name="menu_type"
                value={newMenu.menu_type}
                onChange={handleInputChange}
              >
                <option value="top">Select Option</option>

                <option value="top">Top</option>
                <option value="mid">Middle</option>
                <option value="bot">Bottom</option>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveMenu}>
              Save
            </Button>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Menus;
