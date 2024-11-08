import { FunctionComponent, useCallback } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Flex,
    Box
} from '@chakra-ui/react';
import { CURRENCY, DTOLiteproxyTier, H4, Pad, UsdCurrencyAmount } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { balanceStore, CurrencyRate } from 'src/entities';
import { liteproxysStore } from '../../liteproxy';

const LiteserversPaymentDetailsModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    tier: DTOLiteproxyTier;
}> = ({ tier, ...rest }) => {
    const onConfirm = useCallback(async () => {
        await liteproxysStore.selectTier(tier!.id);
        await balanceStore.fetchPortfolio();
        rest.onClose();
    }, [tier]);

    const price = new UsdCurrencyAmount(tier.usd_price);

    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Payment Details</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Upgrade Liteservers to {tier.name} Plan
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <Pad mb="4">
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Plan
                            </Text>
                            <Text textStyle="body2" color="text.primary">
                                {tier.name}
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Included
                            </Text>
                            <Text textStyle="body2" color="text.primary" textAlign="right">
                                {tier.rps} requests per second
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Period
                            </Text>
                            <Text textStyle="body2" color="text.primary">
                                Monthly
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Price
                            </Text>
                            {price.amount.eq(0) ? (
                                <Flex align="center" gap={1}>
                                    <Text textStyle="body2" textAlign="right">
                                        Free
                                    </Text>
                                </Flex>
                            ) : (
                                <Box>
                                    <Text
                                        textStyle="body2"
                                        color="text.primary"
                                        textAlign="right"
                                        title={price.stringAmountWithoutRound}
                                    >
                                        {price.stringCurrencyAmount}
                                    </Text>
                                    <CurrencyRate
                                        textStyle="body2"
                                        color="text.secondary"
                                        textAlign="right"
                                        amount={price.amount}
                                        currency={CURRENCY.TON}
                                        leftSign=""
                                        reverse
                                    >
                                        &nbsp;TON
                                    </CurrencyRate>
                                </Box>
                            )}
                        </Flex>
                    </Pad>
                    <Text textStyle="body3" color="text.secondary">
                        Your plan will renew automatically every month until cancelled. When you
                        switch to a different tariff plan
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => rest.onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={liteproxysStore.selectedTier$.isLoading}
                        onClick={onConfirm}
                        variant="primary"
                    >
                        Confirm Purchase
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default observer(LiteserversPaymentDetailsModal);
