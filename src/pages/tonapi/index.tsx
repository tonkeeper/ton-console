import { lazy, Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const BillingPage = lazy(() => import('./billing'));
const OAuthPage = lazy(() => import('./oauth'));
const ApiKeysPage = lazy(() => import('./api-keys'));

const TonapiRouting = (
    <>
        <Route
            path="oauth"
            element={
                <Suspense fallback={<>...</>}>
                    <OAuthPage />
                </Suspense>
            }
        />
        <Route
            path="billing"
            element={
                <Suspense fallback={<>...</>}>
                    <BillingPage />
                </Suspense>
            }
        />
        <Route
            path="api-keys/:keyId"
            element={
                <Suspense fallback={<>...</>}>
                    <ApiKeysPage />
                </Suspense>
            }
        />
        <Route index element={<Navigate to="oauth" replace />} />
        <Route path="*" element={<Navigate to="oauth" replace />} />
    </>
);

export default TonapiRouting;
