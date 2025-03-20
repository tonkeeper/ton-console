import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const MainPage = lazy(() => import('./main'));
const AirdropPage = lazy(() => import('./airdrop'));
const AirdropOldPage = lazy(() => import('./old'));
const CreatePage = lazy(() => import('./create'));

const AirdropsRouting = () => (
    <Routes>
        <Route
            index
            element={
                <Suspense>
                    <MainPage />
                </Suspense>
            }
        />
        <Route
            path="create"
            element={
                <Suspense>
                    <CreatePage />
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
                    <AirdropPage />
                </Suspense>
            }
        />
        <Route path="*" element={<Navigate to="./" replace />} />
    </Routes>
);

export default AirdropsRouting;
