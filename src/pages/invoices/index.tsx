import RegisterProject from './RegisterProject';
import { FC, PropsWithChildren, Suspense, useEffect } from 'react';
import { Center, Spinner } from '@chakra-ui/react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { lazy } from '@loadable/component';
import { UnavailableInvoices } from 'src/features/invoices/ui';
import { useProject } from 'src/shared/contexts/ProjectContext';
import { useInvoicesAppQuery } from 'src/features/invoices/models';
import type { InvoicesApp } from 'src/features/invoices/models';

const InvoiceDashboardPage = lazy(() => import('./dashboard'));
const ManageInvoicesPage = lazy(() => import('./manage'));

interface LoadingProps extends PropsWithChildren {
    isLoading: boolean;
}

const WaitForLoading: FC<LoadingProps> = ({ isLoading, children }) => {
    if (isLoading) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    return <>{children}</>;
};

interface InvoicesPageProps {
    app: InvoicesApp | null | undefined;
}

const InvoicesPage: FC<InvoicesPageProps> = ({ app }) => {
    const project = useProject();
    const navigate = useNavigate();
    const hasInvoicesCapability = project?.capabilities.invoices;

    // Navigate to dashboard if app exists
    useEffect(() => {
        if (app?.id) {
            navigate('dashboard', { replace: true });
        }
    }, [app?.id, navigate]);

    if (!hasInvoicesCapability) {
        return <UnavailableInvoices />;
    }

    // Don't show RegisterProject if app exists (navigation is in progress)
    if (app?.id) {
        return null;
    }

    return <RegisterProject />;
};

interface ApiDescriptionProps {
    app: InvoicesApp | null | undefined;
}

const ApiDescription: FC<ApiDescriptionProps> = ({ app }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!app?.id) {
            navigate('../');
        }
    }, [app?.id, navigate]);

    if (!app?.id) {
        return null;
    }

    return (
        <Suspense>
            <InvoiceDashboardPage />
        </Suspense>
    );
};

interface ManageProps {
    app: InvoicesApp | null | undefined;
}

const Manage: FC<ManageProps> = ({ app }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!app?.id) {
            navigate('../');
        }
    }, [app?.id, navigate]);

    if (!app?.id) {
        return null;
    }

    return (
        <Suspense>
            <ManageInvoicesPage />
        </Suspense>
    );
};

const InvoicesRouting = () => {
    const { data: app, isLoading } = useInvoicesAppQuery();

    return (
        <WaitForLoading isLoading={isLoading}>
            <Routes>
                <Route
                    path="dashboard"
                    element={<ApiDescription app={app} />}
                />
                <Route
                    path="manage"
                    element={<Manage app={app} />}
                />
                <Route
                    index
                    element={<InvoicesPage app={app} />}
                />
                <Route
                    path="*"
                    element={<InvoicesPage app={app} />}
                />
            </Routes>
        </WaitForLoading>
    );
};

export default InvoicesRouting;
