import { FunctionComponent } from 'react';
import { CreateProjectForm } from 'src/features';
import { Button, Center, Flex, Text, useBoolean } from '@chakra-ui/react';
import { CreateIcon96, H4 } from 'src/shared';

const CreateFirstProjectPage: FunctionComponent = () => {
    const [clicked, setClicked] = useBoolean();

    const formId = 'create-first-project-form';

    return (
        <Center h="100%">
            <Flex align="center" direction="column" w="100%" maxW="512px">
                {clicked ? (
                    <>
                        <CreateProjectForm id={formId} mb="2" onSubmit={console.log} />
                        <Text
                            textStyle="body3"
                            alignSelf="flex-start"
                            mb="4"
                            color="text.secondary"
                        >
                            You can always change icon in the project settings.
                        </Text>
                        <Button w="100%" form={formId} type="submit">
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

export default CreateFirstProjectPage;
