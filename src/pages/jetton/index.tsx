import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const MinterPage = lazy(() => import('./minter'));

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

        <Route index element={<Navigate to="minter" replace />} />
        <Route path="*" element={<Navigate to="minter" replace />} />
    </>
);

export default JettonRouting;
