import { FC, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { lazy } from '@loadable/component';
import { useMaybeProject } from 'src/shared/contexts/ProjectContext';
import { useUserQuery } from 'src/entities/user/queries';
import { useProjectsQuery } from 'src/shared/queries/projects';
import { useViewportScale } from 'src/shared';
import AppInitialization from 'src/processes/AppInitialization';
import { Layout } from './layouts';
import { LayoutSolid } from 'src/pages/layouts/LayoutSolid';
import { LayoutWithAside } from 'src/pages/layouts/LayoutWithAside';
import TonapiRouting from 'src/pages/tonapi';
import SettingsRouting from 'src/pages/settings';
import InvoicesRouting from './invoices';
import AnalyticsRouting from 'src/pages/analytics';
import NftRouting from 'src/pages/nft';
import JettonRouting from 'src/pages/jetton';

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
    const queryBackUrl = new URLSearchParams(location.search).get('backUrl');
    const project = useMaybeProject();
    const { data: user, isLoading: isUserLoading } = useUserQuery();
    const { isLoading: isProjectsLoading } = useProjectsQuery({ userId: user?.id });

    // Determine if app should show loading screen
    // Show loader if user is loading OR if user exists and projects are loading
    const isAppLoading = isUserLoading || (!!user && isProjectsLoading);

    // Track page views with Yandex Metrika
    useEffect(() => {
        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
        // @ts-ignore
        if (typeof ym !== 'undefined') {
            /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
            // @ts-ignore
            ym(99709953, 'hit', location.pathname);
        }
    }, [location]);

    // Scale layout for mobile devices until adaptive layout is ready
    useViewportScale(!!user);

    // Unauthenticated user - show landing or login
    if (!user) {
        return (
            <AppInitialization isLoading={isAppLoading}>
                <Routes>
                    <Route path="/" element={<LayoutSolid />}>
                        <Route
                            index
                            element={
                                <Suspense>
                                    <LandingPage />
                                </Suspense>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <Suspense>
                                    <LoginPage />
                                </Suspense>
                            }
                        />
                    </Route>
                </Routes>
            </AppInitialization>
        );
    }

    // Authenticated user but no project selected - show create project page
    if (!project) {
        const currentPath = location.pathname + location.search;
        const backUrl = encodeURIComponent(currentPath);
        const navigateTo = `/?backUrl=${backUrl}`;

        return (
            <AppInitialization isLoading={isAppLoading}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route
                            index
                            element={
                                <Suspense>
                                    <CreateFirstProjectPage />
                                </Suspense>
                            }
                        />
                        <Route path="*" element={<Navigate to={navigateTo} replace />} />
                    </Route>
                </Routes>
            </AppInitialization>
        );
    }

    // Handle redirect from create project flow
    if (queryBackUrl) {
        return <Navigate to={queryBackUrl} replace />;
    }

    // Main application routes with project selected
    return (
        <AppInitialization isLoading={isAppLoading}>
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
                    <Route
                        path="invoices/*"
                        element={
                            <Suspense>
                                <InvoicesRouting />
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
        </AppInitialization>
    );
};

export default Routing;
