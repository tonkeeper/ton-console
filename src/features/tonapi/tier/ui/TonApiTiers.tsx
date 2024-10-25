import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Center, Spinner, useDisclosure, Text, Flex, Button, Icon } from '@chakra-ui/react';
import TonApiPaymentDetailsModal from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { RefillModal } from 'src/entities';
import { UsdCurrencyAmount } from 'src/shared';
import { SelectTier } from './SelectTier';
import { TonApiUnlimitedTierCard } from './TonApiUnlimitedTierCard';
import { ChevronRightIcon16 } from 'src/shared/ui/icons/ChevronRightIcon16';
import TonApiPricingModal from './TonApiPricingModal';

const TonApiTiers: FC = () => {
    const storeSelectedTier = tonApiTiersStore.selectedTier$.value;
    const [tierForChange, setTierForChange] = useState<TonApiTier | undefined>();
    const [currentTier, setCurrentTier] = useState<TonApiTier | 'custom' | null>(storeSelectedTier);

    useEffect(() => {
        setCurrentTier(storeSelectedTier);

        return () => setCurrentTier(null);
    }, [storeSelectedTier]);

    const {
        isOpen: isRefillModalOpen,
        onClose: onRefillModalClose,
        onOpen: onRefillModalOpen
    } = useDisclosure();

    const {
        isOpen: isTonApiPricingModalOpen,
        onClose: onTonApiPricingModalClose,
        onOpen: onTonApiPricingModalOpen
    } = useDisclosure();

    if (
        !tonApiTiersStore.tiers$.isResolved ||
        !tonApiTiersStore.selectedTier$.isResolved ||
        !currentTier ||
        !storeSelectedTier
    ) {
        return (
            <Center h="360px">
                <Spinner />
            </Center>
        );
    }

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

    const handleSelectTier = (tier: TonApiTier | 'custom'): void => {
        if (tier === 'custom') {
            setCurrentTier('custom');
        } else if (storeSelectedTier.id === tier.id) {
            setCurrentTier(storeSelectedTier);
        } else {
            setCurrentTier(tier);
        }
    };

    const onPaymentModalClose = (): void => setTierForChange(undefined);

    const isCurrentSubscription =
        currentTier !== 'custom' && tonApiTiersStore.selectedTier$.value?.id === currentTier?.id;

    return (
        <>
            <Flex align="center" justify="space-between" mb="4">
                <Text textStyle="text.label2" mb="4" fontWeight={600}>
                    TON API
                </Text>
                <Button onClick={onTonApiPricingModalOpen} size="sm" variant="secondary">
                    Pricing
                    <Icon as={ChevronRightIcon16} w={4} h={4} ml="2" />
                </Button>
            </Flex>
            <Flex direction={{ base: 'column', lg: 'row' }} gap={6} mb="4">
                <SelectTier onSelectTier={handleSelectTier} currentTier={currentTier} />
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
            <TonApiPricingModal
                isOpen={isTonApiPricingModalOpen}
                onClose={onTonApiPricingModalClose}
            />
        </>
    );
};

export default observer(TonApiTiers);
