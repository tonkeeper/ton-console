import { FunctionComponent, useCallback, useEffect, useMemo } from 'react';
import { Button, Center, Flex, Text } from '@chakra-ui/react';
import { ProjectForm, ProjectFormValues, projectsStore } from 'src/entities';
import { FormProvider, useForm } from 'react-hook-form';
import { toJS } from 'mobx';
import { CopyPad, H4, Overlay } from 'src/shared';
import { observer } from 'mobx-react-lite';

const EditProjectPage: FunctionComponent = () => {
    const formId = 'edit-project-form';

    const methods = useForm();
    const { formState } = methods;

    const defaultValues = useMemo(
        () => toJS(projectsStore.selectedProject) || undefined,
        [projectsStore.selectedProject]
    );

    if (projectsStore.selectedProject === null) {
        throw new Error('Selected project is not defined');
    }

    useEffect(() => {
        projectsStore.fetchProjectParticipants();
        return () => {
            projectsStore.projectParticipants$.clear();
        };
    });

    const onSubmit = useCallback(
        (values: ProjectFormValues) => {
            if (!projectsStore.selectedProject) {
                return;
            }

            const modifiedFields = Object.fromEntries(
                Object.keys(formState.dirtyFields).map(key => [
                    key,
                    values[key as keyof ProjectFormValues]
                ])
            );

            projectsStore.updateProject({
                projectId: projectsStore.selectedProject.id,
                ...modifiedFields
            });
        },
        [formState.dirtyFields, projectsStore.selectedProject]
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
                        text={projectsStore.selectedProject.id.toString() || ''}
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
                        isDisabled={!formState?.isDirty || projectsStore.deleteProject.isLoading}
                        isLoading={projectsStore.createProject.isLoading}
                        type="submit"
                    >
                        Save
                    </Button>
                </Flex>
            </Center>
        </Overlay>
    );
};

export default observer(EditProjectPage);
