import { FunctionComponent } from 'react';
import { Button, Center, Text, VStack } from '@chakra-ui/react';
import { CreateIcon96, H4 } from 'src/shared';
import { CreateProjectForm } from 'src/features';

export const CreateProjectPage: FunctionComponent = () => {
    return <CreateProjectForm />;
    return (
        <Center h="100%">
            <VStack maxW="560px">
                <CreateIcon96 mb="6" />
                <H4 mb="2">Create a Project</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    Use all tools for TON developers inside your project.
                </Text>
                <Button>Create</Button>
            </VStack>
        </Center>
    );
};
