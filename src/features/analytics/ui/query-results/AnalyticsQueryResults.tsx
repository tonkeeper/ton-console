import { ComponentProps, FC, useCallback } from 'react';
import {
    Box,
    BoxProps,
    Button,
    Center,
    Flex,
    Grid,
    GridItem,
    Menu,
    MenuItem,
    MenuList,
    Spacer,
    Spinner,
    Text,
    Link,
    useDisclosure,
    useToast
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
    ChartPieIcon24,
    TooltipHoverable,
    CopyIcon16
} from 'src/shared';
import { observer } from 'mobx-react-lite';
import { AnalyticsQueryStore, isAnalyticsQuerySuccessful } from '../../model';
import { AnalyticsQueryResultsCountdown } from './AnalyticsQueryResultsCountdown';
import { toJS } from 'mobx';
import { AnalyticsTable } from './AnalyticsQueryResultsTable';
import RepeatRequestModal from './RepeatRequestModal';
import { formatRepeatInterval } from '../utils';
import { AreaChartCard, BarChartCard, LineChartCard, PieChartCard } from './charts';
import { EditNameControl } from './AnalyticsQueryName';

const ChartsCards = {
    area: AreaChartCard,
    line: LineChartCard,
    bar: BarChartCard,
    pie: PieChartCard
};

interface AnalyticsQueryResultsProps extends BoxProps {
    analyticsQueryStore: AnalyticsQueryStore;
}

const AnalyticsQueryResults: FC<AnalyticsQueryResultsProps> = ({
    analyticsQueryStore,
    ...props
}) => {
    const query = analyticsQueryStore.query$.value;
    const { isOpen, onClose, onOpen } = useDisclosure();
    const toast = useToast();

    const callback = useCallback(() => {
        if (query?.status === 'executing') {
            analyticsQueryStore.refetchQuery();
        }
    }, [query?.status]);
    useIntervalUpdate(callback, 1000);

    const handleChageName = (name: string) => {
        analyticsQueryStore.setNameForQuery(name);
    };

    const handleCopy = () => {
        if (!query || !isAnalyticsQuerySuccessful(query)) {
            toast({
                title: 'Error',
                description: 'Dada not available',
                status: 'error',
                duration: 5000
            });
            return;
        }

        const headers = query.preview.headings.join('\t');
        const data = query.preview.data.map(row => row.join('\t')).join('\n');

        navigator.clipboard.writeText(`${headers}\n${data}`).then(() => {
            const copyTitle = query.preview.isAllDataPresented
                ? 'Data copied to clipboard'
                : `Copied preview of ${query.preview.data.length} rows to clipboard`;

            toast({
                title: copyTitle,
                description: (
                    <Text>
                        To get all rows,
                        <Link ml="1" color="#E0FFE7" href={query.csvUrl} isExternal>
                            download CSV
                        </Link>
                    </Text>
                ),
                status: 'success',
                duration: 5000
            });
        });
    };

    const repeatInterval = formatRepeatInterval(query?.repeatFrequencyMs);
    const charts = query?.status === 'success' ? query.charts : [];
    const isExecuting = query?.status === 'executing';

    return (
        <Flex direction="column" {...props}>
            {query && (
                <Flex align="center" gap="2" h="8">
                    <Text textStyle="label2" fontSize="16px">
                        Name:
                    </Text>
                    <EditNameControl onChangeName={handleChageName} defaultName={query.name} />
                </Flex>
            )}
            <Flex align="center" gap="2" h="8">
                <Span textStyle="label1" minW="110px">
                    Query Results
                </Span>
                {isExecuting && <AnalyticsQueryResultsCountdown query={toJS(query)} />}
                {query &&
                    isAnalyticsQuerySuccessful(query) &&
                    !query.preview.isAllDataPresented && (
                        <TooltipHoverable
                            canBeShown={true}
                            placement="bottom"
                            host={
                                <Span
                                    color="text.secondary"
                                    textStyle="body2"
                                    textOverflow="ellipsis"
                                    overflow="hidden"
                                    whiteSpace="nowrap"
                                >
                                    The first {query.preview.data.length} lines are shown; download
                                    the rest for the full results
                                </Span>
                            }
                        >
                            <Span
                                color="text.secondary"
                                textStyle="body2"
                                textOverflow="ellipsis"
                                overflow="hidden"
                                whiteSpace="nowrap"
                            >
                                The first {query.preview.data.length} lines are shown; download the
                                rest for the full results
                            </Span>
                        </TooltipHoverable>
                    )}
                <Spacer mr="auto" />
                {query && isAnalyticsQuerySuccessful(query) && (
                    <>
                        <Menu placement="bottom">
                            <MenuButtonDefault
                                pl="3"
                                size="sm"
                                minW="185px"
                                leftIcon={<PlusIcon16 color="icon.primary" />}
                                rightIcon={<ArrowIcon color="icon.primary" />}
                            >
                                Add Visualisation
                            </MenuButtonDefault>
                            <MenuList w="200px">
                                <MenuItem
                                    isDisabled={charts.some(c => c.type === 'bar')}
                                    onClick={() => analyticsQueryStore.addChart({ type: 'bar' })}
                                >
                                    <ChartBarIcon24 mr="2" />
                                    Bar Chart
                                </MenuItem>
                                <MenuItem
                                    isDisabled={charts.some(c => c.type === 'area')}
                                    onClick={() => analyticsQueryStore.addChart({ type: 'area' })}
                                >
                                    <ChartAreaIcon24 mr="2" />
                                    Area Chart
                                </MenuItem>
                                <MenuItem
                                    isDisabled={charts.some(c => c.type === 'line')}
                                    onClick={() => analyticsQueryStore.addChart({ type: 'line' })}
                                >
                                    <ChartLineIcon24 mr="2" />
                                    Line Chart
                                </MenuItem>
                                <MenuItem
                                    isDisabled={charts.some(c => c.type === 'pie')}
                                    onClick={() => analyticsQueryStore.addChart({ type: 'pie' })}
                                >
                                    <ChartPieIcon24 mr="2" />
                                    Pie Chart
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <Button
                            minW="150px"
                            isLoading={analyticsQueryStore.isQueryIntervalUpdateLoading}
                            leftIcon={<RefreshIcon16 color="icon.primary" />}
                            onClick={onOpen}
                            size="sm"
                            variant="secondary"
                        >
                            Repeat Request
                            {!!query.repeatFrequencyMs && (
                                <Span color="text.secondary">&nbsp;·&nbsp;{repeatInterval}</Span>
                            )}
                        </Button>
                        <Button onClick={handleCopy} size="sm" variant="secondary">
                            <CopyIcon16 color="text.primary" />
                        </Button>
                        <ButtonLink
                            leftIcon={<DownloadIcon16 />}
                            size="sm"
                            variant="secondary"
                            href={query.csvUrl}
                            isExternal
                            minW="150px"
                        >
                            Download CSV
                        </ButtonLink>
                    </>
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
            <RepeatRequestModal
                isOpen={isOpen}
                onClose={onClose}
                analyticsQueryStore={analyticsQueryStore}
            />
        </Flex>
    );
};

export default observer(AnalyticsQueryResults);
