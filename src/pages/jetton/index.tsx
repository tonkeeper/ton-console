import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const MinterPage = lazy(() => import('./minter'));
const JettonNewPage = lazy(() => import('./minter/new'));
const JettonViewPage = lazy(() => import('./minter/view'));

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
            path="minter/new"
            element={
                <Suspense>
                    <JettonNewPage />
                </Suspense>
            }
        />

        <Route
            path="minter/view"
            element={
                <Suspense>
                    <JettonViewPage />
                </Suspense>
            }
        />

        <Route index element={<Navigate to="minter" replace />} />
        <Route path="*" element={<Navigate to="minter" replace />} />
    </>
);

export default JettonRouting;
