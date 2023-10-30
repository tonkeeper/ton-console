import { FunctionComponent } from 'react';
import { Button, Center, Flex, Text, useBoolean } from '@chakra-ui/react';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { CreateProjectForm, projectsStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const CreateFirstProjectPage: FunctionComponent = () => {
    const [clicked, setClicked] = useBoolean();
    const formId = 'create-first-project-form';

    return (
        <Overlay>
            <Center h="100%">
                <Flex align="center" direction="column" w="100%" maxW="512px">
                    {clicked ? (
                        <>
                            <CreateProjectForm
                                id={formId}
                                mb="2"
                                onSubmit={form => projectsStore.createProject(form)}
                            />
                            <Text
                                textStyle="body3"
                                alignSelf="flex-start"
                                mb="4"
                                color="text.secondary"
                            >
                                You can always change icon in the project settings.
                            </Text>
                            <Button
                                w="100%"
                                form={formId}
                                isLoading={projectsStore.createProject.isLoading}
                                type="submit"
                            >
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

export default observer(CreateFirstProjectPage);
