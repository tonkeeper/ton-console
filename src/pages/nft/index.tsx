import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const CNFTPage = lazy(() => import('./cnft'));

const NftRouting = (
    <>
        <Route
            path="cnft"
            element={
                <Suspense>
                    <CNFTPage />
                </Suspense>
            }
        />

        <Route index element={<Navigate to="cnft" replace />} />
        <Route path="*" element={<Navigate to="cnft" replace />} />
    </>
);

export default NftRouting;
