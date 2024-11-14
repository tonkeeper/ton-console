import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

interface OverlayProps extends BoxProps {
    breadcrumbs?: React.ReactNode;
}

export const Overlay: FC<OverlayProps> = ({ breadcrumbs, children, ...rest }) => {
    return (
        <>
            {breadcrumbs}
            <Box
                maxW="100%"
                h={breadcrumbs ? 'calc(100% - 28px)' : '100%'}
                px="6"
                py="5"
                borderRadius="lg"
                bgColor="background.content"
                {...rest}
            >
                {children}
            </Box>
        </>
    );
};
