import { FunctionComponent, useContext } from 'react';
import {
    Box,
    Center,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Td,
    Text,
    Tooltip,
    Tr,
    useClipboard
} from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Invoice, invoicesTableStore, InvoiceSuccessful } from '../../models';
import {
    CopyIcon16,
    sliceAddress,
    Span,
    TooltipHoverable,
    toTimeLeft,
    VerticalDotsIcon16,
    useCountdown
} from 'src/shared';
import { InvoicesTableContext } from './invoices-table-context';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

const LoadingRaw: FunctionComponent = () => {
    const { rawHeight } = useContext(InvoicesTableContext);
    return (
        <Tr h={rawHeight} maxH={rawHeight}>
            <Td colSpan={6}>
                <Center>
                    <Spinner size="sm" />
                </Center>
            </Td>
        </Tr>
    );
};

const ItemRaw: FunctionComponent<{ invoice: Invoice }> = observer(({ invoice }) => {
    const { onCopy, hasCopied } = useClipboard(invoice.id);
    const { rawHeight } = useContext(InvoicesTableContext);
    const slicedAddress = sliceAddress(invoice.receiverAddress, { headLength: 6, tailLength: 6 });

    const timeoutSeconds =
        invoice.status === 'pending'
            ? Math.floor((invoice.validUntil.getTime() - Date.now()) / 1000)
            : 0;

    const secondsLeft = useCountdown(timeoutSeconds);
    const formattedTimeLeft = secondsLeft === 0 ? '' : toTimeLeft(secondsLeft * 1000);

    const canCancel = invoice.status === 'pending';

    const paidBy =
        invoice.status === 'success'
            ? sliceAddress(invoice.paidBy, { headLength: 6, tailLength: 6 })
            : '';

    return (
        <Tr sx={{ td: { px: 2, py: 0 } }} h={rawHeight} maxH={rawHeight}>
            <Td
                minW="100px"
                borderLeft="1px"
                borderLeftColor="background.contentTint"
                boxSizing="content-box"
            >
                <Tooltip isOpen={hasCopied} label="Copied!">
                    <IconButton
                        h="4"
                        mr="4"
                        aria-label="copy"
                        icon={<CopyIcon16 />}
                        onClick={onCopy}
                        size="fit"
                        variant="flat"
                    />
                </Tooltip>
                <Span>{invoice.id}</Span>
            </Td>
            <Td minW="192px" boxSizing="content-box">
                <InvoiceStatusBadge status={invoice.status} />
                {!!paidBy && (
                    <TooltipHoverable
                        host={
                            <Span ml="2" textStyle="body2" color="text.secondary" fontFamily="mono">
                                {paidBy}
                            </Span>
                        }
                    >
                        {(invoice as InvoiceSuccessful).paidBy}
                    </TooltipHoverable>
                )}
            </Td>
            <Td minW="108px" boxSizing="content-box">
                {formattedTimeLeft}
            </Td>
            <Td minW="228px" maxW="228px" boxSizing="content-box">
                <TooltipHoverable host={<Span noOfLines={1}>{invoice.description}</Span>}>
                    <Box maxW="500px">{invoice.description}</Box>
                </TooltipHoverable>
            </Td>
            <Td minW="148px" boxSizing="content-box">
                <TooltipHoverable
                    host={
                        <Span textStyle="body2" color="text.secondary" fontFamily="mono">
                            {slicedAddress}
                        </Span>
                    }
                >
                    {invoice.receiverAddress}
                </TooltipHoverable>
            </Td>
            <Td textAlign="right" borderRight="1px" borderRightColor="background.contentTint">
                <Flex align="center" justify="end">
                    <Span mr={canCancel ? '4' : '8'}>{invoice.amount.stringCurrencyAmount}</Span>
                    {canCancel && (
                        <Menu placement="bottom-end">
                            <MenuButton>
                                <VerticalDotsIcon16 display="block" />
                            </MenuButton>
                            <MenuList w="126px">
                                <MenuItem onClick={() => {}}>
                                    <Text textStyle="label2">Cancel</Text>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                </Flex>
            </Td>
        </Tr>
    );
});

const InvoicesTableRaw: FunctionComponent<{ index: number }> = ({ index }) => {
    if (invoicesTableStore.isItemLoaded(index)) {
        return <ItemRaw invoice={invoicesTableStore.invoices$.value[index]} />;
    }

    return <LoadingRaw />;
};

export default observer(InvoicesTableRaw);
