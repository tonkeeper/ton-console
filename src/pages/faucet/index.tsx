import { FunctionComponent, useId, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { H4, isNumber, Overlay, Span, TonCurrencyAmount } from 'src/shared';
import { Button, Divider, Flex, Link, useDisclosure } from '@chakra-ui/react';
import {
    FaucetForm,
    faucetStore,
    RequestFaucetForm,
    FaucetFormInternal,
    FaucetPaymentDetailsModal
} from 'src/features';
import { FormProvider, useForm } from 'react-hook-form';
import BigNumber from 'bignumber.js';
import { balanceStore, RefillModal } from 'src/entities';

const FaucetPage: FunctionComponent = () => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isRefillOpen, onClose: onRefillClose, onOpen: onRefillOpen } = useDisclosure();
    const [receiverAddress, setReceiverAddress] = useState('');
    const [amount, setAmount] = useState<TonCurrencyAmount | undefined>(undefined);

    const formId = useId();

    const methods = useForm<FaucetFormInternal>();

    const { watch } = methods;
    const inputAmount = watch('tonAmount');
    const rate = faucetStore.tonRate$.value;

    let price: TonCurrencyAmount | undefined;
    if (
        faucetStore.tonRate$.isResolved &&
        isNumber(inputAmount) &&
        Number(inputAmount) &&
        Number(inputAmount) >= 0.01
    ) {
        price = TonCurrencyAmount.fromRelativeAmount(
            new BigNumber(Number(inputAmount)).multipliedBy(rate)
        );
    }

    const onSubmit = (form: RequestFaucetForm): void => {
        setReceiverAddress(form.receiverAddress);
        setAmount(form.amount);

        if (price && balanceStore.tonBalance?.isGTE(price)) {
            return onOpen();
        }

        onRefillOpen();
    };

    return (
        <Overlay h="fit-content">
            <H4 mb="5">Testnet Assets</H4>
            <Divider w="auto" mb="4" mx="-6" />
            <FormProvider {...methods}>
                <FaucetForm
                    id={formId}
                    tonLimit={faucetStore.tonSupply$.value || undefined}
                    onSubmit={onSubmit}
                    isDisabled={faucetStore.buyAssets.isLoading}
                    mb="6"
                    w="512px"
                />
            </FormProvider>
            <Flex align="center" gap="4">
                <Button form={formId} isLoading={faucetStore.buyAssets.isLoading} type="submit">
                    {price ? `Buy for ${price.stringCurrencyAmount}` : 'Buy Testnet Assets'}
                </Button>
                {faucetStore.latestPurchase && (
                    <Span textStyle="label2" color="text.secondary">
                        Bought {faucetStore.latestPurchase.amount.stringAmount} testnet TON.{' '}
                        <Link
                            textStyle="label2"
                            color="text.accent"
                            href={faucetStore.latestPurchase.link}
                            isExternal
                        >
                            View in explorer
                        </Link>
                    </Span>
                )}
            </Flex>
            <FaucetPaymentDetailsModal
                isOpen={isOpen}
                onClose={onClose}
                price={price}
                amount={amount}
                receiverAddress={receiverAddress}
            />
            <RefillModal isOpen={isRefillOpen} onClose={onRefillClose} />
        </Overlay>
    );
};

export default observer(FaucetPage);
