import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { CodeArea, CodeAreaFooter, CodeAreaGroup, useDebounce } from 'src/shared';
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

const defaultSQLRequest = `select human_readable from blockchain.accounts a join
(select distinct nft.owner_account_id from getmethods.get_nft_data nft
          join getmethods.get_wallet_data jetton on jetton.owner_account_id = nft.owner_account_id
          where nft.collection_account_id = (select id from blockchain.accounts where human_readable = 'EQDvRFMYLdxmvY3Tk-cfWMLqDnXF_EclO2Fp4wwj33WhlNFT' )
          and jetton.jetton_account_id =  (select id from blockchain.accounts where human_readable = 'EQCcLAW537KnRg_aSPrnQJoyYjOZkzqYp6FVmRUvN1crSazV' )
          ) t
on a.id = t.owner_account_id`;
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

    const onValueChange = (val: string): void => {
        setValue(val);
        if (store.request$.value) {
            store.clearRequest();
        }
    };

    useEffect(() => {
        if (type === 'gpt' && analyticsGPTGenerationStore.generatedSQL$.value) {
            setValue(analyticsGPTGenerationStore.generatedSQL$.value);
        }
    }, [type, analyticsGPTGenerationStore.generatedSQL$.value]);

    useEffect(() => {
        if (debouncedValue) {
            store.estimateRequest(debouncedValue, undefined, { cancelAllPreviousCalls: true });
        } else {
            store.clearRequest();
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
