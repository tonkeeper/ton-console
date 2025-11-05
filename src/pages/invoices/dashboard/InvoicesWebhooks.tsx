import { FC } from 'react';
import {
    Box,
    BoxProps,
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
import { AddWebhookModal, InvoicesWebhook, INVOICES_LINKS } from 'src/features';

const WebhookItem: FC<{ webhook: InvoicesWebhook; isDeleting: boolean; onDelete: (id: string) => void }> = ({
    webhook,
    isDeleting,
    onDelete
}) => {
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
                            isDisabled={isDeleting}
                            onClick={() => onDelete(webhook.id)}
                        >
                            <Flex
                                align="center"
                                gap="2"
                                opacity={isDeleting ? '0.3' : 1}
                            >
                                <DeleteIcon24 />
                                Delete
                            </Flex>
                            {isDeleting && (
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
};

interface InvoicesWebhooksProps extends BoxProps {
    webhooks?: InvoicesWebhook[];
    onAddWebhook: (webhook: string) => Promise<void>;
    onDeleteWebhook: (webhookId: string) => void;
    isDeletingWebhook?: boolean;
    isAddingWebhook?: boolean;
}

const InvoicesWebhooks: FC<InvoicesWebhooksProps> = ({
    webhooks = [],
    onAddWebhook,
    onDeleteWebhook,
    isDeletingWebhook = false,
    isAddingWebhook = false,
    ...props
}) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <Box {...props}>
            <AddWebhookModal isOpen={isOpen} onClose={onClose} onAddWebhook={onAddWebhook} isLoading={isAddingWebhook} />
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
                    isLoading={isAddingWebhook}
                    onClick={onOpen}
                    variant="secondary"
                >
                    + Add
                </Button>
            </Flex>
            {!!webhooks.length && (
                <OrderedList color="text.secondary" spacing="3">
                    {webhooks.map(webhook => (
                        <WebhookItem
                            key={webhook.id}
                            webhook={webhook}
                            isDeleting={isDeletingWebhook}
                            onDelete={onDeleteWebhook}
                        />
                    ))}
                </OrderedList>
            )}
        </Box>
    );
};

export default InvoicesWebhooks;
