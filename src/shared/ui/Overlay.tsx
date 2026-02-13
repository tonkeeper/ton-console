import { Box, BoxProps } from '@chakra-ui/react';
import { FC } from 'react';

interface OverlayProps extends BoxProps {
    breadcrumbs?: React.ReactNode;
}

export const Overlay: FC<OverlayProps> = ({ breadcrumbs, children, p, ...rest }) => {
    return (
        <>
            {breadcrumbs}
            <Box
                maxW="100%"
                h={breadcrumbs ? 'calc(100% - 28px)' : '100%'}
                px={p ?? { base: 4, md: 6 }}
                py={p ?? { base: 4, md: 5 }}
                borderTopRadius={{ base: 'md', md: 'lg' }}
                borderBottomRadius={{ base: 'none', md: 'lg' }}
                bgColor="background.content"
                {...rest}
            >
                {children}
            </Box>
        </>
    );
};
