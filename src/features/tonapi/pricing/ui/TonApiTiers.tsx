import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    Center,
    Spinner,
    useDisclosure,
    Text,
    Flex,
    Button,
    Icon,
    Link,
    Box,
    Divider
} from '@chakra-ui/react';
import TonApiPaymentDetailsModal from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { RefillModal } from 'src/entities';
import { DTOLiteproxyTier, UsdCurrencyAmount } from 'src/shared';
import { SelectTonApiTier } from './SelecTonApitTier';
// import { SelectLiteserverTier } from './SelectLiteserverTier';
import { TonApiUnlimitedTierCard } from './TonApiUnlimitedTierCard';
import { ChevronRightIcon16 } from 'src/shared/ui/icons/ChevronRightIcon16';
import TonApiPricingModal from './TonApiPricingModal';
import WebhooksPricingModal from './WebhooksPricingModal';
import { Link as RouterLink } from 'react-router-dom';
import { liteproxysStore } from '../../liteproxy';
// import { LiteserversTierCard } from './LiteserversTierCard';
import LiteserversPaymentDetailsModal from './LiteserversPaymentDetailsModal';
import LiteserversPricingModal from './LiteserversPricingModal';
import { webhooksStore } from '../../webhooks';

const TonApiTiers: FC = () => {
    const storeSelectedTonApiTier = tonApiTiersStore.selectedTier$.value;
    const [tierTonApiForChange, setTierTonApiForChange] = useState<TonApiTier | undefined>();
    const [currentTonApiTier, setCurrentTonApiTier] = useState<TonApiTier | 'custom' | null>(
        storeSelectedTonApiTier
    );

    const storeSelectedLiteserversTier = liteproxysStore.selectedTier$.value;
    const storeLiteseversTiers = liteproxysStore.liteproxyTiers$.value;
    const [currentLiteserversTier, setCurrentLiteserversTier] = useState<DTOLiteproxyTier | null>(
        storeSelectedLiteserversTier
    );

    useEffect(() => {
        setCurrentTonApiTier(storeSelectedTonApiTier);

        return () => setCurrentTonApiTier(null);
    }, [storeSelectedTonApiTier]);

    useEffect(() => {
        setCurrentLiteserversTier(storeSelectedLiteserversTier);

        return () => setCurrentLiteserversTier(null);
    }, [storeSelectedLiteserversTier]);

    const {
        isOpen: isRefillTonApiModalOpen,
        onClose: onRefillTonApiModalClose,
        onOpen: onRefillTonApiModalOpen
    } = useDisclosure();

    const {
        isOpen: isRefillLiteproxyModalOpen,
        onClose: onRefillLiteproxyModalClose
        // onOpen: onRefillLiteproxyModalOpen
    } = useDisclosure();

    const {
        isOpen: isTonApiPricingModalOpen,
        onClose: onTonApiPricingModalClose,
        onOpen: onTonApiPricingModalOpen
    } = useDisclosure();

    const {
        isOpen: isWebhooksPricingModalOpen,
        onClose: onWebhooksPricingModalClose,
        onOpen: onWebhooksPricingModalOpen
    } = useDisclosure();

    const {
        isOpen: isLiteserversPricingModalOpen,
        onClose: onLiteserversPricingModalClose
        // onOpen: onLiteserversPricingModalOpen
    } = useDisclosure();

    if (
        !tonApiTiersStore.tiers$.isResolved ||
        !tonApiTiersStore.selectedTier$.isResolved ||
        !currentTonApiTier ||
        !storeSelectedTonApiTier
    ) {
        return (
            <Center h="360px">
                <Spinner />
            </Center>
        );
    }

    const onChoseTonApiTier = async (tier: TonApiTier): Promise<void> => {
        const { valid, unspent_money } = await tonApiTiersStore.checkValidChangeTier(tier.id);

        if (!valid) {
            onRefillTonApiModalOpen();
            return;
        }
        const unspentMoney = unspent_money ? new UsdCurrencyAmount(unspent_money) : undefined;

        setTierTonApiForChange({
            ...tier,
            unspentMoney
        });
    };

    // const onChoseLiteserversTier = async (): Promise<void> => {
    //     onRefillLiteproxyModalOpen();
    // };

    const handleSelectTier = (tier: TonApiTier | 'custom'): void => {
        if (tier === 'custom') {
            setCurrentTonApiTier('custom');
        } else if (storeSelectedTonApiTier.id === tier.id) {
            setCurrentTonApiTier(storeSelectedTonApiTier);
        } else {
            setCurrentTonApiTier(tier);
        }
    };

    // const handleSelectLiteserverTier = (tier: DTOLiteproxyTier): void => {
    //     setCurrentLiteserversTier(tier);
    // };

    const onPaymentModalClose = (): void => setTierTonApiForChange(undefined);

    const isCurrentSubscription =
        currentTonApiTier !== 'custom' &&
        tonApiTiersStore.selectedTier$.value?.id === currentTonApiTier?.id;

    // const liteserversExists = liteproxysStore.liteproxyList$.value.length > 0;

    const isEmptyWebhooks = webhooksStore.webhooks$.value.length === 0;

    return (
        <>
            <Flex align="center" justify="space-between" mb="4">
                <Text textStyle="text.label2" mb="4" fontWeight={600}>
                    REST API
                </Text>
                <Button onClick={onTonApiPricingModalOpen} size="sm" variant="secondary">
                    Pricing
                    <Icon as={ChevronRightIcon16} w={4} h={4} ml="2" />
                </Button>
            </Flex>
            <Flex direction={{ base: 'column', lg: 'row' }} gap={6} mb="4">
                <SelectTonApiTier onSelectTier={handleSelectTier} currentTier={currentTonApiTier} />
                {currentTonApiTier === 'custom' ? (
                    <TonApiUnlimitedTierCard w="100%" maxW="497px" />
                ) : (
                    <TonApiTierCard
                        h="100%"
                        tier={currentTonApiTier}
                        onChoseTier={onChoseTonApiTier}
                        isChosen={isCurrentSubscription}
                    />
                )}
            </Flex>
            <Divider my="4" />
            <Flex align="center" justify="space-between" mb="4">
                <Text textStyle="text.label2" mb="4" fontWeight={600}>
                    Webhooks
                </Text>
                <Button onClick={onWebhooksPricingModalOpen} size="sm" variant="secondary">
                    Pricing
                    <Icon as={ChevronRightIcon16} w={4} h={4} ml="2" />
                </Button>
            </Flex>
            <Box>
                <Text textStyle="body2" mb="4" color="text.secondary">
                    {isEmptyWebhooks
                        ? 'The service is currently not in use'
                        : 'The service is currently active.'}
                    . To use it, go to the{' '}
                    <Link as={RouterLink} color="accent.blue" to="../webhooks">
                        Webhooks
                    </Link>{' '}
                    section
                </Text>
            </Box>

            {/* <Divider my="4" />

            <Flex align="center" justify="space-between" mb="4">
                <Text textStyle="text.label2" mb="4" fontWeight={600}>
                    Liteservers
                </Text>
                <Button onClick={onLiteserversPricingModalOpen} size="sm" variant="secondary">
                    Pricing
                    <Icon as={ChevronRightIcon16} w={4} h={4} ml="2" />
                </Button>
            </Flex>
            <Flex direction={{ base: 'column', lg: 'row' }} gap={6} mb="4">
                {liteserversExists &&
                currentLiteserversTier &&
                storeSelectedLiteserversTier &&
                storeLiteseversTiers ? (
                    <>
                        <SelectLiteserverTier
                            onSelectTier={handleSelectLiteserverTier}
                            selectedTier={currentLiteserversTier}
                            currentTier={storeSelectedLiteserversTier}
                            tiers={storeLiteseversTiers}
                        />
                        <LiteserversTierCard
                            h="100%"
                            tier={currentLiteserversTier}
                            onChoseTier={onChoseLiteserversTier}
                            isChosen={storeSelectedLiteserversTier.id === currentLiteserversTier.id}
                        />
                    </>
                ) : (
                    <Text textStyle="body2" mb="4" color="text.secondary">
                        The service is currently not in use. To use it, go to the{' '}
                        <Link as={RouterLink} color="accent.blue" to="../liteservers">
                            Liteservers
                        </Link>{' '}
                        section
                    </Text>
                )}
            </Flex> */}

            {tierTonApiForChange && (
                <TonApiPaymentDetailsModal
                    isOpen={!!tierTonApiForChange}
                    onClose={onPaymentModalClose}
                    tier={tierTonApiForChange}
                />
            )}

            {currentLiteserversTier && (
                <LiteserversPaymentDetailsModal
                    isOpen={isRefillLiteproxyModalOpen}
                    onClose={onRefillLiteproxyModalClose}
                    tier={currentLiteserversTier}
                />
            )}

            <RefillModal isOpen={isRefillTonApiModalOpen} onClose={onRefillTonApiModalClose} />
            <TonApiPricingModal
                isOpen={isTonApiPricingModalOpen}
                onClose={onTonApiPricingModalClose}
            />
            <WebhooksPricingModal
                isOpen={isWebhooksPricingModalOpen}
                onClose={onWebhooksPricingModalClose}
            />

            {storeLiteseversTiers && (
                <LiteserversPricingModal
                    isOpen={isLiteserversPricingModalOpen}
                    onClose={onLiteserversPricingModalClose}
                    tiers={storeLiteseversTiers}
                    currentTier={storeSelectedLiteserversTier}
                />
            )}
        </>
    );
};

export default observer(TonApiTiers);
