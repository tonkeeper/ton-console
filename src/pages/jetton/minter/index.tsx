import { Flex, BoxProps } from '@chakra-ui/react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { ButtonLink, H4, Overlay } from 'src/shared';
import { SearchInput } from './ui/SearchInput';

const MinterPage: FC<BoxProps> = () => {
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" gap={4} mb="5">
                <H4>Jetton Minter</H4>
                <SearchInput />
                <ButtonLink href="/jetton/minter/new">New Jetton</ButtonLink>
                <TonConnectButton />
            </Flex>
        </Overlay>
    );
};

export default observer(MinterPage);
