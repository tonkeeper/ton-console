import { FC } from 'react';
import { BoxProps, Divider } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { InvoicesProjectInfo } from 'src/features';
import {
    useInvoicesApp,
    useInvoicesAppTokenQuery,
    useInvoicesStatisticsQuery,
    useAddWebhookMutation,
    useDeleteInvoicesWebhookMutation,
    useRegenerateTokenMutation
} from 'src/features/invoices/models';
import InvoicesStats from './InvoicesStats';
import InvoicesAuthorization from './InvoicesAuthorization';
import InvoicesWebhooks from './InvoicesWebhooks';
import InvoicesApi from './InvoicesApi';

const InvoiceDashboardPage: FC<BoxProps> = (props) => {
    const invoicesApp = useInvoicesApp();
    const invoicesToken = useInvoicesAppTokenQuery(invoicesApp.app?.id);
    const invoicesStats = useInvoicesStatisticsQuery(invoicesApp.app?.id);
    const addWebhook = useAddWebhookMutation(invoicesApp.app?.id);
    const deleteWebhook = useDeleteInvoicesWebhookMutation(invoicesApp.app?.id);
    const regenerateToken = useRegenerateTokenMutation(invoicesApp.app?.id);

    return (
        <Overlay {...props}>
            <H4 mb="1">Overview</H4>
            <InvoicesProjectInfo mb="5" invoicesApp={invoicesApp} />
            <Divider w="auto" mx="-6" mb="5" />
            <InvoicesStats
                mb="6"
                data={invoicesStats.data || undefined}
                isLoading={invoicesStats.isLoading}
            />
            <Divider w="auto" mx="-6" mb="5" />
            <InvoicesAuthorization
                app={invoicesApp.app}
                token={invoicesToken.data}
                onRegenerateToken={async () => {
                    await new Promise<void>((resolve) => {
                        regenerateToken.mutate(undefined, {
                            onSuccess: () => resolve()
                        });
                    });
                }}
                isRegeneratingToken={regenerateToken.isPending}
                isTokenLoading={invoicesToken.isLoading}
            />
            <Divider w="auto" mx="-6" mb="5" />
            <InvoicesWebhooks
                mb="6"
                webhooks={invoicesApp.app?.webhooks}
                onAddWebhook={async (webhook) => {
                    await new Promise<void>((resolve) => {
                        addWebhook.mutate(webhook, {
                            onSuccess: () => resolve()
                        });
                    });
                }}
                onDeleteWebhook={async (webhookId) => {
                    await new Promise<void>((resolve) => {
                        deleteWebhook.mutate(webhookId, {
                            onSuccess: () => resolve()
                        });
                    });
                }}
                isDeletingWebhook={deleteWebhook.isPending}
                isAddingWebhook={addWebhook.isPending}
            />
            <InvoicesApi app={invoicesApp.app} />
        </Overlay>
    );
};

export default InvoiceDashboardPage;
