import { lazy } from '@loadable/component';
import { Suspense } from 'react';
import { Route } from 'react-router-dom';

const GraphPage = lazy(() => import('./graph'));
const HistoryPage = lazy(() => import('./history'));
const QueryPage = lazy(() => import('./query'));
// const DashboardPage = lazy(() => import('./dashboard'));

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
                    <QueryPage />
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

        {/* <Route index element={<Navigate to="history" replace />} /> */}
        {/* <Route path="*" element={<Navigate to="history" replace />} /> */}
    </>
);

export default AnalyticsRouting;
