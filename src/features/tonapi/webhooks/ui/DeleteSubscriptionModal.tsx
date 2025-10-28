import { FC, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { useUnsubscribeWebhookMutation, useWebhooksUI, Subscription } from '../model';
import { ConfirmationDialog } from 'src/entities';
import { Address } from '@ton/core';

const DeleteSubscriptionsModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription;
}> = ({ subscription, isOpen, onClose }) => {
    const { selectedWebhookId, network } = useWebhooksUI();
    const { mutate: unsubscribe, isPending } = useUnsubscribeWebhookMutation(
        selectedWebhookId || 0,
        network
    );

    const onConfirm = useCallback(() => {
        if (subscription && selectedWebhookId) {
            unsubscribe([Address.parse(subscription.account_id)], {
                onSuccess: onClose
            });
        }
    }, [subscription, selectedWebhookId, unsubscribe, onClose]);

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
            confirmValue={subscription.account_id}
            confirmButtonText="Delete"
            isLoading={isPending}
        />
    );
};

export default DeleteSubscriptionsModal;
