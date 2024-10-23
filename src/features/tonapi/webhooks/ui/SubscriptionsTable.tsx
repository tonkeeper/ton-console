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
    TableContainerProps
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import {
    DeleteIcon24,
    EditIcon24,
    TooltipHoverable,
    VerticalDotsIcon16,
    MenuButtonIcon
} from 'src/shared';
import { webhooksStore } from '../model';
import { observer } from 'mobx-react-lite';
import { Subscription } from '../model/webhooks.store';
import DeleteSubscriptionsModal from './DeleteSubscriptionModal';

const SubscriptionsTable: FC<TableContainerProps> = props => {
    const [modal, setModal] = useState<{ key: Subscription; action: 'edit' | 'delete' } | null>();

    const openEditModal = useCallback((key: Subscription) => {
        setModal({ key, action: 'edit' });
    }, []);

    const openDeleteModal = useCallback((key: Subscription) => {
        setModal({ key, action: 'delete' });
    }, []);

    const closeModal = useCallback(() => {
        setModal(null);
    }, []);

    console.log(webhooksStore.subscriptions$.value);

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
                            <Th>Account</Th>
                            <Th>Subscription</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {webhooksStore.subscriptions$.value.map(subscription => (
                            <Tr key={subscription.account_id}>
                                <Td overflow="hidden" maxW="200px">
                                    <TooltipHoverable
                                        host={
                                            <Box
                                                layerStyle="textEllipse"
                                                w="fit-content"
                                                maxW="100%"
                                            >
                                                {subscription.account_id}
                                            </Box>
                                        }
                                        offset={[-16, 8]}
                                        placement="bottom-start"
                                    >
                                        {subscription.account_id}
                                    </TooltipHoverable>
                                </Td>
                                <Td overflow="hidden" maxW="200px">
                                    <Flex align="center" justify="space-between" gap="4">
                                        <TooltipHoverable
                                            host={
                                                <Box
                                                    layerStyle="textEllipse"
                                                    w="fit-content"
                                                    maxW="100%"
                                                >
                                                    {subscription.last_delivered_lt}
                                                </Box>
                                            }
                                            offset={[-16, 8]}
                                            placement="bottom-start"
                                        >
                                            {subscription.failed_lt}
                                        </TooltipHoverable>

                                        <Menu placement="bottom-end">
                                            <MenuButtonIcon icon={<VerticalDotsIcon16 />} />
                                            <MenuList w="132px">
                                                <MenuItem
                                                    onClick={() => openEditModal(subscription)}
                                                >
                                                    <EditIcon24 mr="2" />
                                                    <Text textStyle="label2" fontFamily="body">
                                                        Edit
                                                    </Text>
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => openDeleteModal(subscription)}
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
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            {modal && (
                <DeleteSubscriptionsModal
                    isOpen={modal?.action === 'delete'}
                    subscription={modal?.key}
                    onClose={closeModal}
                />
            )}
        </>
    );
};

export default observer(SubscriptionsTable);
