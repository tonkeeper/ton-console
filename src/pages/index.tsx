import { FunctionComponent, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import { Layout } from './layouts';
import { projectsStore, tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import SettingsRouting from 'src/pages/settings';
import { LayoutSolid } from 'src/pages/layouts/LayoutSolid';
import { LayoutWithAside } from 'src/pages/layouts/LayoutWithAside';
import AnalyticsRouting from 'src/pages/analytics';

const LandingPage = lazy(() => import('./landing'));
const CreateFirstProjectPage = lazy(() => import('./create-first-project'));
const BalancePage = lazy(() => import('./balance'));
const DashboardPage = lazy(() => import('./dashboard'));
const AppMessagesPage = lazy(() => import('./app-messages'));
const FaucetPage = lazy(() => import('./faucet'));

const Routing: FunctionComponent = () => {
    // Scale layout for mobile devices until adaptive layout is not ready
    useEffect(() => {
        const metatag = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
        if (!metatag) {
            return;
        }

        if (!tGUserStore.user$.value) {
            metatag.content = 'width=device-width, initial-scale=1.0';
        } else {
            metatag.content = 'width=1350px';
        }
    }, [tGUserStore.user$.value]);

    if (!tGUserStore.user$.isResolved) {
        return null;
    }

    if (!tGUserStore.user$.value) {
        return (
            <Routes>
                <Route path="/" element={<LayoutSolid />}>
                    <Route
                        index
                        element={
                            <Suspense>
                                <LandingPage />
                            </Suspense>
                        }
                    ></Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        );
    }

    if (!projectsStore.selectedProject) {
        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={
                            <Suspense>
                                <CreateFirstProjectPage />
                            </Suspense>
                        }
                    ></Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<LayoutWithAside />}>
                <Route
                    path="dashboard"
                    element={
                        <Suspense>
                            <DashboardPage />
                        </Suspense>
                    }
                />
                <Route path="tonapi">{TonapiRouting}</Route>
                <Route
                    path="tonkeeper-messages"
                    element={
                        <Suspense>
                            <AppMessagesPage />
                        </Suspense>
                    }
                />
                <Route
                    path="balance"
                    element={
                        <Suspense>
                            <BalancePage />
                        </Suspense>
                    }
                />
                <Route
                    path="faucet"
                    element={
                        <Suspense>
                            <FaucetPage />
                        </Suspense>
                    }
                />
                <Route path="analytics">{AnalyticsRouting}</Route>
                <Route path="settings">{SettingsRouting}</Route>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
        </Routes>
    );
};

export default observer(Routing);
