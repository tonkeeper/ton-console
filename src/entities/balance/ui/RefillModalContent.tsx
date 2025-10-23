import { FC, useEffect, useMemo, useRef, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Input,
    InputGroup,
    InputRightElement,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spinner,
    Stack,
    Text,
    useClipboard,
    useRadio,
    useRadioGroup
} from '@chakra-ui/react';
import { createTransferLink, fromDecimals, H4, Pad, Span } from 'src/shared';
import { QRCodeSVG } from 'qrcode.react';
import { observer } from 'mobx-react-lite';
import { balanceStore } from 'src/shared/stores';

type Currency = 'USDT' | 'TON';

const USDT_DECIMALS = 6;
const TON_DECIMALS = 9;

const CURRENCY_DECIMALS: Record<Currency, number> = {
    USDT: USDT_DECIMALS,
    TON: TON_DECIMALS
} as const;

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
                flex={1}
                px="4"
                py="2"
                h="44px"
                borderRadius="md"
                alignContent="center"
                cursor="pointer"
                textAlign="center"
                fontWeight="medium"
                textStyle="body2"
                transition="all 0.2s"
                bg="transparent"
                _checked={{
                    bg: 'background.contentTint'
                }}
            >
                {props.children}
            </Box>
        </Box>
    );
};

