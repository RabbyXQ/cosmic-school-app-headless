// SliderComponent.tsx
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Box, Image } from '@chakra-ui/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Slider.css'; // Import the custom CSS
import { createBucketClient } from '@cosmicjs/sdk';

const cosmic = createBucketClient({
  bucketSlug: 'bbhss-production',
  readKey: '03yvDMKwn7se777PUBvEOgYyGZk3nG7MfU26f8cXVhWCFDEScx'
});

interface SliderItem {
  imgSrc: string;
}

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};



const SliderComponent: React.FC = () => {
  const [sliderData, setSliderData] = useState<SliderItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await cosmic.objects.findOne({
          type: 'slider',
          slug: 'slider1'
        }).props('slug,title,metadata').depth(1);

        const { metadata } = response.object;
        const items: SliderItem[] = Object.entries(metadata)
          .filter(([key, value]: [string, any]) => key.startsWith('image-') && value && value.url)
          .map(([key, value]: [string, any]) => ({
            imgSrc: value.url,
          }));

        setSliderData(items);
      } catch (error) {
        console.error('Error fetching slider data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box className="slider-container">
      <Slider {...settings}>
        {sliderData.map((item, index) => (
          <Box key={index} className="slider-item">
            <Image className="slider-image" alt={`Slide ${index + 1}`} src={item.imgSrc} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default SliderComponent;
