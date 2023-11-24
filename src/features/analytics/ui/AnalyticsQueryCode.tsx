import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { CodeArea, CodeAreaFooter, CodeAreaGroup, useDebounce, usePrevious } from 'src/shared';
import { analyticsQueryStore } from 'src/features';
import { observer } from 'mobx-react-lite';
import AnalyticsQueryControlPanel from './AnalyticsQueryControlPanel';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { toJS } from 'mobx';

const defaultRequest = 'SELECT ';

const AnalyticsQueryCode: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const [value, setValue] = useState(
        analyticsQueryStore.request$.value?.request || defaultRequest
    );
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

    const extensions = [
        sql({
            dialect: PostgreSQL,
            schema: toJS(analyticsQueryStore.tablesSchema$.value),
            upperCaseKeywords: true
        })
    ];

    return (
        <Box {...props}>
            <CodeAreaGroup>
                <CodeArea value={value} onChange={onValueChange} extensions={extensions} />
                <CodeAreaFooter>
                    <Flex align="center" justify="flex-end">
                        <AnalyticsQueryControlPanel />
                    </Flex>
                </CodeAreaFooter>
            </CodeAreaGroup>
        </Box>
    );
};

export default observer(AnalyticsQueryCode);
