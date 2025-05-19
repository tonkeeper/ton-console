import { FunctionComponent, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import { Layout } from './layouts';
import { projectsStore, userStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';
import SettingsRouting from 'src/pages/settings';
import InvoicesRouting from './invoices';
import { LayoutSolid } from 'src/pages/layouts/LayoutSolid';
import { LayoutWithAside } from 'src/pages/layouts/LayoutWithAside';
import AnalyticsRouting from 'src/pages/analytics';
import NftRouting from 'src/pages/nft';
import JettonRouting from 'src/pages/jetton';
import { isDevelopmentMode } from 'src/shared';
import { useLocation } from 'react-router-dom';

const LandingPage = lazy(() => import('./landing'));
const LoginPage = lazy(() => import('./login'));
const CreateFirstProjectPage = lazy(() => import('./create-first-project'));
const BalancePage = lazy(() => import('./balance'));
const DashboardPage = lazy(() => import('./dashboard'));
const AppMessagesPage = lazy(() => import('./app-messages'));
const FaucetPage = lazy(() => import('./faucet'));
const UserProfilePage = lazy(() => import('./user-profile'));

const Routing: FunctionComponent = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryBackUrl = params.get('backUrl');

    useEffect(() => {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        if (typeof ym !== 'undefined') {
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            ym(99709953, 'hit', location.pathname);
        }
    }, [location]);

    // Scale layout for mobile devices until adaptive layout is not ready
    useEffect(() => {
        const metatag = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
        if (!metatag) {
            return;
        }

        if (isDevelopmentMode()) {
            return;
        }

        if (!userStore.user$.value) {
            metatag.content = 'width=device-width, initial-scale=1.0';
        } else {
            metatag.content = 'width=1350px';
        }
    }, [userStore.user$.value]);

    if (!userStore.user$.isResolved) {
        return null;
    }

    if (!userStore.user$.value) {
        return (
            <Routes>
                <Route path="/" element={<LayoutSolid />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <LandingPage />
                            </Suspense>
                        }
                    ></Route>
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<div>Loading...</div>}>
                                <LoginPage />
                            </Suspense>
                        }
                    ></Route>
                </Route>
            </Routes>
        );
    }

    if (!projectsStore.selectedProject) {
        const currentPath = location.pathname + location.search;
        const backUrl = encodeURIComponent(currentPath);
        const navigateTo = `/?backUrl=${backUrl}`;

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
                    <Route path="*" element={<Navigate to={navigateTo} replace />} />
                </Route>
            </Routes>
        );
    }

    if (projectsStore.selectedProject && queryBackUrl) {
        return <Navigate to={queryBackUrl} replace />;
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
                <Route path="invoices">{InvoicesRouting}</Route>
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
                <Route
                    path="profile"
                    element={
                        <Suspense>
                            <UserProfilePage />
                        </Suspense>
                    }
                />
                <Route path="analytics">{AnalyticsRouting}</Route>
                <Route path="nft">{NftRouting}</Route>
                <Route
                    path="jetton/*"
                    element={
                        <Suspense>
                            <JettonRouting />
                        </Suspense>
                    }
                />
                <Route path="settings">{SettingsRouting}</Route>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>
        </Routes>
    );
};

export default observer(Routing);
