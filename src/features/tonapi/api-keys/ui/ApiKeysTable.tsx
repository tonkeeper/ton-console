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
    Menu,
    IconButton,
    Box
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, useCallback, useEffect, useState } from 'react';
import {
    CopyIcon16,
    copyToClipboard,
    DeleteIcon24,
    EditIcon24,
    TickIcon,
    TooltipHoverable,
    VerticalDotsIcon16
} from 'src/shared';
import { ApiKey, apiKeysStore } from '../model';
import { observer } from 'mobx-react-lite';
import EditApiKeyModal from './EditApiKeyModal';
import DeleteApiKeyModal from './DeleteApiKeyModal';

const ApiKeysTable: FunctionComponent<ComponentProps<typeof TableContainer>> = props => {
    const [modal, setModal] = useState<{ key: ApiKey; action: 'edit' | 'delete' } | null>();
    const [copiedKey, setCopiedKey] = useState<number | undefined>();

    useEffect(() => {
        if (copiedKey !== undefined) {
            const timeout = setTimeout(() => setCopiedKey(undefined), 1500);
            return () => clearTimeout(timeout);
        }
    }, [copiedKey]);

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
                        {apiKeysStore.apiKeys$.value.map(apiKey => (
                            <Tr key={apiKey.id}>
                                <Td overflow="hidden" maxW="200px">
                                    <TooltipHoverable
                                        host={
                                            <Box
                                                layerStyle="textEllipse"
                                                w="fit-content"
                                                maxW="100%"
                                            >
                                                {apiKey.name}
                                            </Box>
                                        }
                                    >
                                        {apiKey.name}
                                    </TooltipHoverable>
                                </Td>
                                <Td overflow="hidden" w="100%" maxW="0">
                                    <Flex align="center" gap="1">
                                        <chakra.span flexShrink="1" layerStyle="textEllipse">
                                            {apiKey.value}
                                        </chakra.span>
                                        {copiedKey !== undefined && copiedKey === apiKey.id ? (
                                            <TickIcon />
                                        ) : (
                                            <IconButton
                                                aria-label="copy"
                                                icon={<CopyIcon16 />}
                                                onClick={() => {
                                                    setCopiedKey(apiKey.id);
                                                    copyToClipboard(apiKey.value);
                                                }}
                                                size="fit"
                                                variant="flat"
                                            />
                                        )}
                                    </Flex>
                                </Td>
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
