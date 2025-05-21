import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Box, Center, Fade, FadeProps, useConst } from '@chakra-ui/react';
import { TonConsoleIcon } from 'src/shared';
import { userStore, projectsStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';
import { awaitValueResolved } from 'src/shared';

const FadeAnimation: FC<FadeProps> = props => (
    <Fade
        transition={{ enter: { duration: 0 }, exit: { duration: 0.3 } }}
        initial={{ opacity: 1 }}
        unmountOnExit={true}
        {...props}
    />
);

const AppInitialization: FC<PropsWithChildren> = props => {
    const [userResolved, setUserResolved] = useState(false);
    const [projectsResolved, setProjectsResolved] = useState(false);
    const startResolvingTimeout = useConst(Date.now());
    const ref = useRef<SVGElement | null>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                if (userStore.user$.isResolved) {
                    await awaitValueResolved(projectsStore.projects$);
                    const timeout = 500 - (Date.now() - startResolvingTimeout);
                    setTimeout(
                        () => {
                            setUserResolved(true);
                            setProjectsResolved(true);
                        },
                        timeout < 0 ? 0 : timeout
                    );
                }
            } catch (error) {
                console.error('Error initializing app:', error);
                // Даже в случае ошибки, нужно убрать экран загрузки
                setUserResolved(true);
                setProjectsResolved(true);
            }
        };

        initialize();
    }, [userStore.user$.isResolved]);

    // Дополнительная страховка: если загрузка занимает слишком много времени, убираем экран загрузки
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!userResolved || !projectsResolved) {
                setUserResolved(true);
                setProjectsResolved(true);
            }
        }, 5000); // Установите подходящий таймаут (например, 5 секунд)

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        if (userResolved && ref.current) {
            ref.current.style.opacity = '0';
        }
    }, [userResolved]);

    const isInitialized = userResolved && projectsResolved;

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
                in={!isInitialized}
            >
                <TonConsoleIcon ref={ref} transition="opacity 0.1s linear" h="64px" w="64px" />
            </Center>
            <Box
                overflow={isInitialized ? 'auto' : 'hidden'}
                h="100%"
                maxH={isInitialized ? 'unset' : '100%'}
            >
                {props.children}
            </Box>
        </>
    );
};

export default observer(AppInitialization);
