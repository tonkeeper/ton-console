import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
    Button,
    Center,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useClipboard,
    useDisclosure,
    VStack
} from '@chakra-ui/react';
import { DeleteProjectConfirmation, EditProjectParticipant } from 'src/entities';
import { useForm } from 'react-hook-form';
import { CopyIcon16, EditIcon24, H4, ImageInput, imageUrlToFilesList, Overlay } from 'src/shared';
import { useProject, useSetProject } from 'src/shared/contexts/ProjectContext';
import {
    useUpdateProjectMutation,
    useDeleteProjectMutation
} from 'src/shared/queries/projects';
import AddProjectParticipantModal from 'src/entities/project/ui/AddProjectParticipantModal';

const availableDeleteProject = import.meta.env.VITE_AVAILABLE_DELETE_PROJECT === 'true';

interface EditProjectFormValues {
    name: string;
    icon: FileList | null;
}

const EditProjectPage: FC = () => {
    const selectedProject = useProject();
    const setProject = useSetProject();

    const updateProject = useUpdateProjectMutation();
    const deleteProject = useDeleteProjectMutation();

    const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false);
    const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
    const iconModal = useDisclosure();

    const { register, handleSubmit, formState, reset, watch } =
        useForm<EditProjectFormValues>({
            defaultValues: {
                name: '',
                icon: null
            }
        });

    const iconValue = watch('icon');
    const iconPreviewUrl = useMemo(() => {
        if (iconValue && iconValue.length > 0) {
            return URL.createObjectURL(iconValue[0]);
        }
        return selectedProject?.imgUrl || null;
    }, [iconValue, selectedProject?.imgUrl]);

    // Cleanup blob URL to prevent memory leak
    useEffect(() => {
        return () => {
            if (iconPreviewUrl && iconPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(iconPreviewUrl);
            }
        };
    }, [iconPreviewUrl]);

    useEffect(() => {
        const loadDefaults = async () => {
            let iconFileList: FileList | null = null;
            if (selectedProject?.imgUrl) {
                iconFileList = await imageUrlToFilesList(selectedProject.imgUrl);
            }

            reset({
                name: selectedProject?.name || '',
                icon: iconFileList
            });
        };

        loadDefaults();
    }, [selectedProject, reset]);

    const onSubmit = useCallback(
        (values: EditProjectFormValues) => {
            if (!selectedProject) {
                return;
            }

            const modifiedFields: { name?: string; icon?: File } = {};

            if (formState.dirtyFields.name) {
                modifiedFields.name = values.name;
            }

            if (formState.dirtyFields.icon && values.icon && values.icon.length > 0) {
                modifiedFields.icon = values.icon[0];
            }

            if (Object.keys(modifiedFields).length === 0) {
                return;
            }

            updateProject.mutate({
                projectId: selectedProject.id,
                ...modifiedFields
            });
        },
        [formState.dirtyFields, selectedProject, updateProject]
    );

    const handleIconModalSave = () => {
        iconModal.onClose();
    };

    const projectIdString = selectedProject?.id.toString() || '';
    const { onCopy, hasCopied } = useClipboard(projectIdString);

    return (
        <VStack align="stretch" spacing="4">
            {/* Card 1: Project Details */}
            <Overlay h="fit-content">
                {/* Header: Title + ID badge */}
                <Flex align="center" justify="space-between" wrap="wrap" gap="3" mb="4">
                    <H4>Project Details</H4>

                    {/* ID Badge */}
                    <HStack
                        px="3"
                        py="1.5"
                        bg="background.contentTint"
                        borderRadius="md"
                        spacing="2"
                    >
                        <Text textStyle="body3" color="text.secondary">
                            Project ID:
                        </Text>
                        <Text textStyle="body3" fontFamily="mono" fontWeight="medium">
                            {projectIdString}
                        </Text>
                        <IconButton
                            aria-label={hasCopied ? 'Copied!' : 'Copy ID'}
                            icon={<CopyIcon16 />}
                            onClick={onCopy}
                            size="xs"
                            variant="ghost"
                        />
                    </HStack>
                </Flex>

                <Divider w="auto" mx="-6" mb="5" />

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Icon + Name row */}
                    <Flex
                        // align="center"
                        direction={{ base: 'column', md: 'row' }}
                        gap="5"
                    >
                        {/* Icon (clickable) */}
                        <Center
                            as="button"
                            pos="relative"
                            overflow="hidden"
                            w="72px"
                            minW="72px"
                            h="72px"
                            bg="background.contentTint"
                            borderRadius="lg"
                            _hover={{
                                '& > .edit-overlay': {
                                    opacity: 1
                                }
                            }}
                            cursor="pointer"
                            onClick={iconModal.onOpen}
                            type="button"
                        >
                            {iconPreviewUrl ? (
                                <Image
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                    alt={selectedProject?.name || 'Project icon'}
                                    src={iconPreviewUrl}
                                />
                            ) : (
                                <Text
                                    color="text.primary"
                                    fontSize="xl"
                                    fontWeight="medium"
                                >
                                    {selectedProject?.name?.[0] || 'P'}
                                </Text>
                            )}
                            <Center
                                className="edit-overlay"
                                pos="absolute"
                                bg="blackAlpha.600"
                                opacity="0"
                                transition="opacity 0.2s"
                                inset="0"
                            >
                                <EditIcon24 color="white" />
                            </Center>
                        </Center>

                        {/* Name input */}
                        <FormControl flex="1" isInvalid={!!formState.errors.name} isRequired>
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input
                                autoComplete="off"
                                id="name"
                                placeholder="Project name"
                                {...register('name', {
                                    required: 'This is required',
                                    minLength: { value: 3, message: 'Minimum length should be 3' },
                                    maxLength: { value: 64, message: 'Maximum length is 64' }
                                })}
                            />
                            <FormErrorMessage>
                                {formState.errors.name?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Flex>

                    <Button
                        w="100%"
                        mt="5"
                        isDisabled={!formState.isDirty || deleteProject.isPending}
                        isLoading={updateProject.isPending}
                        type="submit"
                    >
                        Save
                    </Button>
                </form>
            </Overlay>

            {/* Card 2: Team Access */}
            <Overlay h="fit-content">
                <EditProjectParticipant
                    onAddParticipant={() => setIsParticipantModalOpen(true)}
                />
            </Overlay>

            {/* Card 3: Danger Zone */}
            {availableDeleteProject && (
                <Overlay h="fit-content">
                    <Text textStyle="label1" mb="4" color="accent.red">
                        Danger Zone
                    </Text>
                    <Divider w="auto" mx="-6" mb="4" />

                    <Text textStyle="body2" mb="4" color="text.secondary">
                        Permanently delete this project and all associated data. This action cannot
                        be undone.
                    </Text>

                    <Button
                        w="100%"
                        isLoading={deleteProject.isPending}
                        onClick={() => setDeleteConfirmationIsOpen(true)}
                        variant="primary"
                    >
                        Delete Project
                    </Button>

                    <DeleteProjectConfirmation
                        isOpen={deleteConfirmationIsOpen}
                        onClose={() => setDeleteConfirmationIsOpen(false)}
                        projectName={selectedProject?.name || ''}
                        onConfirm={() => {
                            if (!selectedProject) return;
                            deleteProject.mutate(selectedProject.id, {
                                onSuccess: () => {
                                    setDeleteConfirmationIsOpen(false);
                                    setProject(null);
                                }
                            });
                        }}
                    />
                </Overlay>
            )}

            {/* Icon Upload Modal */}
            <Modal isOpen={iconModal.isOpen} onClose={iconModal.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Project Icon</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <ImageInput {...register('icon')} />
                    </ModalBody>
                    <ModalFooter>
                        <Button w="100%" onClick={handleIconModalSave}>
                            Done
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Add Participant Modal */}
            <AddProjectParticipantModal
                isOpen={isParticipantModalOpen}
                onClose={() => setIsParticipantModalOpen(false)}
            />
        </VStack>
    );
};

export default EditProjectPage;
