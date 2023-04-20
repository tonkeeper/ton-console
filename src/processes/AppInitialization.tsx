import { ComponentProps, FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Center, Fade, useConst } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared';
import { tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const FadeAnimation: FunctionComponent<ComponentProps<typeof Fade>> = props => (
    <Fade
        transition={{ enter: { duration: 0 }, exit: { duration: 0.25 } }}
        initial={{ opacity: 1 }}
        unmountOnExit={true}
        {...props}
    />
);

const AppInitialization: FunctionComponent<PropsWithChildren> = props => {
    const [userResolved, setUserResolved] = useState(false);
    const startResolvingTimeout = useConst(Date.now());
    useEffect(() => {
        if (tGUserStore.user$.isResolved) {
            const timeout = 500 - (Date.now() - startResolvingTimeout);
            setTimeout(() => setUserResolved(true), timeout < 0 ? 0 : timeout);
        }
    }, [tGUserStore.user$.isResolved]);

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
                <TonConsoleIcon h="64px" w="64px" />
            </Center>
            {props.children}
        </>
    );
};

export default observer(AppInitialization);
