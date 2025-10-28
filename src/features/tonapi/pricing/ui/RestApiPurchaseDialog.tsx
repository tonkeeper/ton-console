import { FC, useCallback } from 'react';
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
import { CURRENCY, H4, InfoTooltip, Pad, UsdCurrencyAmount } from 'src/shared';
import { RestApiTier } from '../model';
import { observer } from 'mobx-react-lite';
import { CurrencyRate } from 'src/entities';
import { projectsStore, restApiTiersStore } from 'src/shared/stores';
import { useQueryClient } from '@tanstack/react-query';

const RestApiPurchaseDialog: FC<{
    isOpen: boolean;
    onClose: () => void;
    selectedTier: RestApiTier;
}> = ({ selectedTier: tier, ...rest }) => {
    const queryClient = useQueryClient();
    const projectId = projectsStore.selectedProject?.id;

    const onConfirm = useCallback(async () => {
        await restApiTiersStore.selectTier(tier!.id);
        // Invalidate balance cache to refetch
        queryClient.invalidateQueries({
            queryKey: ['balance', projectId]
        });
        rest.onClose();
    }, [tier, queryClient, projectId]);

    const unspentMoney = tier.unspentMoney;
    const isFreeTire = tier.price.amount.eq(0);
    const isFreePriceAfterUnspentMoney = unspentMoney && unspentMoney.isGTE(tier.price);
    const isFree = isFreeTire || isFreePriceAfterUnspentMoney;

    const priceAfterUnspentMoney = !unspentMoney
        ? tier.price
        : new UsdCurrencyAmount(tier.price.amount.minus(unspentMoney.amount));

    const correctPrice =
        isFreeTire || isFreePriceAfterUnspentMoney
            ? new UsdCurrencyAmount(0)
            : priceAfterUnspentMoney;

    return (
        <Modal scrollBehavior="inside" size="md" {...rest}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Payment Details</H4>
                    <Text textStyle="body2" color="text.secondary">
                        Upgrade to TON API {tier.name} Plan
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
                        {unspentMoney && (
                            <Flex justify="space-between" gap="10" mb="3">
                                <Text textStyle="body2" color="text.secondary">
                                    Price
                                </Text>
                                <Box>
                                    <Text
                                        textStyle="body2"
                                        color="text.primary"
                                        textAlign="right"
                                        title={tier.price.stringAmountWithoutRound}
                                    >
                                        {tier.price.amount.eq(0)
                                            ? 'Free'
                                            : tier.price.stringCurrencyAmount}
                                    </Text>
                                </Box>
                            </Flex>
                        )}
                        {!isFree && unspentMoney && (
                            <Flex justify="space-between" gap="10" mb="3">
                                <Text textStyle="body2" color="text.secondary">
                                    Unspent funds
                                </Text>
                                <Text
                                    textStyle="body2"
                                    color="text.secondary"
                                    textAlign="right"
                                    title={unspentMoney.stringAmountWithoutRound}
                                >
                                    {unspentMoney.stringCurrencyAmount}
                                </Text>
                            </Flex>
                        )}
                        <Flex justify="space-between" gap="10" mb="3">
                            <Text textStyle="body2" color="text.secondary">
                                {unspentMoney ? 'Total' : 'Price'}
                            </Text>
                            {correctPrice.amount.eq(0) ? (
                                <Flex align="center" gap={1}>
                                    <Text textStyle="body2" textAlign="right">
                                        Free
                                    </Text>
                                    {isFreePriceAfterUnspentMoney && !isFreeTire && (
                                        <InfoTooltip>
                                            <Box textStyle="body2" maxW="200px">
                                                Your unspent money is enough to cover the cost of
                                                the plan
                                            </Box>
                                        </InfoTooltip>
                                    )}
                                </Flex>
                            ) : (
                                <Box>
                                    <Text
                                        textStyle="body2"
                                        color="text.primary"
                                        textAlign="right"
                                        title={correctPrice.stringAmountWithoutRound}
                                    >
                                        {correctPrice.stringCurrencyAmount}
                                    </Text>
                                    <CurrencyRate
                                        textStyle="body2"
                                        color="text.secondary"
                                        textAlign="right"
                                        amount={correctPrice.amount}
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
                        switch to a different tariff plan, any payment you&apos;ve already made for
                        the current month will be forfeited.
                    </Text>
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={() => rest.onClose()} variant="secondary">
                        Cancel
                    </Button>
                    <Button
                        flex={1}
                        isLoading={restApiTiersStore.selectTier.isLoading}
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

export default observer(RestApiPurchaseDialog);
