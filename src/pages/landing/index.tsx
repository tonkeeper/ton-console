import { FunctionComponent, useRef } from 'react';
import { ButtonLink, DocsIcon16, EXTERNAL_LINKS, H1, H2, H3, Overlay, TgIcon } from 'src/shared';
import { Button, Flex, Text, useBreakpointValue } from '@chakra-ui/react';
import { tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import TonApiPricing from './TonApiPricing';
import { Footer } from 'src/widgets';
import { FeaturesList } from 'src/features';

const LandingPage: FunctionComponent = () => {
    const tonapiRef = useRef<HTMLDivElement | null>(null);

    const onTonapiClick = (): void => {
        tonapiRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
                    <Heading mb="5">Connecting businesses to the TON ecosystem</Heading>
                    <Text textStyle="body1" mb={{ base: 8, md: 10 }} color="text.secondary">
                        Launch a successful business with the TON blockchain: manage Dapps, tokens,
                        and payments in just one place with a deeply integrated commercial API
                    </Text>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap="3"
                        w={{ base: '100%', md: 'auto' }}
                    >
                        <Button
                            isLoading={tGUserStore.user$.isLoading}
                            leftIcon={<TgIcon color="constant.white" />}
                            onClick={() => tGUserStore.login()}
                            variant="primary"
                        >
                            Connect and Try
                        </Button>
                        <ButtonLink
                            leftIcon={<DocsIcon16 />}
                            href={EXTERNAL_LINKS.DOCUMENTATION}
                            isExternal
                            variant="secondary"
                        >
                            Documentation
                        </ButtonLink>
                    </Flex>
                </Flex>
                <H3 mb={{ base: '5', md: '7' }} alignSelf={{ base: 'flex-start', md: 'center' }}>
                    Features
                </H3>
                <FeaturesList onTonapiClick={onTonapiClick} mb={{ base: '48px', md: '88px' }} />
                <TonApiPricing ref={tonapiRef} w="100%" flex="1" mb={{ base: 8, md: 14 }} />
                <Footer gap="6" alignSelf={{ base: 'flex-start', md: 'center' }} />
            </Flex>
        </Overlay>
    );
};

export default observer(LandingPage);
