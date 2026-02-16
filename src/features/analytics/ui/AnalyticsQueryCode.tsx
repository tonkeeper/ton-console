import { FC, useEffect, useState } from 'react';
import { Box, BoxProps, Flex } from '@chakra-ui/react';
import { CodeArea, CodeAreaFooter, CodeAreaGroup, useDebounce } from 'src/shared';
import {
    AnalyticsQueryStore,
    AnalyticsQueryRequestStore,
    AnalyticsGPTGenerationStore
} from 'src/features';
import { observer } from 'mobx-react-lite';
import AnalyticsQueryControlPanel from './AnalyticsQueryControlPanel';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { toJS } from 'mobx';

const defaultSQLRequest = `select human_readable from blockchain.accounts a join
(select distinct nft.owner_account_id from getmethods.get_nft_data nft
          join getmethods.get_wallet_data jetton on jetton.owner_account_id = nft.owner_account_id
          where nft.collection_account_id = (select id from blockchain.accounts where human_readable = 'EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT' )
          and jetton.jetton_account_id =  (select id from blockchain.accounts where human_readable = 'EQCcLAW537KnRg_aSPrnQJoyYjOZkzqYp6FVmRUvN1crSazV' )
          ) t
on a.id = t.owner_account_id`;
const defaultGPTRequest = ' ';

interface AnalyticsQueryCodeProps extends BoxProps {
    type: 'sql' | 'gpt';
    defaultRequest?: string;
    analyticsQueryStore: AnalyticsQueryStore;
    analyticsQuerySQLRequestStore: AnalyticsQueryRequestStore;
    analyticsQueryGPTRequestStore: AnalyticsQueryRequestStore;
    analyticsGPTGenerationStore: AnalyticsGPTGenerationStore;
}

const AnalyticsQueryCode: FC<AnalyticsQueryCodeProps> = ({
    type,
    defaultRequest: defaultRequest,
    analyticsQueryStore,
    analyticsQuerySQLRequestStore,
    analyticsQueryGPTRequestStore,
    analyticsGPTGenerationStore,
    ...props
}) => {
    const requestStore = type === 'sql' ? analyticsQuerySQLRequestStore : analyticsQueryGPTRequestStore;
    const [value, setValue] = useState(
        type === 'gpt'
            ? analyticsGPTGenerationStore.generatedSQL$.value ?? defaultRequest ?? defaultGPTRequest
            : requestStore.request$.value?.request ?? defaultRequest ?? defaultSQLRequest
    );
    const debouncedValue = useDebounce(value);

    const onValueChange = (val: string): void => {
        setValue(val);
        if (requestStore.request$.value) {
            requestStore.clearRequest();
        }
    };

    useEffect(() => {
        if (type === 'gpt' && analyticsGPTGenerationStore.generatedSQL$.value) {
            setValue(analyticsGPTGenerationStore.generatedSQL$.value);
        }
    }, [type, analyticsGPTGenerationStore.generatedSQL$.value]);

    useEffect(() => {
        if (debouncedValue) {
            requestStore.estimateRequest(
                {
                    request: debouncedValue,
                    name: 'sql'
                },
                { cancelAllPreviousCalls: true }
            );
        } else {
            requestStore.clearRequest();
        }
    }, [debouncedValue, requestStore]);

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
                        <AnalyticsQueryControlPanel
                            type={type}
                            analyticsQueryStore={analyticsQueryStore}
                            analyticsQuerySQLRequestStore={analyticsQuerySQLRequestStore}
                            analyticsQueryGPTRequestStore={analyticsQueryGPTRequestStore}
                        />
                    </Flex>
                </CodeAreaFooter>
            </CodeAreaGroup>
        </Box>
    );
};

export default observer(AnalyticsQueryCode);
