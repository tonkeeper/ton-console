import { ComponentProps, FunctionComponent, useCallback } from 'react';
import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import { ButtonLink, DownloadIcon16, Span, useIntervalUpdate } from 'src/shared';
import { observer } from 'mobx-react-lite';
import { analyticsQueryStore, isAnalyticsQuerySuccessful } from '../../model';
import { AnalyticsQueryResultsCountdown } from './AnalyticsQueryResultsCountdown';
import { toJS } from 'mobx';
import { AnalyticsTable } from './AnalyticsQueryResultsTable';

const AnalyticsQueryResults: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const query = analyticsQueryStore.query$.value;

    const callback = useCallback(() => {
        if (query?.status === 'executing') {
            analyticsQueryStore.refetchQuery();
        }
    }, [query?.status]);
    useIntervalUpdate(callback, 1000);

    return (
        <Flex direction="column" {...props}>
            <Flex align="center" h="8" mb="3">
                <Span textStyle="label1">Query Results</Span>
                {query?.status === 'executing' && (
                    <AnalyticsQueryResultsCountdown query={toJS(query)} ml="2" />
                )}
                {query && isAnalyticsQuerySuccessful(query) && (
                    <ButtonLink
                        ml="auto"
                        leftIcon={<DownloadIcon16 />}
                        size="sm"
                        variant="secondary"
                        href={query.csvUrl}
                        isExternal
                        download="customers.csv"
                    >
                        Download CSV
                    </ButtonLink>
                )}
            </Flex>
            {query?.status !== 'success' && (
                <Center h="10">
                    {!query && 'No data available'}
                    {query?.status === 'executing' && <Spinner color="icon.secondary" size="sm" />}
                    {query?.status === 'error' && 'Data loading error'}
                </Center>
            )}
            {query?.status === 'success' && (
                <AnalyticsTable flex="1" source={toJS(query.preview)} />
            )}
        </Flex>
    );
};

export default observer(AnalyticsQueryResults);
