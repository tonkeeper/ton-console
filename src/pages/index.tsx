import { FunctionComponent, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import TonapiRouting from 'src/pages/tonapi';
import { lazy } from '@loadable/component';
import { Layout } from './layouts';
import { projectsStore, tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import SettingsRouting from 'src/pages/settings';

const NewUserPage = lazy(() => import('./new-user/NewUserPage'));
const CreateFirstProjectPage = lazy(() => import('./new-user/CreateFirstProjectPage'));
const BalancePage = lazy(() => import('./balance'));

const Routing: FunctionComponent = () => {
    if (!tGUserStore.user) {
        return (
            <Routes>
                <Route path="/" element={<Layout aside={false} />}>
                    <Route
                        index
                        element={
                            <Suspense>
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
            <Route path="/" element={<Layout />}>
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
