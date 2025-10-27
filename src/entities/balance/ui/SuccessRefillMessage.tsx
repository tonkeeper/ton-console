import { FC } from 'react';
import { Box, HStack, VStack, Text, IconButton, Flex } from '@chakra-ui/react';
import { CloseIcon, CheckCircleIcon } from '@chakra-ui/icons';

type SuccessRefillMessageProps = {
    amount: string;
    date: Date;
    onClose: () => void;
};

export const SuccessRefillMessage: FC<SuccessRefillMessageProps> = ({
    amount,
    date,
    onClose
}) => {
    const timeString = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return (
        <HStack
            align="flex-start"
            justify="space-between"
            w="full"
            p="3"
            bg="green.50"
        >
            <HStack align="flex-start" flex={1} spacing="2">
                <Box flexShrink={0} mt="1" color="green.500">
                    <CheckCircleIcon w="5" h="5" />
                </Box>
                <VStack align="flex-start" flex={1} spacing="0">
                    <Text textStyle="label1" color="green.900">
                        Refill detected
                    </Text>
                    <Flex>
                        <Text textStyle="body2" color="green.800">
                            {amount} received at {timeString}
                        </Text>
                    </Flex>
                </VStack>
            </HStack>
            <HStack flexShrink={0} spacing="2">
                <IconButton
                    aria-label="Close"
                    icon={<CloseIcon w="3" h="3" />}
                    onClick={onClose}
                    size="sm"
                    variant="ghost"
                />
            </HStack>
        </HStack>
    );
};
