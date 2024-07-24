import { Box, Flex } from '@chakra-ui/react';
import { Aside, Footer, Header } from 'src/widgets';
import { Overlay } from 'src/shared';
import { Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './ui/ErrorPage';

export const LayoutWithAside: FunctionComponent = () => {
    return (
        <Flex direction="column" minH="100%">
            <Header flexShrink={0} />
            <Flex flex={1} m="4">
                <Box flexShrink="0" w="240px" mr="4">
                    <Overlay p="0" height="fit-content" mb="4.5">
                        <Aside />
                    </Overlay>
                    <Footer />
                </Box>

                <Box flex={1}>
                    <ErrorBoundary fallback={<ErrorPage />}>
                        <Outlet />
                    </ErrorBoundary>
                </Box>
            </Flex>
        </Flex>
    );
};
