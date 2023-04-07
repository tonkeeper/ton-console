import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Flex, useDisclosure } from '@chakra-ui/react';
import TonApiPaymentDetailsModal from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { balanceStore, RefillModal } from 'src/entities';
import { ButtonLink, EXTERNAL_LINKS } from 'src/shared';

const TonApiTiersList: FunctionComponent = () => {
    const [selectedTier, setSelectedTier] = useState<TonApiTier | undefined>(undefined);
    const {
        isOpen: isRefillModalOpen,
        onClose: onRefillModalClose,
        onOpen: onRefillModalOpen
    } = useDisclosure();

    const tonBalance = useMemo(() => {
        return balanceStore.balances.value[0] || null;
    }, [balanceStore.balances.value]);

    const onSelectTier = useCallback(
        (tier: TonApiTier) => {
            if (!tonBalance || tier.price.isGT(tonBalance)) {
                return onRefillModalOpen();
            }

            setSelectedTier(tier);
        },
        [tonBalance]
    );

    const onPaymentModalClose = useCallback(() => {
        setSelectedTier(undefined);
    }, []);

    const currentTier = tonApiTiersStore.selectedTier.value;

    if (tonApiTiersStore.tiers.isLoading || balanceStore.balances.isLoading) {
        return null;
    }

    return (
        <>
            <Flex gap="4">
                {tonApiTiersStore.tiers.value.map(tier => {
                    const isCurrentSubscription = currentTier?.id === tier.id;

                    return (
                        <TonApiTierCard
                            key={tier.id}
                            tier={isCurrentSubscription ? currentTier! : tier}
                            flex="1"
                            button={
                                isCurrentSubscription ? (
                                    <ButtonLink
                                        w="100%"
                                        href={EXTERNAL_LINKS.SUPPORT}
                                        isExternal
                                        variant="secondary"
                                    >
                                        Cancel
                                    </ButtonLink>
                                ) : (
                                    <Button
                                        w="100%"
                                        isDisabled={
                                            !!currentTier && currentTier.price.isGT(tier.price)
                                        }
                                        onClick={() => onSelectTier(tier)}
                                        variant={tier.name === 'Pro' ? 'primary' : 'secondary'}
                                    >
                                        Choose {tier.name}
                                    </Button>
                                )
                            }
                        />
                    );
                })}
            </Flex>
            <TonApiPaymentDetailsModal
                isOpen={!!selectedTier}
                onClose={onPaymentModalClose}
                tier={selectedTier}
            />
            <RefillModal isOpen={isRefillModalOpen} onClose={onRefillModalClose} />
        </>
    );
};

export default observer(TonApiTiersList);
