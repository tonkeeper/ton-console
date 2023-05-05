import { observer } from 'mobx-react-lite';
import { dappStore, dappUrlValidator } from '../model';
import { DAppUrlInputForm } from './DappUrlInputForm';
import { FunctionComponent } from 'react';
import { Divider } from '@chakra-ui/react';
import { PendingDappInfo } from './PendingDappInfo';
import { DappVerification } from './DappVerification';

const DappRegistrationForm: FunctionComponent = () => {
    if (!dappStore.pendingDapp) {
        return (
            <DAppUrlInputForm
                maxW="800px"
                px="6"
                onSubmit={dappStore.createDapp}
                submitButtonLoading={dappStore.createDapp.isLoading}
                validator={dappUrlValidator}
            />
        );
    }

    return (
        <>
            <PendingDappInfo
                maxW="800px"
                px="6"
                mb="5"
                pendingDapp={dappStore.pendingDapp}
                onReset={dappStore.clearPendingDapp}
            />
            <Divider mb="4" />
            <DappVerification
                maxW="850px"
                px="6"
                pendingDapp={dappStore.pendingDapp}
                onSubmit={dappStore.validatePendingDapp}
                submitLoading={dappStore.validatePendingDapp.isLoading}
            />
        </>
    );
};

export default observer(DappRegistrationForm);
