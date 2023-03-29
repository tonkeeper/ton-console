import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    chakra,
    Flex,
    MenuButton,
    Text,
    MenuList,
    MenuItem,
    Menu
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, useCallback, useState } from 'react';
import { DeleteIcon24, EditIcon24, VerticalDotsIcon16 } from 'src/shared';
import { ApiKey, apiKeysStore } from '../model';
import { observer } from 'mobx-react-lite';
import EditApiKeyModal from './EditApiKeyModal';
import DeleteApiKeyModal from './DeleteApiKeyModal';

const ApiKeysTable: FunctionComponent<ComponentProps<typeof TableContainer>> = props => {
    const [modal, setModal] = useState<{ key: ApiKey; action: 'edit' | 'delete' } | null>();

    const openEditModal = useCallback((key: ApiKey) => {
        setModal({ key, action: 'edit' });
    }, []);

    const openDeleteModal = useCallback((key: ApiKey) => {
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
                            <Th>Name</Th>
                            <Th>API Key</Th>
                            <Th w="100%" textAlign="right">
                                <chakra.span pr="34px">Created</chakra.span>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {apiKeysStore.apiKeys.map(apiKey => (
                            <Tr key={apiKey.id}>
                                <Td>{apiKey.name}</Td>
                                <Td>{apiKey.value}</Td>
                                <Td>
                                    <Flex align="center" justify="flex-end" gap="4">
                                        <chakra.span color="text.secondary">
                                            {apiKey.creationDate.toDateString()}
                                        </chakra.span>
                                        <Menu placement="bottom-end">
                                            <MenuButton>
                                                <VerticalDotsIcon16 />
                                            </MenuButton>
                                            <MenuList w="132px">
                                                <MenuItem onClick={() => openEditModal(apiKey)}>
                                                    <EditIcon24 mr="2" />
                                                    <Text textStyle="label2" fontFamily="body">
                                                        Edit
                                                    </Text>
                                                </MenuItem>
                                                <MenuItem onClick={() => openDeleteModal(apiKey)}>
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
            <EditApiKeyModal
                isOpen={modal?.action === 'edit'}
                apiKey={modal?.key}
                onClose={closeModal}
            />
            <DeleteApiKeyModal
                isOpen={modal?.action === 'delete'}
                apiKey={modal?.key}
                onClose={closeModal}
            />
        </>
    );
};

export default observer(ApiKeysTable);
