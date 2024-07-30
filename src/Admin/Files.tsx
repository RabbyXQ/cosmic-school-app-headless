import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  IconButton,
  Checkbox,
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';

interface File {
  name: string;
  size: number; // Size in bytes
  category: string;
}

const initialCategories = ['Documents', 'Images', 'Videos'];

const Files: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]);
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [newCategory, setNewCategory] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const { isOpen: isAddCategoryOpen, onOpen: onAddCategoryOpen, onClose: onAddCategoryClose } = useDisclosure();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files).map(file => ({
        name: file.name,
        size: file.size,
        category: selectedCategory,
      }));
      setFiles([...files, ...uploadedFiles]);
      onUploadClose();
    }
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setSelectedCategory(newCategory);
      setNewCategory('');
      onAddCategoryClose();
    }
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleDeleteFiles = () => {
    const updatedFiles = files.filter((_, index) => !selectedFiles.has(index));
    setFiles(updatedFiles);
    setSelectedFiles(new Set());
  };

  const handleSelectFile = (index: number) => {
    setSelectedFiles(prev => {
      const newSelectedFiles = new Set(prev);
      if (newSelectedFiles.has(index)) {
        newSelectedFiles.delete(index);
      } else {
        newSelectedFiles.add(index);
      }
      return newSelectedFiles;
    });
  };

  const totalPages = Math.ceil(files.filter(file => file.category === selectedCategory).length / itemsPerPage);
  const currentFiles = files
    .filter(file => file.category === selectedCategory)
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box p={5}>
      <Button onClick={onUploadOpen} colorScheme="teal">Upload Files</Button>
      <Button onClick={handleDeleteFiles} colorScheme="red" ml={4} isDisabled={selectedFiles.size === 0}>Delete Selected Files</Button>
      <Button onClick={onAddCategoryOpen} colorScheme="blue" ml={4}>Add Category</Button>

      <FormControl mt={4}>
        <FormLabel>Category</FormLabel>
        <Select value={selectedCategory} onChange={handleCategoryChange}>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </Select>
      </FormControl>

      <FormControl mt={4}>
        <FormLabel>Items per page</FormLabel>
        <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          {[5, 10, 20].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      </FormControl>

      <Box mt={4}>
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {currentFiles.map((file, index) => (
            <Box key={index} p={3} border="1px" borderRadius="md" position="relative">
              <Checkbox
                position="absolute"
                top={2}
                left={2}
                colorScheme="teal"
                isChecked={selectedFiles.has(index)}
                onChange={() => handleSelectFile(index)}
              />
              <Box>
                <Box fontWeight="bold">{file.name}</Box>
                <Box fontSize="sm">{(file.size / 1024).toFixed(2)} KB</Box>
              </Box>
            </Box>
          ))}
        </Grid>

        <Box mt={4} display="flex" justifyContent="center" alignItems="center">
          <IconButton
            icon={<ChevronLeftIcon />}
            aria-label="Previous page"
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 0}
          />
          <Box mx={4}>
            Page {currentPage + 1} of {totalPages}
          </Box>
          <IconButton
            icon={<ChevronRightIcon />}
            aria-label="Next page"
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages - 1}
          />
        </Box>
      </Box>

      {/* Upload File Modal */}
      <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Files</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onUploadClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Category Modal */}
      <Modal isOpen={isAddCategoryOpen} onClose={onAddCategoryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddCategory}>Add Category</Button>
            <Button colorScheme="gray" ml={3} onClick={onAddCategoryClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Files;
