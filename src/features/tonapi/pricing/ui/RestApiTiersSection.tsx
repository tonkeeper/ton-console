import { FC, useState } from 'react';
import { Box, Text, Grid, Link, Flex, useDisclosure, Spinner, Center } from '@chakra-ui/react';
import { SimpleTierCard } from './SimpleTierCard';
import {
    useRestApiTiers,
    useSelectedRestApiTier,
    useCheckValidChangeRestApiTierMutation
} from '../model/queries';
import { RestApiTier } from '../model';
import { UsdCurrencyAmount } from 'src/shared';
import RestApiPurchaseDialog from './RestApiPurchaseDialog';
import { RefillModal } from 'src/entities';
import { Link as RouterLink } from 'react-router-dom';
import { openFeedbackModal } from 'src/features/feedback/model/feedback';

interface RestApiTiersSectionProps {
    displayOnly?: boolean;
}

export const RestApiTiersSection: FC<RestApiTiersSectionProps> = ({ displayOnly = false }) => {
    const [selectedTier, setSelectedTier] = useState<RestApiTier | null>(null);
    const { data: tiers, isLoading: isRestApiTiersLoading } = useRestApiTiers();
    const { data: currentRestApiTier } = useSelectedRestApiTier();
    const { mutateAsync: checkValidChangeTier } = useCheckValidChangeRestApiTierMutation();

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

    const currentTierId = currentRestApiTier?.id;

    const handleSelectRestApiTier = async (tier: RestApiTier) => {
        const isCurrentSubscription = currentTierId === tier.id;

        if (isCurrentSubscription) return;

        const { valid, unspent_money } = await checkValidChangeTier(tier.id);

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
    };

    if (isRestApiTiersLoading || !tiers) {
        return (
            <Center py="8">
                <Spinner />
            </Center>
        );
    }

    // Sort tiers: monthly → pay-as-you-go → others
    const sortedTiers = [...tiers].sort((a, b) => {
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

                <Grid gap="4" templateColumns="repeat(auto-fit, minmax(230px, 1fr))">
                    {sortedTiers.map(tier => {
                        const isCurrent = currentTierId === tier.id;
                        const isFree = tier.price.amount.eq(0);
                        const isPayAsYouGo = tier.type === 'pay-as-you-go';
                        const isDisabled = displayOnly || isCurrent;

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
                                    !isDisabled ? () => handleSelectRestApiTier(tier) : undefined
                                }
                            />
                        );
                    })}

                    <SimpleTierCard
                        name="Custom"
                        price="Custom"
                        rps="∞"
                        priceDescription="Contact us"
                        onSelect={!displayOnly ? openFeedbackModal('unlimited-restapi') : undefined}
                        buttonText="Request"
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
};
