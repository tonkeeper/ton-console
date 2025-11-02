import { FC, ReactNode } from 'react';
import { Box, BoxProps, Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronUpIcon } from '@chakra-ui/icons';

interface MetricGroupCardProps extends BoxProps {
    title: string;
    onExpand?: () => void;
    children: ReactNode;
    hasData?: boolean;
}

const MetricGroupCard: FC<MetricGroupCardProps> = ({ title, onExpand, children, hasData, ...rest }) => {
    return (
        <Box p="4" borderWidth="1px" borderColor="border.primary" borderRadius="12px" {...rest}>
            <Flex align="center" justify="space-between" mb="4">
                <Text textStyle="label1" color="text.primary" fontSize={16}>
                    {title}
                </Text>
                {onExpand && hasData && (
                    <IconButton
                        aria-label="Expand"
                        icon={<ChevronUpIcon />}
                        onClick={onExpand}
                        size="sm"
                        variant="ghost"
                    />
                )}
            </Flex>
            <Flex direction="column" gap="4">
                {children}
            </Flex>
        </Box>
    );
};

export default MetricGroupCard;
