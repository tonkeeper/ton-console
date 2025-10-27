import { FC, useMemo, useState, useId, useEffect } from 'react';
import {
    Box,
    Button,
    Divider,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Stack,
    VStack,
    useRadio,
    useRadioGroup,
    useClipboard
} from '@chakra-ui/react';
import { createTransferLink, fromDecimals, H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { useForm } from 'react-hook-form';
import { useBillingHistoryQuery } from 'src/shared/hooks';
import { UsdtRefillTab } from './UsdtRefillTab';
import { TonDeprecatedTab } from './TonDeprecatedTab';
import { PromoCodeTab } from './PromoCodeTab';
import { SuccessRefillMessage } from './SuccessRefillMessage';
import { useDepositAddressQuery, useApplyPromoCodeMutation } from '../queries';

type Currency = 'USDT' | 'TON';
type RefillMode = 'USDT' | 'TON' | 'PROMO';

const USDT_DECIMALS = 6;
const TON_DECIMALS = 9;

const CURRENCY_DECIMALS: Record<Currency, number> = {
    USDT: USDT_DECIMALS,
    TON: TON_DECIMALS
} as const;

interface DetectedRefill {
    id: string;
    amount: string;
    date: Date;
}

const RadioCard: FC<{
    children: React.ReactNode;
    value: string;
}> = props => {
    const { getInputProps, getRadioProps } = useRadio(props);
    const input = getInputProps();
    const checkbox = getRadioProps();

    return (
        <Box as="label" flex={1}>
            <input {...input} />
            <Box
                {...checkbox}
                textStyle="body2"
                alignContent="center"
                flex={1}
                h="44px"
                px="4"
                py="2"
                fontWeight="medium"
                textAlign="center"
                bg="transparent"
                borderRadius="md"
                _checked={{
                    bg: 'background.contentTint'
                }}
                cursor="pointer"
                transition="all 0.2s"
            >
                {props.children}
            </Box>
        </Box>
    );
};

const RefillModalContent: FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    const {
        data: depositAddress,
        isLoading: isDepositAddressLoading,
        error: depositAddressError
    } = useDepositAddressQuery();
    const { mutate: applyPromoCode, isPending: isPromoLoading } = useApplyPromoCodeMutation();
    const { data: billingHistory = [] } = useBillingHistoryQuery();

    const usdtDepositWallet = depositAddress?.usdt_deposit_wallet;
    const tonDepositWallet = depositAddress?.ton_deposit_wallet;

    const currency_addresses: Record<Currency, string | undefined> = {
        USDT: usdtDepositWallet,
        TON: tonDepositWallet
    } as const;

    const [mode, setMode] = useState<RefillMode>('USDT');
    const [amount, setAmount] = useState<string>('');
    const [detectedRefills, setDetectedRefills] = useState<DetectedRefill[]>([]);
    const [baselineTransactionId, setBaselineTransactionId] = useState<string | null>(null);

    const {
        handleSubmit,
        register,
        formState: { errors },
        setError,
        reset: resetPromoForm,
        setFocus,
        watch
    } = useForm<{ promoCode: string }>();

    const promoCodeValue = watch('promoCode');
    const isPromoCodeEmpty = !promoCodeValue || promoCodeValue.trim() === '';

    const formId = useId();

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'refillMode',
        defaultValue: mode,
        onChange: val => {
            const newMode = val as RefillMode;
            setMode(newMode);
            setAmount('');
            resetPromoForm();
        }
    });

    const paymentLink = useMemo(() => {
        if (mode !== 'USDT') return null;

        if (!usdtDepositWallet) return null;
        if (amount === '' || Number(amount) === 0) return null;

        const address = currency_addresses.USDT;
        if (!address) return null;

        const decimals = CURRENCY_DECIMALS.USDT;
        const numAmount = fromDecimals(amount, decimals);

        const options: Parameters<typeof createTransferLink>[1] = {
            amount: numAmount.toString()
        };

        const jettonAddress = import.meta.env.VITE_USDT_JETTON_ADDRESS;
        if (!jettonAddress) return null;
        options.jetton = jettonAddress;

        options.text = 'TON Console: Refill';

        return createTransferLink(address, options);
    }, [mode, amount, usdtDepositWallet]);

    const { onCopy: onCopyLink } = useClipboard(paymentLink ?? '');

    const handlePayByLink = () => {
        if (!paymentLink) return;
        window.open(paymentLink, '_blank');
    };

    const onPromoSubmit = (form: { promoCode: string }): void => {
        applyPromoCode(form.promoCode, {
            onSuccess: () => {
                onClose();
            },
            onError: () => {
                setError('promoCode', {
                    message: 'Invalid promo code'
                });
                setTimeout(() => setFocus('promoCode'));
            }
        });
    };

    const showCurrencyTabs = !!tonDepositWallet;

    useEffect(() => {
        if (baselineTransactionId === null && billingHistory.length > 0) {
            setBaselineTransactionId(billingHistory[0].id);
        }
    }, []);

    useEffect(() => {
        if (baselineTransactionId === null || billingHistory.length === 0) return;

        const baselineIndex = billingHistory.findIndex(item => item.id === baselineTransactionId);
        if (baselineIndex === -1) return;

        const existsRefills = detectedRefills.map(item => item.id);

        const newRefills: DetectedRefill[] = billingHistory
            .slice(0, baselineIndex)
            .filter(item => item.type === 'deposit')
            .map(item => ({
                id: item.id,
                amount: item.amount.stringCurrencyAmount,
                currency: item.amount.currency,
                date: item.date
            }))
            .filter(item => !existsRefills.includes(item.id));
        
        const refills = [...detectedRefills, ...newRefills].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 2);

        setDetectedRefills(refills);
    }, [billingHistory, baselineTransactionId]);

    const handleRemoveRefill = (id: string) => {
        setDetectedRefills(prev => prev.filter(refill => refill.id !== id));
    };

    return (
        <ModalContent maxW="400px">
            <ModalHeader>
                <H4 mb="1">Balance Refill</H4>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pt="0" pb="0">
                {depositAddressError ? (
                    <Box color="accent.orange">
                        <Box>Balance refill is not available right now.</Box>
                        <Box>Please try again later.</Box>
                    </Box>
                ) : (
                    <>
                        <Stack
                            {...getRootProps()}
                            flexWrap="wrap"
                            direction="row"
                            gap="2"
                            mb="4"
                            p="2"
                            border="1px"
                            borderColor="separator.common"
                            borderRadius="lg"
                        >
                            <RadioCard
                                value="USDT"
                                {...getRadioProps({ value: 'USDT' })}
                                key="USDT"
                            >
                                USDT
                            </RadioCard>
                            {showCurrencyTabs && (
                                <RadioCard
                                    value="TON"
                                    {...getRadioProps({ value: 'TON' })}
                                    key="TON"
                                >
                                    TON
                                </RadioCard>
                            )}
                            <RadioCard
                                value="PROMO"
                                {...getRadioProps({ value: 'PROMO' })}
                                key="PROMO"
                            >
                                Promo
                            </RadioCard>
                        </Stack>

                        {mode === 'USDT' && (
                            <UsdtRefillTab
                                amount={amount}
                                setAmount={setAmount}
                                paymentLink={paymentLink}
                                isDepositAddressLoading={isDepositAddressLoading}
                                depositAddressError={!!depositAddressError}
                            />
                        )}

                        {mode === 'TON' && <TonDeprecatedTab tonDepositWallet={tonDepositWallet} />}

                        {mode === 'PROMO' && (
                            <PromoCodeTab
                                formId={formId}
                                register={register('promoCode', {
                                    required: 'This is required',
                                    maxLength: {
                                        value: 30,
                                        message: 'Max length is 30'
                                    }
                                })}
                                errors={errors}
                                isPromoLoading={isPromoLoading}
                            />
                        )}
                    </>
                )}
            </ModalBody>

            <ModalFooter flexDir="column" gap="2" pt="0">
                {mode === 'USDT' && (
                    <>
                        <Button
                            mt="2"
                            w="full"
                            isDisabled={!paymentLink || isDepositAddressLoading}
                            onClick={handlePayByLink}
                        >
                            Refill by link
                        </Button>
                        <Button
                            w="full"
                            isDisabled={!paymentLink || isDepositAddressLoading}
                            onClick={onCopyLink}
                            variant="secondary"
                        >
                            Copy refill link
                        </Button>
                    </>
                )}

                {mode === 'PROMO' && (
                    <Button
                        w="full"
                        form={formId}
                        isDisabled={isPromoCodeEmpty}
                        isLoading={isPromoLoading}
                        onClick={handleSubmit(onPromoSubmit)}
                        type="submit"
                        variant="primary"
                    >
                        Apply Promo Code
                    </Button>
                )}

                {detectedRefills.length > 0 && (
                    <>
                        <Divider />
                        <VStack align="stretch" w="full" spacing="1">
                            {detectedRefills.map(refill => (
                                <SuccessRefillMessage
                                    key={refill.id}
                                    amount={refill.amount}
                                    date={refill.date}
                                    onClose={() => handleRemoveRefill(refill.id)}
                                />
                            ))}
                        </VStack>
                        <Button w="full" onClick={onClose} variant="primary">
                            Done
                        </Button>
                    </>
                )}
            </ModalFooter>
        </ModalContent>
    );
};

export default observer(RefillModalContent);
