import { Flex, BoxProps, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { H4, Overlay } from 'src/shared';
import { SearchInput } from './ui/SearchInput';

const MinterPage: FC<BoxProps> = () => {
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="flex-start" gap={4} mb="5">
                <H4>Jetton Minter</H4>
            </Flex>
            <Flex align="center" justify="center" gap="4" h="100%" mb="6">
                <SearchInput />
                <Button as={Link} to={'/jetton/minter/new'}>
                    New Jetton
                </Button>
            </Flex>
        </Overlay>
    );
};

export default observer(MinterPage);
