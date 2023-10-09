import RegisterProject from './RegisterProject';
import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { invoicesAppStore } from 'src/features';
import { Center, Spinner } from '@chakra-ui/react';
import { Route, useNavigate } from 'react-router-dom';
import { lazy } from '@loadable/component';
import JoinInvoices from './JoinInvoices';

const InvoiceDashboardPage = lazy(() => import('./dashboard'));
const ManageInvoicesPage = lazy(() => import('./manage'));

const InvoicesPage = observer(() => {
    if (!invoicesAppStore.invoicesApp$.isResolved) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    if (invoicesAppStore.invoicesServiceAvailable) {
        return <RegisterProject />;
    }

    return <JoinInvoices />;
});

const Index = observer(() => {
    const navigate = useNavigate();
    if (invoicesAppStore.invoicesApp$.value) {
        setTimeout(() => navigate('manage'));
        return null;
    }

    return <InvoicesPage />;
});

const ApiDescription = observer(() => {
    const navigate = useNavigate();
    if (!invoicesAppStore.invoicesApp$.value) {
        setTimeout(() => navigate('../'));
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
    if (!invoicesAppStore.invoicesApp$.value) {
        setTimeout(() => navigate('../'));
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
        <Route path="dashboard" element={<ApiDescription />} />
        <Route path="manage" element={<Manage />} />
        <Route index element={<Index />} />
        <Route path="*" element={<Index />} />
    </>
);

export default InvoicesRouting;
