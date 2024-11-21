import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Flex,
    Text,
    MenuList,
    MenuItem,
    Menu,
    Box,
    TableContainerProps,
    Link as ChakraLink,
    chakra
} from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import {
    DeleteIcon24,
    EditIcon24,
    TooltipHoverable,
    VerticalDotsIcon16,
    MenuButtonIcon,
    CopyIcon16,
    TickIcon,
    copyToClipboard,
    IconButton
} from 'src/shared';
import { Webhook, webhooksStore } from '../model';
import { observer } from 'mobx-react-lite';
import DeleteWebhookModal from './DeleteWebhookModal';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';
import { RTWebhookListStatusEnum } from 'src/shared/api/streaming-api';

const WebhooksTable: FC<TableContainerProps> = props => {
    const navigate = useNavigate();
    const [modal, setModal] = useState<{ key: Webhook; action: 'edit' | 'delete' } | null>();
    const [copiedToken, setCopiedToken] = useState<number | undefined>();

    useEffect(() => {
        if (copiedToken !== undefined) {
            const timeout = setTimeout(() => setCopiedToken(undefined), 1500);
            return () => clearTimeout(timeout);
        }
    }, [copiedToken]);

    const goToWebhookPage = useCallback((key: Webhook) => {
        navigate(`./view?webhookId=${key.id}`);
    }, []);

    const openDeleteModal = useCallback((key: Webhook) => {
        setModal({ key, action: 'delete' });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    const backWebhookToOnline = useCallback((webhook: Webhook) => {
        webhooksStore.backWebhookToOnline(webhook);
    }, []);

    return (
        <>
            <TableContainer
                border="1px"
                borderColor="background.contentTint"
                borderRadius="sm"
                {...props}
            >
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>ID</Th>
                            <Th>Webhook</Th>
                            <Th>Subscriptions</Th>
                            <Th>Status</Th>
                            <Th>Token</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {webhooksStore.webhooks$.value.map(webhook => (
                            <ChakraLink
                                key={webhook.id}
                                as={ReactRouterLink}
                                display="contents"
                                to={`./view?webhookId=${webhook.id}`}
                            >
                                <Tr>
                                    <Td overflow="hidden" maxW="200px">
                                        <TooltipHoverable
                                            host={
                                                <Box
                                                    layerStyle="textEllipse"
                                                    w="fit-content"
                                                    maxW="100%"
                                                >
                                                    {webhook.id}
                                                </Box>
                                            }
                                            offset={[-16, 8]}
                                            placement="bottom-start"
                                        >
                                            {webhook.id}
                                        </TooltipHoverable>
                                    </Td>
                                    <Td overflow="hidden">
                                        <TooltipHoverable
                                            host={
                                                <Box
                                                    layerStyle="textEllipse"
                                                    w="fit-content"
                                                    maxW="100%"
                                                >
                                                    {webhook.endpoint}
                                                </Box>
                                            }
                                            offset={[-16, 8]}
                                            placement="bottom-start"
                                        >
                                            {webhook.endpoint}
                                        </TooltipHoverable>
                                    </Td>
                                    <Td maxW="100px">{webhook.subscribed_accounts}</Td>
                                    <Td maxW="100px" onClick={e => e.preventDefault()}>
                                        {webhook.status === RTWebhookListStatusEnum.RTOnline
                                            ? 'Online'
                                            : 'Offline'}
                                        {webhook.status === RTWebhookListStatusEnum.RTOffline && (
                                            <Menu placement="bottom-end">
                                                <MenuButtonIcon icon={<VerticalDotsIcon16 />} />
                                                <MenuList w="132px">
                                                    <MenuItem
                                                        onClick={() => backWebhookToOnline(webhook)}
                                                    >
                                                        <Text textStyle="label2" fontFamily="body">
                                                            Back to Online
                                                        </Text>
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        )}
                                    </Td>
                                    <Td w="100px">
                                        <Flex
                                            align="center"
                                            justify="space-between"
                                            gap="4"
                                            onClick={e => e.preventDefault()}
                                        >
                                            <Flex align="center" gap="1">
                                                <chakra.span
                                                    flexShrink="1"
                                                    w="80px"
                                                    layerStyle="textEllipse"
                                                >
                                                    {webhook.token}
                                                </chakra.span>
                                                {copiedToken !== undefined &&
                                                copiedToken === webhook.id ? (
                                                    <TickIcon />
                                                ) : (
                                                    <IconButton
                                                        aria-label="copy"
                                                        icon={<CopyIcon16 />}
                                                        onClick={() => {
                                                            setCopiedToken(webhook.id);
                                                            copyToClipboard(webhook.token);
                                                        }}
                                                    />
                                                )}
                                            </Flex>

                                            <Menu placement="bottom-end">
                                                <MenuButtonIcon icon={<VerticalDotsIcon16 />} />
                                                <MenuList w="132px">
                                                    <MenuItem
                                                        onClick={() => goToWebhookPage(webhook)}
                                                    >
                                                        <EditIcon24 mr="2" />
                                                        <Text textStyle="label2" fontFamily="body">
                                                            View
                                                        </Text>
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => openDeleteModal(webhook)}
                                                    >
                                                        <DeleteIcon24 mr="2" />
                                                        <Text textStyle="label2" fontFamily="body">
                                                            Delete
                                                        </Text>
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Flex>
                                    </Td>
                                </Tr>
                            </ChakraLink>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {modal && (
                <DeleteWebhookModal
                    isOpen={modal?.action === 'delete'}
                    webhook={modal?.key}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default observer(WebhooksTable);
