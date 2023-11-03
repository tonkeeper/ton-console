import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import {
    CodeArea,
    CodeAreaFooter,
    CodeAreaGroup,
    Span,
    useDebounce,
    usePrevious
} from 'src/shared';
import { analyticsQueryStore } from 'src/features';
import { observer } from 'mobx-react-lite';
import AnalyticsQueryControlPanel from './AnalyticsQueryControlPanel';

const AnalyticsQueryCode: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const [value, setValue] = useState(analyticsQueryStore.request$.value?.request || 'SELECT ');
    const debouncedValue = useDebounce(value);
    const prevDebouncedValue = usePrevious(debouncedValue);

    const onValueChange = (val: string): void => {
        setValue(val);
        if (analyticsQueryStore.request$.value) {
            analyticsQueryStore.clearRequest();
        }
    };

    useEffect(() => {
        if (!prevDebouncedValue) {
            return;
        }

        if (debouncedValue) {
            analyticsQueryStore.estimateRequest(debouncedValue, { cancelAllPreviousCalls: true });
        } else {
            analyticsQueryStore.clearRequest();
        }
    }, [debouncedValue]);

    return (
        <Box {...props}>
            <CodeAreaGroup>
                <CodeArea value={value} onChange={onValueChange} />
                <CodeAreaFooter>
                    <Flex align="center" justify="space-between">
                        <Span textStyle="label2">Explain</Span>
                        <AnalyticsQueryControlPanel />
                    </Flex>
                </CodeAreaFooter>
            </CodeAreaGroup>
        </Box>
    );
};

export default observer(AnalyticsQueryCode);
