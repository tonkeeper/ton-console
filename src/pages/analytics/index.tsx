import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Navigate, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { projectsStore } from 'src/entities';

const GraphPage = lazy(() => import('./graph'));
const HistoryPage = lazy(() => import('./history'));
const QueryPage = lazy(() => import('./query'));
// const DashboardPage = lazy(() => import('./dashboard'));

const QueryGuard = observer(() => {
    if (!projectsStore.selectedProject?.capabilities.stats.query) {
        return <Navigate to=".." replace />;
    }

    return <QueryPage />;
});

/*const DashboardGuard = observer(() => {
    if (!projectsStore.selectedProject?.capabilities.stats.query) {
        return <Navigate to=".." replace />;
    }

    return <DashboardPage />;
});*/

const AnalyticsRouting = (
    <>
        <Route
            path="graph"
            element={
                <Suspense>
                    <GraphPage />
                </Suspense>
            }
        />
        <Route
            path="history"
            element={
                <Suspense>
                    <HistoryPage />
                </Suspense>
            }
        />
        <Route
            path="query"
            element={
                <Suspense>
                    <QueryGuard />
                </Suspense>
            }
        />
        {/* <Route
            path="dashboard"
            element={
                <Suspense>
                    <DashboardGuard />
                </Suspense>
            }
        />*/}

        <Route index element={<Navigate to="history" replace />} />
        <Route path="*" element={<Navigate to="history" replace />} />
    </>
);

export default AnalyticsRouting;
