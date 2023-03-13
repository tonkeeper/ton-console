import { FunctionComponent } from 'react';
import { Logo } from 'src/widgets/header/ui/logo';
import { Flex } from '@chakra-ui/react';
import { SelectApp } from 'src/widgets/header/ui/select-app';

export const Header: FunctionComponent = () => {
    return (
        <Flex as="header" align="center" h="68px" pr="4" pl="5">
            <Logo w="252px" />
            <SelectApp />
        </Flex>
    );
};
