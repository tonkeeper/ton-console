import { FunctionComponent, useCallback, useMemo } from 'react';
import { Button, Center, Flex } from '@chakra-ui/react';
import { CreateProjectForm, CreateProjectFormValues, projectsStore } from 'src/entities';
import { FormProvider, useForm } from 'react-hook-form';
import { toJS } from 'mobx';
import { H4, Overlay } from 'src/shared';
import { observer } from 'mobx-react-lite';

const EditProjectPage: FunctionComponent = () => {
    const formId = 'edit-project-form';

    const methods = useForm();
    const { formState } = methods;

    const defaultValues = useMemo(
        () => toJS(projectsStore.selectedProject) || undefined,
        [projectsStore.selectedProject]
    );

    const onSubmit = useCallback(
        (values: CreateProjectFormValues) => {
            const modifiedFields = Object.fromEntries(
                Object.keys(formState.dirtyFields).map(key => [
                    key,
                    values[key as keyof CreateProjectFormValues]
                ])
            );

            projectsStore.updateProject({
                projectId: projectsStore.selectedProject!.id,
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
                    <FormProvider {...methods}>
                        <CreateProjectForm
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
