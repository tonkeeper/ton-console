import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Box, Center, Fade, FadeProps } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared';
import { setupApiInterceptors } from 'src/shared/api/interceptors';

const FadeAnimation: FC<FadeProps> = props => (
    <Fade
        transition={{ enter: { duration: 0 }, exit: { duration: 0.3 } }}
        initial={{ opacity: 1 }}
        unmountOnExit={true}
        {...props}
    />
);

interface AppInitializationProps extends PropsWithChildren {
    isLoading: boolean;
}

const AppInitialization: FC<AppInitializationProps> = ({ isLoading, children }) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Setup API interceptors once on app initialization
        setupApiInterceptors();
    }, []);

    useEffect(() => {
        if (!isLoading && ref.current) {
            ref.current.style.opacity = '0';
        }
    }, [isLoading]);

    return (
        <>
            <Center
                as={FadeAnimation}
                pos="fixed"
                zIndex={10000}
                top={0}
                right={0}
                bottom={0}
                left={0}
                bgColor="background.content"
                in={isLoading}
            >
                <TonConsoleIcon ref={ref} transition="opacity 0.1s linear" h="64px" w="64px" />
            </Center>
            <Box
                overflow={isLoading ? 'hidden' : 'auto'}
                h="100%"
                maxH={isLoading ? '100%' : 'unset'}
            >
                {children}
            </Box>
        </>
    );
};

export default AppInitialization;
