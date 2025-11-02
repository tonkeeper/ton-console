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
    Box
} from '@chakra-ui/react';

interface InsufficientBalanceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenRefill: () => void;
    errorMessage?: string;
    currentBalance?: number;
    requiredBalance?: number;
}

export const InsufficientBalanceModal: FC<InsufficientBalanceModalProps> = ({
    isOpen,
    onClose,
    onOpenRefill,
    errorMessage,
    currentBalance,
    requiredBalance
}) => {
    const deficit = currentBalance && requiredBalance ? requiredBalance - currentBalance : undefined;

    const formatBalance = (amount: number): string => {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Insufficient Balance</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {errorMessage ? (
                        <Box
                            w="100%"
                            p="3"
                            bg="status.error.background"
                            borderColor="status.error.foreground"
                            borderLeft="3px solid"
                            borderRadius="8px"
                        >
                            <Text color="status.error.foreground" fontSize="sm">
                                {errorMessage}
                            </Text>
                        </Box>
                    ) : (
                        <VStack align="flex-start" w="100%" spacing="4">
                            {currentBalance !== undefined && (
                                <Box>
                                    <Text mb="2" color="text.secondary" fontSize="sm">
                                        Current Balance:
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold">
                                        ${formatBalance(currentBalance)}
                                    </Text>
                                </Box>
                            )}

                            {requiredBalance !== undefined && (
                                <Box>
                                    <Text mb="2" color="text.secondary" fontSize="sm">
                                        Required Balance for Reservation:
                                    </Text>
                                    <Text fontSize="lg" fontWeight="bold">
                                        ${formatBalance(requiredBalance)}
                                    </Text>
                                </Box>
                            )}

                            {deficit !== undefined && (
                                <Box
                                    w="100%"
                                    p="3"
                                    bg="status.error.background"
                                    borderColor="status.error.foreground"
                                    borderLeft="3px solid"
                                    borderRadius="8px"
                                >
                                    <Text color="status.error.foreground" fontSize="sm">
                                        Please top up your balance by at least{' '}
                                        <Box as="span" fontWeight="bold">
                                            ${formatBalance(deficit)}
                                        </Box>
                                    </Text>
                                </Box>
                            )}
                        </VStack>
                    )}
                </ModalBody>

                <ModalFooter gap="3">
                    <Button onClick={onClose} variant="ghost">
                        Close
                    </Button>
                    <Button
                        colorScheme="blue"
                        onClick={() => {
                            onClose();
                            onOpenRefill();
                        }}
                    >
                        Top Up Balance
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
