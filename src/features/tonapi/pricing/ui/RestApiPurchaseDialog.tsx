import { FC, useCallback } from 'react';
import { RestApiTier } from '../model';
import { observer } from 'mobx-react-lite';
import { projectsStore, restApiTiersStore } from 'src/shared/stores';
import { useQueryClient } from '@tanstack/react-query';
import PurchaseDialog from './PurchaseDialog';

const RestApiPurchaseDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedTier: RestApiTier;
}> = observer(({ isOpen, onClose, selectedTier: tier }) => {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    const onConfirm = useCallback(async () => {
        await restApiTiersStore.selectTier(tier!.id);
        // Invalidate balance cache to refetch
        queryClient.invalidateQueries({
            queryKey: ['balance', projectId]
        });
        onClose();
    }, [tier, queryClient, projectId, onClose]);

    return (
        <PurchaseDialog
            isOpen={isOpen}
            onClose={onClose}
            tier={tier}
            title={`Upgrade to TON API ${tier.name} Plan`}
            isLoading={restApiTiersStore.selectTier.isLoading}
            onConfirm={onConfirm}
        />
    );
});

RestApiPurchaseDialog.displayName = 'RestApiPurchaseDialog';

export default RestApiPurchaseDialog;
