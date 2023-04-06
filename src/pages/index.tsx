import { FunctionComponent, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import { Layout } from './layouts';
import { projectsStore, tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import SettingsRouting from 'src/pages/settings';
import { LayoutSolid } from 'src/pages/layouts/LayoutSolid';
import { LayoutWithAside } from 'src/pages/layouts/LayoutWithAside';

const LandingPage = lazy(() => import('./landing'));
const CreateFirstProjectPage = lazy(() => import('./create-first-project'));
const BalancePage = lazy(() => import('./balance'));

const Routing: FunctionComponent = () => {
    if (!tGUserStore.user) {
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
                <Route path="tonapi">{TonapiRouting}</Route>
                <Route
                    path="balance"
                    element={
                        <Suspense>
                            <BalancePage />
                        </Suspense>
                    }
                />
                <Route path="settings">{SettingsRouting}</Route>
                <Route index element={<Navigate to="tonapi" replace />} />
                <Route path="*" element={<Navigate to="tonapi" replace />} />
            </Route>
        </Routes>
    );
};

export default observer(Routing);
