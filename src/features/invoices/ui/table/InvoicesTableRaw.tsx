import { FunctionComponent, useContext } from 'react';
import {
    Box,
    Button,
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
import { Invoice, invoicesTableStore } from '../../models';
import {
    CopyIcon16,
    sliceAddress,
    Span,
    TooltipHoverable,
    toTimeLeft,
    VerticalDotsIcon16,
    useCountdown,
    toDateTime
} from 'src/shared';
import { InvoicesTableContext } from './invoices-table-context';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';

const LoadingRaw: FunctionComponent = () => {
    const { rawHeight } = useContext(InvoicesTableContext);
    return (
        <Tr h={rawHeight} maxH={rawHeight}>
            <Td border="none" colSpan={5}>
                <Center>
                    <Spinner color="text.secondary" size="sm" />
                </Center>
            </Td>
        </Tr>
    );
};

const ItemRaw: FunctionComponent<{ invoice: Invoice }> = observer(({ invoice }) => {
    const { onCopy: onCopyId, hasCopied: hasCopiedId } = useClipboard(invoice.id);
    const { onCopy: onCopyPaidBy, hasCopied: hasCopiedPaidBy } = useClipboard(
        invoice.status === 'success' ? invoice.paidBy : ''
    );
    const { rawHeight } = useContext(InvoicesTableContext);

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

    const paymentDate = invoice.status === 'success' ? toDateTime(invoice.paymentDate) : '';

    return (
        <Tr sx={{ td: { px: 2, py: 0 } }} h={rawHeight} maxH={rawHeight}>
            <Td
                minW="100px"
                borderLeft="1px"
                borderLeftColor="background.contentTint"
                boxSizing="content-box"
            >
                <Tooltip isOpen={hasCopiedId} label="Copied!">
                    <IconButton
                        h="4"
                        mr="4"
                        aria-label="copy"
                        icon={<CopyIcon16 />}
                        onClick={onCopyId}
                        size="fit"
                        variant="flat"
                    />
                </Tooltip>
                <Span>{invoice.id}</Span>
            </Td>
            <Td minW="320px" boxSizing="content-box">
                <Flex align="center">
                    <InvoiceStatusBadge status={invoice.status} />
                    {invoice.status === 'success' && (
                        <>
                            <Span textStyle="body3" ml="2" color="text.secondary">
                                {paymentDate} ·&nbsp;
                            </Span>
                            <Tooltip isOpen={hasCopiedPaidBy} label="Copied!">
                                <Button
                                    display="inline-block"
                                    h="fit-content"
                                    p="0"
                                    _hover={{ svg: { opacity: 1 } }}
                                    onClick={onCopyPaidBy}
                                    variant="flat"
                                >
                                    <Span textStyle="body3" color="text.secondary">
                                        {paidBy}
                                    </Span>
                                    <CopyIcon16
                                        ml="1"
                                        opacity="0"
                                        transition="opacity 0.15s ease-in-out"
                                    />
                                </Button>
                            </Tooltip>
                        </>
                    )}
                    {invoice.status === 'pending' && (
                        <Span textStyle="body3" ml="2">
                            {formattedTimeLeft}
                        </Span>
                    )}
                </Flex>
            </Td>
            <Td minW="180px" boxSizing="content-box">
                {toDateTime(invoice.creationDate)}
            </Td>
            <Td minW="240px" maxW="240px" boxSizing="content-box">
                <TooltipHoverable
                    host={
                        <Span maxW="100%" width="fit-content" noOfLines={1}>
                            {invoice.description}
                        </Span>
                    }
                >
                    <Box maxW="500px">{invoice.description}</Box>
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
