import { Box, Grid, GridItem, Show, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { Aside, Footer, Header, MobileNavDrawer } from 'src/widgets';
import { Overlay } from 'src/shared';
import { Outlet } from 'react-router-dom';
import { FC, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorPage from './ui/ErrorPage';

export const LayoutWithAside: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDesktop] = useMediaQuery('(min-width: 1024px)', { ssr: false });

    // Auto-close drawer when viewport becomes desktop
    useEffect(() => {
        if (isDesktop && isOpen) {
            onClose();
        }
    }, [isDesktop, isOpen, onClose]);

    return (
        <>
            <Grid
                gap="4"
                templateRows="auto 1fr"
                templateColumns={{
                    base: '1fr',
                    lg: '256px 1fr'
                }}
                templateAreas={{
                    base: `"header" "content"`,
                    lg: `"header header" "sidebar content"`
                }}
                w="100%"
                minH="100vh"
            >
                <GridItem area="header">
                    <Header onMenuOpen={onOpen} />
                </GridItem>

                {/* Desktop: Full sidebar (lg+, 1024px+) */}
                <Show above="lg">
                    <GridItem area="sidebar">
                        <Box pl="4">
                            <Overlay p="0" height="fit-content" mb="4.5">
                                <Aside />
                            </Overlay>
                            <Footer />
                        </Box>
                    </GridItem>
                </Show>

                <GridItem
                    area="content"
                    overflow="auto"
                    mb={{ base: 0, md: 6 }}
                    pr={{ base: 0, md: 4 }}
                    pl={{ base: 0, md: 4, lg: 0 }}
                >
                    <ErrorBoundary fallback={<ErrorPage />}>
                        <Outlet />
                    </ErrorBoundary>
                </GridItem>
            </Grid>

            {/* Mobile: Drawer navigation (<lg, <1024px) */}
            <MobileNavDrawer isOpen={isOpen} onClose={onClose} />
        </>
    );
};
