import { ComponentProps, FunctionComponent, useEffect } from 'react';
import { Box, Divider, Flex, Link, Text } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { analyticsGraphQueryStore, GraphAnalyticsForm } from 'src/features';
import { useSearchParams } from 'react-router-dom';

const GraphPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get('id');

    useEffect(() => {
        if (queryId) {
            analyticsGraphQueryStore.loadQuery(queryId);
        } else {
            analyticsGraphQueryStore.clear();
        }
    }, [queryId]);

    return (
        <Overlay {...props} display="flex" flexDirection="column">
            <Flex align="center" justify="space-between" mb="1">
                <H4 mb="1">Graph</H4>
                <Link textStyle="label2" color="accent.blue" href="#" isExternal>
                    How it works
                </Link>
            </Flex>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Visualization of the transaction history of the accounts you are interested in.
            </Text>
            <Divider w="auto" mb="5" mx="-6" />
            <GraphAnalyticsForm flex="1" />
        </Overlay>
    );
};

export default GraphPage;
