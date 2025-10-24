import { FC } from 'react';
import { H2, Overlay, Span, toDecimals, InfoTooltip } from 'src/shared';
import { Box, Button, Flex, Skeleton, useDisclosure, Text, Divider } from '@chakra-ui/react';
import { RefillModal } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { balanceStore } from 'src/shared/stores';

const BalanceBlock: FC = () => {
    const { isOpen: isRefillOpen, onClose: onRefillClose, onOpen: onRefillOpen } = useDisclosure();

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

    const formattedTotalAmount =
        balance?.total !== undefined
            ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2
              }).format(balance?.total)
            : null;

    return (
        <>
            <Overlay h="100%" p="0" display="flex" flexDirection="column" flex="1" minW="330px">
                <Box>
                    <Flex align="center" justify="space-between" py="5" px="6">
                        <Box>
                            <Text textStyle="body2" color="text.secondary" mb="1">
                                Total Balance
                            </Text>
                            <H2 display="flex" alignItems="center" gap="2">
                                {isLoading || balance?.total === undefined ? (
                                    <Skeleton w="200px" h="10" />
                                ) : (
                                    <Span title={balance?.total.toString()}>
                                        {formattedTotalAmount}
                                    </Span>
                                )}
                            </H2>
                        </Box>
                        <Button onClick={onRefillOpen} variant="secondary" size="sm">
                            Refill
                        </Button>
                    </Flex>

                    <Divider />

                    <Flex columnGap="3" rowGap="2" flexWrap="wrap" pt="3" pb="5" px="6">
                        {/* Left Column - USDT Balance and Promo */}
                        <Box minW="170px">
                            <Flex>
                                <Text textStyle="body2" minW="80px" color="text.secondary" mb="1">
                                    Balance
                                </Text>
                                {isLoading ? (
                                    <Skeleton w="80px" h="5" />
                                ) : (
                                    <Text textStyle="body2" title={usdtAmount.toString()}>
                                        {usdtAmount.toFixed(2)} USDT
                                    </Text>
                                )}
                            </Flex>
                            <Flex>
                                <Flex align="center" minW="80px" gap="1" mb="1">
                                    <Text textStyle="body2" color="text.secondary">
                                        Promo
                                    </Text>
                                    <InfoTooltip>
                                        Apply promo codes to get bonus balance
                                    </InfoTooltip>
                                </Flex>
                                {isLoading ? (
                                    <Skeleton w="80px" h="5" />
                                ) : (
                                    <Text textStyle="body2" title={usdtPromoAmount.toString()}>
                                        {usdtPromoAmount.toFixed(2)} USDT
                                    </Text>
                                )}
                            </Flex>
                        </Box>

                        {/* Right Column - TON Balance and TON Promo (if exists) */}
                        {totalTonAmount > 0 && (
                            <Box flex="1" >
                                <Flex>
                                    <Text textStyle="body2" minW="110px" color="text.secondary" mb="1">
                                        TON Balance
                                    </Text>
                                    {isLoading ? (
                                        <Skeleton w="150px" h="5" />
                                    ) : (
                                        <Text textStyle="body2" title={tonAmount.toString()} whiteSpace="nowrap">
                                            {tonAmount.toFixed(2)} TON{' '}
                                            <Span color="text.secondary">
                                                ≈ ${tonAmountUsd.toFixed(2)}
                                            </Span>
                                        </Text>
                                    )}
                                </Flex>
                                <Flex>
                                    <Flex align="center" minW="110px" gap="1" mb="1">
                                        <Text textStyle="body2" color="text.secondary">
                                            TON Promo
                                        </Text>
                                        <InfoTooltip>
                                            Apply promo codes to get bonus balance
                                        </InfoTooltip>
                                    </Flex>
                                    {isLoading ? (
                                        <Skeleton w="150px" h="5" />
                                    ) : (
                                        <Text textStyle="body2" title={tonPromoAmount.toString()} whiteSpace="nowrap">
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
        </>
    );
};

export default observer(BalanceBlock);
