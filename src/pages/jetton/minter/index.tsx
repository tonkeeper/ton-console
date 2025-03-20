import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const JettonMainPage = lazy(() => import('./main'));
const JettonCreatePage = lazy(() => import('./create'));
const JettonViewPage = lazy(() => import('./view'));

const MinterRouting = () => (
    <Routes>
        <Route
            index
            element={
                <Suspense>
                    <JettonMainPage />
                </Suspense>
            }
        />
        <Route
            path="create"
            element={
                <Suspense>
                    <JettonCreatePage />
                </Suspense>
            }
        />
        <Route
            path="view/:address"
            element={
                <Suspense>
                    <JettonViewPage />
                </Suspense>
            }
        />
        <Route path="*" element={<Navigate to="./" replace />} />
    </Routes>
);

export default MinterRouting;
