import { FC, PropsWithChildren, useContext } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';
import { TextareaGroupContext } from './textarea-group-context';

export const TextareaRight: FC<PropsWithChildren<BoxProps>> = ({ children, ...rest }) => {
    const { focused } = useContext(TextareaGroupContext);
    return (
        <Box
            pos="relative"
            p="4"
            border="1px"
            borderColor={focused ? 'field.activeBorder' : 'field.border'}
            borderLeft="none"
            borderTopRightRadius="md"
            borderTopLeftRadius="0"
            borderBottomLeftRadius="0"
            borderBottomRightRadius="md"
            bgColor="field.background"
            transitionDuration="200ms"
            transitionProperty="border"
            {...rest}
        >
            {children}
        </Box>
    );
};
