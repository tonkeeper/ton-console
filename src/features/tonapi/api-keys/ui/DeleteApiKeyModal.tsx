import { FC, useCallback } from 'react';
import { Text } from '@chakra-ui/react';
import { ApiKey, useDeleteApiKeyMutation } from '../model';
import { ConfirmationDialog } from 'src/entities';

const DeleteApiKeyModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey;
}> = ({ apiKey, isOpen, onClose }) => {
    const { mutate: deleteApiKey, isPending } = useDeleteApiKeyMutation();

    const onConfirm = useCallback(() => {
        if (apiKey) {
            deleteApiKey(apiKey.id, {
                onSuccess: () => {
                    onClose();
                }
            });
        }
    }, [apiKey, onClose, deleteApiKey]);

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
            isLoading={isPending}
        />
    );
};

export default DeleteApiKeyModal;
