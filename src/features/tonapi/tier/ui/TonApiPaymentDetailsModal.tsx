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
    chakra,
    Flex,
    Box
} from '@chakra-ui/react';
import { CURRENCY, H4, Pad } from 'src/shared';
import { TonApiTier, tonApiTiersStore } from '../model';
import { observer } from 'mobx-react-lite';
import { balanceStore, CurrencyRate } from 'src/entities';

const TonApiPaymentDetailsModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
    tier?: TonApiTier;
}> = ({ tier, ...rest }) => {
    const onConfirm = useCallback(async () => {
        await tonApiTiersStore.selectTier(tier!.id);
        await balanceStore.fetchPortfolio();
        rest.onClose();
    }, [tier]);

    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Payment Details</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Upgrade to TON API {tier?.name} Plan
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
                                {tier?.name}
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                Included
                            </Text>
                            <Text textStyle="body2" color="text.primary" textAlign="right">
                                {tier?.description.requestsPerSecondLimit} requests per second
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
                            <Box>
                                <Text textStyle="body2" color="text.primary" textAlign="right">
                                    {tier?.price.stringCurrencyAmount}
                                </Text>
                                {tier && (
                                    <CurrencyRate
                                        textStyle="body2"
                                        color="text.secondary"
                                        textAlign="right"
                                        amount={tier.price.amount}
                                        currency={CURRENCY.TON}
                                        leftSign=""
                                        reverse
                                    >
                                        &nbsp;TON
                                    </CurrencyRate>
                                )}
                            </Box>
                        </Flex>
                    </Pad>
                    <Text textStyle="body3" color="text.secondary">
                        Your plan will renew automatically every month until cancelled. When you
                        switch to a different tariff plan, any{' '}
                        <chakra.span color="text.primary">
                            {' '}
                            payment you&apos;ve already made for the current month will be
                            forfeited.
                        </chakra.span>
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => rest.onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={tonApiTiersStore.selectTier.isLoading}
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

export default observer(TonApiPaymentDetailsModal);
