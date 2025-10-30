import { FC, useCallback } from 'react';
import { DTOLiteproxyTier, UsdCurrencyAmount } from 'src/shared';
import { useSelectLiteproxyTierMutation } from 'src/features/tonapi/liteproxy/model/queries';
import { useProjectId } from 'src/shared/contexts/ProjectContext';
import { useQueryClient } from '@tanstack/react-query';
import PurchaseDialog from './PurchaseDialog';

interface LiteserverTierWithUnspent extends DTOLiteproxyTier {
    unspentMoney?: UsdCurrencyAmount;
}

const LiteserversPurchaseDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedTier: LiteserverTierWithUnspent;
}> = ({ isOpen, onClose, selectedTier: tier }) => {
    const projectId = useProjectId();
    const queryClient = useQueryClient();
    const { mutateAsync: selectTier, isPending } = useSelectLiteproxyTierMutation();

    const onConfirm = useCallback(async () => {
        await selectTier(tier!.id);
        // Invalidate balance cache to refetch
        queryClient.invalidateQueries({
            queryKey: ['balance', projectId]
        });
        onClose();
    }, [tier, queryClient, projectId, onClose, selectTier]);

    return (
        <PurchaseDialog
            isOpen={isOpen}
            onClose={onClose}
            tier={tier}
            title={`Upgrade Liteservers to ${tier.name} Plan`}
            isLoading={isPending}
            onConfirm={onConfirm}
        />
    );
};

LiteserversPurchaseDialog.displayName = 'LiteserversPurchaseDialog';

export default LiteserversPurchaseDialog;
