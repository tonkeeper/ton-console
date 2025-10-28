import { FC, useState } from 'react';
import { Box, Text, Grid, Link, Flex, useDisclosure, Spinner, Center } from '@chakra-ui/react';
import { SimpleTierCard } from './SimpleTierCard';
import {
    useLiteproxyTiers,
    useSelectedLiteproxyTier,
    useCheckValidChangeLiteproxyTierMutation
} from 'src/features/tonapi/liteproxy/model/queries';
import { DTOLiteproxyTier, UsdCurrencyAmount } from 'src/shared';
import LiteserversPurchaseDialog from './LiteserversPurchaseDialog';
import { RefillModal } from 'src/entities';
import { openFeedbackModal } from 'src/features/feedback/model/feedback';

interface LiteserverTierWithUnspent extends DTOLiteproxyTier {
    unspentMoney?: UsdCurrencyAmount;
}

export const LiteserversTiersSection: FC = () => {
    const [selectedLiteserverTier, setSelectedLiteserverTier] =
        useState<LiteserverTierWithUnspent | null>(null);

    const { data: liteserverTiers, isLoading: isLiteserversLoading } = useLiteproxyTiers();
    const { data: currentLiteserverTier } = useSelectedLiteproxyTier();
    const { mutateAsync: checkValidChangeTier } = useCheckValidChangeLiteproxyTierMutation();

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
        const isCurrentSubscription = currentLiteserverTier?.id === tier.id;

        if (isCurrentSubscription) return;

        const { valid, unspent_money } = await checkValidChangeTier(tier.id);

        if (!valid) {
            onRefillModalOpen();
            return;
        }

        const unspentMoney = unspent_money ? new UsdCurrencyAmount(unspent_money) : undefined;

        setSelectedLiteserverTier({
            ...tier,
            unspentMoney
        });
        onLiteserversPurchaseDialogOpen();
    };

    if (isLiteserversLoading || !liteserverTiers) {
        return (
            <Center py="8">
                <Spinner />
            </Center>
        );
    }

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

                <Grid gap="4" templateColumns="repeat(auto-fit, minmax(230px, 1fr))">
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
                        buttonText="Request"
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
};
