import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { UnavailableFeatureGate } from 'src/shared/ui';
import { EXTERNAL_LINKS } from 'src/shared';
import { isDebugUnavailableFeaturesEnabled } from 'src/shared/lib/debugUnavailableFeatures';

const PricingPage = lazy(() => import('./pricing'));
const ApiKeysPage = lazy(() => import('./api-keys'));
const WebhooksRouting = lazy(() => import('./webhooks'));
const LiteserversPage = lazy(() => import('./liteservers'));

// Feature availability - change to false to disable webhooks
// isAvailable will be false if feature is unavailable OR debug mode is enabled
const WEBHOOKS_AVAILABLE = true;

const TonapiRouting = (
    <>
        <Route
            path="api-keys"
            element={
                <Suspense>
                    <ApiKeysPage />
                </Suspense>
            }
        />
        <Route
            path="webhooks/*"
            element={
                <UnavailableFeatureGate
                    isAvailable={WEBHOOKS_AVAILABLE && !isDebugUnavailableFeaturesEnabled()}
                    featureName="Webhooks Playground"
                    message="The webhooks service is under maintenance. You can manage webhooks through the API."
                    docLink={EXTERNAL_LINKS.DOCUMENTATION_WEBHOOKS}
                >
                    <Suspense>
                        <WebhooksRouting />
                    </Suspense>
                </UnavailableFeatureGate>
            }
        />
        <Route
            path="liteservers"
            element={
                <Suspense>
                    <LiteserversPage />
                </Suspense>
            }
        />
        <Route
            path="pricing"
            element={
                <Suspense>
                    <PricingPage />
                </Suspense>
            }
        />

        <Route index element={<Navigate to="pricing" replace />} />
        <Route path="*" element={<Navigate to="pricing" replace />} />
    </>
);

export default TonapiRouting;
