import { FC } from 'react';
import { Box, Flex, Text } from '@chakra-ui/react';

export type StatusIndicatorVariant = 'success' | 'error';

interface VariantConfig {
    dotColor: string;
    textColor: string;
    shadow: string;
    animation: string;
}

const VARIANT_CONFIG: Record<StatusIndicatorVariant, VariantConfig> = {
    success: {
        dotColor: 'green.500',
        textColor: 'green.700',
        shadow: '0 0 8px green',
        animation: 'pulse 1.5s infinite'
    },
    error: {
        dotColor: 'red.500',
        textColor: 'gray.700',
        shadow: 'none',
        animation: 'none'
    }
};

const StatusIndicator: FC<{ variant: StatusIndicatorVariant; label?: string }> = ({
    variant,
    label
}) => {
    const config = VARIANT_CONFIG[variant];

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
                bg={config.dotColor}
                borderRadius="50%"
                shadow={config.shadow}
                animation={config.animation}
            />
            {label && (
                <Text color={config.textColor} fontSize="sm">
                    {label}
                </Text>
            )}
        </Flex>
    );
};

export default StatusIndicator;
