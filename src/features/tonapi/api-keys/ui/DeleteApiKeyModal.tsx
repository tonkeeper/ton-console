import { FC, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { ApiKey, ApiKeysStore } from '../model';
import { observer } from 'mobx-react-lite';
import { ConfirmationDialog } from 'src/entities';

const DeleteApiKeyModal: FC<{
    apiKeysStore: ApiKeysStore;
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey;
}> = ({ apiKeysStore, apiKey, isOpen, onClose }) => {
    const onConfirm = useCallback(() => {
        if (apiKey) {
            apiKeysStore.deleteApiKey(apiKey.id).then(onClose);
        }
    }, [apiKey, onClose]);

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
            confirmValue={apiKey.name}
            confirmButtonText="Delete"
            isLoading={apiKeysStore.deleteApiKey.isLoading}
        />
    );
};

export default observer(DeleteApiKeyModal);
