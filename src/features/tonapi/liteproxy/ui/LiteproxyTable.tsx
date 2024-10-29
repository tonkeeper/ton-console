import { Table, TableContainer, Tbody, Td, Th, Thead, Tr, chakra, Flex } from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { CopyIcon16, IconButton, TickIcon, copyToClipboard } from 'src/shared';
import { liteproxysStore } from '../model';
import { observer } from 'mobx-react-lite';

const LiteproxysTable: FunctionComponent<ComponentProps<typeof TableContainer>> = props => {
    const [copiedServer, setCopiedServer] = useState<string | undefined>();
    const [copiedPublicKey, setCopiedPublicKey] = useState<string | undefined>();

    useEffect(() => {
        if (copiedServer !== undefined) {
            const timeout = setTimeout(() => setCopiedServer(undefined), 1500);
            return () => clearTimeout(timeout);
        }
    }, [copiedServer]);

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
                            <Th>Server</Th>
                            {/* <Th>RPS</Th> */}
                            <Th>Public key</Th>
                            <Th>Create At</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {liteproxysStore.liteproxyList$.value.map(liteproxy => (
                            <Tr key={liteproxy.public_key}>
                                <Td overflow="hidden" maxW="230px">
                                    <Flex align="center" gap="1">
                                        <chakra.span flexShrink="1" layerStyle="textEllipse">
                                            {liteproxy.server}
                                        </chakra.span>

                                        {copiedServer !== undefined &&
                                        copiedServer === liteproxy.public_key ? (
                                            <TickIcon />
                                        ) : (
                                            <IconButton
                                                aria-label="copy"
                                                icon={<CopyIcon16 />}
                                                onClick={() => {
                                                    setCopiedServer(liteproxy.public_key);
                                                    copyToClipboard(liteproxy.server);
                                                }}
                                            />
                                        )}
                                    </Flex>
                                </Td>
                                {/* <Td overflow="hidden" w="100%" maxW="0">
                                    <Flex align="center" gap="1">
                                        <chakra.span flexShrink="1" layerStyle="textEllipse">
                                            {liteproxy.rps}
                                        </chakra.span>
                                    </Flex>
                                </Td> */}
                                <Td>
                                    <Flex align="center" gap="1">
                                        <chakra.span flexShrink="1" layerStyle="textEllipse">
                                            {liteproxy.public_key}
                                        </chakra.span>
                                        {copiedPublicKey !== undefined &&
                                        copiedPublicKey === liteproxy.public_key ? (
                                            <TickIcon />
                                        ) : (
                                            <IconButton
                                                aria-label="copy"
                                                icon={<CopyIcon16 />}
                                                onClick={() => {
                                                    setCopiedPublicKey(liteproxy.public_key);
                                                    copyToClipboard(liteproxy.public_key);
                                                }}
                                            />
                                        )}
                                    </Flex>
                                </Td>
                                <Td>{/* {liteproxy.creationDate.toDateString()} */}-</Td>
                                {/* <Td>
                                    <Flex align="center" justify="flex-end" gap="4">
                                        <chakra.span color="text.secondary">
                                            {liteproxy.creationDate.toDateString()}
                                        </chakra.span>
                                        <Menu placement="bottom-end">
                                            <MenuButtonIcon icon={<VerticalDotsIcon16 />} />
                                            <MenuList w="132px">
                                                <MenuItem onClick={() => openEditModal(liteproxy)}>
                                                    <EditIcon24 mr="2" />
                                                    <Text textStyle="label2" fontFamily="body">
                                                        Edit
                                                    </Text>
                                                </MenuItem>
                                                <MenuItem onClick={() => openDeleteModal(liteproxy)}>
                                                    <DeleteIcon24 mr="2" />
                                                    <Text textStyle="label2" fontFamily="body">
                                                        Delete
                                                    </Text>
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </Flex>
                                </Td> */}
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default observer(LiteproxysTable);
