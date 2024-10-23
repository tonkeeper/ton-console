import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { SubscriptionsTable, webhooksStore } from 'src/features/tonapi/webhooks';
import { EmptySubscriptions } from './EmptySubscriptions';
import { Overlay, useSearchParams } from 'src/shared';
import { Button, Center, Spinner, useDisclosure } from '@chakra-ui/react';
import AddSubscriptionsModal from 'src/features/tonapi/webhooks/ui/AddSubscriptionsModal';

const WebhooksViewPage: FC = () => {
    const { searchParams } = useSearchParams();
    const webhookId = searchParams.get('webhookId');

    useEffect(() => {
        if (webhookId) {
            webhooksStore.setSelectedWebhookId(webhookId);
        }

        return () => {
            webhooksStore.setSelectedWebhookId(null);
        };
    }, [webhookId]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!webhooksStore.selectedWebhook) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (!webhooksStore.subscriptions$.value.length) {
        return <EmptySubscriptions />;
    }

    return (
        <>
            <Overlay h="fit-content">
                <Button mb="6" onClick={onOpen} variant="secondary">
                    Add Subscription
                </Button>
                <SubscriptionsTable />
            </Overlay>
            <AddSubscriptionsModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(WebhooksViewPage);
