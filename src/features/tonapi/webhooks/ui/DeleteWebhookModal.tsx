import { FC, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { useDeleteWebhookMutation, useWebhooksUI } from '../model';
import { ConfirmationDialog } from 'src/entities';
import { Webhook } from '../model/interfaces/webhooks';

const DeleteWebhooksModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    webhook: Webhook;
}> = ({ webhook, isOpen, onClose }) => {
    const { network } = useWebhooksUI();
    const { mutate: deleteWebhook, isPending } = useDeleteWebhookMutation(network);

    const onConfirm = useCallback(() => {
        if (webhook) {
            deleteWebhook(webhook.id, {
                onSuccess: onClose
            });
        }
    }, [webhook, deleteWebhook, onClose]);

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
            isLoading={isPending}
        />
    );
};

export default DeleteWebhooksModal;
