import { FC, useContext } from 'react';
import { Center, Spinner, Td, Tr } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { toDateTime, DTOBillingTransaction } from 'src/shared';
import { BillingHistoryItem } from '../model';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';

const LoadingRaw: FC<{ style: React.CSSProperties }> = ({ style: { top, ...style } }) => {
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
        
const mapTypeToColor: Record<DTOBillingTransaction['type'], string> = {
    charge: 'text.primary',
    deposit: 'accent.green'
};

const mapTypeToSign: Record<DTOBillingTransaction['type'], string> = {
    charge: '-',
    deposit: '+'
};

const ItemRow: FC<{ historyItem: BillingHistoryItem; style: React.CSSProperties }> = observer(
    ({ historyItem, style }) => {
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
                    {historyItem.description}
                </Td>
                <Td
                    w="100%"
                    minW="300px"
                    h={rowHeight}
                    maxH={rowHeight}
                    color={mapTypeToColor[historyItem.type] ?? 'text.accent'}
                    borderRight="1px"
                    borderRightColor="background.contentTint"
                    title={historyItem.amount.stringAmountWithoutRound}
                >
                    {mapTypeToSign[historyItem.type]}
                    {historyItem.amount.stringCurrencyAmount}
                </Td>
            </Tr>
        );
    }
);

const BillingTableRow: FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const { billingHistory } = useContext(BillingHistoryTableContext);

    if (!billingHistory || !billingHistory[index]) {
        return <LoadingRaw style={style} />;
    }

    const historyItem = billingHistory[index];
    return <ItemRow key={historyItem.id} style={style} historyItem={historyItem} />;
};

export default observer(BillingTableRow);
