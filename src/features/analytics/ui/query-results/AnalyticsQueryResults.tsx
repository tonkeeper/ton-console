import { ComponentProps, FunctionComponent, useCallback } from 'react';
import {
    Box,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Menu,
    MenuItem,
    MenuList,
    Spinner,
    useDisclosure
} from '@chakra-ui/react';
import {
    ButtonLink,
    DownloadIcon16,
    Span,
    useIntervalUpdate,
    RefreshIcon16,
    MenuButtonDefault,
    ArrowIcon,
    PlusIcon16,
    ChartAreaIcon24,
    ChartBarIcon24,
    ChartLineIcon24,
    ChartPieIcon24
} from 'src/shared';
import { observer } from 'mobx-react-lite';
import { analyticsQueryStore, isAnalyticsQuerySuccessful } from '../../model';
import { AnalyticsQueryResultsCountdown } from './AnalyticsQueryResultsCountdown';
import { toJS } from 'mobx';
import { AnalyticsTable } from './AnalyticsQueryResultsTable';
import RepeatRequestModal from './RepeatRequestModal';
import { formatRepeatInterval } from '../utils';
import { AreaChartCard, BarChartCard, LineChartCard, PieChartCard } from './charts';

const ChartsCards = {
    area: AreaChartCard,
    line: LineChartCard,
    bar: BarChartCard,
    pie: PieChartCard
};

const AnalyticsQueryResults: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const query = analyticsQueryStore.query$.value;
    const { isOpen, onClose, onOpen } = useDisclosure();

    const callback = useCallback(() => {
        if (query?.status === 'executing') {
            analyticsQueryStore.refetchQuery();
        }
    }, [query?.status]);
    useIntervalUpdate(callback, 1000);

    const repeatInterval = formatRepeatInterval(query?.repeatFrequencyMs);

    const charts = query?.status === 'success' ? query.charts : [];

    return (
        <Flex direction="column" {...props}>
            <Flex align="center" h="8" mb="3">
                <Span textStyle="label1">Query Results</Span>
                {query?.status === 'executing' && (
                    <AnalyticsQueryResultsCountdown query={toJS(query)} ml="2" />
                )}
                {query && isAnalyticsQuerySuccessful(query) && (
                    <Flex align="center" justify="space-between" flex="1" pl="3">
                        {!query.preview.isAllDataPresented && (
                            <Span mr="3" color="text.secondary" textStyle="body2">
                                The first {query.preview.data.length} lines are shown; download the
                                rest for the full results
                            </Span>
                        )}
                        <Flex gap="2" ml="auto">
                            <Menu placement="bottom">
                                <MenuButtonDefault
                                    pl="3"
                                    size="sm"
                                    leftIcon={<PlusIcon16 color="icon.primary" />}
                                    rightIcon={<ArrowIcon color="icon.primary" />}
                                >
                                    Add Visualisation
                                </MenuButtonDefault>
                                <MenuList w="200px">
                                    <MenuItem
                                        isDisabled={charts.some(c => c.type === 'bar')}
                                        onClick={() =>
                                            analyticsQueryStore.addChart({ type: 'bar' })
                                        }
                                    >
                                        <ChartBarIcon24 mr="2" />
                                        Bar Chart
                                    </MenuItem>
                                    <MenuItem
                                        isDisabled={charts.some(c => c.type === 'area')}
                                        onClick={() =>
                                            analyticsQueryStore.addChart({ type: 'area' })
                                        }
                                    >
                                        <ChartAreaIcon24 mr="2" />
                                        Area Chart
                                    </MenuItem>
                                    <MenuItem
                                        isDisabled={charts.some(c => c.type === 'line')}
                                        onClick={() =>
                                            analyticsQueryStore.addChart({ type: 'line' })
                                        }
                                    >
                                        <ChartLineIcon24 mr="2" />
                                        Line Chart
                                    </MenuItem>
                                    <MenuItem
                                        isDisabled={charts.some(c => c.type === 'pie')}
                                        onClick={() =>
                                            analyticsQueryStore.addChart({ type: 'pie' })
                                        }
                                    >
                                        <ChartPieIcon24 mr="2" />
                                        Pie Chart
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <Button
                                isLoading={analyticsQueryStore.isQueryIntervalUpdateLoading}
                                leftIcon={<RefreshIcon16 color="icon.primary" />}
                                onClick={onOpen}
                                size="sm"
                                variant="secondary"
                            >
                                Repeat Request
                                {!!query.repeatFrequencyMs && (
                                    <Span color="text.secondary">
                                        &nbsp;·&nbsp;{repeatInterval}
                                    </Span>
                                )}
                            </Button>
                            <ButtonLink
                                leftIcon={<DownloadIcon16 />}
                                size="sm"
                                variant="secondary"
                                href={query.csvUrl}
                                isExternal
                                download="customers.csv"
                            >
                                Download CSV
                            </ButtonLink>
                        </Flex>
                    </Flex>
                )}
            </Flex>
            {analyticsQueryStore.chartsDatasource$.isLoading ? (
                <Center h="280px">
                    <Spinner />
                </Center>
            ) : analyticsQueryStore.chartsDatasource$.value ? (
                <Grid gap="5" templateColumns="1fr 1fr" mb="4">
                    {charts.map((chart, index, arr) => {
                        const Chart = ChartsCards[chart.type];

                        return (
                            <GridItem
                                key={chart.type + arr.length}
                                {...(index === arr.length - 1 &&
                                    arr.length % 2 === 1 && { gridColumn: 'span 2' })}
                            >
                                <Chart
                                    onClose={() => analyticsQueryStore.removeChart(chart.type)}
                                    dataSource={toJS(analyticsQueryStore.chartsDatasource$.value!)}
                                    options={chart as ComponentProps<typeof Chart>['options']}
                                    {...chart}
                                />
                            </GridItem>
                        );
                    })}
                </Grid>
            ) : (
                query?.status === 'success' && <Box>Charts loading error</Box>
            )}

            {query?.status !== 'success' && (
                <Center h="10">
                    {!query && 'No data available'}
                    {query?.status === 'executing' && <Spinner color="icon.secondary" size="sm" />}
                    {query?.status === 'error' && (
                        <Box w="100%">
                            <Box textStyle="body1" mb="1" textAlign="center">
                                Data loading error
                            </Box>
                            <Box textStyle="body3" fontFamily="mono">
                                {query.errorReason}
                            </Box>
                        </Box>
                    )}
                </Center>
            )}
            {query?.status === 'success' && (
                <AnalyticsTable flex="1" source={toJS(query.preview)} />
            )}
            <RepeatRequestModal isOpen={isOpen} onClose={onClose} />
        </Flex>
    );
};

export default observer(AnalyticsQueryResults);
