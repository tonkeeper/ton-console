import { FC } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    VStack,
    Box,
    Flex
} from '@chakra-ui/react';

export interface InsufficientBalanceState {
    message: string;
    needUsd: number;
    currentBalance: bigint;
}

interface InsufficientBalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRefill: () => void;
    error?: InsufficientBalanceState;
}

export const InsufficientBalanceModal: FC<InsufficientBalanceModalProps> = ({
    isOpen,
    onClose,
    onOpenRefill,
    error
}) => {
    if (!error) return null;

    const formatBalance = (amount: number): string => {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    const { currentBalance: currentBalanceBigint, needUsd: requiredBalance } = error ?? {};

    const currentBalance = Number(currentBalanceBigint) / 1e6;
    const deficit =
        currentBalance !== undefined && requiredBalance !== undefined
            ? requiredBalance - currentBalance
            : undefined;

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Insufficient Balance</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack align="flex-start" w="100%" spacing="4">
                        {/* Caption */}
                        <Text color="text.secondary">
                            The estimated cost is approximate. Your balance must meet or exceed the required amount to execute the query.
                        </Text>

                        {/* Required and Current Balance in one row */}
                        <Flex gap="4" w="100%">
                            {/* Requirement info */}
                            <Box flex="1">
                                <Text mb="2" color="text.secondary" fontSize="sm" fontWeight="500">
                                    Required for query execution
                                </Text>
                                <Text color="text.primary" fontSize="lg" fontWeight="bold">
                                    ${formatBalance(requiredBalance)}
                                </Text>
                            </Box>

                            {/* Current balance */}
                            <Box flex="1">
                                <Text mb="2" color="text.secondary" fontSize="sm" fontWeight="500">
                                    Current USDT Balance
                                </Text>
                                <Text color="text.primary" fontSize="lg" fontWeight="bold">
                                    ${formatBalance(currentBalance)}
                                </Text>
                            </Box>
                        </Flex>

                        {/* Deficit alert */}
                        {deficit !== undefined && deficit > 0 && (
                            <Box
                                w="100%"
                                p="3"
                                bg="status.error.background"
                                borderColor="status.error.foreground"
                                borderLeft="3px solid"
                                borderRadius="8px"
                            >
                                <Text color="status.error.foreground" fontSize="sm">
                                    You need to top up your balance by at least{' '}
                                    <Box as="span" fontWeight="bold">
                                        ${formatBalance(deficit)}
                                    </Box>
                                </Text>
                            </Box>
                        )}
                    </VStack>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button onClick={onClose} variant="secondary">
                        Close
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            onOpenRefill();
                        }}
                        variant="primary"
                    >
                        Top Up Balance
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
