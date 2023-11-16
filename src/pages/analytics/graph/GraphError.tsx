import { FunctionComponent } from 'react';
import { Divider, Text } from '@chakra-ui/react';
import { H4, Overlay, TickIcon } from 'src/shared';
import { AnalyticsGraphQueryError } from 'src/features';

export const GraphError: FunctionComponent<{ query: AnalyticsGraphQueryError }> = ({ query }) => {
    return (
        <Overlay display="flex" flexDirection="column">
            <H4 color="accent.red" mb="2">
                <TickIcon />
                Error
            </H4>
            <Text textStyle="body2" mb="5" color="text.secondary">
                {query.errorReason}
            </Text>
            <Divider w="auto" mb="5" mx="-6" />
        </Overlay>
    );
};
