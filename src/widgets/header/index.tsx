import { FC } from 'react';
import { Logo } from 'src/widgets/header/ui/logo';
import { Flex, FlexProps } from '@chakra-ui/react';
import { TgUserButton, SelectProject } from 'src/entities';
import { DocumentationButton } from './ui/DocumentationButton';

export const Header: FC<FlexProps> = props => {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            gap="4"
            h="68px"
            pr="6"
            pl="5"
            bgColor="background.content"
            {...props}
        >
            <Logo w={{ md: '240px' }} />
            <SelectProject mr="auto" />
            <DocumentationButton />
            <TgUserButton />
        </Flex>
    );
};
