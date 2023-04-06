import { Box, Flex } from '@chakra-ui/react';
import { Header } from 'src/widgets';
import { Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';

export const LayoutSolid: FunctionComponent = () => {
    return (
        <Flex direction="column" h="100%" minH="100%">
            <Header flexShrink={0} />
            <Box flex={1}>
                <Outlet />
            </Box>
        </Flex>
    );
};
