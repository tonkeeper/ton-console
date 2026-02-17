import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
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
    Text,
    useClipboard,
    VStack
} from '@chakra-ui/react';
import { DeleteProjectConfirmation, EditProjectParticipant } from 'src/entities';
import { useForm } from 'react-hook-form';
import { CloseIcon24, CopyIcon16, EditIcon24, H4, Overlay } from 'src/shared';
import { UpdateProjectFormValues } from 'src/entities/project/model/interfaces/update-project-form-values';
import { useProject, useSetProject } from 'src/shared/contexts/ProjectContext';
import {
    useUpdateProjectMutation,
    useDeleteProjectMutation
} from 'src/shared/queries/projects';
import AddProjectParticipantModal from 'src/entities/project/ui/AddProjectParticipantModal';

const availableDeleteProject = import.meta.env.VITE_AVAILABLE_DELETE_PROJECT === 'true';

interface EditProjectFormValues {
    name: string;
}

const EditProjectPage: FC = () => {
    const selectedProject = useProject();
    const setProject = useSetProject();

    const updateProject = useUpdateProjectMutation();
    const deleteProject = useDeleteProjectMutation();

    const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false);
    const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);

    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconRemoved, setIconRemoved] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, formState, reset } =
        useForm<EditProjectFormValues>({
            defaultValues: {
                name: ''
            }
        });

    const iconPreviewUrl = useMemo(() => {
        if (iconRemoved) return null;
        if (iconFile) return URL.createObjectURL(iconFile);
        return selectedProject.imgUrl ?? null;
    }, [iconRemoved, iconFile, selectedProject.imgUrl]);

    useEffect(() => {
        return () => {
            if (iconPreviewUrl && iconPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(iconPreviewUrl);
            }
        };
    }, [iconPreviewUrl]);

    useEffect(() => {
        reset({ name: selectedProject.name || '' });
        setIconFile(null);
        setIconRemoved(false);
    }, [selectedProject, reset]);

    const hasIconChange = iconFile !== null || iconRemoved;
    const isFormDirty = formState.isDirty || hasIconChange;

    const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIconFile(file);
            setIconRemoved(false);
        }
        e.target.value = '';
    }, []);

    const handleRemoveIcon = useCallback(() => {
        setIconFile(null);
        setIconRemoved(true);
    }, []);

    const onSubmit = useCallback(
        (values: EditProjectFormValues) => {
            let hasChanges = false;
            const updateData: UpdateProjectFormValues = {
                projectId: selectedProject.id
            };

            if (formState.dirtyFields.name) {
                updateData.name = values.name;
                hasChanges = true;
            }

            if (iconFile) {
                updateData.icon = iconFile;
                hasChanges = true;
            } else if (iconRemoved) {
                // Explicit undefined so that 'icon' in updateData === true,
                // which triggers remove_image in the mutation
                updateData.icon = undefined;
                hasChanges = true;
            }

            if (!hasChanges) return;

            updateProject.mutate(updateData, {
                onSuccess: () => {
                    setIconFile(null);
                    setIconRemoved(false);
                }
            });
        },
        [formState.dirtyFields, selectedProject, updateProject, iconFile, iconRemoved]
    );

    const projectIdString = selectedProject.id.toString();
    const { onCopy, hasCopied } = useClipboard(projectIdString);

    const showRemoveIcon = !iconRemoved && (iconFile !== null || !!selectedProject.imgUrl);

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
                        direction={{ base: 'column', md: 'row' }}
                        gap="5"
                    >
                        {/* Icon (clickable) + corner remove badge */}
                        <Box pos="relative" w="fit-content">
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
                                onClick={() => fileInputRef.current?.click()}
                                type="button"
                            >
                                {iconPreviewUrl ? (
                                    <Image
                                        w="100%"
                                        h="100%"
                                        objectFit="cover"
                                        alt={selectedProject.name || 'Project icon'}
                                        src={iconPreviewUrl}
                                    />
                                ) : (
                                    <Text
                                        color="text.primary"
                                        fontSize="xl"
                                        fontWeight="medium"
                                    >
                                        {selectedProject.name[0] || 'P'}
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

                            {showRemoveIcon && (
                                <IconButton
                                    pos="absolute"
                                    zIndex={1}
                                    top="-6px"
                                    right="-6px"
                                    alignItems="center"
                                    justifyContent="center"
                                    display="flex"
                                    w="20px"
                                    minW="20px"
                                    h="20px"
                                    bg="gray.600"
                                    borderRadius="full"
                                    _hover={{
                                        bg: 'red.500',
                                        transform: 'scale(1.1)'
                                    }}
                                    transition="all 0.15s"
                                    aria-label="Remove icon"
                                    icon={
                                        <CloseIcon24
                                            w="10px"
                                            h="10px"
                                            color="white"
                                        />
                                    }
                                    onClick={handleRemoveIcon}
                                    size="xs"
                                    variant="unstyled"
                                />
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileSelect}
                            />
                        </Box>

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
                        isDisabled={!isFormDirty || deleteProject.isPending}
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
                        projectName={selectedProject.name}
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

            {/* Add Participant Modal */}
            <AddProjectParticipantModal
                isOpen={isParticipantModalOpen}
                onClose={() => setIsParticipantModalOpen(false)}
            />
        </VStack>
    );
};

export default EditProjectPage;
