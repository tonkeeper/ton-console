import { FC } from 'react';
import { Box, BoxProps, Grid, Text, Spinner, Center } from '@chakra-ui/react';
import { CRYPTO_CURRENCY, formatNumber } from 'src/shared';
import { InvoicesAllStatistics, InvoicesStatistics } from 'src/features/invoices/models';
import { StatsCard as StatsCardEntity } from 'src/entities/stats/Card';
import BigNumber from 'bignumber.js';

const StatsCard: FC<{
    header: string;
    stats?: InvoicesStatistics;
    getValue: (value: InvoicesStatistics) => string;
    loading: boolean;
}> = ({ header, stats, getValue, loading }) => {
    if (loading) {
        return <StatsCardEntity header={header} value="" loading={true} />;
    }

    return (
        <StatsCardEntity
            header={header}
            value={stats ? getValue(stats) : ''}
            loading={false}
        />
    );
};

const StatsCurrency: FC<{ stats?: InvoicesStatistics; currency: CRYPTO_CURRENCY; loading: boolean }> = ({
    stats,
    currency,
    loading
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
                    loading={loading}
                    getValue={st =>
                        formatNumber(st.totalInvoices, {
                            roundingMode: BigNumber.ROUND_DOWN
                        })
                    }
                />
                <StatsCard
                    header="Active Invoices"
                    stats={stats}
                    loading={loading}
                    getValue={st =>
                        formatNumber(st.invoicesInProgress, {
                            roundingMode: BigNumber.ROUND_DOWN
                        })
                    }
                />
                <StatsCard
                    header="Earned Total"
                    stats={stats}
                    loading={loading}
                    getValue={st => st.earnedTotal.stringCurrencyAmount}
                />
                <StatsCard
                    header="Earned Last 7 Days"
                    stats={stats}
                    loading={loading}
                    getValue={st => st.earnedLastWeek.stringCurrencyAmount}
                />
                <StatsCard
                    header="Pending Payment"
                    stats={stats}
                    loading={loading}
                    getValue={st => st.awaitingForPaymentAmount.stringCurrencyAmount}
                />
            </Grid>
        </>
    );
};

interface InvoicesStatsProps extends BoxProps {
    data?: InvoicesAllStatistics;
    isLoading?: boolean;
}

const InvoicesStats: FC<InvoicesStatsProps> = ({ data, isLoading = false, ...props }) => {
    if (isLoading) {
        return (
            <Box {...props}>
                <Center h="200px">
                    <Spinner />
                </Center>
            </Box>
        );
    }

    return (
        <Box {...props}>
            <Text textStyle="label1" my={5}>
                Statistics
            </Text>
            <StatsCurrency
                stats={data?.[CRYPTO_CURRENCY.TON]}
                currency={CRYPTO_CURRENCY.TON}
                loading={isLoading}
            />
            <StatsCurrency
                stats={data?.[CRYPTO_CURRENCY.USDT]}
                currency={CRYPTO_CURRENCY.USDT}
                loading={isLoading}
            />
        </Box>
    );
};

export default InvoicesStats;
