import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';

const PricingPage = lazy(() => import('./pricing'));
const DocumentationPage = lazy(() => import('./documentation'));
const ApiKeysPage = lazy(() => import('./api-keys'));

const TonapiRouting = (
    <>
        <Route
            path="documentation"
            element={
                <Suspense fallback={<>...</>}>
                    <DocumentationPage />
                </Suspense>
            }
        />
        <Route
            path="pricing"
            element={
                <Suspense fallback={<>...</>}>
                    <PricingPage />
                </Suspense>
            }
        />
        <Route
            path="api-keys"
            element={
                <Suspense fallback={<>...</>}>
                    <ApiKeysPage />
                </Suspense>
            }
        />
        <Route index element={<Navigate to="pricing" replace />} />
        <Route path="*" element={<Navigate to="pricing" replace />} />
    </>
);

export default TonapiRouting;
