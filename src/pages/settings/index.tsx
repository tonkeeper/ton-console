import { Navigate, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { lazy } from '@loadable/component';

const EditProjectPage = lazy(() => import('./edit-project'));

const SettingsRouting = (
    <>
        <Route
            path="edit-project"
            element={
                <Suspense>
                    <EditProjectPage />
                </Suspense>
            }
        />
        <Route index element={<Navigate to="edit-project" replace />} />
        <Route path="*" element={<Navigate to="edit-project" replace />} />
    </>
);

export default SettingsRouting;
