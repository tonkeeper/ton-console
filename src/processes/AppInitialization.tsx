import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { Box, Center, Fade, FadeProps } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared';
import { appStore, userStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';
import { setupApiInterceptors } from 'src/shared/api/interceptors';

const FadeAnimation: FC<FadeProps> = props => (
    <Fade
        transition={{ enter: { duration: 0 }, exit: { duration: 0.3 } }}
        initial={{ opacity: 1 }}
        unmountOnExit={true}
        {...props}
    />
);

const AppInitialization: FC<PropsWithChildren> = props => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        // Setup API interceptors once on app initialization
        setupApiInterceptors(userStore);
    }, []);

    useEffect(() => {
        if (appStore.isInitialized && ref.current) {
            ref.current.style.opacity = '0';
        }
    }, [appStore.isInitialized]);

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
                in={!appStore.isInitialized}
            >
                <TonConsoleIcon ref={ref} transition="opacity 0.1s linear" h="64px" w="64px" />
            </Center>
            <Box
                overflow={appStore.isInitialized ? 'auto' : 'hidden'}
                h="100%"
                maxH={appStore.isInitialized ? 'unset' : '100%'}
            >
                {props.children}
            </Box>
        </>
    );
};

export default observer(AppInitialization);
