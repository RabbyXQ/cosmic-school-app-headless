import React, { useState, useEffect } from 'react';
import { Select, Button, Box, Grid, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, IconButton, FormControl, FormLabel, Checkbox, Stack } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, DeleteIcon } from '@chakra-ui/icons';

// Dummy data for galleries and photos
const initialGalleries = [
  { id: 1, name: 'Vacation', photos: ['photo1.jpg', 'photo2.jpg'] },
  { id: 2, name: 'Family', photos: ['photo3.jpg'] },
];

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState(initialGalleries);
  const [selectedGalleryId, setSelectedGalleryId] = useState<number | null>(null);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<number>>(new Set());
  const { isOpen: isAddGalleryOpen, onOpen: onAddGalleryOpen, onClose: onAddGalleryClose } = useDisclosure();
  const { isOpen: isAddPhotoOpen, onOpen: onAddPhotoOpen, onClose: onAddPhotoClose } = useDisclosure();

  useEffect(() => {
    if (selectedGalleryId !== null) {
      const gallery = galleries.find(g => g.id === selectedGalleryId);
      if (gallery) {
        setNewPhoto(null);
        setSelectedPhotos(new Set());
      }
    }
  }, [selectedGalleryId]);

  const handleAddGallery = () => {
    const newGallery = { id: Date.now(), name: newGalleryName, photos: [] };
    setGalleries([...galleries, newGallery]);
    setNewGalleryName('');
    onAddGalleryClose();
  };

  const handleAddPhoto = () => {
    if (selectedGalleryId !== null && newPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        const photoUrl = reader.result as string;
        const updatedGalleries = galleries.map(gallery =>
          gallery.id === selectedGalleryId
            ? { ...gallery, photos: [...gallery.photos, photoUrl] }
            : gallery
        );
        setGalleries(updatedGalleries);
        setNewPhoto(null);
        onAddPhotoClose();
      };
      reader.readAsDataURL(newPhoto);
    }
  };

  const handleGalleryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGalleryId(Number(event.target.value));
  };

  const handleItemsPerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(0);
  };

  const handleDeletePhotos = () => {
    if (selectedGalleryId !== null) {
      const updatedGalleries = galleries.map(gallery =>
        gallery.id === selectedGalleryId
          ? { ...gallery, photos: gallery.photos.filter((_, index) => !selectedPhotos.has(index)) }
          : gallery
      );
      setGalleries(updatedGalleries);
      setSelectedPhotos(new Set());
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

  const selectedGallery = selectedGalleryId !== null ? galleries.find(g => g.id === selectedGalleryId) : null;
  const totalPhotos = selectedGallery?.photos.length || 0;
  const totalPages = Math.ceil(totalPhotos / itemsPerPage);
  const currentPhotos = selectedGallery?.photos.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) || [];

  const handlePageChange = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Box p={5}>
      <Select placeholder="Select gallery" onChange={handleGalleryChange}>
        {galleries.map(gallery => (
          <option key={gallery.id} value={gallery.id}>{gallery.name}</option>
        ))}
      </Select>
      <Button onClick={onAddGalleryOpen} mt={4}>Add Gallery</Button>
      <Button onClick={onAddPhotoOpen} mt={4} ml={4}>Add Photo</Button>
      <Button onClick={handleDeletePhotos} mt={4} ml={4} colorScheme="red" isDisabled={selectedPhotos.size === 0}>Delete Selected Photos</Button>

      <FormControl mt={4}>
        <FormLabel>Items per page</FormLabel>
        <Select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          {[5, 10, 20].map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </Select>
      </FormControl>

      <Box mt={4}>
        {selectedGalleryId !== null && (
          <>
            <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={4}>
              {currentPhotos.map((photo, index) => (
                <Box key={index} position="relative" p={2} border="1px" borderRadius="md">
                  <Checkbox
                    position="absolute"
                    top={2}
                    left={2}
                    colorScheme="teal"
                    isChecked={selectedPhotos.has(index)}
                    onChange={() => handleSelectPhoto(index)}
                  />
                  <img src={photo} alt={`Photo ${index + 1}`} width="100%" />
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
          </>
        )}
      </Box>

      {/* Add Gallery Modal */}
      <Modal isOpen={isAddGalleryOpen} onClose={onAddGalleryClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Gallery</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="New gallery name"
              value={newGalleryName}
              onChange={(e) => setNewGalleryName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddGallery}>Add Gallery</Button>
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
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setNewPhoto(e.target.files[0]);
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddPhoto}>Add Photo</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Gallery;
