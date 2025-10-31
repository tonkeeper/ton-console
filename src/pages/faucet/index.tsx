import { FC, useId, useState } from 'react';
import {
    H4,
    isNumber,
    Overlay,
    Span,
    TonCurrencyAmount,
    UsdCurrencyAmount,
    formatNumber,
    useIntervalUpdate
} from 'src/shared';
import { Box, Button, Divider, Flex, Link, useDisclosure } from '@chakra-ui/react';
import {
    FaucetForm,
    RequestFaucetForm,
    FaucetFormInternal,
    FaucetPaymentDetailsModal
} from 'src/features';
import { FormProvider, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { RefillModal } from 'src/entities';
import { useBalanceQuery } from 'src/features/balance';
import {
    useFaucetSupplyAndRate,
    useBuyTestnetCoinsMutation
} from 'src/features/faucet/model/queries';

const USDT_DIVISOR = 1_000_000;

const FaucetPage: FC = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isRefillOpen, onClose: onRefillClose, onOpen: onRefillOpen } = useDisclosure();
    const [receiverAddress, setReceiverAddress] = useState('');
    const [amount, setAmount] = useState<TonCurrencyAmount | undefined>(undefined);
    const [latestPurchase, setLatestPurchase] = useState<{
        amount: TonCurrencyAmount;
        link: string;
    } | null>(null);

    const { data: supplyAndRate, refetch: refetchSupplyAndRate } = useFaucetSupplyAndRate();
    const { mutate: buyTestnetCoins, isPending: isBuyingAssets } = useBuyTestnetCoinsMutation();

    // Setup interval update for supply and rate
    useIntervalUpdate(refetchSupplyAndRate);

    const formId = useId();

    const methods = useForm<FaucetFormInternal>();
    const { data: balance } = useBalanceQuery();
    const availableUsdtBalance = balance?.usdt
        ? new BigNumber(balance.usdt.amount.toString())
              .plus(balance.usdt.promo_amount.toString())
              .dividedBy(USDT_DIVISOR)
        : null;

    const { watch } = methods;
    const inputAmount = watch('tonAmount');
    const rate = supplyAndRate?.tonRate ?? 0;

    let price: UsdCurrencyAmount | undefined;
    if (
        supplyAndRate &&
        isNumber(inputAmount) &&
        Number(inputAmount) &&
        Number(inputAmount) >= 0.01
    ) {
        price = new UsdCurrencyAmount(new BigNumber(Number(inputAmount)).multipliedBy(rate));
    }

    const onSubmit = (form: RequestFaucetForm): void => {
        setReceiverAddress(form.receiverAddress);
        setAmount(form.amount);

        if (price && availableUsdtBalance && availableUsdtBalance.gte(price.amount)) {
            return onOpen();
        }

        onRefillOpen();
    };

    const handlePaymentConfirm = (form: RequestFaucetForm): void => {
        buyTestnetCoins(form, {
            onSuccess: data => {
                setLatestPurchase({
                    amount: data.amount,
                    link: data.link
                });
                onClose();
            }
        });
    };

    return (
        <Overlay h="fit-content">
            <H4 mb="5">Testnet Assets</H4>
            <Divider w="auto" mx="-6" mb="4" />
            <Box maxW={'512px'}>
                <FormProvider {...methods}>
                    <FaucetForm
                        id={formId}
                        tonLimit={supplyAndRate?.tonSupply || undefined}
                        onSubmit={onSubmit}
                        isDisabled={isBuyingAssets}
                        mb="6"
                        w="100%"
                    />
                </FormProvider>
                <Flex align="center" gap="4" justifyContent='space-between'>
                    <Button form={formId} isLoading={isBuyingAssets} type="submit">
                        {price ? `Buy for ${price.stringCurrencyAmount}` : 'Buy Testnet TON'}
                    </Button>
                    {rate > 0 && (
                        <Box textStyle="label2" color="text.secondary" alignContent={'right'} alignSelf={'right'}>
                            1 testnet TON =&nbsp;${formatNumber(rate, { decimalPlaces: 2 })}
                        </Box>
                    )}
                    {latestPurchase && (
                        <Box textStyle="label2" color="text.secondary">
                            {`Bought ${latestPurchase.amount.stringAmount} testnet TON.`}{' '}
                            <Link
                                textStyle="label2"
                                color="text.accent"
                                href={latestPurchase.link}
                                isExternal
                            >
                                View&nbsp;in&nbsp;explorer
                            </Link>
                        </Box>
                    )}
                </Flex>
            </Box>
            <FaucetPaymentDetailsModal
                isOpen={isOpen}
                onClose={onClose}
                price={price}
                amount={amount}
                receiverAddress={receiverAddress}
                onConfirm={handlePaymentConfirm}
                isLoading={isBuyingAssets}
            />
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
        </Overlay>
    );
};

export default FaucetPage;
