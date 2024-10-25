import { ComponentProps, FC } from 'react';
import { Box, Grid, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { CRYPTO_CURRENCY, formatNumber, useIntervalUpdate } from 'src/shared';
import { invoicesAppStore, InvoicesStatistics } from 'src/features';
import BigNumber from 'bignumber.js';
import { StatsCard as StatsCardEntity } from 'src/entities/stats/Card';

const StatsCard: FC<{
    header: string;
    stats?: InvoicesStatistics;
    getValue: (value: InvoicesStatistics) => string;
}> = observer(({ header, stats, getValue }) => {
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

const StatsCurentcy: FC<{ stats?: InvoicesStatistics; currency: CRYPTO_CURRENCY }> = ({
    stats,
    currency
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
                    getValue={st =>
                        formatNumber(st.totalInvoices, {
                            roundingMode: BigNumber.ROUND_DOWN
                        })
                    }
                />
                <StatsCard
                    header="Active Invoices"
                    stats={stats}
                    getValue={st =>
                        formatNumber(st.invoicesInProgress, {
                            roundingMode: BigNumber.ROUND_DOWN
                        })
                    }
                />
                <StatsCard
                    header="Earned Total"
                    stats={stats}
                    getValue={st => st.earnedTotal.stringCurrencyAmount}
                />
                <StatsCard
                    header="Earned Last 7 Days"
                    stats={stats}
                    getValue={st => st.earnedLastWeek.stringCurrencyAmount}
                />
                <StatsCard
                    header="Pending Payment"
                    stats={stats}
                    getValue={st => st.awaitingForPaymentAmount.stringCurrencyAmount}
                />
            </Grid>
        </>
    );
};

const InvoicesStats: FC<ComponentProps<typeof Box>> = props => {
    useIntervalUpdate(invoicesAppStore.fetchInvoicesStatistics);

    return (
        <Box {...props}>
            <Text textStyle="label1" my={5}>
                Statistics
            </Text>
            <StatsCurentcy
                stats={invoicesAppStore.statistics$.value?.TON}
                currency={CRYPTO_CURRENCY.TON}
            />
            <StatsCurentcy
                stats={invoicesAppStore.statistics$.value?.USDT}
                currency={CRYPTO_CURRENCY.USDT}
            />
        </Box>
    );
};

export default observer(InvoicesStats);
