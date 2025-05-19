import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const JettonMainPage = lazy(() => import('./main'));
const JettonMinerPage = lazy(() => import('./mint'));
const JettonViewPage = lazy(() => import('./view'));

const JettonRouting = (
    <>
        <Route
            index
            element={
                <Suspense>
                    <JettonMainPage />
                </Suspense>
            }
        />
        <Route path="*" element={<Navigate to="./" replace />} />
        {/* <Route
            path="minter"
            element={
                <Suspense>
                    <JettonMinerPage />
                </Suspense>
            }
        /> */}
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
    </>
);

export default JettonRouting;
