import { FC, useCallback } from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay
} from '@chakra-ui/react';
import {
    sliceAddress,
    Span,
    TonCurrencyAmount,
    TooltipHoverable,
    UsdCurrencyAmount,
    toUserFriendlyAddress
} from 'src/shared';
import { RequestFaucetForm } from '../model';

const FaucetPaymentDetailsModal: FC<{
    isOpen: boolean;
    onClose: () => void;
    amount?: TonCurrencyAmount;
    receiverAddress?: string;
    price?: UsdCurrencyAmount;
    isLoading?: boolean;
    onConfirm?: (form: RequestFaucetForm) => void;
}> = ({ isOpen, onClose, amount, receiverAddress, price, isLoading, onConfirm }) => {
    const userFriendlyAddress = receiverAddress ? toUserFriendlyAddress(receiverAddress) : '';

    const handleConfirm = useCallback((): void => {
        if (onConfirm && amount && receiverAddress) {
            onConfirm({
                amount,
                receiverAddress
            });
        }
    }, [onConfirm, amount, receiverAddress]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
            <ModalOverlay></ModalOverlay>
            <ModalContent>
                <ModalCloseButton />
                <ModalHeader>Payment Details</ModalHeader>
                <ModalBody>
                    <Card>
                        <CardBody
                            textStyle="body2"
                            flexDir="column"
                            gap="3"
                            display="flex"
                            px="6"
                            py="5"
                        >
                            <Flex align="center" justify="space-between">
                                <Span color="text.secondary">Amount</Span>
                                <Span>{amount?.stringCurrencyAmount} (testnet)</Span>
                            </Flex>
                            <Flex align="center" justify="space-between">
                                <Span color="text.secondary">Recipient testnet address</Span>
                                <Span>
                                    <TooltipHoverable
                                        canBeShown
                                        host={<Span>{sliceAddress(userFriendlyAddress)}</Span>}
                                    >
                                        {userFriendlyAddress}
                                    </TooltipHoverable>
                                </Span>
                            </Flex>
                            <Flex align="flex-start" justify="space-between">
                                <Span color="text.secondary">Price</Span>
                                {price && (
                                    <Box textAlign="right">
                                        <Span>{price.stringCurrencyAmount}</Span>
                                        <Box color="text.secondary">USD</Box>
                                    </Box>
                                )}
                            </Flex>
                        </CardBody>
                    </Card>
                </ModalBody>
                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={isLoading}
                        onClick={handleConfirm}
                        variant="primary"
                    >
                        Confirm Purchase
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FaucetPaymentDetailsModal;
