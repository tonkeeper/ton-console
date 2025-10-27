import { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { H4, useBillingHistoryQuery } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { BillingHistoryTable } from 'src/features/billing';

const BillingBlock: FC = () => {
    const [hasEverLoaded, setHasEverLoaded] = useState(false);
    const [previousRowCount, setPreviousRowCount] = useState(0);

    const { data: billingHistory = [], isLoading } = useBillingHistoryQuery();
    const hasBillingHistory = billingHistory.length > 0;

    // Track whether data has ever been loaded and remember the row count
    useEffect(() => {
        if (!isLoading && hasBillingHistory && billingHistory) {
            setHasEverLoaded(true);
            setPreviousRowCount(billingHistory.length);
        }
    }, [isLoading, hasBillingHistory, billingHistory?.length]);

    // Calculate skeleton row count
    const skeletonRowCount = Math.min(Math.max(previousRowCount, 1), 20);

    return (
        <Box px="6" py="5">
            <H4 mb="5">Billing History</H4>
            <BillingHistoryTable
                billingHistory={billingHistory}
                isLoading={isLoading}
                hasEverLoaded={hasEverLoaded}
                skeletonRowCount={skeletonRowCount}
                hasBillingHistory={hasBillingHistory}
            />
        </Box>
    );
};

// observer() to react to projectsStore.selectedProject changes
export default observer(BillingBlock);
