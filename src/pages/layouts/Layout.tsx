import { Box, Flex } from '@chakra-ui/react';
import { Aside, Footer, Header } from 'src/widgets';
import { Overlay } from 'src/shared';
import { Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';

export const Layout: FunctionComponent<{ aside: boolean }> = ({ aside }) => {
    return (
        <Flex direction="column" minH="100%">
            <Header />
            <Flex flex={1} m="4">
                {aside && (
                    <Box w="240px" mr="4">
                        <Overlay height="fit-content" mb="4.5">
                            <Aside />
                        </Overlay>
                        <Footer />
                    </Box>
                )}
                <Overlay flex={1}>
                    <Outlet />
                </Overlay>
            </Flex>
        </Flex>
    );
};
