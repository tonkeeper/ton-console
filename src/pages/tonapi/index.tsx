import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const PricingPage = lazy(() => import('./pricing'));
const ApiKeysPage = lazy(() => import('./api-keys'));
const WebhooksPage = lazy(() => import('./webhooks'));
const LiteproxyPage = lazy(() => import('./liteproxy'));
const WebhookViewPage = lazy(() => import('./webhooks/view'));

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
            path="webhooks"
            element={
                <Suspense>
                    <WebhooksPage />
                </Suspense>
            }
        />
        <Route
            path="webhooks/view"
            element={
                <Suspense>
                    <WebhookViewPage />
                </Suspense>
            }
        />
        <Route
            path="liteproxy"
            element={
                <Suspense>
                    <LiteproxyPage />
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
