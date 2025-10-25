import { FC } from 'react';
import { EmptyApiKeys } from './EmptyApiKeys';
import { observer } from 'mobx-react-lite';
import { ApiKeysTable, CreateApiKeyModal } from 'src/features';
import { ApiKeysStore } from 'src/features/tonapi/api-keys/model';
import { Overlay, useLocalObservableWithDestroy } from 'src/shared';
import { Button, Center, Spinner, useDisclosure } from '@chakra-ui/react';
import { SelectPlanFirstly } from 'src/pages/tonapi/api-keys/SelectPlanFirstly';
import { projectsStore, restApiTiersStore } from 'src/shared/stores';

const ApiKeysPage: FC = () => {
    const apiKeysStore = useLocalObservableWithDestroy(() => new ApiKeysStore(projectsStore));
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!restApiTiersStore.selectedTier$.isResolved || !apiKeysStore.apiKeys$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (!restApiTiersStore.selectedTier$.value) {
        return <SelectPlanFirstly />;
    }

    if (!apiKeysStore.apiKeys$.value.length) {
        return <EmptyApiKeys apiKeysStore={apiKeysStore} />;
    }

    return (
        <>
            <Overlay h="fit-content">
                <Button mb="6" onClick={onOpen} variant="secondary">
                    Create API key
                </Button>
                <ApiKeysTable apiKeysStore={apiKeysStore} />
            </Overlay>
            <CreateApiKeyModal apiKeysStore={apiKeysStore} isOpen={isOpen} onClose={onClose} />
        </>
    );
};

export default observer(ApiKeysPage);
