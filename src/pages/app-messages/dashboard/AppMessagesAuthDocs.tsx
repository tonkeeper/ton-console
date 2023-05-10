import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react';
import { CopyPad } from 'src/shared';

export const AppMessagesAuthDocs: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Box {...props}>
            <Text textStyle="body2" mb="2">
                Token:
            </Text>
            <Flex gap="3" mb="2">
                <CopyPad flex="1" text="123token" />
                <Button h="100%" variant="secondary">
                    Refresh
                </Button>
            </Flex>
            <Text textStyle="body2" mb="4" color="text.secondary">
                This is a service to service authorisation token. The service have token-based
                authentication, is a type of authentication that generates encrypted security
                tokens. To authorise your request, you have to call service URL&apos;s with token in
                the path. Keep token secret.
            </Text>
            <Tabs mb="3">
                <TabList>
                    <Tab>Send push</Tab>
                    <Tab>Send push to all users</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Text textStyle="label2" mb="3">
                            Label:
                        </Text>
                        <CopyPad text="curl\n\n" iconAlign="start" />
                    </TabPanel>
                    <TabPanel>
                        <Text textStyle="label2" mb="3">
                            Label:
                        </Text>
                        <CopyPad text="curl2\n\n" iconAlign="start" />
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <Text textStyle="body2" color="text.secondary">
                The first step in creating an effective manual is to have a clear objective in mind.
                Answers to questions like “What’s is the purpose of creating the instruction
                manual?” and “What activities should be included in the instruction manual?” should
                be thought of well before you begin writing.
            </Text>
        </Box>
    );
};
