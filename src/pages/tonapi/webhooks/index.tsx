import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { CreateWebhookModal, WebhooksTable, webhooksStore } from 'src/features/tonapi/webhooks';
import { EmptyWebhooks } from './EmptyWebhooks';
import { Overlay } from 'src/shared';
import { Button, Center, Spinner, useDisclosure } from '@chakra-ui/react';

const WebhooksPage: FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!webhooksStore.webhooks$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (!webhooksStore.webhooks$.value.length) {
        return <EmptyWebhooks />;
    }

    return (
        <>
            <Overlay h="fit-content">
                <Button mb="6" onClick={onOpen} variant="secondary">
                    Create Webhook
                </Button>
                <WebhooksTable />
            </Overlay>
            <CreateWebhookModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(WebhooksPage);
