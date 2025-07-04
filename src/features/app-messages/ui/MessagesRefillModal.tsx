import { FunctionComponent, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    useDisclosure,
    useRadioGroup,
    VStack
} from '@chakra-ui/react';
import { CURRENCY, FilledWarnIcon16, formatWithSuffix, H4 } from 'src/shared';
import { RadioCard } from 'src/shared/ui/checkbox';
import { AppMessagesPackage, appMessagesStore } from '../model';
import { CurrencyRate, RefillModalContent } from 'src/entities';
import MessagesPaymentConfirmationModalContent from './MessagesPaymentConfirmationModalContent';
import { observer } from 'mobx-react-lite';
import { balancesStore } from 'src/shared/stores';

const MessagesRefillModal: FunctionComponent<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const options = appMessagesStore.packages$.value;
    const [selectedPlan, setSelectedPlan] = useState<AppMessagesPackage | null>(null);

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'package',
        defaultValue: appMessagesStore.packages$.value[0]?.name || '',
        onChange: name => setSelectedPlan(options.find(pkg => pkg.name === name) || null)
    });
    const group = getRootProps();

    const balance = balancesStore.tonBalanceUSDEquivalent;
    const notEnoughUsd =
        balance && selectedPlan && balance.isLT(selectedPlan?.price)
            ? selectedPlan.price.amount.minus(balance.amount).decimalPlaces(1).toNumber()
            : 0;

    useEffect(() => {
        setSelectedPlan(options[0]);
    }, [options]);

    const tonRefillModal = useDisclosure();
    const confirmPaymentModal = useDisclosure();

    useEffect(() => {
        if (!isOpen) {
            tonRefillModal.onClose();
            confirmPaymentModal.onClose();
        }
    }, [isOpen]);

    const onPrimaryButtonClick = (): void => {
        if (notEnoughUsd) {
            tonRefillModal.onOpen();
        } else {
            confirmPaymentModal.onOpen();
        }
    };

    const Content = (
        <ModalContent>
            <ModalHeader>
                <H4 mb="1">Pricing</H4>
                <Text textStyle="body2" color="text.secondary">
                    It’s one-time payment
                </Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pt="0" pb="2">
                {appMessagesStore.packages$.isResolved ? (
                    <VStack {...group}>
                        {options.map(pkg => (
                            <RadioCard
                                w="100%"
                                key={pkg.id}
                                {...getRadioProps({ value: pkg.name })}
                            >
                                <Box w="100%">
                                    <Flex justify="space-between">
                                        <Text textStyle="label1">{pkg.name}</Text>
                                        <Text textStyle="label1" textAlign="end">
                                            {pkg.price.stringCurrencyAmount}
                                        </Text>
                                    </Flex>
                                    <Flex justify="space-between" w="100%">
                                        <Text textStyle="body2" color="text.secondary">
                                            {formatWithSuffix(pkg.messagesIncluded)} messages
                                        </Text>
                                        <CurrencyRate
                                            textStyle="body2"
                                            color="text.secondary"
                                            leftSign=""
                                            textAlign="end"
                                            currency={CURRENCY.TON}
                                            amount={pkg.price.amount}
                                            reverse
                                            contentUnderSkeleton="&nbsp;TON"
                                        />
                                    </Flex>
                                </Box>
                            </RadioCard>
                        ))}
                    </VStack>
                ) : (
                    <Center h="200px">
                        <Spinner />
                    </Center>
                )}
                {!!notEnoughUsd && (
                    <Text textStyle="body2" mt="3" color="text.secondary">
                        <FilledWarnIcon16 />
                        &nbsp;Not enough ${notEnoughUsd} to buy the plan, fund your account
                    </Text>
                )}
            </ModalBody>
            <ModalFooter gap="3" pt="4">
                <Button flex={1} onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button flex={1} onClick={onPrimaryButtonClick} variant="primary">
                    {notEnoughUsd ? 'Refill balance' : 'Choose'}
                </Button>
            </ModalFooter>
        </ModalContent>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="inside" size="md">
            <ModalOverlay />
            {tonRefillModal.isOpen ? (
                <RefillModalContent onClose={onClose} />
            ) : confirmPaymentModal.isOpen ? (
                <MessagesPaymentConfirmationModalContent onClose={onClose} pkg={selectedPlan!} />
            ) : (
                Content
            )}
        </Modal>
    );
};

export default observer(MessagesRefillModal);
