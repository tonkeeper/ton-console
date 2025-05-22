import { FunctionComponent } from 'react';
import { EmptyApiKeys } from './EmptyApiKeys';
import { observer } from 'mobx-react-lite';
import { ApiKeysTable, CreateApiKeyModal } from 'src/features';
import { Overlay } from 'src/shared';
import { Button, Center, Spinner, useDisclosure } from '@chakra-ui/react';
import { SelectPlanFirstly } from 'src/pages/tonapi/api-keys/SelectPlanFirstly';
import { tonApiTiersStore, apiKeysStore } from 'src/shared/stores';

const ApiKeysPage: FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (!tonApiTiersStore.selectedTier$.isResolved || !apiKeysStore.apiKeys$.isResolved) {
        return (
            <Center h="300px">
                <Spinner />
            </Center>
        );
    }

    if (!tonApiTiersStore.selectedTier$.value) {
        return <SelectPlanFirstly />;
    }

    if (!apiKeysStore.apiKeys$.value.length) {
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
