import { FunctionComponent } from 'react';
import { EmptyApiKeys } from './EmptyApiKeys';
import { observer } from 'mobx-react-lite';
import { apiKeysStore, ApiKeysTable, CreateApiKeyModal, tonApiTiersStore } from 'src/features';
import { Overlay } from 'src/shared';
import { Button, useDisclosure } from '@chakra-ui/react';
import { SelectPlanFirstly } from 'src/pages/tonapi/api-keys/SelectPlanFirstly';

const ApiKeysPage: FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    if (tonApiTiersStore.selectedTier.isLoading) {
        return <>Loading ...</>;
    }

    if (!tonApiTiersStore.selectedTier.value) {
        return <SelectPlanFirstly />;
    }

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
