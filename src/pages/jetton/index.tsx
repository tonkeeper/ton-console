import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const MinterPage = lazy(() => import('./minter/main'));
const AirdropsPage = lazy(() => import('./airdrops/main'));

const JettonRouting = (
    <>
        <Route
            path="minter"
            element={
                <Suspense>
                    <MinterPage />
                </Suspense>
            }
        />
        <Route
            path="airdrops"
            element={
                <Suspense>
                    <AirdropsPage />
                </Suspense>
            }
        />
        <Route index element={<Navigate to="minter" replace />} />
        <Route path="*" element={<Navigate to="minter" replace />} />
    </>
);

export default JettonRouting;
