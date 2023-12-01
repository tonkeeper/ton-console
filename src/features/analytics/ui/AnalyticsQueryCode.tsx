import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { CodeArea, CodeAreaFooter, CodeAreaGroup, useDebounce, usePrevious } from 'src/shared';
import {
    analyticsGPTGenerationStore,
    analyticsQueryGPTRequestStore,
    analyticsQuerySQLRequestStore,
    analyticsQueryStore
} from 'src/features';
import { observer } from 'mobx-react-lite';
import AnalyticsQueryControlPanel from './AnalyticsQueryControlPanel';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { toJS } from 'mobx';

const defaultSQLRequest = 'SELECT ';
const defaultGPTRequest = ' ';

const AnalyticsQueryCode: FunctionComponent<
    ComponentProps<typeof Box> & { type: 'sql' | 'gpt' }
> = ({ type, ...props }) => {
    const store = type === 'sql' ? analyticsQuerySQLRequestStore : analyticsQueryGPTRequestStore;
    const [value, setValue] = useState(
        type === 'gpt'
            ? analyticsGPTGenerationStore.generatedSQL$.value || defaultGPTRequest
            : store.request$.value?.request || defaultSQLRequest
    );
    const debouncedValue = useDebounce(value);
    const prevDebouncedValue = usePrevious(debouncedValue);

    const onValueChange = (val: string): void => {
        setValue(val);
        if (store.request$.value) {
            store.clear();
        }
    };

    useEffect(() => {
        if (type === 'gpt' && analyticsGPTGenerationStore.generatedSQL$.value) {
            setValue(analyticsGPTGenerationStore.generatedSQL$.value);
        }
    }, [type, analyticsGPTGenerationStore.generatedSQL$.value]);

    useEffect(() => {
        if (!prevDebouncedValue && type === 'sql') {
            return;
        }

        if (debouncedValue) {
            store.estimateRequest(debouncedValue, { cancelAllPreviousCalls: true });
        } else {
            store.clear();
        }
    }, [debouncedValue, type]);

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
                <CodeArea
                    value={value}
                    onChange={onValueChange}
                    extensions={extensions}
                    isLoading={type === 'gpt' && analyticsGPTGenerationStore.generateSQL.isLoading}
                />
                <CodeAreaFooter>
                    <Flex align="center" justify="flex-end">
                        <AnalyticsQueryControlPanel type={type} />
                    </Flex>
                </CodeAreaFooter>
            </CodeAreaGroup>
        </Box>
    );
};

export default observer(AnalyticsQueryCode);
