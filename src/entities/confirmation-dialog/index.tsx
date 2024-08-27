import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from '@chakra-ui/react';
import { FC, ReactNode, useEffect, useState } from 'react';

export const ConfirmationDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: ((confirmValue: string) => string) | string;
    confirmValue?: string;
    description?: ((confirmValue: string) => ReactNode) | ReactNode;
    cancelButtonText?: string;
    confirmButtonText?: string;
    isLoading?: boolean;
}> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmValue,
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
    isLoading = false
}) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setInputValue('');
        }
    }, [isOpen]);

    const titleString = typeof title === 'function' ? confirmValue && title(confirmValue) : title;
    const descriptionString =
        typeof description === 'function'
            ? confirmValue && description(`"${confirmValue}"`)
            : description;

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">{titleString}</ModalHeader>
                <ModalCloseButton />
                {descriptionString && (
                    <ModalBody pb="0">
                        <Text
                            textStyle="text.body2"
                            mb="6"
                            color="text.secondary"
                            textAlign="center"
                        >
                            {descriptionString}
                        </Text>
                        {confirmValue && (
                            <Input
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Name"
                                value={inputValue}
                            />
                        )}
                    </ModalBody>
                )}

                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        {cancelButtonText}
                    </Button>
                    <Button
                        flex={1}
                        isDisabled={!!confirmValue && inputValue !== confirmValue}
                        isLoading={isLoading}
                        onClick={onConfirm}
                        type="submit"
                        variant="primary"
                    >
                        {confirmButtonText}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
