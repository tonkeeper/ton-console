import { Box, Flex, Text } from '@chakra-ui/react';

const StatusIndicator = ({ isOnline, label = false }: { isOnline: boolean; label: boolean }) => {
    return (
        <Flex align="center" gap="8px">
            <Box
                sx={{
                    '@keyframes pulse': {
                        '0%': { boxShadow: '0 0 8px green' },
                        '50%': { boxShadow: '0 0 12px green' },
                        '100%': { boxShadow: '0 0 8px green' }
                    }
                }}
                w="10px"
                h="10px"
                bg={isOnline ? 'green.500' : 'red.500'}
                borderRadius="50%"
                shadow={isOnline ? '0 0 8px green' : 'none'}
                animation={isOnline ? 'pulse 1.5s infinite' : 'none'}
            />
            {label && (
                <Text color={isOnline ? 'green.700' : 'gray.700'} fontSize="sm">
                    {isOnline ? 'Online' : 'Offline'}
                </Text>
            )}
        </Flex>
    );
};

export default StatusIndicator;
