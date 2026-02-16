import { FC } from 'react';
import { CreateIcon96, H4 } from 'src/shared';
import { Button, Flex, Text, useDisclosure, Center } from '@chakra-ui/react';
import { CreateApiKeyModal } from '../index';

export const EmptyApiKeys: FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <>
            <Center>
                <Flex align="center" direction="column" maxW="512px">
                    <CreateIcon96 mb="8" />
                    <H4 mb="2">Your API keys will be shown here</H4>
                    <Text textStyle="body2" mb="6" color="text.secondary">
                        Create your first API key
                    </Text>
                    <Button onClick={onOpen}>Create API key</Button>
                </Flex>
            </Center>
            <CreateApiKeyModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};
