import { ComponentProps, FunctionComponent } from 'react';
import { Logo } from 'src/widgets/header/ui/logo';
import { Flex } from '@chakra-ui/react';
import { SelectApp } from 'src/widgets/header/ui/select-app';
import { TonConnectButton } from '@tonconnect/ui-react';
import { TgUserButton } from 'src/entities';

export const Header: FunctionComponent<ComponentProps<typeof Flex>> = props => {
    return (
        <Flex
            as="header"
            align="center"
            h="68px"
            pr="4"
            pl="5"
            bgColor="background.content"
            {...props}
        >
            <Logo w="252px" />
            <SelectApp mr="auto" />
            <TgUserButton />
            <TonConnectButton />
        </Flex>
    );
};
