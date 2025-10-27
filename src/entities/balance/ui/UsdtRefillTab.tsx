import { FC, useRef } from 'react';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { Pad, Span } from 'src/shared';
import { QRCodeSVG } from 'qrcode.react';
import { Text, Center } from '@chakra-ui/react';

const USDT_DECIMALS = 6;

type UsdtRefillTabProps = {
    amount: string;
    setAmount: (amount: string) => void;
    paymentLink: string | null;
    isDepositAddressLoading: boolean;
    depositAddressError: boolean;
};

export const UsdtRefillTab: FC<UsdtRefillTabProps> = ({
    amount,
    setAmount,
    paymentLink,
    isDepositAddressLoading,
    depositAddressError
}) => {
    const amountInputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <InputGroup mb="4">
                <Input
                    ref={amountInputRef}
                    pr="60px"
                    fontSize="lg"
                    fontWeight="medium"
                    bg="white"
                    autoFocus
                    onChange={e => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        const symbols = value.split('.')[1]?.length;

                        if (symbols && symbols > USDT_DECIMALS) {
                            return;
                        }

                        setAmount(value);
                    }}
                    placeholder="Enter amount"
                    value={amount}
                />
                <InputRightElement
                    textStyle="body2"
                    w="60px"
                    color="text.secondary"
                >
                    <Span>USDT</Span>
                </InputRightElement>
            </InputGroup>

            <Pad
                mb="4"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
            >
                {paymentLink && !isDepositAddressLoading && !depositAddressError ? (
                    <QRCodeSVG
                        bgColor="transparent"
                        size={200}
                        value={paymentLink}
                    />
                ) : !isDepositAddressLoading && depositAddressError ? (
                    <Center h="200px">
                        <Text textStyle="body2" color="text.secondary">
                            Error fetching deposit address
                        </Text>
                    </Center>
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
                    textStyle="body2"
                    mt="4"
                    color="text.secondary"
                    textAlign="center"
                >
                    {paymentLink
                        ? 'Scan QR code for refill'
                        : 'QR code for refill will appear here'}
                </Text>
            </Pad>
        </>
    );
};
