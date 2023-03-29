import { FunctionComponent, useCallback } from 'react';
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
import { apiKeysStore } from 'src/entities/api-keys';

const CreateApiKeyModal: FunctionComponent<{ isOpen: boolean; onClose: () => void }> = props => {
    const formId = 'create-api-key-form';

    const {
        handleSubmit,
        register,
        formState: { errors }
    } = useForm<{ name: string }>();

    const onSubmit = useCallback(
        (form: { name: string }): void => {
            apiKeysStore.createApiKey(form).then(props.onClose);
        },
        [props.onClose]
    );

    return (
        <Modal scrollBehavior="inside" {...props}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>New API key</ModalHeader>
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
                                    minLength: { value: 3, message: 'Minimum length should be 3' }
                                })}
                            />
                            <FormErrorMessage>
                                {errors.name && errors.name.message}
                            </FormErrorMessage>
                        </FormControl>
                    </chakra.form>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={props.onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={apiKeysStore.createApiKey.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Create
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(CreateApiKeyModal);
