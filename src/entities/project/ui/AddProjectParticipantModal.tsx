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
import { useIMask } from 'react-imask';
import { mergeRefs } from 'src/shared';

const AddProjectParticipantModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ onClose, ...rest }) => {
    const formId = 'add-project-participant-form';

    const { handleSubmit, register, formState, reset } = useForm<AddProjectParticipantFormValues>();

    const handleClose = () => {
        onClose();
        reset();
    };

    const submitMiddleware = (form: AddProjectParticipantFormValues): void => {
        projectsStore.addProjectParticipant(form).then(handleClose);
    };

    const { ref: maskRef } = useIMask({
        // FIXME: useIMask is not work sometimes
        mask: Number,
        scale: 0,
        normalizeZeros: true,
        signed: false,
        min: 0,
        max: Number.MAX_SAFE_INTEGER
    });

    const { ref: hookFormRef, ...amountRest } = register('userId', {
        required: 'This is required',
        validate: value => {
            if (
                projectsStore.projectParticipants$.value.find(
                    participant => participant.id === value
                )
            ) {
                return 'User already exists';
            }
            return true;
        },
        valueAsNumber: true
    });

    return (
        <Modal onClose={handleClose} scrollBehavior="inside" {...rest}>
            <ModalOverlay />
            <ModalContent maxW="380px">
                <ModalHeader textAlign="center">
                    Add user
                    <Box color="text.secondary" fontSize={14} fontWeight={400} lineHeight="20px">
                        Users with the same permissions as you, including the ability to manage all
                        project users
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
                                ref={mergeRefs(maskRef, hookFormRef)}
                                autoComplete="off"
                                autoFocus
                                id="userId"
                                min={0}
                                placeholder="User ID"
                                {...amountRest}
                            />
                            <FormErrorMessage>
                                {formState.errors.userId && formState.errors.userId.message}
                            </FormErrorMessage>
                        </FormControl>
                    </chakra.form>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={handleClose} variant="secondary">
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

export default observer(AddProjectParticipantModal);
