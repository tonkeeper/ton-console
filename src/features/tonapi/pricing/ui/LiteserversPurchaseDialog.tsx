import { FC, useCallback } from 'react';
import { DTOLiteproxyTier, UsdCurrencyAmount } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { liteproxysStore, projectsStore } from 'src/shared/stores';
import { useQueryClient } from '@tanstack/react-query';
import PurchaseDialog from './PurchaseDialog';

interface LiteserverTierWithUnspent extends DTOLiteproxyTier {
    unspentMoney?: UsdCurrencyAmount;
}

const LiteserversPurchaseDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedTier: LiteserverTierWithUnspent;
}> = observer(({ isOpen, onClose, selectedTier: tier }) => {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    const onConfirm = useCallback(async () => {
        await liteproxysStore.selectTier(tier!.id);
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
            title={`Upgrade Liteservers to ${tier.name} Plan`}
            isLoading={liteproxysStore.selectedTier$.isLoading}
            onConfirm={onConfirm}
        />
    );
});

LiteserversPurchaseDialog.displayName = 'LiteserversPurchaseDialog';

export default LiteserversPurchaseDialog;
