import { FC, useRef } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Portal,
    chakra
} from '@chakra-ui/react';
import { AddProjectParticipantFormValues } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { useIMask } from 'react-imask';
import { InfoIcon16, mergeRefs } from 'src/shared';
import { projectsStore } from 'src/shared/stores';

const AddProjectParticipantModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ onClose, ...rest }) => {
    const formId = 'add-project-participant-form';

    const { handleSubmit, register, formState, reset } = useForm<AddProjectParticipantFormValues>();
    const ref = useRef(null);

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
            <ModalContent ref={ref} maxW="380px">
                <ModalHeader textAlign="center">
                    Add user
                    <Box color="text.secondary" fontSize={14} fontWeight={400} lineHeight="20px">
                        Users with the same permissions as you, including the ability to manage all
                        project users
                    </Box>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py={1}>
                    <chakra.form
                        w="100%"
                        onSubmit={handleSubmit(submitMiddleware)}
                        noValidate
                        id={formId}
                    >
                        <FormControl mb={0} isInvalid={!!formState.errors.userId} isRequired>
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
                            <FormHelperText
                                textStyle="body2"
                                alignItems="center"
                                gap="1"
                                display="flex"
                                ml="auto"
                                color="text.secondary"
                            >
                                Where to find User ID?
                                <Popover isLazy>
                                    <PopoverTrigger>
                                        <InfoIcon16 cursor="pointer" />
                                    </PopoverTrigger>
                                    <Portal containerRef={ref}>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <video
                                                    autoPlay={true}
                                                    src="/assets/videos/find-user-id.webm"
                                                />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </Portal>
                                </Popover>{' '}
                            </FormHelperText>
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
