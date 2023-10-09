import { FunctionComponent } from 'react';
import {
    Button,
    Card,
    CardBody,
    Flex,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Text
} from '@chakra-ui/react';
import { createInvoicePaymentLink, Invoice } from 'src/features';
import { CopyPad, CURRENCY, H4, Span, toTimeLeft } from 'src/shared';
import { CurrencyRate } from 'src/entities';
import { useCountdown } from 'src/shared/hooks/useCountdown';

export const ViewInvoiceModalContent: FunctionComponent<{
    onClose: () => void;
    invoice: Invoice;
}> = ({ onClose, invoice }) => {
    const secondsLeft = useCountdown(
        Math.floor((invoice.validUntil.getTime() - Date.now()) / 1000)
    );
    const formattedTimeLeft = toTimeLeft(secondsLeft * 1000);

    return (
        <ModalContent>
            <ModalCloseButton />
            <ModalHeader>
                <H4 mb="1">Invoice</H4>
                <Text textStyle="body2" color="text.secondary">
                    <Span>ID {invoice.id}</Span>
                    {invoice.description && <Span>&nbsp;·&nbsp;{invoice.description}</Span>}
                </Text>
            </ModalHeader>
            <ModalBody>
                <Card mb="4">
                    <CardBody textStyle="body2" px="6" py="5">
                        <Flex justify="space-between" mb="3">
                            <Span color="text.secondary">Life time</Span>
                            <Span color="text.primary" fontFamily="mono">
                                {formattedTimeLeft}
                            </Span>
                        </Flex>
                        <Flex justify="space-between">
                            <Span color="text.secondary">Amount</Span>
                            <Span color="text.primary">{invoice.amount.stringCurrencyAmount}</Span>
                        </Flex>
                        <Flex justify="flex-end">
                            <CurrencyRate
                                color="text.secondary"
                                textStyle="body2"
                                leftSign="$"
                                currency={CURRENCY.TON}
                                amount={invoice.amount.amount}
                            />
                        </Flex>
                    </CardBody>
                </Card>
                {invoice.status === 'pending' && (
                    <>
                        <Text textStyle="label2" mb="2">
                            Link for payment
                        </Text>
                        <CopyPad text={createInvoicePaymentLink(invoice)} />
                    </>
                )}
            </ModalBody>
            <ModalFooter gap="3">
                <Button flex={1} onClick={onClose} variant="secondary">
                    Done
                </Button>
            </ModalFooter>
        </ModalContent>
    );
};
