import { ComponentProps, FC } from 'react';
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
import { AddWebhookModal, invoicesAppStore, InvoicesWebhook, INVOICES_LINKS } from 'src/features';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

const WebhookItem: FC<{ webhook: InvoicesWebhook }> = observer(({ webhook }) => {
    const { hasCopied, onCopy } = useClipboard(webhook.value);

    return (
        <ListItem>
            <Flex align="center" gap="3" pl="2">
                <Span color="text.primary" fontFamily="mono">
                    {webhook.value}
                </Span>
                <Menu closeOnSelect={false} placement="right-start">
                    <MenuButton>
                        <VerticalDotsIcon16 display="block" />
                    </MenuButton>
                    <MenuList w="126px">
                        <MenuItem alignItems="center" gap="2" display="flex" onClick={onCopy}>
                            <CopyIcon24 color="icon.primary" />
                            {hasCopied ? 'Copied' : 'Copy'}
                        </MenuItem>
                        <MenuItem
                            pos="relative"
                            isDisabled={invoicesAppStore.deleteWebhook.isLoading}
                            onClick={() => invoicesAppStore.deleteWebhook(webhook.id)}
                        >
                            <Flex
                                align="center"
                                gap="2"
                                opacity={invoicesAppStore.deleteWebhook.isLoading ? '0.3' : 1}
                            >
                                <DeleteIcon24 />
                                Delete
                            </Flex>
                            {invoicesAppStore.deleteWebhook.isLoading && (
                                <Center pos="absolute" top="0" right="0" bottom="0" left="0">
                                    <Spinner size="sm" />
                                </Center>
                            )}
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </ListItem>
    );
});

const InvoicesWebhooks: FC<ComponentProps<typeof Box>> = props => {
    const { isOpen, onClose, onOpen } = useDisclosure();

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
                            Handle invoices statuses change on your backend with webhooks
                        </Span>
                        <Link color="accent.blue" href={INVOICES_LINKS.WEBHOOKS} isExternal>
                            Documentation
                        </Link>
                    </Flex>
                </Box>
                <Button
                    ml="auto"
                    isLoading={invoicesAppStore.addWebhook.isLoading}
                    onClick={onOpen}
                    variant="secondary"
                >
                    + Add
                </Button>
            </Flex>
            {!!invoicesAppStore.invoicesApp$.value!.webhooks.length && (
                <OrderedList color="text.secondary" spacing="3">
                    {invoicesAppStore.invoicesApp$.value!.webhooks.map(webhook => (
                        <WebhookItem key={webhook.id} webhook={toJS(webhook)} />
                    ))}
                </OrderedList>
            )}
        </Box>
    );
};

export default observer(InvoicesWebhooks);
