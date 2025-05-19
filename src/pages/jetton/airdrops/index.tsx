import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const MainPage = lazy(() => import('./main'));
const AirdropPage = lazy(() => import('./airdrop'));
const AirdropOldPage = lazy(() => import('./airdropOld'));
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
            path="old"
            element={
                <Suspense>
                    <AirdropOldPage />
                </Suspense>
            }
        />
        <Route
            path="airdrop"
            element={
                <Suspense>
                    <AirdropPage />
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
        <Route path="*" element={<Navigate to="./" replace />} />
    </Routes>
);

export default AirdropsRouting;
