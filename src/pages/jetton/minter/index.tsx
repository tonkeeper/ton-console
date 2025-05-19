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
        <Route path="*" element={<Navigate to="./" replace />} />
        {/* <Route
            path="view"
            element={
                <Suspense>
                    <JettonViewPage />
                </Suspense>
            }
        /> */}
        {/* <Route
            path="airdropOld"
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
        /> */}
        {/* <Route
            path="airdrops"
            element={
                <Suspense>
                    <AirdropsPage />
                </Suspense>
            }
        /> */}
        {/* <Route
            path="new-airdrop"
            element={
                <Suspense>
                    <NewAirdropPage />
                </Suspense>
            }
        /> */}
        {/* <Route index element={<Navigate to="new-jetton" replace />} />
        <Route path="*" element={<Navigate to="new-jetton" replace />} /> */}
    </Routes>
);

export default MinterRouting;
