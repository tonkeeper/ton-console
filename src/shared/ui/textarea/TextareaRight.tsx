import { ComponentProps, FC, PropsWithChildren, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { TextareaGroupContext } from './textarea-group-context';

export const TextareaRight: FC<PropsWithChildren<ComponentProps<typeof Box>>> = ({
    children,
    ...rest
}) => {
    const { focused } = useContext(TextareaGroupContext);
    return (
        <Box
            pos="relative"
            p="4"
            border="1px"
            borderColor={focused ? 'field.activeBorder' : 'field.border'}
            borderLeft="none"
            borderTopLeftRadius="0"
            borderTopRightRadius="md"
            borderBottomRightRadius="md"
            borderBottomLeftRadius="0"
            bgColor="field.background"
            transitionDuration="200ms"
            transitionProperty="border"
            {...rest}
        >
            {children}
        </Box>
    );
};
