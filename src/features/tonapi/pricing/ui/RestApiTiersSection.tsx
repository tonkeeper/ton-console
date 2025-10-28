import { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Box, Text, Grid, Link, Flex, useDisclosure } from '@chakra-ui/react';
import { SimpleTierCard } from './SimpleTierCard';
import { restApiTiersStore } from 'src/shared/stores';
import { RestApiTier } from '../model';
import { UsdCurrencyAmount } from 'src/shared';
import RestApiPurchaseDialog from './RestApiPurchaseDialog';
import { RefillModal } from 'src/entities';
import { Link as RouterLink } from 'react-router-dom';
import { openFeedbackModal } from 'src/features/feedback/model/feedback';

export const RestApiTiersSection: FC = observer(() => {
    const storeSelectedTonApiTier = restApiTiersStore?.selectedTier$;
    const [selectedTier, setSelectedTier] = useState<RestApiTier | null>(null);

    const {
        isOpen: isRestApiPurchaseDialogOpen,
        onOpen: onRestApiPurchaseDialogOpen,
        onClose: onRestApiPurchaseDialogClose
    } = useDisclosure();

    const {
        isOpen: isRefillModalOpen,
        onOpen: onRefillModalOpen,
        onClose: onRefillModalClose
    } = useDisclosure();

    const handleSelectRestApiTier = async (tier: RestApiTier) => {
        const isCurrentSubscription =
            storeSelectedTonApiTier.value && storeSelectedTonApiTier.value.id === tier.id;

        if (!isCurrentSubscription) {
            const { valid, unspent_money } = await restApiTiersStore.checkValidChangeTier(tier.id);

            if (!valid) {
                onRefillModalOpen();
                return;
            }

            const unspentMoney = unspent_money ? new UsdCurrencyAmount(unspent_money) : undefined;

            setSelectedTier({
                ...tier,
                unspentMoney
            });
            onRestApiPurchaseDialogOpen();
        }
    };

    if (!restApiTiersStore?.tiers$.isResolved || !storeSelectedTonApiTier) {
        return null;
    }

    const currentRestApiTier = storeSelectedTonApiTier.value;

    // Sort tiers: monthly → pay-as-you-go → others
    const sortedTiers = [...restApiTiersStore.tiers$.value].sort((a, b) => {
        if (a.type === 'monthly' && b.type === 'pay-as-you-go') return -1;
        if (a.type === 'pay-as-you-go' && b.type === 'monthly') return 1;
        return 0;
    });

    return (
        <>
            <Box mb="8">
                <Flex align="baseline" direction="column" gap="2" mb="4">
                    <Text textStyle="h4" fontWeight={600}>
                        REST API
                    </Text>
                    <Text textStyle="body2" color="text.secondary">
                        Access TON blockchain data via REST API.{' '}
                        <Link as={RouterLink} color="accent.blue" to="/tonapi/api-keys">
                            Get API keys
                        </Link>{' '}
                        or explore the{' '}
                        <Link
                            color="accent.blue"
                            href="https://docs.tonconsole.com/tonapi/rest-api"
                            isExternal
                        >
                            API documentation
                        </Link>
                    </Text>
                </Flex>

                <Grid gap="4" templateColumns="repeat(auto-fit, minmax(290px, 1fr))">
                    {sortedTiers.map(tier => {
                        const isCurrent = currentRestApiTier?.id === tier.id;
                        const isFree = tier.price.amount.eq(0);
                        const isPayAsYouGo = tier.type === 'pay-as-you-go';

                        return (
                            <SimpleTierCard
                                key={tier.id}
                                name={tier.name}
                                price={isFree ? '$0' : tier.price.stringCurrencyAmount}
                                rps={tier.rps}
                                priceDescription={
                                    isPayAsYouGo
                                        ? 'per 1K requests'
                                        : tier.type === 'monthly'
                                          ? 'Monthly'
                                          : undefined
                                }
                                isCurrent={isCurrent}
                                onSelect={
                                    !isCurrent ? () => handleSelectRestApiTier(tier) : undefined
                                }
                            />
                        );
                    })}

                    <SimpleTierCard
                        name="Custom"
                        price="Custom"
                        rps="∞"
                        priceDescription="Contact us"
                        onSelect={openFeedbackModal('unlimited-tonapi')}
                        buttonText="Make request"
                        buttonVariant="contrast"
                    />
                </Grid>
            </Box>

            {/* Modals */}
            {selectedTier && (
                <RestApiPurchaseDialog
                    isOpen={isRestApiPurchaseDialogOpen}
                    onClose={onRestApiPurchaseDialogClose}
                    selectedTier={selectedTier}
                />
            )}

            <RefillModal isOpen={isRefillModalOpen} onClose={onRefillModalClose} />
        </>
    );
});
