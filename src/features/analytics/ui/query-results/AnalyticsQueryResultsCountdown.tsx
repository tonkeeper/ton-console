import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { toTimeLeft, useCountup } from 'src/shared';
import { AnalyticsQueryPending } from '../../model';
import { CurrencyRate } from 'src/entities';

export const AnalyticsQueryResultsCountdown: FunctionComponent<
    ComponentProps<typeof Box> & { query: AnalyticsQueryPending }
> = ({ query, ...rest }) => {
    const [renderDate, setRenderDate] = useState(() => Date.now());
    useEffect(() => {
        setRenderDate(Date.now());
    }, [query.id]);

    const timeoutSeconds = Math.floor((renderDate - query.creationDate.getTime()) / 1000);

    const secondsPassed = useCountup(timeoutSeconds);
    const formattedTimeLeft = toTimeLeft(secondsPassed * 1000);
    return (
        <Flex align="flex-start" color="text.secondary" {...rest}>
            {formattedTimeLeft}
            &nbsp;out of {toTimeLeft(query.estimatedTimeMS)}
            <CurrencyRate reverse amount={query.estimatedCost.amount} leftSign=" · $" />
        </Flex>
    );
};
