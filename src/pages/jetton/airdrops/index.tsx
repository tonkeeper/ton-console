import { lazy } from '@loadable/component';
import { Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AirdropsStore } from 'src/features/airdrop/model/airdrops.store';
import { Center, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useProject } from 'src/shared/contexts/ProjectIdContext';

const MainPage = lazy(() => import('./main'));
const AirdropPage = lazy(() => import('./airdrop'));
const AirdropOldPage = lazy(() => import('./old'));
const CreatePage = lazy(() => import('./create'));

const AirdropsRouting = observer(() => {
    const [store, setStore] = useState<AirdropsStore | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const project = useProject();
    
    useEffect(() => {
        const airdropsStore = new AirdropsStore(project);
        setStore(airdropsStore);
    }, []);

    useEffect(() => {
        if (store && store.airdrops$.isResolved && store.config$.isResolved) {
            setIsLoading(false);
        }
    }, [store?.airdrops$.isResolved, store?.config$.isResolved]);

    if (isLoading || !store) {
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
                path="old/:id"
                element={
                    <Suspense>
                        <AirdropOldPage />
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
