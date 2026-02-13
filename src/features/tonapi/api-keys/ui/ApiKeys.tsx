import { FC } from 'react';
import { Center, Spinner, Button, useDisclosure } from '@chakra-ui/react';
import { Overlay } from 'src/shared';
import { useApiKeysQuery } from '../model';
import ApiKeysTable from './ApiKeysTable';
import { EmptyApiKeys } from './EmptyApiKeys';
import CreateApiKeyModal from './CreateApiKeyModal';

const ApiKeys: FC = () => {
    const { data: apiKeys, isLoading, error } = useApiKeysQuery();
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (isLoading) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (error) {
        return (
            <Center h="300px">
                <span>Error loading API keys</span>
            </Center>
        );
    }

    return (
        <>
            <Overlay h="fit-content">
                {!apiKeys || apiKeys.length === 0 ? (
                    <EmptyApiKeys />
                ) : (
                    <>
                        <Button mb="6" onClick={onOpen} variant="secondary">
                            Create API key
                        </Button>
                        <ApiKeysTable apiKeys={apiKeys} />
                    </>
                )}
            </Overlay>
            <CreateApiKeyModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default ApiKeys;
