import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const PricingPage = lazy(() => import('./pricing'));
const ApiKeysPage = lazy(() => import('./api-keys'));
const WebhooksRouting = lazy(() => import('./webhooks'));
const LiteserversPage = lazy(() => import('./liteservers'));

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
                <Suspense>
                    <WebhooksRouting />
                </Suspense>
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
