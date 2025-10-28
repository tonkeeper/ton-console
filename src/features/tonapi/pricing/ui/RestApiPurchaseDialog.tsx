import { FC, useCallback } from 'react';
import { RestApiTier } from '../model';
import { useProjectId } from 'src/shared/contexts/ProjectIdContext';
import { useQueryClient } from '@tanstack/react-query';
import { useSelectRestApiTierMutation } from '../model/queries';
import PurchaseDialog from './PurchaseDialog';

const RestApiPurchaseDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedTier: RestApiTier;
}> = ({ isOpen, onClose, selectedTier: tier }) => {
    const queryClient = useQueryClient();
    const projectId = useProjectId();
    const { mutate: selectTier, isPending } = useSelectRestApiTierMutation();

    const onConfirm = useCallback(async () => {
        selectTier(tier.id, {
            onSuccess: () => {
                // Invalidate balance cache to refetch
                queryClient.invalidateQueries({
                    queryKey: ['balance', projectId]
                });
                onClose();
            }
        });
    }, [tier, queryClient, projectId, onClose, selectTier]);

    return (
        <PurchaseDialog
            isOpen={isOpen}
            onClose={onClose}
            tier={tier}
            title={`Upgrade to TON API ${tier.name} Plan`}
            isLoading={isPending}
            onConfirm={onConfirm}
        />
    );
};

RestApiPurchaseDialog.displayName = 'RestApiPurchaseDialog';

export default RestApiPurchaseDialog;
