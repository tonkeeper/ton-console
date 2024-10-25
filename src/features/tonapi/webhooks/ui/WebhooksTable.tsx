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
    Link as ChakraLink
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import {
    DeleteIcon24,
    EditIcon24,
    TooltipHoverable,
    VerticalDotsIcon16,
    MenuButtonIcon
} from 'src/shared';
import { Webhook, webhooksStore } from '../model';
import { observer } from 'mobx-react-lite';
import DeleteWebhookModal from './DeleteWebhookModal';
import { useNavigate, Link as ReactRouterLink } from 'react-router-dom';

const WebhooksTable: FC<TableContainerProps> = props => {
    const navigate = useNavigate();
    const [modal, setModal] = useState<{ key: Webhook; action: 'edit' | 'delete' } | null>();

    const goToWebhookPage = useCallback((key: Webhook) => {
        navigate(`./view?webhookId=${key.id}`);
    }, []);

    const openDeleteModal = useCallback((key: Webhook) => {
        setModal({ key, action: 'delete' });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
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
                                    <Td maxW="170px">
                                        <Flex
                                            align="center"
                                            justify="space-between"
                                            gap="4"
                                            onClick={e => e.preventDefault()}
                                        >
                                            {webhook.subscribed_accounts}

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
