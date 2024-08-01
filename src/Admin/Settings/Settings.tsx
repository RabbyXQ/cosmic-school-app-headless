import React from "react"
import SchoolInfo from "./Schoolnfo";
import { Button, Heading, HStack, VStack} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {useColorModeValue } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

export const SettingMenu: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const buttonColor = useColorModeValue('green', 'green');
    const inactiveButtonColor = useColorModeValue('blue', 'blue');
    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <VStack py={2} spacing={4} align="stretch">
            <Heading size="sm">Select Option</Heading>
            <HStack spacing={4} wrap="wrap" justify="center">
                <Button
                    size="md"
                    colorScheme={location.pathname === "/admin/settings/pages" ? buttonColor : inactiveButtonColor}
                    onClick={() => handleNavigation("/admin/settings/pages")}
                >
                    Pages
                </Button>
                <Button
                    size="md"
                    colorScheme={location.pathname === "/admin/settings/menus" ? buttonColor : inactiveButtonColor}
                    onClick={() => handleNavigation("/admin/settings/menus")}
                >
                    Top Menu
                </Button>
                <Button
                    size="md"
                    colorScheme={location.pathname === "/admin/settings/patron-message" ? buttonColor : inactiveButtonColor}
                    onClick={() => handleNavigation("/admin/settings/patron-message")}
                >
                    Patron Messages
                </Button>
                <Button
                    size="md"
                    colorScheme={location.pathname === "/admin/settings/brief-edit" ? buttonColor : inactiveButtonColor}
                    onClick={() => handleNavigation("/admin/settings/brief-edit")}
                >
                    Brief
                </Button>
                <Button
                    size="md"
                    colorScheme={location.pathname === "/admin/settings" ? buttonColor : inactiveButtonColor}
                    onClick={() => handleNavigation("/admin/settings")}
                >
                    School Info
                </Button>
            </HStack>
        </VStack>
    );
};



const Settings: React.FC = () =>{
    
    return (
        <VStack>
            <SchoolInfo/>
        </VStack>
    );
}

export default Settings;