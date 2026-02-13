import { FC, useEffect } from 'react';
import {
    Box,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Show
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { SelectProject } from 'src/entities';
import Aside from 'src/widgets/aside';
import { Footer } from 'src/widgets/footer';
import { Logo } from 'src/widgets/header/ui/logo';

interface MobileNavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MobileNavDrawer: FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    // Close drawer on navigation
    useEffect(() => {
        if (isOpen) {
            onClose();
        }
        // Only react to location changes, not isOpen/onClose changes
    }, [location.pathname]);

    return (
        <Drawer isOpen={isOpen} onClose={onClose} placement="left">
            <DrawerOverlay />
            <DrawerContent maxW="280px" bgColor="background.content">
                <DrawerCloseButton top="4" right="3" />
                <DrawerBody flexDir="column" display="flex" px="4" pt="14" pb="4">
                    {/* Logo and SelectProject only on mobile (on tablet they're in header) */}
                    <Show below="tablet">
                        <Box mb="4">
                            <Logo showText />
                        </Box>
                    </Show>
                    <Show below="md">
                        <Box mb="3">
                            <SelectProject w="100%" />
                        </Box>
                    </Show>
                    <Show below="tablet">
                        <Divider mb="3" />
                    </Show>
                    <Aside />
                    <Footer mt="auto" pt="4" />
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    );
};
