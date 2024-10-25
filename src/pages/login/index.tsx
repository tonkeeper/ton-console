import { FC } from 'react';
import { H2, H3, Overlay, TgIcon } from 'src/shared';
import { Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { Footer } from 'src/widgets';
import { useLocation } from 'react-router-dom';
import { SERVICE_NAMES, SERVICE } from 'src/entities/service/SERVICES';
import { userStore } from 'src/entities';

const LoginPage: FC = () => {
    const location = useLocation();
    const firstSegment = location.pathname.split('/')[1];

    const serviceName = SERVICE_NAMES[firstSegment as SERVICE] as string | undefined;

    const Heading = useBreakpointValue({
        md: H2,
        base: H3
    })!;

    return (
        <Overlay pt="0">
            <Flex align="center" direction="column" maxW="1440px" h="100%" mx="auto">
                <Flex
                    align="center"
                    justify="center"
                    direction="column"
                    flex="1"
                    maxW="648px"
                    mx="auto"
                    pt={{ base: 10, md: 18, lg: 8 }}
                    pb={{ base: 12, md: 14 }}
                    textAlign={{ base: 'start', md: 'center' }}
                >
                    <Heading mb="5">
                        {serviceName ? `Sign in to access ${serviceName} service` : 'Connect'}
                    </Heading>
                    <Text textStyle="body1" mb={{ base: 8, md: 10 }} color="text.secondary">
                        Please connect to your account to start using the service
                    </Text>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap="3"
                        w={{ base: '100%', md: 'auto' }}
                    >
                        <Button
                            isLoading={userStore.user$.isLoading}
                            leftIcon={<TgIcon color="constant.white" />}
                            onClick={() => userStore.login()}
                            size="lg"
                            variant="primary"
                        >
                            Connect to Ton Console
                        </Button>
                    </Flex>
                </Flex>
                <H3
                    mt="auto"
                    mb={{ base: '5', md: '7' }}
                    alignSelf={{ base: 'flex-start', md: 'center' }}
                >
                    Features
                </H3>
                <Footer gap="6" alignSelf={{ base: 'flex-start', md: 'center' }} mb="6" />
            </Flex>
        </Overlay>
    );
};

export default observer(LoginPage);
