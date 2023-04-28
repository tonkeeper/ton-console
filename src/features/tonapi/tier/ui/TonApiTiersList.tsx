import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Center, Flex, Spinner, useDisclosure } from '@chakra-ui/react';
import TonApiPaymentDetailsModal from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { balanceStore, ratesStore, RefillModal } from 'src/entities';
import { ButtonLink, EXTERNAL_LINKS } from 'src/shared';

const TonApiTiersList: FunctionComponent = () => {
    const [selectedTier, setSelectedTier] = useState<TonApiTier | undefined>(undefined);
    const {
        isOpen: isRefillModalOpen,
        onClose: onRefillModalClose,
        onOpen: onRefillModalOpen
    } = useDisclosure();

    const tonBalance = useMemo(() => {
        return balanceStore.balances[0] || null;
    }, [balanceStore.balances]);

    const tonRate = ratesStore.rates$.TON.value;
    const tonRateResolved = ratesStore.rates$.TON.isResolved;

    const onSelectTier = useCallback(
        (tier: TonApiTier) => {
            if (
                tonBalance &&
                tonRateResolved &&
                tier.price.amount.gt(tonBalance.amount.multipliedBy(tonRate))
            ) {
                return onRefillModalOpen();
            }

            setSelectedTier(tier);
        },
        [tonBalance, tonRate, tonRateResolved]
    );

    const onPaymentModalClose = useCallback(() => {
        setSelectedTier(undefined);
    }, []);

    if (!tonApiTiersStore.tiers$.isResolved || !tonApiTiersStore.selectedTier$.isResolved) {
        return (
            <Center h="360px">
                <Spinner />
            </Center>
        );
    }

    const currentTier = tonApiTiersStore.selectedTier$.value;

    return (
        <>
            <Flex gap="4">
                {tonApiTiersStore.tiers$.value.map(tier => {
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
                                        isDisabled={currentTier?.price.amount.isZero()}
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
