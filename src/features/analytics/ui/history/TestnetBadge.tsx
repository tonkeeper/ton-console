import { ComponentProps, FunctionComponent } from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Span } from 'src/shared';

export const TestnetBadge: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Flex
            align="center"
            h="20px"
            px="1"
            py="0.5"
            border="1px solid"
            borderColor="icon.tertiary"
            borderRadius="sm"
            {...props}
        >
            <Span fontFamily="mono" textStyle="body3" color="text.tertiary">
                Testnet
            </Span>
        </Flex>
    );
};
