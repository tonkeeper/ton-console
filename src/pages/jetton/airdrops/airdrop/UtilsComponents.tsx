import { Card, Flex, Spinner, Text, Link } from '@chakra-ui/react';
import { IconButton, DownloadIcon16 } from 'src/shared';

export const FileInfoComponent = () => {
    const handleDownload = () => {
        const data = [
            ['recipient', 'amount'],
            ['0:c28bb05cd8433090056ef266531ecb933a0d9339619d2cd4304483594cdd15c5', '11000000000']
        ];

        const csvContent = data.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'example.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <Card bg="background.contentTint">
            <Flex direction="column" gap="6px" p="16px">
                <Flex align="center" justify="space-between" direction="row">
                    <Text textStyle="label1">File requirements</Text>
                    <IconButton
                        w="24px"
                        h="24px"
                        icon={<DownloadIcon16 />}
                        onClick={() => handleDownload()}
                        aria-label="Refresh"
                    />
                </Flex>
                <Text textStyle="body2" color="text.secondary">
                    1. CSV format with a comma delimiter;
                    <br />
                    2. Contain a header in the format: recipient, amount;
                    <br />
                    3. Token amount in minimal indivisible units without considering decimals
                    (example: 1000000 for 1 USDT, decimals=6). The value must be positive, and
                    decimal points are not allowed;
                    <br />
                    4. Recipient wallet addresses in user-friendly or raw format, with no&nbsp;duplicate
                    addresses allowed. More information in{' '}
                    <Link
                        color="accent.blue"
                        href="https://docs.tonconsole.com/tonconsole/jettons/airdrop"
                        isExternal
                    >
                        documentation
                    </Link>
                    ;
                    <br />
                    5. File size up to 10,000,000 records
                </Text>
            </Flex>
        </Card>
    );
};

export const FileProcessedComponent = () => {
    return (
        <Card bg="background.contentTint">
            <Flex direction="column" gap="6px" p="16px">
                <Flex align="center" justify="space-between" direction="row">
                    <Text textStyle="label1">Preparing data for distribution</Text>
                    <Spinner />
                </Flex>
                <Text textStyle="body2" color="text.secondary">
                    Preparing data for distribution. This is a lengthy process and will take
                    approximately 7 minutes per 1 million addresses. You can close the page and
                    check later.
                </Text>
            </Flex>
        </Card>
    );
};
