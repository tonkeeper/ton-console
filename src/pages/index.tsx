import { FunctionComponent, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import { Layout } from './layouts';
import { projectsStore, tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const NewUserPage = lazy(() => import('./new-user/NewUserPage'));
const CreateFirstProjectPage = lazy(() => import('./new-user/CreateFirstProjectPage'));
const SettingsPage = lazy(() => import('./settings'));
const SupportPage = lazy(() => import('./support'));

const Routing: FunctionComponent = () => {
    if (!tGUserStore.user) {
        return (
            <Routes>
                <Route path="/" element={<Layout aside={false} />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={<>...</>}>
                                <NewUserPage />
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
                <Route path="/" element={<Layout aside={false} />}>
                    <Route
                        index
                        element={
                            <Suspense fallback={<>...</>}>
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
            <Route path="/" element={<Layout />}>
                <Route path="tonapi">{TonapiRouting}</Route>
                <Route
                    path="support"
                    element={
                        <Suspense fallback={<>...</>}>
                            <SupportPage />
                        </Suspense>
                    }
                />
                <Route
                    path="settings"
                    element={
                        <Suspense fallback={<>...</>}>
                            <SettingsPage />
                        </Suspense>
                    }
                />
                <Route index element={<Navigate to="tonapi" replace />} />
                <Route path="*" element={<Navigate to="tonapi" replace />} />
            </Route>
        </Routes>
    );
};

export default observer(Routing);
