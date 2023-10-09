import { ComponentProps, FunctionComponent } from 'react';
import {
    Box,
    Button,
    Center,
    Flex,
    Link,
    ListItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    OrderedList,
    Spinner,
    Text,
    useClipboard,
    useDisclosure
} from '@chakra-ui/react';
import { CopyIcon24, DeleteIcon24, Span, VerticalDotsIcon16 } from 'src/shared';
import { AddWebhookModal, invoicesAppStore } from 'src/features';
import { observer } from 'mobx-react-lite';

const InvoicesWebhooks: FunctionComponent<ComponentProps<typeof Box>> = props => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { hasCopied, onCopy, setValue } = useClipboard('');

    return (
        <Box {...props}>
            <AddWebhookModal isOpen={isOpen} onClose={onClose} />
            <Flex>
                <Box>
                    <Text textStyle="label1" mb="1">
                        Webhooks
                    </Text>
                    <Flex gap="3" mb="5">
                        <Span textStyle="body2" color="text.secondary">
                            Description
                        </Span>
                        <Link color="accent.blue" href="#" /*TODO*/ isExternal>
                            Documentation
                        </Link>
                    </Flex>
                </Box>
                <Button
                    ml="auto"
                    isDisabled={!invoicesAppStore.webhooks$.isResolved}
                    isLoading={invoicesAppStore.addWebhook.isLoading}
                    onClick={onOpen}
                    variant="secondary"
                >
                    + Add
                </Button>
            </Flex>
            {invoicesAppStore.webhooks$.isResolved ? (
                invoicesAppStore.webhooks$.value.length ? (
                    <OrderedList color="text.secondary" spacing="3">
                        {invoicesAppStore.webhooks$.value.map(webhook => (
                            <ListItem key={webhook.id}>
                                <Flex align="center" gap="3" pl="2">
                                    <Span color="text.primary" fontFamily="mono">
                                        {webhook.value}
                                    </Span>
                                    <Menu closeOnSelect={false} placement="right-start">
                                        <MenuButton>
                                            <VerticalDotsIcon16 display="block" />
                                        </MenuButton>
                                        <MenuList w="126px">
                                            <MenuItem
                                                alignItems="center"
                                                gap="2"
                                                display="flex"
                                                isDisabled={true}
                                                onClick={() => {
                                                    setValue(webhook.value);
                                                    onCopy();
                                                }}
                                            >
                                                <CopyIcon24 color="icon.primary" />
                                                {hasCopied ? 'Copied' : 'Copy'}
                                            </MenuItem>
                                            <MenuItem
                                                pos="relative"
                                                isDisabled={
                                                    invoicesAppStore.deleteWebhook.isLoading
                                                }
                                                onClick={() =>
                                                    invoicesAppStore.deleteWebhook(webhook.id)
                                                }
                                            >
                                                <Flex
                                                    align="center"
                                                    gap="2"
                                                    opacity={
                                                        invoicesAppStore.deleteWebhook.isLoading
                                                            ? '0.3'
                                                            : 1
                                                    }
                                                >
                                                    <DeleteIcon24 />
                                                    Delete
                                                </Flex>
                                                {invoicesAppStore.deleteWebhook.isLoading && (
                                                    <Center
                                                        pos="absolute"
                                                        top="0"
                                                        right="0"
                                                        bottom="0"
                                                        left="0"
                                                    >
                                                        <Spinner size="sm" />
                                                    </Center>
                                                )}
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </Flex>
                            </ListItem>
                        ))}
                    </OrderedList>
                ) : (
                    <Box textStyle="body2" h="6" color="text.secondary" textAlign="center">
                        Click to the Add button to register a webhook
                    </Box>
                )
            ) : (
                <Center>
                    <Spinner />
                </Center>
            )}
        </Box>
    );
};

export default observer(InvoicesWebhooks);
