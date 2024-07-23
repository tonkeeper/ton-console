import {
    ComponentProps,
    FunctionComponent,
    PropsWithChildren,
    useEffect,
    useRef,
    useState
} from 'react';
import { Box, Center, Fade, useConst } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared';
import { userStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const FadeAnimation: FunctionComponent<ComponentProps<typeof Fade>> = props => (
    <Fade
        transition={{ enter: { duration: 0 }, exit: { duration: 0.3 } }}
        initial={{ opacity: 1 }}
        unmountOnExit={true}
        {...props}
    />
);

const AppInitialization: FunctionComponent<PropsWithChildren> = props => {
    const [userResolved, setUserResolved] = useState(false);
    const startResolvingTimeout = useConst(Date.now());
    const ref = useRef<SVGElement | null>(null);
    useEffect(() => {
        if (userStore.user$.isResolved) {
            const timeout = 500 - (Date.now() - startResolvingTimeout);
            setTimeout(() => setUserResolved(true), timeout < 0 ? 0 : timeout);
        }
    }, [userStore.user$.isResolved]);

    useEffect(() => {
        if (userResolved && ref.current) {
            ref.current.style.opacity = '0';
        }
    }, [userResolved]);

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
                in={!userResolved}
            >
                <TonConsoleIcon ref={ref} transition="opacity 0.1s linear" h="64px" w="64px" />
            </Center>
            <Box
                overflow={userResolved ? 'auto' : 'hidden'}
                h="100%"
                maxH={userResolved ? 'unset' : '100%'}
            >
                {props.children}
            </Box>
        </>
    );
};

export default observer(AppInitialization);
