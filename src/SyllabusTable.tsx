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
  Select,
  Flex,
  Box,
  useToast,
  VStack
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SyllabusTable = () => {
  const [syllabi, setSyllabi] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(10);
  const [selectedYear, setSelectedYear] = useState('');
  const [classNames, setClassNames] = useState<Record<number, string>>({});
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchSyllabi();
  }, [page, search, selectedYear]);

  useEffect(() => {
    fetchClassNames();
  }, [syllabi]);

  const fetchSyllabi = async () => {
    try {
      const { data } = await axios.get('http://localhost:4000/syllabi', {
        params: {
          page,
          limit: perPage,
          search,
          year: selectedYear
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

  const fetchClassNames = async () => {
    try {
      const classIds = Array.from(new Set(syllabi.map(syllabus => syllabus.class_id)));
      const classPromises = classIds.map(classId =>
        axios.get(`http://localhost:4000/classes/${classId}`).then(response => ({
          id: classId,
          name: response.data.name
        }))
      );
      const classResponses = await Promise.all(classPromises);
      const classNameMap = classResponses.reduce((acc: any, { id, name }) => {
        acc[id] = name;
        return acc;
      }, {});
      setClassNames(classNameMap);
    } catch (error) {
      console.error('Error fetching class names:', error);
      toast({
        title: 'Error fetching class names',
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box p={4}>
      <VStack align="center" justify="space-between">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          placeholder="Select year"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          mb={4}
        >
          {years.map(year => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </Select>
      </VStack>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Class Name</Th>
            <Th>Year</Th>
            <Th>Link</Th>
          </Tr>
        </Thead>
        <Tbody>
          {syllabi.map((syllabus: any) => (
            <Tr key={syllabus.id}>
              <Td>{syllabus.id}</Td>
              <Td>{classNames[syllabus.class_id]}</Td>
              <Td>{syllabus.year}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => navigate(`/pages/${syllabus.page_slug}`)}
                >
                  View
                </Button>
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
    </Box>
  );
};

export default SyllabusTable;
