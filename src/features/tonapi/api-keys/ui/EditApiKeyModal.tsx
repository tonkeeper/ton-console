import { FunctionComponent, useCallback, useEffect } from 'react';
import {
    Button,
    chakra,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { ApiKey, apiKeysStore } from '../model';

const EditApiKeyModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    apiKey: ApiKey | undefined;
}> = ({ apiKey, ...rest }) => {
    const formId = 'create-api-key-form';

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isDirty }
    } = useForm<{ name: string }>();

    useEffect(() => {
        reset({ name: apiKey?.name });
    }, [apiKey]);

    const onSubmit = useCallback(
        (form: { name: string }): void => {
            if (apiKey) {
                apiKeysStore.editApiKey({ id: apiKey.id, ...form }).then(rest.onClose);
            }
        },
        [apiKey, rest.onClose]
    );

    return (
        <Modal scrollBehavior="inside" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{apiKey?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <chakra.form id={formId} w="100%" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FormControl isInvalid={!!errors.name} isRequired>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input
                                autoComplete="off"
                                id="name"
                                placeholder="Name"
                                {...register('name', {
                                    required: 'This is required',
                                    minLength: { value: 3, message: 'Minimum length should be 3' },
                                    maxLength: { value: 64, message: 'Maximum length is 64' }
                                })}
                            />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>
                    </chakra.form>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={rest.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isDisabled={!isDirty}
                        isLoading={apiKeysStore.editApiKey.isLoading}
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

export default observer(EditApiKeyModal);