const RefillModalContent: FC<{
    onClose: () => void;
}> = () => {
    const depositAddress = balanceStore.depositAddress$.value;
    const usdtDepositWallet = depositAddress?.usdt_deposit_wallet;
    const tonDepositWallet = depositAddress?.ton_deposit_wallet;
    const inputRef = useRef<HTMLInputElement>(null);

    const currency_addresses: Record<Currency, string | undefined> = {
        USDT: usdtDepositWallet,
        TON: tonDepositWallet
    } as const;

    const [currency, setCurrency] = useState<Currency>('USDT');
    const [amount, setAmount] = useState<string>('');

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'currency',
        defaultValue: currency,
        onChange: val => {
            setCurrency(val as Currency);
            setAmount('');
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    });

    const paymentLink = useMemo(() => {
        if (!usdtDepositWallet) return null;
        if (currency === 'TON' && !tonDepositWallet) return null;
        if (amount === '' || Number(amount) === 0) return null;

        const address = currency_addresses[currency];
        if (!address) return null;

        const decimals = CURRENCY_DECIMALS[currency];
        const numAmount = fromDecimals(amount, decimals);

        const options: Parameters<typeof createTransferLink>[1] = {
            amount: numAmount.toString()
        };

        if (currency === 'USDT') {
            const jettonAddress = import.meta.env.VITE_USDT_JETTON_ADDRESS;
            if (!jettonAddress) {
                return null;
            }
            options.jetton = jettonAddress;
        }

        return createTransferLink(address, options);
    }, [currency, amount, usdtDepositWallet, tonDepositWallet]);

    const { onCopy: onCopyLink } = useClipboard(paymentLink ?? '');

    const handlePayByLink = () => {
        if (!paymentLink) return;
        window.open(paymentLink, '_blank');
    };

    const showCurrencyTabs = !!tonDepositWallet;

    return (
        <ModalContent maxW="400px">
            <ModalHeader>
                <H4 mb="1">Balance Refill</H4>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pt="0" pb="4">
                {balanceStore.depositAddress$.isLoading ? (
                    <Center h="80px">
                        <Spinner />
                    </Center>
                ) : balanceStore.depositAddress$.error ? (
                    <Box color="accent.orange">
                        <Box>Balance refill is not available right now.</Box>
                        <Box>Please try again later.</Box>
                    </Box>
                ) : (
                    <>
                        {showCurrencyTabs && (
                            <Stack
                                {...getRootProps()}
                                direction="row"
                                gap="2"
                                mb="4"
                                borderRadius="lg"
                                border="1px"
                                borderColor="separator.common"
                                p="2"
                            >
                                <RadioCard value="USDT" {...getRadioProps({ value: 'USDT' })}>
                                    USDT
                                </RadioCard>
                                <RadioCard value="TON" {...getRadioProps({ value: 'TON' })}>
                                    TON
                                </RadioCard>
                            </Stack>
                        )}

                        {currency === 'TON' && (
                            <Text textStyle="body2" color="accent.orange" mb="1" textAlign="center">
                                TON Balance is deprecated, please use USDT instead
                            </Text>
                        )}
                        <InputGroup mb="4">
                            <Input
                                ref={inputRef}
                                placeholder="Enter amount"
                                autoFocus
                                pr="60px"
                                value={amount}
                                onChange={e => {
                                    const value = e.target.value.replace(/[^\d.]/g, '');
                                    const symbols = value.split('.')[1]?.length;

                                    if (symbols && symbols > CURRENCY_DECIMALS[currency]) {
                                        return;
                                    }

                                    setAmount(value);
                                }}
                                fontSize="lg"
                                bg="white"
                                fontWeight="medium"
                            />
                            <InputRightElement textStyle="body2" w="60px" color="text.secondary">
                                <Span>{currency}</Span>
                            </InputRightElement>
                        </InputGroup>

                        <Pad
                            mb="4"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexDirection="column"
                        >
                            {paymentLink ? (
                                <QRCodeSVG bgColor="transparent" size={200} value={paymentLink} />
                            ) : (
                                <svg
                                    width="200"
                                    height="200"
                                    viewBox="0 0 128 128"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M23 75.5C25.2091 75.5 27 77.2909 27 79.5V81.7998C27 88.5204 26.9997 91.8813 28.3076 94.4482C29.4581 96.706 31.294 98.5419 33.5518 99.6924C36.1187 101 39.4796 101 46.2002 101H48.5C50.7091 101 52.5 102.791 52.5 105C52.5 107.209 50.7091 109 48.5 109C48.4493 109 48.3989 108.998 48.3486 108.996C38.887 108.983 33.8464 108.821 29.9199 106.82C26.1568 104.903 23.0971 101.843 21.1797 98.0801C19.179 94.1534 19.0164 89.1126 19.0029 79.6504C19.0011 79.6005 19 79.5504 19 79.5C19 77.2909 20.7909 75.5 23 75.5ZM105 75.5C107.209 75.5 109 77.2909 109 79.5C109 79.5504 108.998 79.6005 108.996 79.6504C108.983 89.1126 108.821 94.1534 106.82 98.0801C104.903 101.843 101.843 104.903 98.0801 106.82C94.1534 108.821 89.1126 108.983 79.6504 108.996C79.6005 108.998 79.5504 109 79.5 109C77.2909 109 75.5 107.209 75.5 105C75.5 102.791 77.2909 101 79.5 101H81.7998C88.5204 101 91.8813 101 94.4482 99.6924C96.706 98.5419 98.5419 96.706 99.6924 94.4482C101 91.8813 101 88.5204 101 81.7998V79.5C101 77.2909 102.791 75.5 105 75.5ZM48.5 19C50.7091 19 52.5 20.7909 52.5 23C52.5 25.2091 50.7091 27 48.5 27H46.2002C39.4796 27 36.1187 26.9997 33.5518 28.3076C31.294 29.4581 29.4581 31.294 28.3076 33.5518C26.9997 36.1187 27 39.4796 27 46.2002V48.5L26.9951 48.7061C26.8879 50.8194 25.14 52.5 23 52.5C20.7909 52.5 19 50.7091 19 48.5C19 48.4493 19.0011 48.3989 19.0029 48.3486C19.0164 38.887 19.1791 33.8464 21.1797 29.9199C23.0971 26.1568 26.1568 23.0971 29.9199 21.1797C33.8533 19.1755 38.9047 19.0149 48.3984 19.002C48.4322 19.0011 48.466 19 48.5 19ZM79.6006 19.002C89.095 19.0149 94.1465 19.1755 98.0801 21.1797C101.843 23.0971 104.903 26.1568 106.82 29.9199C108.821 33.8464 108.983 38.887 108.996 48.3486C108.998 48.3989 109 48.4493 109 48.5C109 50.7091 107.209 52.5 105 52.5C102.86 52.5 101.112 50.8194 101.005 48.7061L101 48.5V46.2002C101 39.4796 101 36.1187 99.6924 33.5518C98.5419 31.2939 96.706 29.4581 94.4482 28.3076C91.8813 26.9997 88.5204 27 81.7998 27H79.5C77.2909 27 75.5 25.2091 75.5 23C75.5 20.7909 77.2909 19 79.5 19C79.5336 19 79.5672 19.0011 79.6006 19.002Z"
                                        fill="#A0A6AD"
                                    />
                                    <rect
                                        opacity="0.32"
                                        x="40"
                                        y="40"
                                        width="48"
                                        height="48"
                                        rx="8"
                                        fill="#A0A6AD"
                                    />
                                </svg>
                            )}

                            <Text
                                textAlign="center"
                                textStyle="body2"
                                color="text.secondary"
                                mt="4"
                            >
                                {paymentLink
                                    ? 'Scan QR code for refill'
                                    : 'QR code for refill will appear here'}
                            </Text>
                        </Pad>
                    </>
                )}
            </ModalBody>

            <ModalFooter gap="3" pt="0" flexDirection="column">
                <Button
                    w="full"
                    onClick={handlePayByLink}
                    isDisabled={!paymentLink || balanceStore.depositAddress$.isLoading}
                >
                    Refill by link
                </Button>
                <Button
                    w="full"
                    onClick={onCopyLink}
                    variant="secondary"
                    isDisabled={!paymentLink || balanceStore.depositAddress$.isLoading}
                >
                    Copy refill link
                </Button>
            </ModalFooter>
        </ModalContent>
    );
};

export default observer(RefillModalContent);
