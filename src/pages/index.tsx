import { FunctionComponent, lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { LayoutWithAside } from 'src/pages/layouts';

const SubscriptionsPage = lazy(() => import('./subscriptions'));
const DashboardPage = lazy(() => import('./dashboard'));

export const Routing: FunctionComponent = () => {
    return (
        <Routes>
            <Route path="/" element={<LayoutWithAside />}>
                <Route
                    index
                    element={
                        <Suspense fallback={<>...</>}>
                            <DashboardPage />
                        </Suspense>
                    }
                />
                <Route
                    path="subscriptions"
                    element={
                        <Suspense fallback={<>...</>}>
                            <SubscriptionsPage />
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    );
};
