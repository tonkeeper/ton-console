import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { H4, Overlay } from 'src/shared';
import { AnalyticsQueryCode, AnalyticsQueryResults } from 'src/features';
import { QueryLinks } from './QueryLinks';

const QueryPage: FunctionComponent<ComponentProps<typeof Box>> = () => {
    return (
        <Overlay>
            <H4 mb="4">New Request</H4>
            <Tabs>
                <TabList w="auto" mx="-24px" px="6">
                    <Tab>SQL</Tab>
                    <Tab isDisabled={true}>Chat GPT (coming soon)</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Flex gap="6" mb="6">
                            <AnalyticsQueryCode flex="1" />
                            <QueryLinks />
                        </Flex>
                        <AnalyticsQueryResults />
                    </TabPanel>
                    <TabPanel />
                </TabPanels>
            </Tabs>
        </Overlay>
    );
};

export default QueryPage;
