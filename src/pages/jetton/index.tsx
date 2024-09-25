import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { Flex, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { H4, Overlay } from 'src/shared';
import { SearchInput } from './ui/SearchInput';

const JettonNewPage = lazy(() => import('./minter'));
const JettonViewPage = lazy(() => import('./view'));

const JettonRouting = (
    <>
        <Route
            path="minter"
            element={
                <Suspense>
                    <JettonNewPage />
                </Suspense>
            }
        />

        <Route
            path="view"
            element={
                <Suspense>
                    <JettonViewPage />
                </Suspense>
            }
        />

        <Route
            index
            element={
                <Overlay display="flex" flexDirection="column">
                    <Flex align="flex-start" gap={4} mb="5">
                        <H4>Jetton Minter</H4>
                    </Flex>
                    <Flex align="center" justify="center" gap="4" h="100%" mb="6">
                        <SearchInput />
                        <Button as={Link} to={'/jetton/minter'}>
                            New Jetton
                        </Button>
                    </Flex>
                </Overlay>
            }
        />
        <Route path="*" element={<Navigate to="minter" replace />} />
    </>
);

export default JettonRouting;
