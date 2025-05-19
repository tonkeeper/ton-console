import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const MainPage = lazy(() => import('./main'));
const AirdropPage = lazy(() => import('./airdrop'));
const AirdropOldPage = lazy(() => import('./airdropOld'));

const JettonRouting = (
    <>
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
        <Route path="*" element={<Navigate to="./" replace />} />
    </>
);

export default JettonRouting;
