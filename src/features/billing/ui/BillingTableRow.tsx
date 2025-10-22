import { FunctionComponent, useContext } from 'react';
import { Center, chakra, Link, Spinner, Td, Tr } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { toDateTime, explorer, shortAddress } from 'src/shared';
import { toJS } from 'mobx';
import { BillingHistoryItem, billingStore } from 'src/features/billing';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';

const LoadingRaw: FunctionComponent<{ style: React.CSSProperties }> = ({
    style: { top, ...style }
}) => {
    const { rowHeight } = useContext(BillingHistoryTableContext);
    return (
        <Tr
            top={parseFloat(top!.toString()) + parseFloat(rowHeight) + 'px'}
            h={rowHeight}
            maxH={rowHeight}
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

const ItemRow: FunctionComponent<{ historyItem: BillingHistoryItem; style: React.CSSProperties }> =
    observer(({ historyItem, style }) => {
        const { rowHeight } = useContext(BillingHistoryTableContext);

        return (
            <Tr
                sx={{ td: { px: 2, py: 0 } }}
                pos="absolute"
                top={parseFloat(style.top!.toString()) + parseFloat(rowHeight) + 'px'}
                left="0"
                display="table-row"
                w="100%"
                h={rowHeight}
                maxH={rowHeight}
            >
                <Td
                    minW="150px"
                    h={rowHeight}
                    maxH={rowHeight}
                    borderLeft="1px"
                    borderLeftColor="background.contentTint"
                    boxSizing="content-box"
                >
                    {toDateTime(historyItem.date)}
                </Td>
                <Td minW="320px" h={rowHeight} maxH={rowHeight} boxSizing="content-box">
                    {historyItem.action === 'payment' ? (
                        historyItem.name
                    ) : (
                        <>
                            {historyItem.type === 'deposit' ? (
                                <>
                                    Refill
                                    {historyItem.fromAddress && (
                                        <>
                                            {' '}
                                            from{' '}
                                            <Link
                                                color="text.accent"
                                                href={explorer.accountLink(historyItem.fromAddress)}
                                                isExternal
                                            >
                                                {shortAddress(historyItem.fromAddress)}
                                            </Link>
                                        </>
                                    )}
                                </>
                            ) : (
                                'Refill with promo code'
                            )}
                        </>
                    )}
                </Td>
                <Td
                    w="100%"
                    minW="300px"
                    h={rowHeight}
                    maxH={rowHeight}
                    color={historyItem.action === 'payment' ? 'text.primary' : 'accent.green'}
                    borderRight="1px"
                    borderRightColor="background.contentTint"
                    title={historyItem.amount.stringAmountWithoutRound}
                >
                    {historyItem.action === 'payment' ? (
                        <>
                            -{historyItem.amount.stringCurrencyAmount}
                            {historyItem.amountUsdEquivalent && (
                                <>
                                    &nbsp;
                                    <chakra.span color="text.secondary">
                                        ({historyItem.amountUsdEquivalent.stringCurrencyAmount})
                                    </chakra.span>
                                </>
                            )}
                        </>
                    ) : (
                        <>+{historyItem.amount.stringCurrencyAmount}</>
                    )}
                </Td>
            </Tr>
        );
    });

const BillingTableRow: FunctionComponent<{ index: number; style: React.CSSProperties }> = ({
    index,
    style
}) => {
    if (billingStore.isItemLoaded(index)) {
        const historyItem = toJS(billingStore.billingHistory[index]);
        return <ItemRow key={historyItem.id} style={style} historyItem={historyItem} />;
    }

    return <LoadingRaw style={style} />;
};

export default observer(BillingTableRow);
