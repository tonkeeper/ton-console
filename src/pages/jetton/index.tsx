import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

const MinterRouting = lazy(() => import('./minter'));
const AirdropsRouting = lazy(() => import('./airdrops'));

const JettonRouting = () => (
    <Routes>
        <Route
            path="minter/*"
            element={
                <Suspense>
                    <MinterRouting />
                </Suspense>
            }
        />
        <Route
            path="airdrops/*"
            element={
                <Suspense>
                    <AirdropsRouting />
                </Suspense>
            }
        />
        <Route index element={<Navigate to="minter" replace />} />
        <Route path="*" element={<Navigate to="minter" replace />} />
    </Routes>
);

export default JettonRouting;
