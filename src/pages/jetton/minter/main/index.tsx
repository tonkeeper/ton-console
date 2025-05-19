import { Flex, BoxProps, Button, Badge } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';

import { H4, Overlay } from 'src/shared';
import { SearchInput } from 'src/pages/jetton/minter/main/ui/SearchInput';

const MainPage: FC<BoxProps> = () => {
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" gap={4} mb="5">
                <H4>Jetton Minter</H4>
                <Badge
                    textStyle="label3"
                    color="accent.orange"
                    fontFamily="body"
                    bgColor={'color-mix(in srgb, currentColor 12%, transparent)'}
                >
                    BETA
                </Badge>
            </Flex>
            <Flex align="center" justify="center" gap="4" h="100%" mb="6">
                <SearchInput />
                <Button as={Link} to={'/jetton/minter'}>
                    New Jetton
                </Button>
            </Flex>
        </Overlay>
    );
};

export default observer(MainPage);
