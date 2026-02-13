import { FC } from 'react';
import { Box, VStack, HStack, Text } from '@chakra-ui/react';
import { CopyPad, FilledWarnIcon16 } from 'src/shared';

type TonDeprecatedTabProps = {
    tonDepositWallet: string | undefined;
};

export const TonDeprecatedTab: FC<TonDeprecatedTabProps> = ({ tonDepositWallet }) => {
    return (
        <VStack  spacing="4">
            <Box
                w="full"
                p="4"
                bg="orange.50"
                borderRadius="md"
            >
                <HStack align="flex-start" spacing="2">
                    <Box
                        flexShrink={0}
                        mt="1"
                        color="accent.orange"
                    >
                        <FilledWarnIcon16 />
                    </Box>
                    <VStack align="flex-start" spacing="1">
                        <Text textStyle="label1" color="orange.900">
                            TON Balance is Deprecated
                        </Text>
                        <Text textStyle="body2" color="orange.800">
                            This method is no longer recommended. Please use USDT refills instead.
                        </Text>
                    </VStack>
                </HStack>
            </Box>

            {tonDepositWallet && (
                <Box w="full">
                    <Text textStyle="body2" color="text.secondary">
                        Deposit address for TON (legacy):
                    </Text>
                    <CopyPad text={tonDepositWallet} />
                </Box>
            )}
        </VStack>
    );
};
