import { FC, useState } from 'react';
import {
    Box,
    Text,
    Grid,
    Link,
    Flex,
    useDisclosure,
    Spinner,
    Center,
    Badge,
    Button
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
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

interface LiteserversTiersSectionProps {
    displayOnly?: boolean;
}

export const LiteserversTiersSection: FC<LiteserversTiersSectionProps> = ({
    displayOnly = false
}) => {
    const navigate = useNavigate();
    const [selectedLiteserverTier, setSelectedLiteserverTier] =
        useState<LiteserverTierWithUnspent | null>(null);

    const { data: liteserverTiers, isLoading: isLiteserversLoading } = useLiteproxyTiers();
    const { data: currentLiteserverTier, isLoading: isCurrentLiteserverTierLoading } =
        useSelectedLiteproxyTier();
    const { mutateAsync: checkValidChangeTier } = useCheckValidChangeLiteproxyTierMutation();

    const isLiteserversInactive = !currentLiteserverTier && !isCurrentLiteserverTierLoading;
    const isDisabled = !displayOnly && isLiteserversInactive;

    const handleActivateLiteservers = () => {
        navigate('../liteservers');
    };

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
                <Flex align="baseline" gap="3" mb="4">
                    <Text textStyle="h4" fontWeight={600}>
                        Liteservers
                    </Text>
                    {!displayOnly && isLiteserversInactive && (
                        <Badge fontSize="xs" colorScheme="gray">
                            Inactive
                        </Badge>
                    )}
                </Flex>

                <Text textStyle="body2" mb="4" color="text.secondary">
                    Direct access to TON blockchain via Liteserver protocol.{' '}
                    <Link
                        color="accent.blue"
                        href="https://docs.tonconsole.com/tonapi/liteservers"
                        isExternal
                    >
                        Learn more about Liteservers
                    </Link>
                    {isDisabled && (
                        <>
                            . To get started with Liteservers, activate the service in the{' '}
                            <Link
                                color="accent.blue"
                                fontWeight={500}
                                cursor="pointer"
                                onClick={handleActivateLiteservers}
                            >
                                dedicated section
                            </Link>
                        </>
                    )}
                </Text>

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
                                isDisabled={isDisabled}
                                onSelect={
                                    !isDisabled && !isCurrent
                                        ? () => handleSelectLiteserverTier(tier)
                                        : undefined
                                }
                            />
                        );
                    })}

                    <SimpleTierCard
                        name="Custom"
                        price="Custom"
                        rps="∞"
                        priceDescription="Contact us"
                        isDisabled={isDisabled}
                        onSelect={
                            !isDisabled ? openFeedbackModal('unlimited-liteservers') : undefined
                        }
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
