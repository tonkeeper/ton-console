import { FC } from 'react';
import { Logo } from 'src/widgets/header/ui/logo';
import { Box, Flex, FlexProps, IconButton, Show } from '@chakra-ui/react';
import { TgUserButton, SelectProject } from 'src/entities';
import { DocumentationButton } from './ui/DocumentationButton';
import { MenuIcon24 } from 'src/shared';

interface HeaderProps extends FlexProps {
    onMenuOpen?: () => void;
}

export const Header: FC<HeaderProps> = ({ onMenuOpen, ...props }) => {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            gap={{ base: 2, md: 4 }}
            h="68px"
            pr={{ base: 3, md: 6 }}
            pl={{ base: 3, md: 5 }}
            bgColor="background.content"
            {...props}
        >
            {/* Hamburger menu when sidebar is hidden (<1024px) */}
            <Show below="lg">
                <IconButton
                    minW="48px"
                    minH="48px"
                    aria-label="Open menu"
                    icon={<MenuIcon24 />}
                    onClick={onMenuOpen}
                    size="lg"
                    variant="ghost"
                />
            </Show>

            <Logo w={{ base: 'auto', lg: '240px' }} mr={{ base: 'auto', lg: '0' }} />

            {/* SelectProject in header on tablet+ (640px+) */}
            <Show above="md">
                <SelectProject mr={{ base: '0', lg: 'auto' }} w={{ base: 'auto', lg: '240px' }} />
            </Show>

            {/* Mobile: Spacer (SelectProject moved to drawer) */}
            <Show below="md">
                <Box flex="1" />
            </Show>

            {/* Documentation button on tablet+ */}
            <Show above="md">
                <DocumentationButton />
            </Show>

            <TgUserButton />
        </Flex>
    );
};
