import { FC } from 'react';
import { H2, Overlay, Span, toDecimals, InfoTooltip } from 'src/shared';
import { Box, Button, Flex, Skeleton, useDisclosure, Text } from '@chakra-ui/react';
import { PromoCodeModal, RefillModal } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { balanceStore } from 'src/shared/stores';

const BalanceBlock: FC = () => {
    const { isOpen: isRefillOpen, onClose: onRefillClose, onOpen: onRefillOpen } = useDisclosure();
    const { isOpen: isPromoOpen, onClose: onPromoClose, onOpen: onPromoOpen } = useDisclosure();

    const isLoading = balanceStore.currentBalance$.isLoading;
    const balance = balanceStore.balance;
    const tonRate = balanceStore.tonRate$.value;

    const usdtAmount = balance ? Number(toDecimals(balance.usdt.amount, 6)) : 0;
    const usdtPromoAmount = balance ? Number(toDecimals(balance.usdt.promo_amount, 6)) : 0;

    const tonAmount = balance ? Number(toDecimals(balance.ton?.amount || 0, 9)) : 0;
    const tonAmountUsd = tonAmount && tonRate ? tonAmount * tonRate : 0;
    const tonPromoAmount = balance ? Number(toDecimals(balance.ton?.promo_amount || 0, 9)) : 0;
    const tonPromoAmountUsd = tonPromoAmount && tonRate ? tonPromoAmount * tonRate : 0;

    const totalTonAmount = tonAmount + tonPromoAmount;

    const formattedTotalAmount = balance?.total !== undefined
    ? new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
      }).format(balance?.total)
    : null;

    return (
        <>
            <Overlay h="fit-content" p="0" mb={4} display="flex" flexDirection="column">
                <Box pt="5" pb="6" px="6">
                    <Text textStyle="body2" color="text.secondary" mb="1">
                        Total Balance
                    </Text>
                    <Flex align="center" justify="space-between" mb="5">
                        <H2 display="flex" alignItems="center" gap="2">
                            {isLoading || balance?.total === undefined ? (
                                <Skeleton w="200px" h="10" />
                            ) : (
                                <Span title={balance?.total.toString()}>
                                    {formattedTotalAmount}
                                </Span>
                            )}
                        </H2>
                        <Flex gap="2">
                            <Button onClick={onRefillOpen} variant="secondary">
                                Refill
                            </Button>
                            <Button onClick={onPromoOpen} variant="secondary">
                                Use Promo Code
                            </Button>
                        </Flex>
                    </Flex>

                    <Flex columnGap="8" rowGap="4" flexWrap="wrap">
                        {/* Left Column - USDT Balance and Promo */}
                        <Box minW="200px">
                            <Flex align="center" columnGap="2" mb="2">
                                <Text textStyle="body2" color="text.secondary">
                                    Balance:
                                </Text>
                                {isLoading ? (
                                    <Skeleton w="100px" h="5" />
                                ) : (
                                    <Text textStyle="body2" title={usdtAmount.toString()}>{usdtAmount.toFixed(2)} USDT</Text>
                                )}
                            </Flex>
                            <Flex align="center" columnGap="2">
                                <Flex align="center" gap="1">
                                    <Text textStyle="body2" color="text.secondary">
                                        Promo Balance:
                                    </Text>
                                    <InfoTooltip>
                                        Apply promo codes to get bonus balance
                                    </InfoTooltip>
                                </Flex>
                                {isLoading ? (
                                    <Skeleton w="80px" h="5" />
                                ) : (
                                    <Text textStyle="body2" title={usdtPromoAmount.toString()}>{usdtPromoAmount.toFixed(2)} USDT</Text>
                                )}
                            </Flex>
                        </Box>

                        {/* Right Column - TON Balance and TON Promo (if exists) */}
                        {totalTonAmount > 0 && (
                            <Box flex="1" minW="200px">
                                <Flex align="center" columnGap="2" mb="2">
                                    <Text textStyle="body2" color="text.secondary">
                                        TON Balance:
                                    </Text>
                                    {isLoading ? (
                                        <Skeleton w="150px" h="5" />
                                    ) : (
                                        <Text textStyle="body2" title={tonAmount.toString()}>
                                            {tonAmount.toFixed(2)} TON{' '}
                                            <Span color="text.secondary">
                                                ≈ ${tonAmountUsd.toFixed(2)}
                                            </Span>
                                        </Text>
                                    )}
                                </Flex>
                                <Flex align="center" columnGap="2">
                                    <Flex align="center" gap="1">
                                        <Text textStyle="body2" color="text.secondary">
                                            TON Promo Balance:
                                        </Text>
                                        <InfoTooltip>
                                            Apply promo codes to get bonus balance
                                        </InfoTooltip>
                                    </Flex>
                                    {isLoading ? (
                                        <Skeleton w="150px" h="5" />
                                    ) : (
                                        <Text textStyle="body2" title={tonPromoAmount.toString()}>
                                            {tonPromoAmount.toFixed(2)} TON{' '}
                                            <Span color="text.secondary">
                                                ≈ ${tonPromoAmountUsd.toFixed(2)}
                                            </Span>
                                        </Text>
                                    )}
                                </Flex>
                            </Box>
                        )}
                    </Flex>
                </Box>
            </Overlay>
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
            <PromoCodeModal isOpen={isPromoOpen} onClose={onPromoClose} />
        </>
    );
};

export default observer(BalanceBlock);
