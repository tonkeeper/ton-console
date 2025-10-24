import { ComponentProps, FC, PropsWithChildren } from 'react';
import { Box } from '@chakra-ui/react';

export const CodeAreaFooter: FC<PropsWithChildren<ComponentProps<typeof Box>>> = ({
    children,
    ...rest
}) => {
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
