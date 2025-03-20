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
    Link as ChakraLink
} from '@chakra-ui/react';
import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { CopyIcon16, copyToClipboard, TickIcon, IconButton } from 'src/shared';
import { Link as ReactRouterLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { airdropsStore } from 'src/shared/stores';

const AirdropsHistoryTable: FunctionComponent<ComponentProps<typeof TableContainer>> = props => {
    const [copiedKey, setCopiedKey] = useState<string | undefined>();

    useEffect(() => {
        if (copiedKey !== undefined) {
            const timeout = setTimeout(() => setCopiedKey(undefined), 1500);
            return () => clearTimeout(timeout);
        }
    }, [copiedKey]);

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
                            <Th>Name</Th>
                            <Th>Creation Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {airdropsStore.airdrops$.value.toReversed().map(i => (
                            <Tr
                                key={i.id}
                                _hover={{ bg: 'background.contentTint' }}
                                cursor="pointer"
                            >
                                <Td overflow="hidden">
                                    <ChakraLink
                                        as={ReactRouterLink}
                                        display="block"
                                        _hover={{ textDecoration: 'none' }}
                                        to={
                                            i.version === 1
                                                ? `/jetton/airdrops/old/${i.api_id}`
                                                : `/jetton/airdrops/${i.api_id}`
                                        }
                                    >
                                        <Flex align="center" gap="1" color="black">
                                            <chakra.span flexShrink="1" layerStyle="textEllipse">
                                                {i.api_id}
                                            </chakra.span>
                                            {copiedKey !== undefined && copiedKey === i.api_id ? (
                                                <TickIcon />
                                            ) : (
                                                <IconButton
                                                    aria-label="copy"
                                                    icon={<CopyIcon16 />}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setCopiedKey(i.api_id);
                                                        copyToClipboard(i.api_id);
                                                    }}
                                                />
                                            )}
                                        </Flex>
                                    </ChakraLink>
                                </Td>
                                <Td overflow="hidden">
                                    <ChakraLink
                                        as={ReactRouterLink}
                                        display="block"
                                        _hover={{ textDecoration: 'none' }}
                                        to={
                                            i.version === 1
                                                ? `/jetton/airdrops/old/${i.api_id}`
                                                : `/jetton/airdrops/${i.api_id}`
                                        }
                                    >
                                        <Flex align="center" gap="1" color="black">
                                            <chakra.span flexShrink="1" layerStyle="textEllipse">
                                                {i.name}
                                            </chakra.span>
                                        </Flex>
                                    </ChakraLink>
                                </Td>
                                <Td overflow="hidden">
                                    <ChakraLink
                                        as={ReactRouterLink}
                                        display="block"
                                        _hover={{ textDecoration: 'none' }}
                                        to={
                                            i.version === 1
                                                ? `/jetton/airdrops/old/${i.api_id}`
                                                : `/jetton/airdrops/${i.api_id}`
                                        }
                                    >
                                        <Flex align="center" gap="1">
                                            <chakra.span flexShrink="1" layerStyle="textEllipse">
                                                {new Date(i.date_create * 1000).toDateString()}
                                            </chakra.span>
                                        </Flex>
                                    </ChakraLink>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default observer(AirdropsHistoryTable);
