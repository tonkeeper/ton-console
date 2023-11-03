import { ComponentProps, FunctionComponent } from 'react';
import { Box, Divider, Flex, Link, Text } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { GraphAnalyticsForm } from 'src/features';

const GraphPage: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Overlay {...props}>
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
            <GraphAnalyticsForm />
        </Overlay>
    );
};

export default GraphPage;
