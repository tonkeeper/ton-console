import { FC, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
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
    UseRadioProps,
    VStack
} from '@chakra-ui/react';
import { FilledWarnIcon16, formatWithSuffix, H4, UsdCurrencyAmount } from 'src/shared';
import { RadioCard } from 'src/shared/ui/checkbox';
import { AppMessagesPackage } from '../model';
import { RefillModalContent } from 'src/entities';
import MessagesPaymentConfirmationModalContent from './MessagesPaymentConfirmationModalContent';
import { usePackagesQuery } from '../model/queries';
import { useBalanceSufficiencyCheck, getPaymentDeficit } from 'src/features/balance';

const MessagesRefillModal: FC<{
    isOpen: boolean;
    onClose: () => void;
}> = ({ isOpen, onClose }) => {
    const { data: options = [] } = usePackagesQuery();
    const [selectedPlan, setSelectedPlan] = useState<AppMessagesPackage | null>(null);

    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'package',
        defaultValue: options[0]?.name || '',
        onChange: name => setSelectedPlan(options.find(pkg => pkg.name === name) || null)
    });
    const group = getRootProps();
    const sufficiencyCheck = useBalanceSufficiencyCheck(selectedPlan?.price.amount ?? null);
    const notEnoughAmount = sufficiencyCheck ? getPaymentDeficit(sufficiencyCheck) : BigInt(0);
    const notEnoughAmountUsdt = new UsdCurrencyAmount(new BigNumber(notEnoughAmount).div(1e6));

    const tonRefillModal = useDisclosure();
    const confirmPaymentModal = useDisclosure();

    useEffect(() => {
        if (!isOpen) {
            tonRefillModal.onClose();
            confirmPaymentModal.onClose();
        }
    }, [isOpen]);

    const onPrimaryButtonClick = (): void => {
        if (notEnoughAmount) {
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
                {options.length > 0 ? (
                    <VStack {...group}>
                        {options.map(pkg => (
                            <RadioCard
                                w="100%"
                                key={pkg.id}
                                {...(getRadioProps({ value: pkg.name }) as UseRadioProps)}
                            >
                                <Box w="100%">
                                    <Flex justify="space-between">
                                        <Text textStyle="label1">{pkg.name}</Text>
                                        <Text textStyle="label1" textAlign="end">
                                            {pkg.price.stringCurrencyAmount}
                                        </Text>
                                    </Flex>
                                    <Text textStyle="body2" color="text.secondary">
                                        {formatWithSuffix(pkg.messagesIncluded)} messages
                                    </Text>
                                </Box>
                            </RadioCard>
                        ))}
                    </VStack>
                ) : (
                    <Center h="200px">
                        <Spinner />
                    </Center>
                )}
                {!!notEnoughAmount && (
                    <Text textStyle="body2" mt="3" color="text.secondary">
                        <FilledWarnIcon16 />
                        &nbsp;Not enough {notEnoughAmountUsdt.stringCurrencyAmount} USDT to buy the
                        plan, fund your account
                    </Text>
                )}
            </ModalBody>
            <ModalFooter gap="3" pt="4">
                <Button flex={1} onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button flex={1} onClick={onPrimaryButtonClick} variant="primary">
                    {notEnoughAmount ? 'Refill balance' : 'Choose'}
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

export default MessagesRefillModal;
