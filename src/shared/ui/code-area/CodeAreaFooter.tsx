import { FC, PropsWithChildren } from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

export const CodeAreaFooter: FC<PropsWithChildren<BoxProps>> = ({ children, ...rest }) => {
    return (
        <Box
            {...rest}
            p="4"
            color="button.primary.foreground"
            bg="codeArea.footerBackground"
            borderBottomRadius="lg"
        >
            {children}
        </Box>
    );
};
