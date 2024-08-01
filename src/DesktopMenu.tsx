import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Flex,
  Collapse,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { API_BASE_URL } from './API';

type Section = {
  section_id: number;
  section_type: string;
  section_name: string;
  section_value: string;
};

type Menu = {
  menu_id: number;
  menu_name: string;
  sections: Section[];
};

type MenuType = {
  menu_type: string;
  menus: Menu[];
};

type NavItem = {
  title: string;
  items: { label: string; link: string }[]; // Ensure link is a string here
};


const fetchNavItems = async () => {
  try {
    const response = await axios.get(API_BASE_URL+'/menus/sections/grouped');
    const data: MenuType[] = response.data;
    
    const navItems: NavItem[] = data
      .filter(menuType => menuType.menu_type === 'top')
      .flatMap(menuType =>
        menuType.menus.map(menu => ({
          title: menu.menu_name,
          items: menu.sections
            .map(section => ({
              label: section.section_name,
              link: section.section_type === 'page'
                ? `/pages/${section.section_value}`
                : section.section_type === 'link'
                  ? section.section_value
                  : ''
            }))
            .filter(item => item.link) // Ensure only valid links are included
        }))
      );

    return navItems;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const DesktopMenu: React.FC = () => {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const location = useLocation();

  useEffect(() => {
    const getNavItems = async () => {
      const items = await fetchNavItems();
      setNavItems(items);
    };

    getNavItems();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path ? { bg: 'teal.100', color: 'teal.600' } : {};
  };

  const isParentActive = (parentItems: { link: string }[]) => {
    return parentItems.some(item => location.pathname.startsWith(item.link));
  };

  return (
    <Flex
      display={{ base: 'none', md: 'flex' }}
      p="2"
      alignItems="center"
      justifyContent="space-around"
      wrap="wrap"
      borderTop="4px solid"
      borderColor="teal.300"
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
                        ? <ChevronDownIcon
                            transition="transform 0.2s"
                            transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                          />
                        : <ChevronDownIcon
                            transition="transform 0.2s"
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
