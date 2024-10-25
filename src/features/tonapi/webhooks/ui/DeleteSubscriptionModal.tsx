import { FunctionComponent, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { webhooksStore } from '../model';
import { observer } from 'mobx-react-lite';
import { ConfirmationDialog } from 'src/entities';
import { Subscription } from '../model/webhooks.store';
import { Address } from '@ton/core';

const DeleteSubscriptionsModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    subscription: Subscription;
}> = ({ subscription, isOpen, onClose }) => {
    const onConfirm = useCallback(() => {
        if (subscription) {
            webhooksStore
                .unsubscribeWebhook([Address.parse(subscription.account_id)])
                .then(onClose);
        }
    }, [subscription]);

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
            isLoading={webhooksStore.deleteWebhook.isLoading}
        />
    );
};

export default observer(DeleteSubscriptionsModal);
