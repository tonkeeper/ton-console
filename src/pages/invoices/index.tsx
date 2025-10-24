import RegisterProject from './RegisterProject';
import { FC, PropsWithChildren, Suspense, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { invoicesAppStore } from 'src/features';
import { Center, Spinner } from '@chakra-ui/react';
import { Route, useLocation, useNavigate } from 'react-router-dom';
import { lazy } from '@loadable/component';
import JoinInvoices from './JoinInvoices';

const InvoiceDashboardPage = lazy(() => import('./dashboard'));
const ManageInvoicesPage = lazy(() => import('./manage'));

const WaitForAppResolving: FC<PropsWithChildren> = observer(({ children }) => {
    if (!invoicesAppStore.invoicesApp$.isResolved) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    return <>{children}</>;
});

const InvoicesPage = observer(() => {
    if (invoicesAppStore.invoicesServiceAvailable) {
        return <RegisterProject />;
    }

    return <JoinInvoices />;
});

const Index = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    const id = invoicesAppStore.invoicesApp$.value?.id;

    useEffect(() => {
        if (id !== undefined) {
            navigate(location.pathname.endsWith('dashboard') ? 'dashboard' : 'manage');
        }
    }, [id]);

    return <InvoicesPage />;
});

const ApiDescription = observer(() => {
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
            <InvoiceDashboardPage />
        </Suspense>
    );
});

const Manage = observer(() => {
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
            <ManageInvoicesPage />
        </Suspense>
    );
});

const InvoicesRouting = (
    <>
        <Route
            path="dashboard"
            element={
                <WaitForAppResolving>
                    <ApiDescription />
                </WaitForAppResolving>
            }
        />
        <Route
            path="manage"
            element={
                <WaitForAppResolving>
                    <Manage />
                </WaitForAppResolving>
            }
        />
        <Route
            index
            element={
                <WaitForAppResolving>
                    <Index />
                </WaitForAppResolving>
            }
        />
        <Route
            path="*"
            element={
                <WaitForAppResolving>
                    <Index />
                </WaitForAppResolving>
            }
        />
    </>
);

export default InvoicesRouting;
