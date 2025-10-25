import { FC } from 'react';
import { CreateIcon96, H4, Overlay } from 'src/shared';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { CreateApiKeyModal } from 'src/features';
import { ApiKeysStore } from 'src/features/tonapi/api-keys/model';

interface EmptyApiKeysProps {
    apiKeysStore: ApiKeysStore;
}

export const EmptyApiKeys: FC<EmptyApiKeysProps> = ({ apiKeysStore }) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    return (
        <Overlay display="flex" alignItems="center" justifyContent="center">
            <Flex align="center" direction="column" maxW="512px">
                <CreateIcon96 mb="8" />
                <H4 mb="2">Your API keys will be shown here</H4>
                <Text textStyle="body2" mb="6" color="text.secondary">
                    Create your first API key
                </Text>
                <Button onClick={onOpen}>Create API key</Button>
            </Flex>
            <CreateApiKeyModal apiKeysStore={apiKeysStore} isOpen={isOpen} onClose={onClose} />
        </Overlay>
    );
};
