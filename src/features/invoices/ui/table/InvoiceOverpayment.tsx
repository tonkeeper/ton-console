import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Invoice } from 'src/features';
import { FilledInfoIcon16, Span } from 'src/shared';

export const InvoiceOverpayment: FunctionComponent<
    { invoice: Invoice } & ComponentProps<typeof Box>
> = props => {
    const { invoice, ...rest } = props;

    return (
        <Flex
            align="center"
            flexShrink="0"
            minW="fit-content"
            px="3"
            py="1.5"
            bg="background.contentTint"
            borderRadius="full"
            {...rest}
        >
            <FilledInfoIcon16 color="accent.red" />
            <Span ml="1.5" textStyle="label3" fontFamily="mono">
                <Span color="text.secondary">Overpayment: </Span>
                <Span>{invoice.overpayment!.toStringCurrencyAmount({ decimalPlaces: 'all' })}</Span>
            </Span>
        </Flex>
    );
};
