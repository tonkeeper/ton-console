import { ComponentProps, FunctionComponent } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import { CodeArea, H4, Overlay } from 'src/shared';

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
                        <CodeArea />
                    </TabPanel>
                    <TabPanel />
                </TabPanels>
            </Tabs>
        </Overlay>
    );
};

export default QueryPage;
