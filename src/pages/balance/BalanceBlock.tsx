import { FC, useEffect, useRef, useState } from 'react';
import { CRYPTO_CURRENCY, H2, IconButton, Overlay, RefreshIcon16, Span } from 'src/shared';
import { Box, Button, Flex, Skeleton, useDisclosure } from '@chakra-ui/react';
import { CurrencyRate, PromoCodeModal, RefillModal } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { balancesStore } from 'src/shared/stores';

const BalanceBlock: FC = () => {
    const [h2Width, setH2Width] = useState(0);
    const { isOpen: isRefillOpen, onClose: onRefillClose, onOpen: onRefillOpen } = useDisclosure();
    const { isOpen: isPromoOpen, onClose: onPromoClose, onOpen: onPromoOpen } = useDisclosure();

    const h2Ref = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (h2Ref.current) {
            setH2Width(Math.ceil(h2Ref.current.getBoundingClientRect().width));
        }
    }, [balancesStore.balances[0]?.stringAmount]);

    const isRefreshing = balancesStore.portfolio$.isLoading;

    return (
        <>
            <Overlay h="fit-content" p="0" mb={4} display="flex" flexDirection="column">
                <Box pt="5" pb="6" px="6">
                    <Flex align="center" gap="2" mb="1">
                        <H2 minW={h2Width} display="flex" alignItems="center" gap="2">
                            {balancesStore.portfolio$.isLoading ? (
                                <Skeleton w={h2Width || '100px'} h="6" />
                            ) : (
                                <Span
                                    ref={h2Ref}
                                    title={balancesStore.balances[0]?.stringAmountWithoutRound}
                                >
                                    {balancesStore.balances[0]?.stringCurrencyAmount}
                                </Span>
                            )}
                        </H2>
                        <IconButton
                            icon={<RefreshIcon16 />}
                            onClick={() => balancesStore.fetchPortfolio()}
                            aria-label="Refresh"
                            isDisabled={isRefreshing}
                        />
                    </Flex>
                    <CurrencyRate
                        textStyle="body2"
                        color="text.secondary"
                        mb="5"
                        skeletonWidth="70px"
                        currency={CRYPTO_CURRENCY.TON}
                        leftSign={balancesStore.balances[0]?.amount.isZero() ? '' : '≈'}
                        amount={balancesStore.balances[0]?.amount}
                        amountLoading={balancesStore.portfolio$.isLoading}
                        contentUnderSkeleton="&nbsp;USD"
                    />
                    <Flex gap="3">
                        <Button onClick={onRefillOpen}>Refill</Button>
                        <Button
                            isLoading={balancesStore.applyPromoCode.isLoading}
                            onClick={onPromoOpen}
                            variant="secondary"
                        >
                            Use Promo Code
                        </Button>
                    </Flex>
                </Box>
            </Overlay>
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
            <PromoCodeModal isOpen={isPromoOpen} onClose={onPromoClose} />
        </>
    );
};

export default observer(BalanceBlock);
