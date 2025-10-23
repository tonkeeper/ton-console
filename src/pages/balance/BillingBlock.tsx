import { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { H4 } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { BillingHistoryTable, BillingStore } from 'src/features/billing';

interface BillingBlockProps {
    billingStore: BillingStore;
}

const BillingBlock: FC<BillingBlockProps> = ({ billingStore }) => {
    const [hasEverLoaded, setHasEverLoaded] = useState(false);
    const [previousRowCount, setPreviousRowCount] = useState(0);
    const hasBillingHistory = billingStore.billingHistory.length > 0;
    const isLoading = billingStore.billingHistoryLoading;

    // Track whether data has ever been loaded and remember the row count
    useEffect(() => {
        if (!isLoading && hasBillingHistory) {
            setHasEverLoaded(true);
            setPreviousRowCount(billingStore.billingHistory.length);
        }
    }, [isLoading, hasBillingHistory, billingStore.billingHistory.length]);

    // Calculate skeleton row count
    const skeletonRowCount = Math.min(Math.max(previousRowCount, 1), 20);

    return (
        <Box px="6" py="5">
            <H4 mb="5">Billing History</H4>
            <BillingHistoryTable
                billingStore={billingStore}
                isLoading={isLoading}
                hasEverLoaded={hasEverLoaded}
                skeletonRowCount={skeletonRowCount}
                hasBillingHistory={hasBillingHistory}
            />
        </Box>
    );
};

export default observer(BillingBlock);
