import { ComponentProps, FunctionComponent } from 'react';
import { Logo } from 'src/widgets/header/ui/logo';
import { Flex } from '@chakra-ui/react';
import { TgUserButton, SelectProject } from 'src/entities';

export const Header: FunctionComponent<ComponentProps<typeof Flex>> = props => {
    return (
        <Flex
            as="header"
            align="center"
            justify="space-between"
            h="68px"
            pr="6"
            pl="5"
            bgColor="background.content"
            {...props}
        >
            <Logo />
            <SelectProject ml="100px" mr="auto" />
            <TgUserButton />
        </Flex>
    );
};
