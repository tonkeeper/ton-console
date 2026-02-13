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
    TableContainerProps,
    Spinner
} from '@chakra-ui/react';
import { FC, useCallback, useState } from 'react';
import {
    DeleteIcon24,
    EditIcon24,
    VerticalDotsIcon16,
    MenuButtonIcon,
    Pagination
} from 'src/shared';
import { Subscription, useWebhookSubscriptionsQuery, useWebhooksUI } from '../model';
import DeleteSubscriptionsModal from './DeleteSubscriptionModal';
import { Address } from '@ton/core';

const SubscriptionsTable: FC<TableContainerProps> = props => {
    const { selectedWebhookId, subscriptionsPage, setSubscriptionsPage } = useWebhooksUI();
    const { data: subscriptions = [], isLoading } = useWebhookSubscriptionsQuery(
        selectedWebhookId,
        subscriptionsPage
    );
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

    if (isLoading) {
        return <Spinner />;
    }

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
                            <Th>Last Delivered LT</Th>
                            <Th>Failed Attempts</Th>
                            <Th>Failed LT</Th>
                            <Th>Failed At</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {subscriptions.map((subscription: Subscription) => (
                            <Tr key={subscription.account_id}>
                                <Td overflow="hidden" minW={250}>
                                    {Address.parse(subscription.account_id).toString({
                                        bounceable: false
                                    })}
                                </Td>
                                <Td overflow="hidden" maxW="200px">
                                    {subscription.last_delivered_lt ?? '-'}
                                </Td>

                                <Td overflow="hidden" maxW="200px">
                                    {subscription.failed_attempts ?? '-'}
                                </Td>

                                <Td overflow="hidden" maxW="200px">
                                    {subscription.failed_lt ?? '-'}
                                </Td>
                                <Td overflow="hidden" maxW="200px">
                                    <Flex align="center" justify="space-between" gap="4">
                                        {subscription.failed_at ?? '-'}

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
            <Pagination
                currentPage={subscriptionsPage}
                totalPages={Math.ceil(subscriptions.length / 20)}
                onPageChange={(page: number) => setSubscriptionsPage(page)}
            />
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

export default SubscriptionsTable;
