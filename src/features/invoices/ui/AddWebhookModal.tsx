import { FunctionComponent, useEffect, useId } from 'react';
import {
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { useForm } from 'react-hook-form';
import { invoicesAppStore } from 'src/features';
import { observer } from 'mobx-react-lite';

const AddWebhookModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { formState, register, handleSubmit, reset, watch, setFocus } = useForm<{
        value: string;
    }>();
    const formId = useId();

    const value = watch('value');

    const onSubmit = handleSubmit(async form => {
        await invoicesAppStore.addWebhook(form.value);
        onClose();
        setTimeout(reset, 1000);
    });

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setFocus('value'));
        } else if (!value) {
            reset();
        }
    }, [isOpen, value, setFocus, reset]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>
                    <H4>Add webhook</H4>
                </ModalHeader>
                <ModalBody>
                    <form noValidate id={formId} onSubmit={onSubmit}>
                        <FormControl isInvalid={!!formState.errors.value}>
                            <Input
                                autoComplete="off"
                                placeholder="https://myapp.com/api/invoice-change"
                                {...register('value', {
                                    required: 'This field is required',
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: 'Wrong URL format'
                                    }
                                })}
                            />
                            <FormErrorMessage>
                                {formState.errors.value && formState.errors.value.message}
                            </FormErrorMessage>
                        </FormControl>
                    </form>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={invoicesAppStore.addWebhook.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(AddWebhookModal);
