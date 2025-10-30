import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Center, Flex, Text } from '@chakra-ui/react';
import { DeleteProjectConfirmation, ProjectForm, ProjectFormValues } from 'src/entities';
import { FormProvider, useForm } from 'react-hook-form';
import { CopyPad, H4, Overlay } from 'src/shared';
import { useProject, useProjectId, useSetProject } from 'src/shared/contexts/ProjectContext';
import {
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useProjectParticipantsQuery
} from 'src/shared/queries/projects';
import { useUserQuery } from 'src/entities/user/queries';

const availableDeleteProject = import.meta.env.VITE_AVAILABLE_DELETE_PROJECT === 'true';

const EditProjectPage: FC = () => {
    const formId = 'edit-project-form';
    const selectedProject = useProject();
    const projectId = useProjectId();
    const setProject = useSetProject();

    const updateProject = useUpdateProjectMutation();
    const deleteProject = useDeleteProjectMutation();

    // Fetch participants (just to load them, they're used by EditProjectParticipan component)
    const { data: user } = useUserQuery();
    useProjectParticipantsQuery(projectId, user?.id);

    const methods = useForm();
    const [deleteConfirmationIsOpen, setDeleteConfirmationIsOpen] = useState(false);
    const { formState } = methods;

    const defaultValues = useMemo(() => selectedProject || undefined, [selectedProject]);

    const onSubmit = useCallback(
        (values: ProjectFormValues) => {
            if (!selectedProject) {
                return;
            }

            const modifiedFields = Object.fromEntries(
                Object.keys(formState.dirtyFields).map(key => [
                    key,
                    values[key as keyof ProjectFormValues]
                ])
            );

            updateProject.mutate({
                projectId: selectedProject.id,
                ...modifiedFields
            });
        },
        [formState.dirtyFields, selectedProject, updateProject]
    );

    return (
        <Overlay>
            <H4>Edit project</H4>
            <Center h="100%">
                <Flex align="center" direction="column" w="100%" maxW="512px">
                    <Text textStyle="label2" alignSelf="flex-start" mb="1">
                        Project ID
                    </Text>
                    <CopyPad
                        alignSelf="flex-start"
                        mb="4"
                        variant="flat"
                        size="sm"
                        pr="1"
                        textStyles={{ textStyle: 'label1' }}
                        text={selectedProject.id.toString() || ''}
                    />

                    <FormProvider {...methods}>
                        <ProjectForm
                            defaultValues={defaultValues}
                            id={formId}
                            mb="4"
                            onSubmit={onSubmit}
                            disableDefaultFocus
                        />
                    </FormProvider>
                    <Button
                        w="100%"
                        mb="4"
                        form={formId}
                        isDisabled={!formState?.isDirty || deleteProject.isPending}
                        isLoading={updateProject.isPending}
                        type="submit"
                    >
                        Save
                    </Button>

                    {availableDeleteProject && (
                        <>
                            <Button
                                w="100%"
                                colorScheme="red"
                                isLoading={deleteProject.isPending}
                                onClick={() => setDeleteConfirmationIsOpen(true)}
                            >
                                Delete project
                            </Button>
                            <DeleteProjectConfirmation
                                isOpen={deleteConfirmationIsOpen}
                                onClose={() => setDeleteConfirmationIsOpen(false)}
                                projectName={selectedProject.name}
                                onConfirm={() => {
                                    deleteProject.mutate(selectedProject.id, {
                                        onSuccess: () => {
                                            setDeleteConfirmationIsOpen(false);
                                            // Select first available project after deletion
                                            setProject(null);
                                        }
                                    });
                                }}
                            />
                        </>
                    )}
                </Flex>
            </Center>
        </Overlay>
    );
};

export default EditProjectPage;
