import { ComponentProps, FunctionComponent } from 'react';
import {
    Box,
    Button,
    Code,
    Flex,
    ListItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    UnorderedList,
    useDisclosure
} from '@chakra-ui/react';
import { CopyPad, DocsLink } from 'src/shared';
import { appMessagesStore, MessagesTokenRegenerateConfirmation } from 'src/features';
import { observer } from 'mobx-react-lite';

const AppMessagesAuthDocs: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box {...props}>
            <Box px="6">
                <Text textStyle="body2" mb="2">
                    Token:
                </Text>
                <Flex gap="3" mb="2">
                    <CopyPad
                        isLoading={!appMessagesStore.dappToken$.isResolved}
                        flex="1"
                        wordBreak="break-all"
                        text={appMessagesStore.dappToken$.value || ''}
                    />
                    <Button
                        h="auto"
                        isDisabled={!appMessagesStore.dappToken$.isResolved}
                        isLoading={appMessagesStore.regenerateDappToken.isLoading}
                        onClick={onOpen}
                        variant="secondary"
                    >
                        Regenerate
                    </Button>
                    <MessagesTokenRegenerateConfirmation isOpen={isOpen} onClose={onClose} />
                </Flex>
                <Text textStyle="body2" mb="4" color="text.secondary">
                    This is a service to service authorisation token. The service have token-based
                    authentication, is a type of authentication that generates encrypted security
                    tokens. To authorise your request, you have to call service URL&apos;s with
                    token in the path. Keep token secret.
                </Text>
            </Box>
            <Tabs mb="4">
                <TabList pl="6">
                    <Tab>Send message</Tab>
                    <Tab>Send message to all users</Tab>
                </TabList>

                <TabPanels px="6">
                    <TabPanel>
                        <Text textStyle="label2" mb="3">
                            Posting a message for user by wallet address with Curl:
                        </Text>
                        <CopyPad
                            whiteSpace="pre-wrap"
                            text={`curl -X POST
    https://api.tonconsole.com/v1/pushes/123123123123123/push
    -H 'Content-Type: application/json'
    -d 
    '{"address":"EQ...ER","message":"My Message", link: "http://my-dapp.com/event"}'`}
                            iconAlign="start"
                            mb="3"
                        />
                        <Box textStyle="body2" color="text.secondary">
                            <Box mb="1">Where body have properties:</Box>
                            <UnorderedList listStyleType={'"-"'} spacing="1">
                                <ListItem pl="1">
                                    <Code>address</Code> is user wallet address
                                </ListItem>
                                <ListItem pl="1">
                                    <Code>message</Code> call to action message for user
                                </ListItem>
                                <ListItem pl="1">
                                    <Code>link</Code> link for user action, the link will open in
                                    Tonkeeper dApp Browser
                                </ListItem>
                            </UnorderedList>
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Text textStyle="label2" mb="3">
                            Posting a message for all users with allow notifications with Curl:
                        </Text>
                        <CopyPad
                            whiteSpace="pre-wrap"
                            text={`curl -X POST 
    https://api.tonconsole.com/v1/pushes/123123123123123/push
    -H 'Content-Type: application/json'
    -d 
    '{"message":"My Message", link: "http://my-dapp.com/event"}'`}
                            iconAlign="start"
                            mb="3"
                        />
                        <Box textStyle="body2" color="text.secondary">
                            <Box mb="1">Where body have properties:</Box>
                            <UnorderedList listStyleType={'"-"'} spacing="1">
                                <ListItem pl="1">
                                    <Code>message</Code> call to action message for user
                                </ListItem>
                                <ListItem pl="1">
                                    <Code>link</Code> link for user action, the link will open in
                                    Tonkeeper dApp Browser
                                </ListItem>
                            </UnorderedList>
                        </Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            <DocsLink mb="6" mx="6" />
        </Box>
    );
};

export default observer(AppMessagesAuthDocs);
