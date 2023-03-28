import { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { Pad } from './Pad';
import { Box } from '@chakra-ui/react';
import { CopyIcon24 } from './icons/CopyIcon24';

export const CopyPad: FunctionComponent<ComponentProps<typeof Pad> & { children: ReactNode }> = ({
    children,
    ...rest
}) => {
    return (
        <Pad
            py="3"
            px="4"
            pr="2.5"
            display="flex"
            cursor="pointer"
            {...rest}
            gap="7"
            alignItems="center"
        >
            <Box wordBreak="break-word">{children}</Box>
            <CopyIcon24 />
        </Pad>
    );
};
