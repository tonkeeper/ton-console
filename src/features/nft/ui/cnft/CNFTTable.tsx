import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    TableContainerProps,
    Link,
    Box,
    Center,
    Spinner,
    BoxProps,
    Flex
} from '@chakra-ui/react';
import { FC, PropsWithChildren, useState } from 'react';
import { observer } from 'mobx-react-lite';
import {
    CopyIcon16,
    EmptyFolderIcon48,
    TickIcon,
    copyToClipboard,
    explorer,
    IconButton
} from 'src/shared';
import { CnftCollection } from '../../model/interfaces/CnftCollection';
import { CNFTStore } from 'src/features';

const EmptyTable: FC<PropsWithChildren<BoxProps>> = ({ children, ...props }) => {
    return (
        <Tr>
            <Td
                h="192px"
                border="1px"
                borderColor="background.contentTint"
                borderTop="0"
                colSpan={12}
            >
                <Center textStyle="body2" color="text.secondary" fontFamily="body" {...props}>
                    {children}
                </Center>
            </Td>
        </Tr>
    );
};

const CNFTTableRow: FC<{ row: CnftCollection }> = ({ row }) => {
    const addressString = row.account.toString();
    const [copied, setCopied] = useState<boolean>();

    const handleCopy = () => {
        setCopied(true);
        copyToClipboard(addressString);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <Tr>
            <Td overflow="hidden" maxW="200px">
                {row.name}
            </Td>
            <Td w="100%" maxW="0">
                <Flex align="center" gap="1">
                    <Link
                        display="block"
                        overflow="hidden"
                        color="text.accent"
                        textOverflow="ellipsis"
                        href={explorer.accountLink(addressString)}
                        isExternal
                    >
                        {addressString}
                    </Link>
                    {copied && <TickIcon />}

                    {!copied && (
                        <IconButton aria-label="copy" icon={<CopyIcon16 />} onClick={handleCopy} />
                    )}
                </Flex>
            </Td>
            <Td>{row.minted_count}</Td>
            <Td>{row.paid_indexing_count}</Td>
            <Td>{row.nft_count}</Td>
        </Tr>
    );
};

interface CNFTTableProps {
    cnftStore: CNFTStore;
}

const CNFTTable: FC<TableContainerProps & CNFTTableProps> = ({ cnftStore, ...props }) => {
    const noDataKey = cnftStore.history$.isResolved ? 'empty' : 'loading';
    const bodyKey = cnftStore.history$.value.length > 0 ? 'data' : noDataKey;

    return (
        <Box {...props}>
            <TableContainer
                overflowX="auto"
                w="100%"
                border="1px"
                borderColor="background.contentTint"
                borderRadius="sm"
            >
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Address</Th>
                            <Th>Minted</Th>
                            <Th>Paid</Th>
                            <Th>Total count</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {bodyKey === 'data' &&
                            cnftStore.history$.value.map(row => (
                                <CNFTTableRow key={row.account.toString()} row={row} />
                            ))}
                        {bodyKey === 'loading' && (
                            <EmptyTable>
                                <Spinner />
                            </EmptyTable>
                        )}
                        {bodyKey === 'empty' && (
                            <EmptyTable display="flex" flexDirection="column">
                                <EmptyFolderIcon48 />
                                <Box>No cNFT yet</Box>
                                <Box>Your collections will show up here.</Box>
                            </EmptyTable>
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default observer(CNFTTable);
