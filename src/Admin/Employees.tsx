import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
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
  useToast,
  Avatar,
} from '@chakra-ui/react';

const roles = [
  { id: 1, name: 'Teacher' },
  { id: 2, name: 'Admin' },
  { id: 3, name: 'Support Staff' }
];

const departments = [
  { id: 1, name: 'Mathematics' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'Humanities' }
];

const initialEmployees = [
  { id: 1, name: 'John Doe', roleId: 1, departmentId: 1, avatar: 'https://via.placeholder.com/40' },
  { id: 2, name: 'Jane Smith', roleId: 2, departmentId: 2, avatar: 'https://via.placeholder.com/40' },
  // Add more sample data as needed
];

const Employees: React.FC = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<{ id: number; name: string; roleId: number; departmentId: number; avatar: string } | null>(null);
  const [newEmployeeName, setNewEmployeeName] = useState<string>('');
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Filter employees based on search query
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [employees, searchQuery]);

  // Paginate filtered employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  }, [filteredEmployees, currentPage, itemsPerPage]);

  const handleSelect = (id: number) => {
    setSelectedEmployees(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
    );
  };

  const handleAddEmployee = () => {
    if (newEmployeeName.trim() && selectedRoleId !== null && selectedDepartmentId !== null) {
      setEmployees([{ id: Date.now(), name: newEmployeeName, roleId: selectedRoleId, departmentId: selectedDepartmentId, avatar: avatarUrl || 'https://via.placeholder.com/40' }, ...employees]);
      setNewEmployeeName('');
      setSelectedRoleId(null);
      setSelectedDepartmentId(null);
      setAvatarUrl('');
      toast({
        title: 'Employee added.',
        description: `The employee "${newEmployeeName}" has been added.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleEditEmployee = () => {
    if (currentEmployee && newEmployeeName.trim() && selectedRoleId !== null && selectedDepartmentId !== null) {
      setEmployees(employees.map(emp =>
        emp.id === currentEmployee.id
          ? { ...emp, name: newEmployeeName, roleId: selectedRoleId, departmentId: selectedDepartmentId, avatar: avatarUrl || emp.avatar }
          : emp
      ));
      setCurrentEmployee(null);
      setNewEmployeeName('');
      setSelectedRoleId(null);
      setSelectedDepartmentId(null);
      setAvatarUrl('');
      setIsEditing(false);
      toast({
        title: 'Employee updated.',
        description: `The employee "${newEmployeeName}" has been updated.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };

  const handleDeleteEmployees = () => {
    setEmployees(employees.filter(emp => !selectedEmployees.includes(emp.id)));
    setSelectedEmployees([]);
    toast({
      title: 'Employees deleted.',
      description: 'Selected employees have been deleted.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  const openEditModal = (emp: { id: number; name: string; roleId: number; departmentId: number; avatar: string }) => {
    setCurrentEmployee(emp);
    setNewEmployeeName(emp.name);
    setSelectedRoleId(emp.roleId);
    setSelectedDepartmentId(emp.departmentId);
    setAvatarUrl(emp.avatar);
    setIsEditing(true);
    onOpen();
  };

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <Container maxW="container.md" py={6}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">List of Employees</Text>
        <Button colorScheme="teal" onClick={() => { setIsEditing(false); onOpen(); }}>Add Employee</Button>
      </Flex>
      <Stack spacing={4} mb={4}>
        <Flex mb={4} align="center">
          <FormControl id="search" flex="1" mr={4}>
            <FormLabel>Search</FormLabel>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by employee name"
            />
          </FormControl>
          <FormControl id="items-per-page" flex="1">
            <FormLabel>Items Per Page</FormLabel>
            <Select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </Select>
          </FormControl>
        </Flex>
        {paginatedEmployees.map(emp => (
          <Flex key={emp.id} align="center" p={3} borderWidth={1} borderRadius="md" boxShadow="md">
            <Avatar name={emp.name} src={emp.avatar} size="md" mr={4} />
            <Stack flex="1">
              <Text fontSize="lg" fontWeight="bold">{emp.name}</Text>
              <Text>Role: {roles.find(role => role.id === emp.roleId)?.name}</Text>
              <Text>Department: {departments.find(dept => dept.id === emp.departmentId)?.name}</Text>
            </Stack>
            <Button colorScheme="blue" onClick={() => openEditModal(emp)}>Edit</Button>
          </Flex>
        ))}
      </Stack>
      <Flex justify="space-between" align="center">
        <Button
          colorScheme="red"
          onClick={handleDeleteEmployees}
          isDisabled={selectedEmployees.length === 0}
        >
          Delete Selected
        </Button>
        <Flex>
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            isDisabled={currentPage === 1}
          >
            Previous
          </Button>
          <Text mx={2}>{currentPage} / {totalPages}</Text>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Flex>
      </Flex>
      {/* Modal for Add/Edit Employee */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditing ? 'Edit Employee' : 'Add Employee'}</ModalHeader>
          <ModalBody>
            <FormControl id="employee-name" mb={4}>
              <FormLabel>Employee Name</FormLabel>
              <Input
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                placeholder="Enter employee name"
              />
            </FormControl>
            <FormControl id="role-select" mb={4}>
              <FormLabel>Select Role</FormLabel>
              <Select
                placeholder="Select role"
                value={selectedRoleId ?? ''}
                onChange={(e) => setSelectedRoleId(Number(e.target.value))}
              >
                {roles.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="department-select" mb={4}>
              <FormLabel>Select Department</FormLabel>
              <Select
                placeholder="Select department"
                value={selectedDepartmentId ?? ''}
                onChange={(e) => setSelectedDepartmentId(Number(e.target.value))}
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="avatar-url" mb={4}>
              <FormLabel>Avatar URL</FormLabel>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="Enter avatar URL"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={isEditing ? handleEditEmployee : handleAddEmployee}>
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

export default Employees;
