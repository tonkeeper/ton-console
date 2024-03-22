import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { CloseIcon24, IconButton, Span } from 'src/shared';

export const ChartCard: FunctionComponent<
    PropsWithChildren<ComponentProps<typeof Box>> & { label: string; onClose: () => void }
> = ({ label, children, onClose, ...rest }) => {
    return (
        <Box
            maxW="100%"
            h="100%"
            px="5"
            py="4"
            bg="background.contentTint"
            borderRadius="md"
            {...rest}
        >
            <Flex align="center" justify="space-between" mb="2">
                <Span textStyle="label1" color="text.secondary">
                    {label}
                </Span>
                <IconButton icon={<CloseIcon24 />} aria-label="Close" onClick={onClose} />
            </Flex>
            {children}
        </Box>
    );
};
