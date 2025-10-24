import { FC } from 'react';
import {
    Button,
    Card,
    CardBody,
    Flex,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader
} from '@chakra-ui/react';
import { CURRENCY, formatWithSuffix, Span } from 'src/shared';
import { AppMessagesPackage, appMessagesStore } from '../model';
import { CurrencyRate } from 'src/entities';
import { observer } from 'mobx-react-lite';

const MessagesPaymentConfirmationModalContent: FC<{
    onClose: () => void;
    pkg: AppMessagesPackage;
}> = ({ onClose, pkg }) => {
    const onConfirm = (): Promise<void> => appMessagesStore.buyPackage(pkg.id).then(onClose);

    return (
        <ModalContent>
            <ModalHeader>Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody pt="0" pb="2">
                <Card>
                    <CardBody textStyle="body2" px="6" py="5">
                        <Flex justify="space-between" mb="3">
                            <Span color="text.secondary">Package</Span>
                            <Span>{pkg.name}</Span>
                        </Flex>
                        <Flex justify="space-between" mb="3">
                            <Span color="text.secondary">Includes</Span>
                            <Span>{formatWithSuffix(pkg.messagesIncluded)} messages</Span>
                        </Flex>
                        <Flex justify="space-between" mb="3">
                            <Span color="text.secondary">Type</Span>
                            <Span>One-time payment</Span>
                        </Flex>
                        <Flex justify="space-between">
                            <Span color="text.secondary">Price</Span>
                            <Span>{pkg.price.stringCurrencyAmount}</Span>
                        </Flex>
                        <Flex justify="flex-end">
                            <CurrencyRate
                                color="text.secondary"
                                textStyle="body2"
                                currency={CURRENCY.TON}
                                amount={pkg.price.amount}
                                reverse
                            >
                                &nbsp;TON
                            </CurrencyRate>
                        </Flex>
                    </CardBody>
                </Card>
            </ModalBody>
            <ModalFooter gap="3" pt="4">
                <Button flex={1} onClick={onClose} variant="secondary">
                    Cancel
                </Button>
                <Button
                    flex={1}
                    isLoading={appMessagesStore.buyPackage.isLoading}
                    onClick={onConfirm}
                    variant="primary"
                >
                    Purchase
                </Button>
            </ModalFooter>
        </ModalContent>
    );
};

export default observer(MessagesPaymentConfirmationModalContent);
