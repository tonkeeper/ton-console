import { dappUrlValidator } from '../model';
import { DAppUrlInputForm } from './DappUrlInputForm';
import { FC, useState } from 'react';
import { Divider } from '@chakra-ui/react';
import { PendingDappInfo } from './PendingDappInfo';
import { DappVerification } from './DappVerification';
import { useCreateDappMutation, useValidateDappMutation } from '../model/queries';
import { CreateDappForm, PendingDapp } from '../model/interfaces';

const DappRegistrationForm: FC = () => {
    const [pendingDapp, setPendingDapp] = useState<PendingDapp | null>(null);

    const createMutation = useCreateDappMutation();
    const validateMutation = useValidateDappMutation();

    const handleCreateDapp = async (formData: CreateDappForm) => {
        try {
            const result: PendingDapp = await createMutation.mutateAsync(formData);
            setPendingDapp(result);
        } catch {
            // Error toast is handled by mutation onError
        }
    };

    const handleValidateDapp = async () => {
        if (!pendingDapp) return;
        try {
            await validateMutation.mutateAsync(pendingDapp.token);
            setPendingDapp(null);
        } catch {
            // Error toast is handled by mutation onError
        }
    };

    const handleResetPendingDapp = () => {
        setPendingDapp(null);
    };

    if (!pendingDapp) {
        return (
            <DAppUrlInputForm
                maxW="800px"
                px="6"
                onSubmit={handleCreateDapp}
                submitButtonLoading={createMutation.isPending}
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
                pendingDapp={pendingDapp}
                onReset={handleResetPendingDapp}
            />
            <Divider mb="4" />
            <DappVerification
                maxW="850px"
                px="6"
                pendingDapp={pendingDapp}
                onSubmit={handleValidateDapp}
                submitLoading={validateMutation.isPending}
            />
        </>
    );
};

export default DappRegistrationForm;
