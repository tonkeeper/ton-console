import { FunctionComponent, useEffect } from 'react';
import { Button, Center, Flex, Text, useBoolean, useToast } from '@chakra-ui/react';
import { CreateIcon96, H4 } from 'src/shared';
import { CreateProjectForm, projectsStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const CreateFirstProjectPage: FunctionComponent = () => {
    const [clicked, setClicked] = useBoolean();
    const toast = useToast();

    useEffect(() => {
        if (projectsStore.createProject.error) {
            toast({
                title: "Project wasn't created",
                description: 'Unknown api error happened. Try again later',
                status: 'error',
                isClosable: true
            });
        }
    }, [toast, projectsStore.createProject.error]);

    const formId = 'create-first-project-form';

    return (
        <Center h="100%">
            <Flex align="center" direction="column" w="100%" maxW="512px">
                {clicked ? (
                    <>
                        <CreateProjectForm
                            id={formId}
                            mb="2"
                            onSubmit={projectsStore.createProject}
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
    );
};

export default observer(CreateFirstProjectPage);
