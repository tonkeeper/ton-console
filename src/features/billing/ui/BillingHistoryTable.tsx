import { FC } from 'react';
import { Box, BoxProps, Center, Spinner } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { FixedSizeList } from 'react-window';
import { BillingTableStructure } from './BillingTableStructure';
import { BillingHistoryTableContext } from './BillingHistoryTableContext';
import BillingTableRow from './BillingTableRow';
import { BillingHistoryItem } from 'src/shared/hooks/useBillingHistoryQuery';

interface BillingHistoryTableProps extends BoxProps {
    billingHistory: BillingHistoryItem[];
    isLoading?: boolean;
    hasEverLoaded?: boolean;
    skeletonRowCount?: number;
    hasBillingHistory?: boolean;
}

const BillingHistoryTable: FC<BillingHistoryTableProps> = ({
    billingHistory,
    isLoading = false,
    hasEverLoaded = false,
    skeletonRowCount = 1,
    hasBillingHistory = undefined,
    ...props
}) => {
    const actualHasBillingHistory = hasBillingHistory ?? billingHistory.length > 0;
    const rowHeight = '48px';

    // First load - show Spinner (height of header + one row: 48px + 48px = 96px)
    if (!hasEverLoaded && isLoading) {
        return (
            <Center h="96px">
                <Spinner />
            </Center>
        );
    }

    // No data and not loading - show Empty message (height of header + one row: 48px + 48px = 96px)
    if (!isLoading && !actualHasBillingHistory) {
        return (
            <Box h="96px" py="10" color="text.secondary" textAlign="center">
                No billing history yet
            </Box>
        );
    }

    // Display item count: during refresh show skeleton rows, otherwise show actual data
    const displayItemCount = isLoading && hasEverLoaded ? skeletonRowCount : billingHistory.length;

    // Table with data or skeleton
    const minH = Math.min(parseInt(rowHeight) * (displayItemCount + 1) + 6, 800) + 'px';

    // Calculate list height based on item count
    const listHeight = Math.min(parseInt(rowHeight) * (displayItemCount + 1) + 6, 800);

    // Table with data or skeleton
    return (
        <BillingHistoryTableContext.Provider
            value={{
                billingHistory,
                rowHeight,
                isLoading,
                hasEverLoaded,
                skeletonRowCount
            }}
        >
            <Box minH={minH} {...props}>
                <FixedSizeList
                    height={listHeight}
                    width="100%"
                    itemCount={displayItemCount}
                    itemSize={parseInt(rowHeight)}
                    innerElementType={BillingTableStructure}
                >
                    {BillingTableRow}
                </FixedSizeList>
            </Box>
        </BillingHistoryTableContext.Provider>
    );
};

export default observer(BillingHistoryTable);
