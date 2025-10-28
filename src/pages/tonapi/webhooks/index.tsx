import { FC, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { WebhooksProvider } from 'src/features/tonapi/webhooks';
import { lazy } from '@loadable/component';

const WebhooksPage = lazy(() => import('./WebhooksPage'));
const WebhooksViewPage = lazy(() => import('./view'));

const WebhooksRouting: FC = () => {
    return (
        <WebhooksProvider>
            <Routes>
                <Route
                    index
                    element={
                        <Suspense>
                            <WebhooksPage />
                        </Suspense>
                    }
                />
                <Route
                    path="view"
                    element={
                        <Suspense>
                            <WebhooksViewPage />
                        </Suspense>
                    }
                />
                <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
        </WebhooksProvider>
    );
};

export default WebhooksRouting;
