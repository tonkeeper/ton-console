import RegisterProject from './RegisterProject';
import { FC, PropsWithChildren, Suspense, useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Center, Spinner } from '@chakra-ui/react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { lazy } from '@loadable/component';
import { UnavailableInvoices } from 'src/features/invoices/ui';
import { useProjectId, useProject } from 'src/shared/contexts/ProjectIdContext';
import { InvoicesAppStore, InvoicesTableStore } from 'src/features/invoices/models';

const InvoiceDashboardPage = lazy(() => import('./dashboard'));
const ManageInvoicesPage = lazy(() => import('./manage'));

interface WaitForAppResolvingProps extends PropsWithChildren {
    invoicesAppStore: InvoicesAppStore;
}

const WaitForAppResolving: FC<WaitForAppResolvingProps> = observer(({
    invoicesAppStore,
    children
}) => {
    if (!invoicesAppStore.invoicesApp$.isResolved) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    return <>{children}</>;
});

interface InvoicesPageProps {
    invoicesAppStore: InvoicesAppStore;
}

const InvoicesPage: FC<InvoicesPageProps> = observer(({ invoicesAppStore }) => {
    const project = useProject();
    const hasInvoicesCapability = project?.capabilities.invoices;

    if (!hasInvoicesCapability) {
        return <UnavailableInvoices />;
    }

    return <RegisterProject invoicesAppStore={invoicesAppStore} />;
});

interface IndexProps {
    invoicesAppStore: InvoicesAppStore;
}

const Index: FC<IndexProps> = observer(({ invoicesAppStore }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const id = invoicesAppStore.invoicesApp$.value?.id;

    useEffect(() => {
        if (id !== undefined) {
            navigate(location.pathname.endsWith('dashboard') ? 'dashboard' : 'manage');
        }
    }, [id]);

    return <InvoicesPage invoicesAppStore={invoicesAppStore} />;
});

interface ApiDescriptionProps {
    invoicesAppStore: InvoicesAppStore;
}

const ApiDescription: FC<ApiDescriptionProps> = observer(({ invoicesAppStore }) => {
    const navigate = useNavigate();
    const id = invoicesAppStore.invoicesApp$.value?.id;

    useEffect(() => {
        if (id === undefined) {
            navigate('../');
        }
    }, [id]);

    if (id === undefined) {
        return null;
    }

    return (
        <Suspense>
            <InvoiceDashboardPage invoicesAppStore={invoicesAppStore} />
        </Suspense>
    );
});

interface ManageProps {
    invoicesAppStore: InvoicesAppStore;
    invoicesTableStore: InvoicesTableStore;
}

const Manage: FC<ManageProps> = observer(({ invoicesAppStore, invoicesTableStore }) => {
    const navigate = useNavigate();
    const id = invoicesAppStore.invoicesApp$.value?.id;

    useEffect(() => {
        if (id === undefined) {
            navigate('../');
        }
    }, [id]);

    if (id === undefined) {
        return null;
    }

    return (
        <Suspense>
            <ManageInvoicesPage
                invoicesAppStore={invoicesAppStore}
                invoicesTableStore={invoicesTableStore}
            />
        </Suspense>
    );
});

const InvoicesRouting = observer(() => {
    const projectId = useProjectId();

    // Use useMemo for synchronous store creation to avoid unnecessary loading states
    const invoicesAppStore = useMemo(
        () => (projectId ? new InvoicesAppStore({ projectId }) : null),
        [projectId]
    );

    const invoicesTableStore = useMemo(
        () => (invoicesAppStore ? new InvoicesTableStore({ invoicesAppStore }) : null),
        [invoicesAppStore]
    );

    // Cleanup reactions when stores change
    useEffect(() => {
        return () => {
            invoicesAppStore?.dispose();
            invoicesTableStore?.dispose();
        };
    }, [invoicesAppStore, invoicesTableStore]);

    if (!invoicesAppStore || !invoicesTableStore) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    return (
        <Routes>
            <Route
                path="dashboard"
                element={
                    <WaitForAppResolving invoicesAppStore={invoicesAppStore}>
                        <ApiDescription invoicesAppStore={invoicesAppStore} />
                    </WaitForAppResolving>
                }
            />
            <Route
                path="manage"
                element={
                    <WaitForAppResolving invoicesAppStore={invoicesAppStore}>
                        <Manage
                            invoicesAppStore={invoicesAppStore}
                            invoicesTableStore={invoicesTableStore}
                        />
                    </WaitForAppResolving>
                }
            />
            <Route
                index
                element={
                    <WaitForAppResolving invoicesAppStore={invoicesAppStore}>
                        <Index invoicesAppStore={invoicesAppStore} />
                    </WaitForAppResolving>
                }
            />
            <Route
                path="*"
                element={
                    <WaitForAppResolving invoicesAppStore={invoicesAppStore}>
                        <Index invoicesAppStore={invoicesAppStore} />
                    </WaitForAppResolving>
                }
            />
        </Routes>
    );
});

export default InvoicesRouting;
