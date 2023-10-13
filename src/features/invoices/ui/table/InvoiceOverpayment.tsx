import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { Invoice, invoicesTableStore } from 'src/features';
import { FilledInfoIcon16, InfoIcon16, Span, toDateTime, TooltipHoverable } from 'src/shared';

export const InvoiceOverpayment: FunctionComponent<
    { invoice: Invoice } & ComponentProps<typeof Box>
> = props => {
    const { invoice, ...rest } = props;

    if (invoice.refundDate) {
        return (
            <TooltipHoverable
                host={
                    <Flex
                        align="center"
                        px="3"
                        py="1.5"
                        bg="background.contentTint"
                        borderRadius="full"
                        {...rest}
                    >
                        <InfoIcon16 color="icon.tertiary" />
                        <Span ml="1.5" textStyle="label3" fontFamily="mono">
                            <Span color="text.secondary">Refunded: </Span>
                            <Span>{invoice.refundedAmount!.stringCurrencyAmount}</Span>
                        </Span>
                    </Flex>
                }
                canBeShown={true}
            >
                <Span textStyle="label2" color="text.secondary" fontFamily="mono">
                    Marked as refunded
                </Span>
                <Span textStyle="label2" fontFamily="mono">
                    {toDateTime(invoice.refundDate, { includeYear: true })}
                </Span>
            </TooltipHoverable>
        );
    }

    return (
        <Menu placement="bottom-end" {...rest}>
            <MenuButton ml="auto" onClick={e => e.stopPropagation()}>
                <Flex
                    align="center"
                    px="3"
                    py="1.5"
                    bg="background.contentTint"
                    borderRadius="full"
                >
                    <FilledInfoIcon16 color="accent.red" />
                    <Span ml="1.5" textStyle="label3" fontFamily="mono">
                        <Span color="text.secondary">Overpayment: </Span>
                        <Span>{invoice.overpayment!.stringCurrencyAmount}</Span>
                    </Span>
                </Flex>
            </MenuButton>
            <MenuList w="200px">
                <MenuItem
                    disabled={invoicesTableStore.markInvoiceAsRefunded.isLoading}
                    onClick={e => {
                        e.stopPropagation();
                        invoicesTableStore.markInvoiceAsRefunded({
                            id: invoice.id,
                            refundedAmount: Number(invoice.overpayment!.stringWeiAmount)
                        });
                    }}
                >
                    <Text textStyle="label2">Mark as refunded</Text>
                </MenuItem>
            </MenuList>
        </Menu>
    );
};
