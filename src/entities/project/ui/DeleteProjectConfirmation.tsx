import { FunctionComponent } from 'react';
import { Text } from '@chakra-ui/react';
import { ConfirmationDialog } from 'src/entities/confirmation-dialog';

export const DeleteProjectConfirmation: FunctionComponent<
    { projectName: string } & { isOpen: boolean; onClose: () => void; onConfirm: () => void }
> = props => {
    const { projectName, isOpen, onClose, onConfirm } = props;

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
            confirmValue={projectName}
            confirmButtonText="Delete"
        />
    );
};
