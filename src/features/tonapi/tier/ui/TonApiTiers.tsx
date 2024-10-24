import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Center, Spinner, useDisclosure, Text, Flex } from '@chakra-ui/react';
import TonApiPaymentDetailsModal from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { RefillModal } from 'src/entities';
import { UsdCurrencyAmount } from 'src/shared';
import { SelectTier } from './SelectTier';
import { TonApiUnlimitedTierCard } from './TonApiUnlimitedTierCard';

const TonApiTiers: FC = () => {
    const [tierForChange, setTierForChange] = useState<TonApiTier | undefined>();
    const [currentTier, setCurrentTier] = useState<TonApiTier | 'custom' | undefined>(
        tonApiTiersStore.selectedTier$.value ?? undefined
    );

    const {
        isOpen: isRefillModalOpen,
        onClose: onRefillModalClose,
        onOpen: onRefillModalOpen
    } = useDisclosure();

    const onChoseTier = async (tier: TonApiTier): Promise<void> => {
        const { valid, unspent_money } = await tonApiTiersStore.checkValidChangeTier(tier.id);

        if (!valid) {
            onRefillModalOpen();
            return;
        }
        const unspentMoney = unspent_money ? new UsdCurrencyAmount(unspent_money) : undefined;

        setTierForChange({
            ...tier,
            unspentMoney
        });
    };

    const onPaymentModalClose = (): void => setTierForChange(undefined);

    if (!tonApiTiersStore.tiers$.isResolved || !tonApiTiersStore.selectedTier$.isResolved) {
        return (
            <Center h="360px">
                <Spinner />
            </Center>
        );
    }

    if (!currentTier) {
        return (
            <Center h="360px">
                <Spinner />
            </Center>
        );
    }

    const isCurrentSubscription =
        currentTier !== 'custom' && tonApiTiersStore.selectedTier$.value?.id === currentTier?.id;

    return (
        <>
            <Text textStyle="text.label2" mb="4" fontWeight={600}>
                TON API
            </Text>
            <Flex direction={{ base: 'column', lg: 'row' }} gap={6} mb="4">
                <SelectTier onSelectTier={setCurrentTier} currentTier={currentTier} />
                {currentTier === 'custom' ? (
                    <TonApiUnlimitedTierCard w="100%" maxW="497px" />
                ) : (
                    <TonApiTierCard
                        h="100%"
                        tier={currentTier}
                        onChoseTier={onChoseTier}
                        isChosen={isCurrentSubscription}
                    />
                )}
            </Flex>
            {tierForChange && (
                <TonApiPaymentDetailsModal
                    isOpen={!!tierForChange}
                    onClose={onPaymentModalClose}
                    tier={tierForChange}
                />
            )}
            <RefillModal isOpen={isRefillModalOpen} onClose={onRefillModalClose} />
        </>
    );
};

export default observer(TonApiTiers);
