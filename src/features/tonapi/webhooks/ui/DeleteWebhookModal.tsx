import { FunctionComponent, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { Webhook, webhooksStore } from '../model';
import { observer } from 'mobx-react-lite';
import { ConfirmationDialog } from 'src/entities';

const DeleteWebhooksModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    webhook: Webhook;
}> = ({ webhook, isOpen, onClose }) => {
    const onConfirm = useCallback(() => {
        if (webhook) {
            webhooksStore.deleteWebhook(webhook.id).then(onClose);
        }
    }, [webhook]);

    return (
        <ConfirmationDialog
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title={v => `Delete ${v}`}
            description={v => (
                <>
                    <Text textStyle="text.body2" mb="6" color="text.secondary">
                        This action cannot be canceled. To confirm, type <b>{v}</b> in the box
                        below.
                    </Text>
                </>
            )}
            confirmValue={webhook.endpoint}
            confirmButtonText="Delete"
            isLoading={webhooksStore.deleteWebhook.isLoading}
        />
    );
};

export default observer(DeleteWebhooksModal);
