import RegisterProject from './RegisterProject';
import { Suspense } from 'react';
import { observer } from 'mobx-react-lite';
import { invoicesStore } from 'src/features';
import { Center, Spinner } from '@chakra-ui/react';
import { Route, useNavigate } from 'react-router-dom';
import { lazy } from '@loadable/component';

const ApiDescriptionPage = lazy(() => import('./api-description'));
const ManageInvoicesPage = lazy(() => import('./manage'));

const InvoicesPage = observer(() => {
    if (!invoicesStore.invoicesApp$.isResolved) {
        return (
            <Center h="200px">
                <Spinner />
            </Center>
        );
    }

    return <RegisterProject />;
});

const Index = observer(() => {
    const navigate = useNavigate();
    if (invoicesStore.invoicesApp$.value) {
        setTimeout(() => navigate('manage'));
        return null;
    }

    return <InvoicesPage />;
});

const ApiDescription = observer(() => {
    const navigate = useNavigate();
    if (!invoicesStore.invoicesApp$.value) {
        setTimeout(() => navigate('../'));
        return null;
    }

    return (
        <Suspense>
            <ApiDescriptionPage />
        </Suspense>
    );
});

const Manage = observer(() => {
    const navigate = useNavigate();
    if (!invoicesStore.invoicesApp$.value) {
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
        <Route path="api-description" element={<ApiDescription />} />
        <Route path="manage" element={<Manage />} />
        <Route index element={<Index />} />
        <Route path="*" element={<Index />} />
    </>
);

export default InvoicesRouting;
