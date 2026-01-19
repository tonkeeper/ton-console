import { FC, useMemo, useState } from 'react';
import { H4, Overlay } from 'src/shared';
import {
    DashboardCardsList,
    DashboardChart,
    DashboardLiteproxyChart,
    DashboardWebhooksChart,
    FeaturesList
} from 'src/features';
import { Flex, Text, Grid, GridItem, Hide, HStack, Link, Show, Divider } from '@chakra-ui/react';
import { EXTERNAL_LINKS, TgIcon } from 'src/shared';
import { useRestStats, useLiteproxyStats, TimePeriod } from 'src/features/tonapi/statistics/model/queries';
import { useWebhooksStatsQuery, mapWebhooksStatsToChartPoints } from 'src/features/tonapi/webhooks/model/queries';
import { useSelectedRestApiTier } from 'src/features/tonapi/pricing/model/queries';
import { useSelectedLiteproxyTier } from 'src/features/tonapi/liteproxy/model/queries';
import PeriodSelector from 'src/features/tonapi/statistics/ui/PeriodSelector';

const DashboardPage: FC = () => {
    // State for time period selector
    const [period, setPeriod] = useState<TimePeriod>('last_6h');

    // Fetch tier information
    const { data: selectedRestApiTier } = useSelectedRestApiTier();
    const { data: selectedLiteproxyTier } = useSelectedLiteproxyTier();

    // Fetch statistics data to check for activity
    const { data: restStatsData } = useRestStats(period);
    const { data: liteproxyStatsData } = useLiteproxyStats(period);
    const { data: webhooksStatsData } = useWebhooksStatsQuery(period);

    // Determine which services should be displayed
    const hasRestApiData = useMemo(() => restStatsData && restStatsData.length > 0, [restStatsData]);

    const hasLiteproxyData = useMemo(
        () => liteproxyStatsData?.requests && liteproxyStatsData.requests.length > 0,
        [liteproxyStatsData]
    );

    const hasWebhooksData = useMemo(() => {
        if (!webhooksStatsData) return false;
        const failedData = mapWebhooksStatsToChartPoints(webhooksStatsData, 'failed');
        const deliveredData = mapWebhooksStatsToChartPoints(webhooksStatsData, 'delivered');
        return (failedData && failedData.length > 0) || (deliveredData && deliveredData.length > 0);
    }, [webhooksStatsData]);

    // Determine visibility based on requirements:
    // - If has tier AND has data: show with data
    // - If has tier AND no data: show empty state (for Liteproxy)
    // - If no tier AND has data: show as locked/inactive (data was used in the past)
    // - If no tier AND no data: hide completely
    // Note: Webhooks shows only if hasWebhooksData (never show empty webhooks)
    const shouldShowLiteproxy = selectedLiteproxyTier || hasLiteproxyData;
    const shouldShowWebhooks = hasWebhooksData; // Only show if has data

    return (
        <>
            <Overlay h="fit-content" mb="4">
                <Flex align="center" justify="space-between" mb="4">
                    <H4>Dashboard</H4>
                    <Link
                        _hover={{ textDecoration: 'none', opacity: 0.8 }}
                        href={EXTERNAL_LINKS.TG_CHANNEL}
                        isExternal
                    >
                        <HStack color="text.secondary" spacing="2">
                            <TgIcon />
                            <Hide below="md">
                                <Text textStyle="body2">Telegram Channel</Text>
                            </Hide>
                        </HStack>
                    </Link>
                </Flex>
                <DashboardCardsList mb={{ base: 4, md: 6 }} />
                {(hasRestApiData || selectedRestApiTier) && (
                    <Show below="md">
                        <Divider mb="4" />
                    </Show>
                )}
                {(hasRestApiData || selectedRestApiTier) && (
                    <>
                        <Flex align="center" justify="space-between" wrap="wrap" gap="2" mb="5">
                            <Text textStyle="label1" color="text.primary">
                                Statistics
                            </Text>
                            <PeriodSelector value={period} onChange={setPeriod} />
                        </Flex>
                        <Grid gap="4" mb="6">
                            <GridItem colSpan={{ base: 1, lg: 1 }}>
                                <DashboardChart period={period} />
                            </GridItem>
                            {(shouldShowLiteproxy || shouldShowWebhooks) && (
                                <Grid
                                    gap="4"
                                    templateColumns={{
                                        base: '1fr',
                                        lg: shouldShowLiteproxy && shouldShowWebhooks ? 'repeat(2, 1fr)' : '1fr'
                                    }}
                                    w="100%"
                                >
                                    {shouldShowLiteproxy && (
                                        <GridItem>
                                            <DashboardLiteproxyChart
                                                period={period}
                                                childrenDirection={shouldShowLiteproxy && shouldShowWebhooks ? 'column' : 'row'}
                                            />
                                        </GridItem>
                                    )}
                                    {shouldShowWebhooks && (
                                        <GridItem>
                                            <DashboardWebhooksChart
                                                period={period}
                                                childrenDirection={shouldShowLiteproxy && shouldShowWebhooks ? 'column' : 'row'}
                                            />
                                        </GridItem>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                    </>
                )}
            </Overlay>
            <FeaturesList isContrast />
        </>
    );
};

export default DashboardPage;
