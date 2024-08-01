import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Stack,
  List,
  ListItem,
  IconButton,
  useToast,
  Select,
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
import { SettingMenu } from './Settings';

type Page = {
  title: string;
  slug: string;
};

type Section = {
  type: 'link' | 'page';
  id?: number;
  name?: string;
  value: string;
};

type Class = {
  id: number;
  menuType: string;
  name: string;
  sections: Section[];
};

const TopMenu: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newSection, setNewSection] = useState<Section>({ type: 'page', value: '', id: 0 });
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState<boolean>(false);
  const [isEditingClass, setIsEditingClass] = useState<boolean>(false);
  const [isEditingSection, setIsEditingSection] = useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/menus/classes');
        setClasses(response.data);
      } catch (err) {
        console.error('Failed to fetch classes', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch classes.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    const fetchPages = async () => {
      try {
        const response = await axios.get('http://localhost:4000/menus/sections/grouped');
        setPages(response.data);
      } catch (err) {
        console.error('Failed to fetch pages', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch pages.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchClasses();
    fetchPages();
  }, [toast]);

  const handleSaveClass = async () => {
    if (newClassName.trim()) {
      try {
        if (isEditingClass && currentClass) {
          await axios.put(`http://localhost:4000/menus/classes/${currentClass.id}`, { name: newClassName });
          setClasses((prevClasses) =>
            prevClasses.map((cls) =>
              cls.id === currentClass.id ? { ...cls, name: newClassName } : cls
            )
          );
          toast({
            title: 'Class Updated',
            description: `Class "${newClassName}" updated successfully.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          const response = await axios.post('http://localhost:4000/menus/classes', {
            name: newClassName,
            menuType: 'default',
          });
          setClasses((prevClasses) => [
            ...prevClasses,
            {
              id: response.data.id,
              name: newClassName,
              menuType: 'default',
              sections: [],
            },
          ]);
          toast({
            title: 'Class Added',
            description: `Class "${newClassName}" added successfully.`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
        setIsClassModalOpen(false);
        setNewClassName('');
        setCurrentClass(null);
        setIsEditingClass(false);
      } catch (err) {
        console.error('Failed to save class', err);
        toast({
          title: 'Error',
          description: 'Failed to save class.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteClass = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/menus/classes/${id}`);
      setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== id));
      toast({
        title: 'Class Deleted',
        description: 'Class deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to delete class', err);
      toast({
        title: 'Error',
        description: 'Failed to delete class.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddSection = (cls: Class) => {
    setCurrentClass(cls);
    setNewSection({ type: 'page', value: '', id: 0 });
    setIsSectionModalOpen(true);
    setIsEditingSection(false);
  };

  const handleEditSection = (cls: Class, section: Section) => {
    setCurrentClass(cls);
    setNewSection(section);
    setIsSectionModalOpen(true);
    setIsEditingSection(true);
  };

  const handleSaveSection = async () => {
    if (currentClass && newSection.value) {
      try {
        if (isEditingSection && newSection.id) {
          await axios.put(`http://localhost:4000/menus/sections/${newSection.id}`, newSection);
          const updatedSections = currentClass.sections.map((sec) =>
            sec.id === newSection.id ? newSection : sec
          );
          setCurrentClass({ ...currentClass, sections: updatedSections });
          setClasses((prevClasses) =>
            prevClasses.map((cls) =>
              cls.id === currentClass.id ? { ...cls, sections: updatedSections } : cls
            )
          );
          toast({
            title: 'Section Updated',
            description: 'Section updated successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        } else {
          const response = await axios.post('http://localhost:4000/menus/sections', {
            classId: currentClass.id,
            type: newSection.type,
            name: newSection.name,
            value: newSection.value,
          });
          const updatedSections = [
            ...currentClass.sections,
            { ...newSection, id: response.data.id },
          ];
          setCurrentClass({ ...currentClass, sections: updatedSections });
          setClasses((prevClasses) =>
            prevClasses.map((cls) =>
              cls.id === currentClass.id ? { ...cls, sections: updatedSections } : cls
            )
          );
          toast({
            title: 'Section Added',
            description: 'Section added successfully.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        }
        setIsSectionModalOpen(false);
        setNewSection({ type: 'page', value: '', id: 0 });
        setCurrentClass(null);
        setIsEditingSection(false);
      } catch (err) {
        console.error('Failed to save section', err);
        toast({
          title: 'Error',
          description: 'Failed to save section.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDeleteSection = async (classId: number, sectionId: number) => {
    try {
      await axios.delete(`http://localhost:4000/menus/sections/${sectionId}`);
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === classId
            ? { ...cls, sections: cls.sections.filter((sec) => sec.id !== sectionId) }
            : cls
        )
      );
      toast({
        title: 'Section Deleted',
        description: 'Section deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Failed to delete section', err);
      toast({
        title: 'Error',
        description: 'Failed to delete section.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.lg">
      <Box mb={4}>
        <Heading as="h1">Manage Classes and Sections</Heading>
      </Box>
      <Box mb={4}>
        <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={() => {
          setIsClassModalOpen(true);
          setIsEditingClass(false);
          setNewClassName('');
        }}>
          Add Class
        </Button>
      </Box>
      <List spacing={3}>
        {classes.map((cls) => (
          <ListItem key={cls.id}>
            <HStack justify="space-between">
              <Box>
                <Heading as="h3" size="md">
                  {cls.name}
                </Heading>
                {cls.sections && (
                  <List spacing={1}>
                    {cls.sections.map((sec) => (
                      <ListItem key={sec.id}>
                        <HStack justify="space-between">
                          <Box>
                            {sec.type === 'page' ? `Page: ${sec.value}` : `Link: ${sec.value}`}
                          </Box>
                          <Box>
                            <IconButton
                              aria-label="Edit section"
                              icon={<EditIcon />}
                              onClick={() => handleEditSection(cls, sec)}
                            />
                            <IconButton
                              aria-label="Delete section"
                              icon={<DeleteIcon />}
                              onClick={() => handleDeleteSection(cls.id, sec.id!)}
                              colorScheme="red"
                            />
                          </Box>
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
              <Button
                leftIcon={<AddIcon />}
                colorScheme="teal"
                onClick={() => handleAddSection(cls)}
              >
                Add Section
              </Button>
              <IconButton
                aria-label="Edit class"
                icon={<EditIcon />}
                onClick={() => {
                  setCurrentClass(cls);
                  setNewClassName(cls.name);
                  setIsClassModalOpen(true);
                  setIsEditingClass(true);
                }}
              />
              <IconButton
                aria-label="Delete class"
                icon={<DeleteIcon />}
                onClick={() => handleDeleteClass(cls.id)}
                colorScheme="red"
              />
            </HStack>
          </ListItem>
        ))}
      </List>

      <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditingClass ? 'Edit Class' : 'Add Class'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Class Name</FormLabel>
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter class name"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsClassModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveClass} colorScheme="blue">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditingSection ? 'Edit Section' : 'Add Section'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Section Type</FormLabel>
              <Select
                value={newSection.type}
                onChange={(e) =>
                  setNewSection((prevSection) => ({
                    ...prevSection,
                    type: e.target.value as 'link' | 'page',
                  }))
                }
              >
                <option value="page">Page</option>
                <option value="link">Link</option>
              </Select>
            </FormControl>
            {newSection.type === 'page' ? (
              <FormControl mt={4}>
                <FormLabel>Page</FormLabel>
                <Select
                  value={newSection.value}
                  onChange={(e) =>
                    setNewSection((prevSection) => ({
                      ...prevSection,
                      value: e.target.value,
                    }))
                  }
                >
                  {pages.map((page) => (
                    <option key={page.slug} value={page.slug}>
                      {page.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <FormControl mt={4}>
                <FormLabel>Link</FormLabel>
                <Input
                  value={newSection.value}
                  onChange={(e) =>
                    setNewSection((prevSection) => ({
                      ...prevSection,
                      value: e.target.value,
                    }))
                  }
                  placeholder="Enter link URL"
                />
              </FormControl>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSection} colorScheme="blue">
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default TopMenu;
