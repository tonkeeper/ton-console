import { FunctionComponent } from 'react';
import { H1, H2, H3, Overlay, TgIcon } from 'src/shared';
import { Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { userStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { Footer } from 'src/widgets';

const LoginPage: FunctionComponent = () => {
    const Heading = useBreakpointValue({
        md: H1,
        base: H2
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
                    maxH="600px"
                    mx="auto"
                    pt={{ base: 10, md: 18, lg: 8 }}
                    pb={{ base: 12, md: 14 }}
                    textAlign={{ base: 'start', md: 'center' }}
                >
                    <Heading mb="5">Connect</Heading>
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
                <H3 mb={{ base: '5', md: '7' }} alignSelf={{ base: 'flex-start', md: 'center' }}>
                    Features
                </H3>
                <Footer gap="6" alignSelf={{ base: 'flex-start', md: 'center' }} />
            </Flex>
        </Overlay>
    );
};

export default observer(LoginPage);
