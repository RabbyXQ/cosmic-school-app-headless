import React, { useState, useEffect } from 'react';
import {
  Select,
  Button,
  Box,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  IconButton,
  FormControl,
  FormLabel,
  Text,
  Icon,
  HStack
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { API_BASE_URL } from '../API';
import { FaClipboard, FaDownload } from 'react-icons/fa';
import { BsPencil, BsTrash } from 'react-icons/bs';

const API_BASE_URL_CATEGORIES = 'http://localhost:4000/gallery/categories';
const API_BASE_URL_ITEMS = 'http://localhost:4000/gallery/items';
const API_UPLOAD_URL = 'http://localhost:4000/pages/upload';

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<any[]>([]);
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [editingGalleryName, setEditingGalleryName] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const [galleryToEdit, setGalleryToEdit] = useState<number | null>(null);
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  const { isOpen: isAddGalleryOpen, onOpen: onAddGalleryOpen, onClose: onAddGalleryClose } = useDisclosure();
  const { isOpen: isAddPhotoOpen, onOpen: onAddPhotoOpen, onClose: onAddPhotoClose } = useDisclosure();
  const { isOpen: isEditGalleryOpen, onOpen: onEditGalleryOpen, onClose: onEditGalleryClose } = useDisclosure();
  const { isOpen: isDeleteGalleryOpen, onOpen: onDeleteGalleryOpen, onClose: onDeleteGalleryClose } = useDisclosure();

  useEffect(() => {
    fetchGalleries();
  }, []);

  useEffect(() => {
    if (selectedGalleryId !== null) {
      fetchGalleryItems(selectedGalleryId);
    }
  }, [selectedGalleryId]);

  const fetchGalleries = async () => {
    try {
      const response = await fetch(API_BASE_URL_CATEGORIES);
      const data = await response.json();
      setGalleries(data);
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    }
  };

  const fetchGalleryItems = async (galleryId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL_ITEMS}?galleryId=${galleryId}`);
      const data = await response.json();
      setGalleryItems(data);
    } catch (error) {
      console.error('Failed to fetch gallery items:', error);
    }
  };

  const handleAddGallery = async () => {
    try {
      const response = await fetch(API_BASE_URL_CATEGORIES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGalleryName })
      });
      if (response.ok) {
        fetchGalleries();
        setNewGalleryName('');
        onAddGalleryClose();
      }
    } catch (error) {
      console.error('Failed to add gallery:', error);
    }
  };

  const handleEditGallery = async () => {
    if (selectedGalleryId !== null) {
      try {
        const response = await fetch(`${API_BASE_URL_CATEGORIES}/${selectedGalleryId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: editingGalleryName })
        });
        if (response.ok) {
          fetchGalleries();
          setEditingGalleryName('');
          onEditGalleryClose();
        }
      } catch (error) {
        console.error('Failed to edit gallery:', error);
      }
    }
  };

  const handleDeleteGallery = async () => {
    if (selectedGalleryId !== null) {
      try {
        const response = await fetch(`${API_BASE_URL_CATEGORIES}/${selectedGalleryId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchGalleries();
          setSelectedGalleryId(null);
          setGalleryItems([]);
          onDeleteGalleryClose();
        }
      } catch (error) {
        console.error('Failed to delete gallery:', error);
      }
    }
  };

  const handleAddPhoto = async () => {
    if (selectedGalleryId !== null && newPhoto) {
      const formData = new FormData();
      formData.append('file', newPhoto);

      try {
        const response = await fetch(API_UPLOAD_URL, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (response.ok && result.url) {
          const photoData = {
            gallery_id: selectedGalleryId,
            image: result.url
          };
          await fetch(API_BASE_URL_ITEMS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(photoData)
          });
          fetchGalleryItems(selectedGalleryId);
          setNewPhoto(null);
          onAddPhotoClose();
        }
      } catch (error) {
        console.error('Failed to add photo:', error);
      }
    }
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGalleryId(Number(event.target.value));
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleDeletePhotos = async () => {
    if (selectedGalleryId !== null) {
      const photosToDelete = Array.from(selectedPhotos);
      try {
        await Promise.all(
          photosToDelete.map(photoIndex =>
            fetch(`${API_BASE_URL_ITEMS}/${galleryItems[photoIndex].id}`, {
              method: 'DELETE'
            })
          )
        );
        fetchGalleryItems(selectedGalleryId);
        setSelectedPhotos(new Set());
      } catch (error) {
        console.error('Failed to delete photos:', error);
      }
    }
  };

  const handleSelectPhoto = (index: number) => {
    setSelectedPhotos(prev => {
      const newSelectedPhotos = new Set(prev);
      if (newSelectedPhotos.has(index)) {
        newSelectedPhotos.delete(index);
      } else {
        newSelectedPhotos.add(index);
      }
      return newSelectedPhotos;
    });
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }).catch((error) => {
      console.error('Failed to copy link:', error);
    });
  };

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || 'photo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedGallery = selectedGalleryId !== null ? galleries.find(g => g.id === selectedGalleryId) : null;
  const totalPhotos = galleryItems.length;
  const totalPages = Math.ceil(totalPhotos / itemsPerPage);
  const currentPhotos = galleryItems.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box p={5}>
      <Select placeholder="Select gallery" onChange={handleGalleryChange} value={selectedGalleryId || ''}>
        {galleries.map(gallery => (
          <option key={gallery.id} value={gallery.id}>{gallery.name}</option>
        ))}
      </Select>
      <HStack mt={4}>
        <Button onClick={onAddGalleryOpen}>Add Gallery</Button>
        {selectedGalleryId !== null && (
          <>
            <Button onClick={onEditGalleryOpen} ml={4}>Edit Gallery</Button>
            <Button onClick={onDeleteGalleryOpen} ml={4} colorScheme="red">Delete Gallery</Button>
          </>
        )}
        <Button onClick={onAddPhotoOpen} ml={4}>Add Photo</Button>
        <Button onClick={handleDeletePhotos} ml={4} colorScheme="red" isDisabled={selectedPhotos.size === 0}>Delete Selected Photos</Button>
      </HStack>

      <FormControl mt={4}>
        <FormLabel>Items per page</FormLabel>
        <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </Select>
      </FormControl>

      {selectedGalleryId && (
        <Box mt={4}>
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            {currentPhotos.map((photo, index) => (
              <Box key={index} borderWidth="1px" borderRadius="md" overflow="hidden" p={2} position="relative">
                <img src={API_BASE_URL+photo.image} alt={`Photo ${index + 1}`} width="100%" />
                <HStack padding={2} justify="center" bottom={2} right={2}>
                  <IconButton colorScheme='green' icon={<FaClipboard />} aria-label="Copy Link" onClick={() => handleCopyLink(`${API_BASE_URL}/${photo.image}`)} />
                  <IconButton colorScheme='blue' icon={<FaDownload />} aria-label="Download" onClick={() => handleDownload(`${API_BASE_URL}/${photo.image}`)} />
                  <IconButton colorScheme="red" icon={<BsTrash />} aria-label="Delete" onClick={() => handleSelectPhoto(index)} />
                </HStack>
              </Box>
            ))}
          </Grid>
          <HStack mt={4} justifyContent="center">
            <IconButton
              icon={<ChevronLeftIcon />}
              aria-label="Previous Page"
              onClick={() => handlePageChange(currentPage - 1)}
              isDisabled={currentPage === 0}
            />
            <Text>{currentPage + 1} of {totalPages}</Text>
            <IconButton
              icon={<ChevronRightIcon />}
              aria-label="Next Page"
              onClick={() => handlePageChange(currentPage + 1)}
              isDisabled={currentPage === totalPages - 1}
            />
          </HStack>
        </Box>
      )}

      {/* Add Gallery Modal */}
      <Modal isOpen={isAddGalleryOpen} onClose={onAddGalleryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Gallery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Gallery Name</FormLabel>
              <Input value={newGalleryName} onChange={(e) => setNewGalleryName(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddGallery}>Add</Button>
            <Button variant="ghost" onClick={onAddGalleryClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Photo Modal */}
      <Modal isOpen={isAddPhotoOpen} onClose={onAddPhotoClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Select Photo</FormLabel>
              <Input type="file" onChange={(e) => setNewPhoto(e.target.files?.[0] || null)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddPhoto}>Upload</Button>
            <Button variant="ghost" onClick={onAddPhotoClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Gallery Modal */}
      <Modal isOpen={isEditGalleryOpen} onClose={onEditGalleryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Gallery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Gallery Name</FormLabel>
              <Input
                value={editingGalleryName}
                onChange={(e) => setEditingGalleryName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleEditGallery}>Save</Button>
            <Button variant="ghost" onClick={onEditGalleryClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Gallery Modal */}
      <Modal isOpen={isDeleteGalleryOpen} onClose={onDeleteGalleryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Gallery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to delete this gallery?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteGallery}>Delete</Button>
            <Button variant="ghost" onClick={onDeleteGalleryClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Gallery;
