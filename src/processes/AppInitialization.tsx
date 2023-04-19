import { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';
import { Box, Center, Fade, useConst } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared';
import { tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';

const AppInitialization: FunctionComponent<PropsWithChildren> = props => {
    const [userResolved, setUserResolved] = useState(false);
    const [renderContent, setRenderContent] = useState(false);
    const startResovingTimeout = useConst(Date.now());
    useEffect(() => {
        if (tGUserStore.user$.isResolved) {
            const timeout = 500 - (Date.now() - startResovingTimeout);
            setTimeout(() => setUserResolved(true), timeout < 0 ? 0 : timeout);
        }
    }, [tGUserStore.user$.isResolved]);

    return (
        <>
            <Fade
                transition={{ enter: { duration: 0 }, exit: { duration: 0.2 } }}
                in={!userResolved}
                initial={{ opacity: 1 }}
                onAnimationComplete={definition => definition === 'exit' && setRenderContent(true)}
                unmountOnExit={true}
            >
                <Center
                    pos="fixed"
                    zIndex={10000}
                    top={0}
                    right={0}
                    bottom={0}
                    left={0}
                    bgColor="background.content"
                >
                    <TonConsoleIcon h="64px" w="64px" />
                </Center>
            </Fade>
            <Box display={renderContent ? 'box' : 'none'}>{props.children}</Box>
        </>
    );
};

export default observer(AppInitialization);
