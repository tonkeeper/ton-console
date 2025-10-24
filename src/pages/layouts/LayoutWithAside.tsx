import { Box, Grid, GridItem } from '@chakra-ui/react';
import { Aside, Footer, Header } from 'src/widgets';
import { Overlay } from 'src/shared';
import { Outlet } from 'react-router-dom';
import { FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './ui/ErrorPage';

export const LayoutWithAside: FC = () => {
    return (
        <Grid
            gap="4"
            templateRows={'auto 1fr'}
            templateColumns="256px 1fr"
            templateAreas={`"header header"
                "sidebar content"`}
            w="100%"
            minH="100vh"
        >
            <GridItem area="header">
                <Header />
            </GridItem>
            <GridItem area="sidebar">
                <Box pl="4">
                    <Overlay p="0" height="fit-content" mb="4.5">
                        <Aside />
                    </Overlay>
                    <Footer />
                </Box>
            </GridItem>

            <GridItem area="content" overflow="auto" pr="4">
                <ErrorBoundary fallback={<ErrorPage />}>
                    <Outlet />
                </ErrorBoundary>
            </GridItem>
        </Grid>
    );
};
