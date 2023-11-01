import { FunctionComponent, useContext, useEffect, useState } from 'react';
import {
    Box,
    Button,
    Center,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Td,
    Text,
    Tooltip,
    Tr,
    useClipboard,
    useConst,
    useDisclosure
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
    toDateTime,
    FlashIcon16
} from 'src/shared';
import { InvoicesTableContext } from './invoices-table-context';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { ViewInvoiceModal } from '../ViewInvoiceModal';
import CancelInvoiceConfirmation from '../CancelInvoiceConfirmation';
import { InvoiceOverpayment } from './InvoiceOverpayment';
import { toJS } from 'mobx';

const LoadingRaw: FunctionComponent<{ style: React.CSSProperties }> = ({
    style: { top, ...style }
}) => {
    const { rawHeight } = useContext(InvoicesTableContext);
    return (
        <Tr
            top={parseFloat(top!.toString()) + parseFloat(rawHeight) + 'px'}
            h={rawHeight}
            maxH={rawHeight}
            style={style}
        >
            <Td pos="absolute" right="0" left="0" border="none" colSpan={5}>
                <Center>
                    <Spinner color="text.secondary" size="sm" />
                </Center>
            </Td>
        </Tr>
    );
};

const ItemRaw: FunctionComponent<{ invoice: Invoice; style: React.CSSProperties }> = observer(
    ({ invoice, style }) => {
        const renderTime = useConst(Date.now());
        const { isOpen: isOpenView, onClose: onCloseView, onOpen: onOpenView } = useDisclosure();
        const {
            isOpen: isOpenCancel,
            onClose: onCloseCancel,
            onOpen: onOpenCancel
        } = useDisclosure();

        const { onCopy: onCopyId, hasCopied: hasCopiedId } = useClipboard(invoice.id);
        const { onCopy: onCopyPaidBy, hasCopied: hasCopiedPaidBy } = useClipboard(
            invoice.status === 'success' ? invoice.paidBy.userFriendly : ''
        );
        const [isStatusUpdating, setIsStatusUpdating] = useState(false);

        const { rawHeight } = useContext(InvoicesTableContext);

        const timeoutSeconds =
            invoice.status === 'pending'
                ? Math.floor((invoice.validUntil.getTime() - renderTime) / 1000)
                : 0;

        const secondsLeft = useCountdown(timeoutSeconds);
        const formattedTimeLeft = secondsLeft === 0 ? '' : toTimeLeft(secondsLeft * 1000);

        const canCancel = invoice.status === 'pending';
        const shouldShowFlash = secondsLeft < 300;

        const paidBy =
            invoice.status === 'success'
                ? sliceAddress(invoice.paidBy, { headLength: 6, tailLength: 6 })
                : '';

        const paymentDate = invoice.status === 'success' ? toDateTime(invoice.paymentDate) : '';

        useEffect(() => {
            if (invoice.status === 'pending' && secondsLeft === 0) {
                setIsStatusUpdating(true);

                const timeout = setTimeout(async () => {
                    await invoicesTableStore.updateCurrentListSilently({ silently: true });
                    setIsStatusUpdating(false);
                }, 2500);

                return () => clearTimeout(timeout);
            }
        }, [secondsLeft, invoice.status]);

        return (
            <>
                <ViewInvoiceModal isOpen={isOpenView} onClose={onCloseView} invoice={invoice} />
                <CancelInvoiceConfirmation
                    isOpen={isOpenCancel}
                    onClose={onCloseCancel}
                    invoice={invoice}
                />
                <Tr
                    sx={{ td: { px: 2, py: 0 } }}
                    pos="absolute"
                    top={parseFloat(style.top!.toString()) + parseFloat(rawHeight) + 'px'}
                    left="0"
                    display="table-row"
                    w="100%"
                    h={rawHeight}
                    maxH={rawHeight}
                    cursor={invoice.status === 'pending' ? 'pointer' : 'default'}
                    onClick={invoice.status === 'pending' ? onOpenView : () => {}}
                >
                    <Td
                        minW="100px"
                        h={rawHeight}
                        maxH={rawHeight}
                        borderLeft="1px"
                        borderLeftColor="background.contentTint"
                        boxSizing="content-box"
                    >
                        <Tooltip isOpen={hasCopiedId} label="Copied!">
                            <Button
                                onClick={e => {
                                    e.stopPropagation();
                                    onCopyId();
                                }}
                                variant="flat"
                            >
                                <Span textStyle="body2">{invoice.id}</Span>
                            </Button>
                        </Tooltip>
                    </Td>
                    <Td minW="320px" h={rawHeight} maxH={rawHeight} boxSizing="content-box">
                        <Flex align="center">
                            <InvoiceStatusBadge
                                isLoading={isStatusUpdating}
                                status={invoice.status}
                            />
                            {invoice.status === 'success' && (
                                <>
                                    <Span textStyle="body3" ml="2" color="text.secondary">
                                        {paymentDate} ·&nbsp;
                                    </Span>
                                    <Tooltip isOpen={hasCopiedPaidBy} label="Copied!">
                                        <Button
                                            display="inline-block"
                                            _hover={{ svg: { opacity: 1 } }}
                                            onClick={e => {
                                                e.stopPropagation();
                                                onCopyPaidBy();
                                            }}
                                            size="fit"
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
                            {invoice.status === 'pending' && !!secondsLeft && (
                                <Span textStyle="body3" ml="2">
                                    {shouldShowFlash && <FlashIcon16 mr="2px" />}
                                    {formattedTimeLeft}
                                </Span>
                            )}
                            {invoice.status === 'cancelled' && (
                                <Span textStyle="body3" ml="2" color="text.secondary">
                                    {toDateTime(invoice.cancellationDate)}
                                </Span>
                            )}
                            {invoice.status === 'expired' && (
                                <Span textStyle="body3" ml="2" color="text.secondary">
                                    {toDateTime(invoice.validUntil)}
                                </Span>
                            )}
                        </Flex>
                    </Td>
                    <Td minW="160px" h={rawHeight} maxH={rawHeight} boxSizing="content-box">
                        {invoice.amount.toStringCurrencyAmount({ decimalPlaces: 'all' })}
                    </Td>
                    <Td
                        minW="180px"
                        maxW="180px"
                        h={rawHeight}
                        maxH={rawHeight}
                        boxSizing="content-box"
                    >
                        {toDateTime(invoice.creationDate)}
                    </Td>
                    <Td
                        w="100%"
                        minW="300px"
                        h={rawHeight}
                        maxH={rawHeight}
                        borderRight="1px"
                        borderRightColor="background.contentTint"
                    >
                        <Flex align="center" justify="space-between" gap="2">
                            <TooltipHoverable
                                host={
                                    <Span
                                        wordBreak="break-all"
                                        mr={canCancel || invoice.overpayment ? '0' : '8'}
                                        maxW="100%"
                                        width="fit-content"
                                        noOfLines={1}
                                    >
                                        {invoice.description}
                                    </Span>
                                }
                            >
                                <Box maxW="500px">{invoice.description}</Box>
                            </TooltipHoverable>
                            <Flex gap="2" minW="fit-content">
                                {!!invoice.overpayment && (
                                    <InvoiceOverpayment invoice={toJS(invoice)} />
                                )}
                                {canCancel && (
                                    <Menu placement="bottom-end">
                                        <MenuButton onClick={e => e.stopPropagation()}>
                                            <VerticalDotsIcon16 display="block" />
                                        </MenuButton>
                                        <MenuList w="126px">
                                            <MenuItem
                                                isDisabled={
                                                    invoicesTableStore.cancelInvoice.isLoading
                                                }
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    onOpenCancel();
                                                }}
                                            >
                                                <Text textStyle="label2">Cancel</Text>
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                )}
                            </Flex>
                        </Flex>
                    </Td>
                </Tr>
            </>
        );
    }
);

const InvoicesTableRaw: FunctionComponent<{ index: number; style: React.CSSProperties }> = ({
    index,
    style
}) => {
    if (invoicesTableStore.isItemLoaded(index)) {
        const invoice = toJS(invoicesTableStore.invoices$.value[index]);
        return <ItemRaw key={invoice.id} style={style} invoice={invoice} />;
    }

    return <LoadingRaw style={style} />;
};

export default observer(InvoicesTableRaw);
