import { FC } from 'react';
import { Box, BoxProps, Grid, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CRYPTO_CURRENCY, formatNumber, useIntervalUpdate } from 'src/shared';
import { InvoicesAppStore, InvoicesStatistics } from 'src/features';
import BigNumber from 'bignumber.js';
import { StatsCard as StatsCardEntity } from 'src/entities/stats/Card';

const StatsCard: FC<{
    header: string;
    stats?: InvoicesStatistics;
    getValue: (value: InvoicesStatistics) => string;
    invoicesAppStore: InvoicesAppStore;
}> = observer(({ header, stats, getValue, invoicesAppStore }) => {
    const isResolved = invoicesAppStore.statistics$.isResolved;
    const canShow = isResolved && stats;

    if (isResolved && !stats) {
        throw new Error('Stats are not resolved');
    }

    return (
        <StatsCardEntity
            header={header}
            value={canShow ? getValue(stats!) : ''}
            loading={!canShow}
        />
    );
});

const StatsCurentcy: FC<{ stats?: InvoicesStatistics; currency: CRYPTO_CURRENCY; invoicesAppStore: InvoicesAppStore }> = ({
    stats,
    currency,
    invoicesAppStore
}) => {
    return (
        <>
            <Text textStyle="label2" color="text.secondary">
                {currency}
            </Text>
            <Grid gap="6" templateColumns="repeat(auto-fit, minmax(200px, 1fr))" mt={2} mb={6}>
                <StatsCard
                    header="Total Number of Invoices"
                    stats={stats}
                    invoicesAppStore={invoicesAppStore}
                    getValue={st =>
                        formatNumber(st.totalInvoices, {
                            roundingMode: BigNumber.ROUND_DOWN
                        })
                    }
                />
                <StatsCard
                    header="Active Invoices"
                    stats={stats}
                    invoicesAppStore={invoicesAppStore}
                    getValue={st =>
                        formatNumber(st.invoicesInProgress, {
                            roundingMode: BigNumber.ROUND_DOWN
                        })
                    }
                />
                <StatsCard
                    header="Earned Total"
                    stats={stats}
                    invoicesAppStore={invoicesAppStore}
                    getValue={st => st.earnedTotal.stringCurrencyAmount}
                />
                <StatsCard
                    header="Earned Last 7 Days"
                    stats={stats}
                    invoicesAppStore={invoicesAppStore}
                    getValue={st => st.earnedLastWeek.stringCurrencyAmount}
                />
                <StatsCard
                    header="Pending Payment"
                    stats={stats}
                    invoicesAppStore={invoicesAppStore}
                    getValue={st => st.awaitingForPaymentAmount.stringCurrencyAmount}
                />
            </Grid>
        </>
    );
};

interface InvoicesStatsProps extends BoxProps {
    invoicesAppStore: InvoicesAppStore;
}

const InvoicesStats: FC<InvoicesStatsProps> = ({ invoicesAppStore, ...props }) => {
    useIntervalUpdate(invoicesAppStore.fetchInvoicesStatistics);

    return (
        <Box {...props}>
            <Text textStyle="label1" my={5}>
                Statistics
            </Text>
            <StatsCurentcy
                stats={invoicesAppStore.statistics$.value?.TON}
                currency={CRYPTO_CURRENCY.TON}
                invoicesAppStore={invoicesAppStore}
            />
            <StatsCurentcy
                stats={invoicesAppStore.statistics$.value?.USDT}
                currency={CRYPTO_CURRENCY.USDT}
                invoicesAppStore={invoicesAppStore}
            />
        </Box>
    );
};

export default observer(InvoicesStats);
