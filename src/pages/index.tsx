import { FunctionComponent, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LayoutWithAside } from 'src/pages/layouts';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import SubscriptionsPage from 'src/pages/subscriptions';

const DashboardPage = lazy(() => import('./dashboard'));
const SettingsPage = lazy(() => import('./settings'));
const SupportPage = lazy(() => import('./support'));

export const Routing: FunctionComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutWithAside />}>
                <Route
                    path="dashboard"
                    element={
                        <Suspense fallback={<>...</>}>
                            <DashboardPage />
                        </Suspense>
                    }
                />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="tonapi">{TonapiRouting}</Route>
                <Route
                    path="settings"
                    element={
                        <Suspense fallback={<>...</>}>
                            <SettingsPage />
                        </Suspense>
                    }
                />
                <Route
                    path="support"
                    element={
                        <Suspense fallback={<>...</>}>
                            <SupportPage />
                        </Suspense>
                    }
                />
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
        </Routes>
    );
};
