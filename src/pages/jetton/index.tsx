import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const JettonNewPage = lazy(() => import('./new-jetton'));
const JettonMinerPage = lazy(() => import('./minter'));
const JettonViewPage = lazy(() => import('./view'));
const AirdropPage = lazy(() => import('./airdrop'));
const AirdropOldPage = lazy(() => import('./airdropOld'));
const AirdropsPage = lazy(() => import('./airdrops'));
const NewAirdropPage = lazy(() => import('./new-airdrop'));

const JettonRouting = (
    <>
        <Route
            path="new-jetton"
            element={
                <Suspense>
                    <JettonNewPage />
                </Suspense>
            }
        />
        <Route
            path="minter"
            element={
                <Suspense>
                    <JettonMinerPage />
                </Suspense>
            }
        />
        <Route
            path="view"
            element={
                <Suspense>
                    <JettonViewPage />
                </Suspense>
            }
        />
        <Route
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
        />
        <Route
            path="airdrops"
            element={
                <Suspense>
                    <AirdropsPage />
                </Suspense>
            }
        />
        <Route
            path="new-airdrop"
            element={
                <Suspense>
                    <NewAirdropPage />
                </Suspense>
            }
        />
        <Route index element={<Navigate to="new-jetton" replace />} />
        <Route path="*" element={<Navigate to="new-jetton" replace />} />
    </>
);

export default JettonRouting;
