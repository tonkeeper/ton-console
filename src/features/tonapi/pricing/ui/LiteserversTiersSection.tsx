import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Text, Grid, Link, Flex, useDisclosure } from '@chakra-ui/react';
import { SimpleTierCard } from './SimpleTierCard';
import { liteproxysStore } from 'src/shared/stores';
import { DTOLiteproxyTier, UsdCurrencyAmount } from 'src/shared';
import LiteserversPurchaseDialog from './LiteserversPurchaseDialog';
import { RefillModal } from 'src/entities';
import { openFeedbackModal } from 'src/features/feedback/model/feedback';

export const LiteserversTiersSection: FC = observer(() => {
    const [selectedLiteserverTier, setSelectedLiteserverTier] = useState<DTOLiteproxyTier | null>(
        null
    );

    const {
        isOpen: isLiteserversPurchaseDialogOpen,
        onOpen: onLiteserversPurchaseDialogOpen,
        onClose: onLiteserversPurchaseDialogClose
    } = useDisclosure();

    const {
        isOpen: isRefillModalOpen,
        onOpen: onRefillModalOpen,
        onClose: onRefillModalClose
    } = useDisclosure();

    const handleSelectLiteserverTier = async (tier: DTOLiteproxyTier) => {
        const selectedLiteserverDetail = liteproxysStore?.selectedTier$.value;

        const isCurrentSubscription = selectedLiteserverDetail?.id === tier.id;

        if (!isCurrentSubscription) {
            const { valid } = await liteproxysStore.checkValidChangeTier(tier.id);

            if (!valid) {
                onRefillModalOpen();
                return;
            }

            setSelectedLiteserverTier(tier);
            onLiteserversPurchaseDialogOpen();
        }
    };

    if (!liteproxysStore?.liteproxyTiers$.isResolved) {
        return null;
    }

    const liteserverTiers = liteproxysStore.liteproxyTiers$.value;
    const currentLiteserverTier = liteproxysStore.selectedTier$.value;

    return (
        <>
            <Box mb="8">
                <Flex align="baseline" direction="column" gap="2" mb="4">
                    <Text textStyle="h4" fontWeight={600}>
                        Liteservers
                    </Text>
                    <Text textStyle="body2" color="text.secondary">
                        Direct access to TON blockchain via Liteserver protocol.{' '}
                        <Link
                            color="accent.blue"
                            href="https://docs.tonconsole.com/tonapi/liteservers"
                            isExternal
                        >
                            Learn more about Liteservers
                        </Link>
                    </Text>
                </Flex>

                <Grid gap="4" templateColumns="repeat(auto-fit, minmax(290px, 1fr))">
                    {liteserverTiers?.map(tier => {
                        const price = new UsdCurrencyAmount(tier.usd_price);
                        const isCurrent = currentLiteserverTier?.id === tier.id;
                        const isFree = price.amount.eq(0);

                        return (
                            <SimpleTierCard
                                key={tier.id}
                                name={tier.name}
                                price={isFree ? '$0' : price.stringCurrencyAmount}
                                rps={tier.rps}
                                priceDescription="Monthly"
                                isCurrent={isCurrent}
                                onSelect={
                                    !isCurrent ? () => handleSelectLiteserverTier(tier) : undefined
                                }
                            />
                        );
                    })}

                    <SimpleTierCard
                        name="Custom"
                        price="Custom"
                        rps="∞"
                        priceDescription="Contact us"
                        onSelect={openFeedbackModal('unlimited-liteservers')}
                        buttonText="Make request"
                        buttonVariant="contrast"
                    />
                </Grid>
            </Box>

            {/* Modals */}
            {selectedLiteserverTier && (
                <LiteserversPurchaseDialog
                    isOpen={isLiteserversPurchaseDialogOpen}
                    onClose={onLiteserversPurchaseDialogClose}
                    selectedTier={selectedLiteserverTier}
                />
            )}

            <RefillModal isOpen={isRefillModalOpen} onClose={onRefillModalClose} />
        </>
    );
});
