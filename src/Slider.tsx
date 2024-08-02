import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box, Image, Text } from '@chakra-ui/react';

const SliderComponent: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [galleryId, setGalleryId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  useEffect(() => {
    // Fetch initial data to get the gallery ID
    const fetchInitialData = async () => {
      try {
        const response = await fetch('http://localhost:4000/school-info');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setGalleryId(data.slider_gallery);

        // Fetch gallery images based on galleryId
        fetchGalleryImages(data.slider_gallery);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };

    // Fetch gallery images based on the galleryId
    const fetchGalleryImages = async (galleryId: number) => {
      try {
        const response = await fetch(`http://localhost:4000/gallery/items/category/${galleryId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setImages(data.map((item: { image: string }) => `http://localhost:4000${item.image}`));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch gallery images:', error);
        setError('Failed to load images.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Box color="teal" w="95%" h="20%" maxW="container" mx="auto" mt={5}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index}>
            <Image src={image} alt={`Slide ${index + 1}`} w="100%" h={{ base: "auto", md: "450px" }} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SliderComponent;
