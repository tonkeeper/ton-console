import { FunctionComponent } from 'react';
import { EmptyApiKeys } from './EmptyApiKeys';
import { observer } from 'mobx-react-lite';
import { apiKeysStore, ApiKeysTable, CreateApiKeyModal } from 'src/entities';
import { Overlay } from 'src/shared';
import { Button, useDisclosure } from '@chakra-ui/react';

const ApiKeysPage: FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    if (!apiKeysStore.apiKeys.length) {
        return <EmptyApiKeys />;
    }

    return (
        <>
            <Overlay h="fit-content">
                <Button mb="6" onClick={onOpen} variant="secondary">
                    Create API key
                </Button>
                <ApiKeysTable />
            </Overlay>
            <CreateApiKeyModal isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(ApiKeysPage);
