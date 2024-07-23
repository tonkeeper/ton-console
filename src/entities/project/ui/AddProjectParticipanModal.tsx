import { FC } from 'react';
import {
    Box,
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
    ModalOverlay,
    chakra
} from '@chakra-ui/react';
import { AddProjectParticipantFormValues, projectsStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';

const AddProjectParticipanModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ ...rest }) => {
    const formId = 'add-project-participant-form';

    const { handleSubmit, register, formState } = useForm<AddProjectParticipantFormValues>();

    const { onClose } = rest;

    const submitMiddleware = (form: AddProjectParticipantFormValues): void => {
        projectsStore
            .addProjectParticipant(form)
            .then(onClose)
            .catch(() => console.error('Error'));
    };

    // TODO reset form after close

    return (
        <Modal scrollBehavior="inside" {...rest}>
            <ModalOverlay />
            <ModalContent maxW="350px">
                <ModalHeader textAlign="center">
                    Add user
                    <Box color="text.secondary" fontSize={14}>
                        {/* TODO change on more strict message */}
                        Users who will be able to edit, enter data and delete information
                    </Box>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody paddingY={1}>
                    <chakra.form
                        w="100%"
                        onSubmit={handleSubmit(submitMiddleware)}
                        noValidate
                        id={formId}
                    >
                        <FormControl isInvalid={!!formState.errors.userId} isRequired>
                            <Input
                                autoComplete="off"
                                autoFocus
                                id="name"
                                placeholder="User ID"
                                {...register('userId', {
                                    required: 'This is required', // TODO add validation for existing user
                                    valueAsNumber: true
                                })}
                            />
                            <FormErrorMessage>
                                {formState.errors.userId && formState.errors.userId.message}
                            </FormErrorMessage>
                        </FormControl>
                    </chakra.form>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        form={formId}
                        isLoading={projectsStore.createProject.isLoading}
                        type="submit"
                        variant="primary"
                    >
                        Add
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(AddProjectParticipanModal);
