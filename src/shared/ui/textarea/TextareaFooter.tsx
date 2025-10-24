import { FC, PropsWithChildren, useContext } from 'react';
import { Box, BoxProps, Fade } from '@chakra-ui/react';
import { TextareaGroupContext } from './textarea-group-context';

export const TextareaFooter: FC<PropsWithChildren<BoxProps>> = ({ children, ...rest }) => {
    const { showScrollDivider, focused } = useContext(TextareaGroupContext);
    return (
        <Box
            pos="relative"
            pt="3"
            pb="4"
            px="4"
            border="1px"
            borderColor={focused ? 'field.activeBorder' : 'field.border'}
            borderTop="none"
            borderBottomRadius="md"
            bgColor="field.background"
            transitionDuration="200ms"
            transitionProperty="border"
            {...rest}
        >
            <Fade transition={{ enter: { delay: 0.01 } }} in={showScrollDivider}>
                <Box
                    pos="absolute"
                    top="0"
                    right="12px"
                    left="12px"
                    h="1px"
                    bgColor="separator.common"
                />
            </Fade>
            {children}
        </Box>
    );
};
