import { FC } from 'react';
import { H2, Overlay, Span, toDecimals, InfoTooltip } from 'src/shared';
import { Box, Button, Flex, Skeleton, useDisclosure, Link, Text } from '@chakra-ui/react';
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
    const totalAmount = balance ? Number(balance.total) : 0;

    return (
        <>
            <Overlay h="fit-content" p="0" mb={4} display="flex" flexDirection="column">
                <Box pt="5" pb="6" px="6">
                    <Text textStyle="body2" color="text.secondary" mb="1">
                        Total Balance
                    </Text>
                    <Flex align="center" justify="space-between" mb="5">
                        <H2 display="flex" alignItems="center" gap="2">
                            {isLoading ? (
                                <Skeleton w="200px" h="10" />
                            ) : (
                                <Span title={totalAmount.toString()}>
                                    {balance?.ton?.amount && '≈ '}${totalAmount.toFixed(2)}
                                </Span>
                            )}
                        </H2>
                        <Button onClick={onRefillOpen} variant="secondary">
                            Refill
                        </Button>
                    </Flex>

                    <Flex columnGap="8" flexWrap="wrap">
                        <Flex align="center" columnGap="2">
                            <Text textStyle="body2" color="text.secondary">
                                Balance:
                            </Text>
                            {isLoading ? (
                                <Skeleton w="100px" h="5" />
                            ) : (
                                <Text textStyle="body2">{usdtAmount.toFixed(2)} USDT</Text>
                            )}
                        </Flex>
                        {tonAmount > 0 && (
                            <Flex align="center" columnGap="2">
                                <Text textStyle="body2" color="text.secondary">
                                    TON Balance:
                                </Text>
                                {isLoading ? (
                                    <Skeleton w="150px" h="5" />
                                ) : (
                                    <Text textStyle="body2">
                                        {tonAmount.toFixed(2)} TON{' '}
                                        {tonAmountUsd > 0 && (
                                            <Span color="text.secondary">
                                                ≈ ${tonAmountUsd.toFixed(2)}
                                            </Span>
                                        )}
                                    </Text>
                                )}
                            </Flex>
                        )}
                        <Flex align="center" gap="2">
                            <Flex align="center" gap="1">
                                <Text textStyle="body2" color="text.secondary">
                                    Promo Balance:
                                </Text>
                                <InfoTooltip>Apply promo codes to get bonus balance</InfoTooltip>
                            </Flex>
                            {isLoading ? (
                                <Skeleton w="80px" h="5" />
                            ) : (
                                <Text textStyle="body2">{usdtPromoAmount.toFixed(2)} USDT</Text>
                            )}
                            <Link
                                color="accent.blue"
                                textStyle="body2"
                                onClick={onPromoOpen}
                                cursor="pointer"
                                _hover={{ textDecoration: 'underline' }}
                            >
                                Use Promo Code
                            </Link>
                        </Flex>
                    </Flex>
                </Box>
            </Overlay>
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
            <PromoCodeModal isOpen={isPromoOpen} onClose={onPromoClose} />
        </>
    );
};

export default observer(BalanceBlock);
