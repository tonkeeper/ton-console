import { FunctionComponent, useEffect, useState } from 'react';
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

export const DeleteProjectConfirmation: FunctionComponent<
    { projectName: string } & { isOpen: boolean; onClose: (confirm?: boolean) => void }
> = props => {
    const { projectName, ...rest } = props;
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (!rest.isOpen) {
            setInputValue('');
        }
    }, [rest.isOpen]);

    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Delete {projectName}?</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="0">
                    <Text textStyle="text.body2" mb="6" color="text.secondary" textAlign="center">
                        This action cannot be canceled. To confirm, please enter the name of the
                        project.
                    </Text>
                    <Input
                        onChange={e => setInputValue(e.target.value)}
                        placeholder="Name"
                        value={inputValue}
                    />
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => props.onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isDisabled={inputValue !== projectName}
                        onClick={() => props.onClose(true)}
                        type="submit"
                        variant="primary"
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
