import { FC } from 'react';
import { Divider, Flex, Link, Text } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { ANALYTICS_LINKS, GraphAnalyticsForm } from 'src/features';

export const GraphHome: FC = () => {
    return (
        <Overlay display="flex" flexDirection="column">
            <Flex align="center" justify="space-between" mb="1">
                <H4 mb="1">Graph</H4>
                <Link
                    textStyle="label2"
                    color="accent.blue"
                    href={ANALYTICS_LINKS.GRAPH.HOW_IT_WORKS}
                    isExternal
                >
                    How it works
                </Link>
            </Flex>
            <Text textStyle="body2" mb="5" color="text.secondary">
                Visualization of the transaction history of the accounts you are interested in.
            </Text>
            <Divider w="auto" mx="-6" mb="5" />
            <GraphAnalyticsForm flex="1" />
        </Overlay>
    );
};
