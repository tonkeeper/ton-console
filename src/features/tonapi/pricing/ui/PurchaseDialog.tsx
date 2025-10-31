import { FC } from 'react';
import {
    Alert,
    AlertIcon,
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
import { H4, InfoTooltip, Pad, UsdCurrencyAmount } from 'src/shared';

export interface TierForPurchaseDialog {
    id: number;
    name: string;
    rps: number;
    unspentMoney?: UsdCurrencyAmount;
    type?: 'monthly' | 'pay-as-you-go';
    // Either usd_price OR price should be provided
    usd_price?: number;
    price?: UsdCurrencyAmount;
}

interface PurchaseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    tier: TierForPurchaseDialog;
    title: string;
    isLoading: boolean;
    onConfirm: () => void;
}

const PurchaseDialog: FC<PurchaseDialogProps> = ({
    isOpen,
    onClose,
    tier,
    title,
    isLoading,
    onConfirm
}) => {
    const unspentMoney = tier.unspentMoney;
    // Support both RestApiTier (with price: UsdCurrencyAmount) and DTOLiteproxyTier (with usd_price: number)
    const price = tier.price || new UsdCurrencyAmount(tier.usd_price || 0);

    const isFreeTire = price.amount.eq(0);
    const isFreePriceAfterUnspentMoney = unspentMoney && unspentMoney.isGTE(price);

    const priceAfterUnspentMoney = !unspentMoney
        ? price
        : new UsdCurrencyAmount(price.amount.minus(unspentMoney.amount));

    const correctPrice =
        isFreeTire || isFreePriceAfterUnspentMoney
            ? new UsdCurrencyAmount(0)
            : priceAfterUnspentMoney;

    const isMonthlyTier = !tier.type || tier.type === 'monthly';
    const isPayAsYouGo = tier.type === 'pay-as-you-go';

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <H4 mb="1">Payment Details</H4>
                    <Text textStyle="body2" color="text.secondary">
                        {title}
                    </Text>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody py="0">
                    <Pad mb="4">
                        <Flex justify="space-between" gap="10" mb="1">
                            <Text textStyle="body2" color="text.secondary">
                                Plan
                            </Text>
                            <Text textStyle="body2" color="text.primary">
                                {tier.name}
                            </Text>
                        </Flex>
                        <Flex justify="space-between" gap="10" mb="1">
                            <Text textStyle="body2" color="text.secondary">
                                Included
                            </Text>
                            <Text textStyle="body2" color="text.primary" textAlign="right">
                                {tier.rps} RPS
                            </Text>
                        </Flex>
                        {isMonthlyTier && (
                            <Flex justify="space-between" gap="10" mb="1">
                                <Text textStyle="body2" color="text.secondary">
                                    Period
                                </Text>
                                <Text textStyle="body2" color="text.primary">
                                    Monthly
                                </Text>
                            </Flex>
                        )}
                        {isPayAsYouGo && (
                            <Flex justify="space-between" gap="10" mb="1">
                                <Text textStyle="body2" color="text.secondary">
                                    Price Model
                                </Text>
                                <Text textStyle="body2" color="text.primary">
                                    per 1K requests
                                </Text>
                            </Flex>
                        )}
                        {unspentMoney && (
                            <Flex justify="space-between" gap="10" mb="1">
                                <Text textStyle="body2" color="text.secondary">
                                    Price
                                </Text>
                                <Box>
                                    <Text
                                        textStyle="body2"
                                        color="text.primary"
                                        textAlign="right"
                                        title={price.stringAmountWithoutRound}
                                    >
                                        {price.amount.eq(0) ? 'Free' : price.stringCurrencyAmount}
                                    </Text>
                                </Box>
                            </Flex>
                        )}
                        {!isFreePriceAfterUnspentMoney && !isFreeTire && unspentMoney && (
                            <Flex justify="space-between" gap="10" mb="1">
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
                        {!isPayAsYouGo && (
                            <Flex justify="space-between" gap="10" mb="1">
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
                                                    Your unspent money is enough to cover the cost
                                                    of the plan
                                                </Box>
                                            </InfoTooltip>
                                        )}
                                    </Flex>
                                ) : (
                                    <Text
                                        textStyle="body2"
                                        color="text.primary"
                                        textAlign="right"
                                        title={correctPrice.stringAmountWithoutRound}
                                    >
                                        {correctPrice.stringCurrencyAmount}
                                    </Text>
                                )}
                            </Flex>
                        )}
                    </Pad>
                    {isMonthlyTier && (
                        <Text textStyle="body3" color="text.secondary">
                            Your plan will renew automatically every month until cancelled.
                        </Text>
                    )}
                    {unspentMoney &&
                        priceAfterUnspentMoney.amount.isNegative() &&
                        isMonthlyTier && (
                            <Alert mt="4" borderRadius="md" status="warning" variant="subtle">
                                <AlertIcon />
                                <Box>
                                    <Text textStyle="body3" mb="1">
                                        You will be switched to the new tariff immediately
                                    </Text>
                                    <Text textStyle="body3" color="text.secondary">
                                        Remaining days of your current plan will be forfeited
                                    </Text>
                                </Box>
                            </Alert>
                        )}
                </ModalBody>

                <ModalFooter gap="3">
                    <Button flex={1} onClick={onClose} variant="secondary">
                        Cancel
                    </Button>
                    <Button flex={1} isLoading={isLoading} onClick={onConfirm} variant="primary">
                        Confirm Purchase
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

PurchaseDialog.displayName = 'PurchaseDialog';

export default PurchaseDialog;
