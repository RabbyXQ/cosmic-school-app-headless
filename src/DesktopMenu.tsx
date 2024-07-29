import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  useColorModeValue,
  Box,
  Icon,
  useDisclosure,
  Collapse
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

// JSON data for navigation
const navItems = [
  {
    title: "প্রতিষ্ঠান সম্পর্কিত",
    items: [
      { label: "প্রতিষ্ঠান সম্পর্কে", link: "/about-institution/about-school/" },
      { label: "ভবন ও কক্ষ", link: "/about-institution/about-building/" },
      { label: "ভূমির তথ্য", link: "/about-institution/about-land/" },
      { label: "ক্যাম্পাস ম্যাপ", link: "/about-institution/campus-map/" }
    ]
  },
  {
    title: "প্রশাসনিক তথ্য",
    items: [
      { label: "প্রধান শিক্ষকের তালিকা", link: "/adminstration-info/list-of-headmasters/" },
      { label: "শিক্ষক-শিক্ষিকাদের তালিকা", link: "/teachers/" },
      { label: "কর্মচারীদের তালিকা", link: "/adminstration-info/workers/" },
      { label: "কমিটি মেম্বার", link: "/adminstration-info/committee/" },
      { label: "প্রতিষ্ঠাতা ও দানকারীর তথ্য", link: "/adminstration-info/land-doner/" }
    ]
  },
  {
    title: "একাডেমিক তথ্য",
    items: [
      { label: "শিক্ষার্থীদের তালিকা", link: "/students/" },
      { label: "নোটিশ বোর্ড", link: "/notices/" },
      { label: "সিলেবাস", link: "/academic-info/syllabus/" },
      { label: "ক্লাশ রুটিন", link: "/academic-info/class-routine/" },
      { label: "পরিক্ষার রুটিন", link: "/academic-info/exam-routine/" },
      { label: "পরীক্ষার আসন পরিকল্পনা", link: "/academic-info/exam-seat-management/" },
      { label: "পরীক্ষার ফলাফল", link: "/academic-info/exam-result/" },
      { label: "বোর্ড পরীক্ষার ফলাফল", link: "/academic-info/board-exam-result/" },
      { label: "ছুটির তালিকা", link: "/academic-info/vacation-list/" }
    ]
  },
  {
    title: "ডাউনলোড",
    items: [
      { label: "বই", link: "/downloads/book" },
      { label: "এসাইনমেন্ট", link: "/downloads/assignments" },
      { label: "নোট", link: "/downloads/note" },
      { label: "অন্যান্য", link: "/downloads/others" }
    ]
  }
];

const DesktopMenu: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? { bg: 'teal.100', color: 'teal.600' } : {};
  };

  const isParentActive = (parentItems: { link: string }[]) => {
    return parentItems.some(item => location.pathname.startsWith(item.link));
  };

  return (
    <Flex
      display={{ base: 'none', md: 'flex' }}
      p="4"
      alignItems="center"
      justifyContent="space-around"
      wrap="wrap"
      borderTop="4px solid teal"
    >
      <HStack spacing="4" as="nav">
        {navItems.map((navItem, index) => {
          const parentActive = isParentActive(navItem.items);
          return (
            <Menu key={index} isLazy>
              {({ isOpen }) => (
                <>
                  <MenuButton
                    as={Button}
                    variant="ghost"
                    rightIcon={
                      isOpen
                        ? <ChevronUpIcon
                            transition="transform 0.05s"
                            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                          />
                        : <ChevronDownIcon
                            transition="transform 0.05s"
                            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                          />
                    }
                    {...(parentActive ? { bg: 'teal.100', color: 'teal.600', fontWeight: 'bold' } : {})}
                  >
                    {navItem.title}
                  </MenuButton>
                  <Collapse in={isOpen}>
                    <MenuList>
                      {navItem.items.map((item, itemIndex) => (
                        <MenuItem
                          key={itemIndex}
                          as={Link}
                          to={item.link}
                          {...isActive(item.link)}
                        >
                          {item.label}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Collapse>
                </>
              )}
            </Menu>
          );
        })}
      </HStack>
    </Flex>
  );
};

export default DesktopMenu;
