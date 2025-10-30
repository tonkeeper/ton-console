import { FC } from 'react';
import { Button, Center, Flex, Text, useBoolean } from '@chakra-ui/react';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { ProjectForm } from 'src/entities';
import { useCreateProjectMutation } from 'src/shared/queries/projects';
import { useSetProject } from 'src/shared/contexts/ProjectContext';

const CreateFirstProjectPage: FC = () => {
    const [clicked, setClicked] = useBoolean();
    const { mutate: createProject, isPending } = useCreateProjectMutation();
    const selectProject = useSetProject();
    const formId = 'create-first-project-form';

    return (
        <Overlay>
            <Center h="100%">
                <Flex align="center" direction="column" w="100%" maxW="512px">
                    {clicked ? (
                        <>
                            <ProjectForm
                                id={formId}
                                mb="2"
                                onSubmit={form =>
                                    createProject(form, {
                                        onSuccess: newProject => selectProject(newProject.id)
                                    })
                                }
                            />
                            <Text
                                textStyle="body3"
                                alignSelf="flex-start"
                                mb="4"
                                color="text.secondary"
                            >
                                You can always change icon in the project settings.
                            </Text>
                            <Button w="100%" form={formId} isLoading={isPending} type="submit">
                                Create
                            </Button>
                        </>
                    ) : (
                        <>
                            <CreateIcon96 mb="6" />
                            <H4 mb="2">Create a Project</H4>
                            <Text textStyle="body2" mb="6" color="text.secondary">
                                Use all tools for TON developers inside your project.
                            </Text>
                            <Button onClick={setClicked.on}>Create</Button>
                        </>
                    )}
                </Flex>
            </Center>
        </Overlay>
    );
};

export default CreateFirstProjectPage;
