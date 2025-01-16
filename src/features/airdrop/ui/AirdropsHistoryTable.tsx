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
import { airdropsStore } from '../model';
import { observer } from 'mobx-react-lite';

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
                        {airdropsStore.airdrops$.value.map(i => (
                            <ChakraLink
                                key={i.id}
                                as={ReactRouterLink}
                                display="contents"
                                to={`/jetton/airdrop?id=${i.api_id}`}
                            >
                                <Tr key={i.id}>
                                    <Td overflow="hidden">
                                        <Flex align="center" gap="1">
                                            <chakra.span flexShrink="1" layerStyle="textEllipse">
                                                {i.id}
                                            </chakra.span>
                                            {copiedKey !== undefined && copiedKey === i.id ? (
                                                <TickIcon />
                                            ) : (
                                                <IconButton
                                                    aria-label="copy"
                                                    icon={<CopyIcon16 />}
                                                    onClick={e => {
                                                        e.stopPropagation();
                                                        e.preventDefault();
                                                        setCopiedKey(i.id);
                                                        copyToClipboard(i.id);
                                                    }}
                                                />
                                            )}
                                        </Flex>
                                    </Td>
                                    <Td overflow="hidden">
                                        <Flex align="center" gap="1">
                                            <chakra.span flexShrink="1" layerStyle="textEllipse">
                                                {i.name}
                                            </chakra.span>
                                        </Flex>
                                    </Td>
                                    <Td overflow="hidden">
                                        <Flex align="center" gap="1">
                                            <chakra.span
                                                color="text.secondary"
                                                flexShrink="1"
                                                layerStyle="textEllipse"
                                            >
                                                {new Date(i.date_create * 1000).toDateString()}
                                            </chakra.span>
                                        </Flex>
                                    </Td>
                                </Tr>
                            </ChakraLink>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </>
    );
};

export default observer(AirdropsHistoryTable);
