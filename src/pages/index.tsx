import { FC, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import { Layout } from './layouts';
import SettingsRouting from 'src/pages/settings';
import InvoicesRouting from './invoices';
import { LayoutSolid } from 'src/pages/layouts/LayoutSolid';
import { LayoutWithAside } from 'src/pages/layouts/LayoutWithAside';
import AnalyticsRouting from 'src/pages/analytics';
import NftRouting from 'src/pages/nft';
import JettonRouting from 'src/pages/jetton';
import { isDevelopmentMode } from 'src/shared';
import { useLocation } from 'react-router-dom';
import { useMaybeProject } from 'src/shared/contexts/ProjectContext';
import { useUserQuery } from 'src/entities/user/queries';

const LandingPage = lazy(() => import('./landing'));
const LoginPage = lazy(() => import('./login'));
const CreateFirstProjectPage = lazy(() => import('./create-first-project'));
const BalancePage = lazy(() => import('./balance'));
const DashboardPage = lazy(() => import('./dashboard'));
const AppMessagesPage = lazy(() => import('./app-messages'));
const FaucetPage = lazy(() => import('./faucet'));
const UserProfilePage = lazy(() => import('./user-profile'));

const Routing: FC = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const queryBackUrl = params.get('backUrl');
    const project = useMaybeProject();
    const { data: user, isLoading, isFetching, status } = useUserQuery();

    // Debug: log user query state
    useEffect(() => {
        console.log('[Routing] User query state:', { user, isLoading, isFetching, status });
    }, [user, isLoading, isFetching, status]);

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

        if (!user) {
            metatag.content = 'width=device-width, initial-scale=1.0';
        } else {
            metatag.content = 'width=1350px';
        }
    }, [user]);

    // Show loading only if user data is being fetched for the first time
    // Check both isLoading (no data in cache) and isFetching (request in progress)
    if (isLoading) {
        console.log('[Routing] Showing loader, isLoading:', isLoading);
        return null;
    }

    if (!user) {
        return (
            <Routes>
                <Route path="/" element={<LayoutSolid />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={null}>
                                <LandingPage />
                            </Suspense>
                        }
                    ></Route>
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={null}>
                                <LoginPage />
                            </Suspense>
                        }
                    ></Route>
                </Route>
            </Routes>
        );
    }

    if (!project) {
        const currentPath = location.pathname + location.search;
        const backUrl = encodeURIComponent(currentPath);
        const navigateTo = `/?backUrl=${backUrl}`;

        return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={null}>
                                <CreateFirstProjectPage />
                            </Suspense>
                        }
                    ></Route>
                    <Route path="*" element={<Navigate to={navigateTo} replace />} />
                </Route>
            </Routes>
        );
    }

    if (project && queryBackUrl) {
        return <Navigate to={queryBackUrl} replace />;
    }

    return (
        <Routes>
            <Route path="/" element={<LayoutWithAside />}>
                <Route
                    path="dashboard"
                    element={
                        <Suspense fallback={null}>
                            <DashboardPage />
                        </Suspense>
                    }
                />
                <Route
                    path="invoices/*"
                    element={
                        <Suspense fallback={null}>
                            <InvoicesRouting />
                        </Suspense>
                    }
                />
                <Route path="tonapi">{TonapiRouting}</Route>
                <Route
                    path="tonkeeper-messages"
                    element={
                        <Suspense fallback={null}>
                            <AppMessagesPage />
                        </Suspense>
                    }
                />
                <Route
                    path="balance"
                    element={
                        <Suspense fallback={null}>
                            <BalancePage />
                        </Suspense>
                    }
                />
                <Route
                    path="faucet"
                    element={
                        <Suspense fallback={null}>
                            <FaucetPage />
                        </Suspense>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <Suspense fallback={null}>
                            <UserProfilePage />
                        </Suspense>
                    }
                />
                <Route path="analytics">{AnalyticsRouting}</Route>
                <Route path="nft">{NftRouting}</Route>
                <Route
                    path="jetton/*"
                    element={
                        <Suspense fallback={null}>
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

export default Routing;
