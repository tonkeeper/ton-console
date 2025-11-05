import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { UnavailableFeatureGate } from 'src/shared/ui';
import { isDebugUnavailableFeaturesEnabled } from 'src/shared/lib/debugUnavailableFeatures';

const MinterRouting = lazy(() => import('./minter'));
const AirdropsRouting = lazy(() => import('./airdrops'));

// Feature availability - change to false to disable airdrops
// isAvailable will be false if feature is unavailable OR debug mode is enabled
const AIRDROPS_AVAILABLE = true;

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
                <UnavailableFeatureGate
                    isAvailable={AIRDROPS_AVAILABLE && !isDebugUnavailableFeaturesEnabled()}
                    featureName="Airdrop Service"
                    message="The airdrop service is under maintenance. We are working on improving this feature."
                >
                    <Suspense>
                        <AirdropsRouting />
                    </Suspense>
                </UnavailableFeatureGate>
            }
        />
        <Route index element={<Navigate to="minter" replace />} />
        <Route path="*" element={<Navigate to="minter" replace />} />
    </Routes>
);

export default JettonRouting;
