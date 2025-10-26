import { FC, useContext } from 'react';
import { Skeleton, Td, Tr } from '@chakra-ui/react';
import { toDateTime, DTOBillingTransaction } from 'src/shared';
import { BillingHistoryItem } from '../model';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';

const SkeletonRow: FC<{ style: React.CSSProperties }> = ({ style: { top, ...style } }) => {
    const { rowHeight } = useContext(BillingHistoryTableContext);
    return (
        <Tr
            sx={{ td: { px: 2, py: 0 } }}
            pos="absolute"
            top={parseFloat(top!.toString()) + parseFloat(rowHeight) + 'px'}
            left="0"
            display="table-row"
            w="100%"
            h={rowHeight}
            maxH={rowHeight}
            style={style}
        >
            <Td
                minW="150px"
                h={rowHeight}
                maxH={rowHeight}
                borderLeft="1px"
                borderLeftColor="background.contentTint"
                boxSizing="content-box"
            >
                <Skeleton w="120px" h="4" />
            </Td>
            <Td minW="320px" h={rowHeight} maxH={rowHeight} boxSizing="content-box">
                <Skeleton w="200px" h="4" />
            </Td>
            <Td
                w="100%"
                minW="300px"
                h={rowHeight}
                maxH={rowHeight}
                borderRight="1px"
                borderRightColor="background.contentTint"
            >
                <Skeleton w="100px" h="4" />
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

const ItemRow: FC<{ historyItem: BillingHistoryItem; style: React.CSSProperties }> = ({
    historyItem,
    style
}) => {
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
};

const BillingTableRow: FC<{ index: number; style: React.CSSProperties }> = ({ index, style }) => {
    const { billingHistory, isLoading } = useContext(BillingHistoryTableContext);

    if (isLoading || !billingHistory || !billingHistory[index]) {
        return <SkeletonRow style={style} />;
    }

    const historyItem = billingHistory[index];
    return <ItemRow key={historyItem.id} style={style} historyItem={historyItem} />;
};

export default BillingTableRow;
