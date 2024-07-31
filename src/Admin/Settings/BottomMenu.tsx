import React, { useState, useRef } from 'react';
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
  name?: string; // Only needed for 'link'
  value: string; // For 'page', it's the slug. For 'link', it's the URL.
};

type Class = {
  id: number;
  name: string;
  sections: Section[];
};

const pages: Page[] = [
  { title: 'Home', slug: 'home' },
  { title: 'About Us', slug: 'about-us' },
  { title: 'Contact', slug: 'contact' },
];

const initialClasses: Class[] = [
  { id: 1, name: 'Class 1', sections: [] },
  { id: 2, name: 'Class 2', sections: [] },
  { id: 3, name: 'Class 3', sections: [] },
];

const BottomMenu: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newSection, setNewSection] = useState<Section>({ type: 'page', value: '' });
  const [isClassModalOpen, setIsClassModalOpen] = useState<boolean>(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  const handleAddClass = () => {
    setNewClassName('');
    setIsClassModalOpen(true);
  };

  const handleSaveClass = () => {
    if (newClassName.trim()) {
      const newClass: Class = { id: Date.now(), name: newClassName, sections: [] };
      setClasses([...classes, newClass]);
      setIsClassModalOpen(false);
      toast({
        title: 'Class Added',
        description: `A new class has been added.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateClass = () => {
    if (currentClass && newClassName.trim()) {
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === currentClass.id ? { ...cls, name: newClassName } : cls
        )
      );
      setIsClassModalOpen(false);
      setCurrentClass(null);
      toast({
        title: 'Class Updated',
        description: `The class "${newClassName}" has been updated.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteClass = (id: number) => {
    setClasses((prevClasses) => prevClasses.filter((cls) => cls.id !== id));
    toast({
      title: 'Class Deleted',
      description: `The class has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleAddSection = (cls: Class) => {
    setCurrentClass(cls);
    setNewSection({ type: 'page', value: '' });
    setIsSectionModalOpen(true);
  };

  const handleSaveSection = () => {
    if (currentClass && newSection.value) {
      const updatedSections = [...currentClass.sections, newSection];
      setCurrentClass({ ...currentClass, sections: updatedSections });
      setClasses((prevClasses) =>
        prevClasses.map((cls) =>
          cls.id === currentClass.id ? { ...cls, sections: updatedSections } : cls
        )
      );
      setIsSectionModalOpen(false);
      setNewSection({ type: 'page', value: '' });
      toast({
        title: 'Section Added',
        description: `A new section has been added.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteSection = (classId: number, sectionIndex: number) => {
    setClasses((prevClasses) =>
      prevClasses.map((cls) =>
        cls.id === classId
          ? { ...cls, sections: cls.sections.filter((_, index) => index !== sectionIndex) }
          : cls
      )
    );
    toast({
      title: 'Section Deleted',
      description: `The section has been deleted.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container" py={6}>
      <SettingMenu/>
      <Heading size="lg" mb={6}>Menu</Heading>
      <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={handleAddClass} mb={6}>
        Add Class
      </Button>
      <List spacing={3}>
        {classes.map((cls) => (
          <ListItem key={cls.id} borderWidth={1} borderRadius="md" p={4}>
            <HStack justify="space-between">
              <Box>{cls.name}</Box>
              <HStack spacing={2}>
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Add Section"
                  onClick={() => handleAddSection(cls)}
                />
                <IconButton
                  icon={<EditIcon />}
                  aria-label="Edit Class"
                  onClick={() => {
                    setCurrentClass(cls);
                    setNewClassName(cls.name);
                    setIsClassModalOpen(true);
                  }}
                />
                <IconButton
                  icon={<DeleteIcon />}
                  aria-label="Delete Class"
                  onClick={() => handleDeleteClass(cls.id)}
                />
              </HStack>
            </HStack>
            {cls.sections.length > 0 && (
              <List mt={4} spacing={2}>
                {cls.sections.map((section, index) => (
                  <ListItem key={index} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      {section.type === 'link' ? (
                        <a href={section.value} target="_blank" rel="noopener noreferrer">
                          {section.name || 'Unnamed Link'}
                        </a>
                      ) : (
                        <a href={`/pages/${section.value}`}>
                          {section.name || section.value}
                        </a>
                      )}
                    </Box>
                    <IconButton
                      icon={<DeleteIcon />}
                      aria-label="Delete Section"
                      onClick={() => handleDeleteSection(cls.id, index)}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </ListItem>
        ))}
      </List>

      <Modal isOpen={isClassModalOpen} onClose={() => setIsClassModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{currentClass ? 'Edit Class' : 'Add Class'}</ModalHeader>
          <ModalCloseButton />
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
            <Button colorScheme="teal" mr={3} onClick={currentClass ? handleUpdateClass : handleSaveClass}>
              Save
            </Button>
            <Button ref={cancelRef} onClick={() => setIsClassModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSectionModalOpen} onClose={() => setIsSectionModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Section</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl id="section-type" mb={2}>
              <FormLabel>Section Type</FormLabel>
              <Select
                value={newSection.type}
                onChange={(e) => setNewSection({ ...newSection, type: e.target.value as 'link' | 'page' })}
              >
                <option value="page">Page</option>
                <option value="link">Link</option>
              </Select>
            </FormControl>
            {newSection.type === 'page' && (
              <FormControl id="section-value" mb={2}>
                <FormLabel>Page</FormLabel>
                <Select
                  value={newSection.value}
                  onChange={(e) => setNewSection({ ...newSection, value: e.target.value })}
                >
                <option key={null} value="null"/>
                  {pages.map((page) => (
                    <option key={page.slug} value={page.slug}>
                      {page.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
            {newSection.type === 'link' && (
              <>
                <FormControl id="section-name" mb={2}>
                  <FormLabel>Link Name</FormLabel>
                  <Input
                    value={newSection.name || ''}
                    onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                    placeholder="Enter link name"
                  />
                </FormControl>
                <FormControl id="section-url" mb={2}>
                  <FormLabel>Link URL</FormLabel>
                  <Input
                    value={newSection.value}
                    onChange={(e) => setNewSection({ ...newSection, value: e.target.value })}
                    placeholder="Enter URL"
                  />
                </FormControl>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleSaveSection}>
              Save
            </Button>
            <Button ref={cancelRef} onClick={() => setIsSectionModalOpen(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default BottomMenu;
