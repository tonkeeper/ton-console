import { lazy } from '@loadable/component';
import { Suspense, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AirdropsStore } from 'src/features/airdrop/model/airdrops.store';
import { Center, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useProject } from 'src/shared/contexts/ProjectContext';

const MainPage = lazy(() => import('./main'));
const AirdropPage = lazy(() => import('./airdrop'));
const CreatePage = lazy(() => import('./create'));

const AirdropsRouting = observer(() => {
    const project = useProject();
    const store = useMemo(() => new AirdropsStore(project), [project.id]);

    if (!store.airdrops$.isResolved || !store.config$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    return (
        <Routes>
            <Route
                index
                element={
                    <Suspense>
                        <MainPage airdropsStore={store} />
                    </Suspense>
                }
            />
            <Route
                path="create"
                element={
                    <Suspense>
                        <CreatePage airdropsStore={store} />
                    </Suspense>
                }
            />
            <Route
                path=":id"
                element={
                    <Suspense>
                        <AirdropPage airdropsStore={store} />
                    </Suspense>
                }
            />
            <Route path="*" element={<Navigate to="./" replace />} />
        </Routes>
    );
});

export default AirdropsRouting;
