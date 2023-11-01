import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { Box, Card, CardBody, CardHeader, Grid, Skeleton, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { formatNumber, H4, useIntervalUpdate } from 'src/shared';
import { invoicesAppStore, InvoicesStatistics } from 'src/features';

const StatsCard: FunctionComponent<{
    header: string;
    children: (stats: InvoicesStatistics) => ReactNode;
}> = observer(({ header, children }) => {
    const isResolved = invoicesAppStore.statistics$.isResolved;
    const stats = invoicesAppStore.statistics$.value;

    return (
        <Card size="lg">
            <CardHeader textStyle="label2" pb="1" color="text.secondary">
                {header}
            </CardHeader>
            <CardBody>
                {isResolved ? <H4>{children(stats!)}</H4> : <Skeleton w="100px" h="3" />}
            </CardBody>
        </Card>
    );
});

const InvoicesStats: FunctionComponent<ComponentProps<typeof Box>> = props => {
    useIntervalUpdate(invoicesAppStore.fetchInvoicesStatistics);

    return (
        <Box {...props}>
            <Text textStyle="label1" mb="1">
                Statistics
            </Text>
            <Grid gap="6" templateColumns="repeat(auto-fit, minmax(200px, 1fr))">
                <StatsCard header="Total Number of Invoices">
                    {stats => formatNumber(stats.totalInvoices)}
                </StatsCard>
                <StatsCard header="Active Invoices">
                    {stats => formatNumber(stats.invoicesInProgress)}
                </StatsCard>
                <StatsCard header="Earned Total">
                    {stats => stats.earnedTotal.stringCurrencyAmount}
                </StatsCard>
                <StatsCard header="Earned Last 7 Days">
                    {stats => stats.earnedLastWeek.stringCurrencyAmount}
                </StatsCard>
                <StatsCard header="Pending Payment">
                    {stats => stats.awaitingForPaymentAmount.stringCurrencyAmount}
                </StatsCard>
            </Grid>
        </Box>
    );
};

export default observer(InvoicesStats);
