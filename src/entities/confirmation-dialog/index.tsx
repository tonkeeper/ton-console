import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button
} from '@chakra-ui/react';
import { FC, useRef } from 'react';

export const ConfirmationDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
}> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    cancelText = 'Cancel',
    confirmText = 'Confirm'
}) => {
    const cancelRef = useRef(null);

    return (
        <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    {description && <AlertDialogBody paddingY={0}>{description}</AlertDialogBody>}

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose} variant="outline">
                            {cancelText}
                        </Button>
                        <Button ml={3} onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};
