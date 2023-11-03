import { ComponentProps, FunctionComponent, useEffect } from 'react';
import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { AnalyticsQueryCode, AnalyticsQueryResults, analyticsQueryStore } from 'src/features';
import { QueryLinks } from './QueryLinks';
import { useSearchParams } from 'react-router-dom';

const QueryPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    const [searchParams] = useSearchParams();
    const queryId = searchParams.get('id');

    useEffect(() => {
        if (queryId) {
            analyticsQueryStore.loadQueryAndRequest(queryId);
        } else {
            analyticsQueryStore.clear();
        }
    }, [queryId]);

    return (
        <Overlay display="flex" flexDirection="column">
            <H4 mb="4">New Request</H4>
            <Tabs flexDir="column" flex="1" display="flex">
                <TabList w="auto" mx="-24px" px="6">
                    <Tab>SQL</Tab>
                    <Tab isDisabled={true}>Chat GPT (coming soon)</Tab>
                </TabList>
                <TabPanels flexDir="column" flex="1" display="flex">
                    <TabPanel flexDir="column" flex="1" display="flex">
                        <Flex gap="6" mb="6">
                            <AnalyticsQueryCode flex="1" />
                            <QueryLinks />
                        </Flex>
                        <AnalyticsQueryResults flex="1" />
                    </TabPanel>
                    <TabPanel />
                </TabPanels>
            </Tabs>
        </Overlay>
    );
};

export default QueryPage;
