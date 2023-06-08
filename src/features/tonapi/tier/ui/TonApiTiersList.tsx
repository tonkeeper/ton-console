import { FunctionComponent, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Center, Grid, GridItem, Spinner, useDisclosure } from '@chakra-ui/react';
import TonApiPaymentDetailsModal from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { RefillModal } from 'src/entities';
import { ButtonLink, EXTERNAL_LINKS } from 'src/shared';

const TonApiTiersList: FunctionComponent = () => {
    const [selectedTier, setSelectedTier] = useState<TonApiTier | undefined>();
    const [canBuyTierLoading, _setCanBuyTierLoading] = useState<number | undefined>();
    const currentLoadingCanBuyTierId = useRef<number | undefined>();

    const setCanBuyTierLoading = (id: number | undefined): void => {
        _setCanBuyTierLoading(id);
        currentLoadingCanBuyTierId.current = id;
    };

    const {
        isOpen: isRefillModalOpen,
        onClose: onRefillModalClose,
        onOpen: onRefillModalOpen
    } = useDisclosure();

    const onSelectTier = async (tier: TonApiTier): Promise<void> => {
        setCanBuyTierLoading(tier.id);
        const canBuy = await tonApiTiersStore.checkCanBuyTier(tier.id);

        if (currentLoadingCanBuyTierId.current !== tier.id) {
            return;
        }

        // wrapped to setTimeout to fix modal and button visual intersection during modal open animation
        setTimeout(() => setCanBuyTierLoading(undefined), 200);

        if (canBuy) {
            setSelectedTier(tier);
        } else {
            onRefillModalOpen();
        }
    };

    const onPaymentModalClose = (): void => setSelectedTier(undefined);

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
            <Grid gap="4" templateColumns="repeat(auto-fit, minmax(250px, 1fr))">
                {tonApiTiersStore.tiers$.value.map(tier => {
                    const isCurrentSubscription = currentTier?.id === tier.id;

                    return (
                        <GridItem key={tier.id}>
                            <TonApiTierCard
                                h="100%"
                                tier={isCurrentSubscription ? currentTier! : tier}
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
                                            isLoading={canBuyTierLoading === tier.id}
                                            onClick={() => onSelectTier(tier)}
                                            variant={tier.name === 'Pro' ? 'primary' : 'secondary'}
                                        >
                                            Choose {tier.name}
                                        </Button>
                                    )
                                }
                            />
                        </GridItem>
                    );
                })}
            </Grid>
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
