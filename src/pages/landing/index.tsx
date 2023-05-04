import { ComponentProps, FunctionComponent, useEffect, useState } from 'react';
import { ButtonLink, DocsIcon16, EXTERNAL_LINKS, H1, H2, H3, Overlay, TgIcon } from 'src/shared';
import { Button, Flex, SlideFade, Text, useBreakpointValue } from '@chakra-ui/react';
import { tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import TonApiPricing from './TonApiPricing';
import { Footer } from 'src/widgets';

const SlideFadeTransition: FunctionComponent<ComponentProps<typeof SlideFade>> = props => (
    <SlideFade transition={{ enter: { duration: 0.5 } }} {...props} />
);

const LandingPage: FunctionComponent = () => {
    const Heading = useBreakpointValue({
        md: H1,
        base: H2
    })!;

    const [isOpen, seIsOpen] = useState(false);
    useEffect(() => seIsOpen(true), []);

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
                    pb={{ base: 12, md: 15, lg: 8 }}
                    textAlign={{ base: 'start', md: 'center' }}
                >
                    <Heading mb="5">Connecting businesses to the TON ecosystem</Heading>
                    <Text textStyle="body1" mb={{ base: 8, md: 10 }} color="text.secondary">
                        Launch a successful business with TON blockchain: manage dapps, tokens and
                        payments in one place with powerful API and deep commercial integrations
                    </Text>
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap="3"
                        w={{ base: '100%', md: 'auto' }}
                    >
                        <Button
                            isLoading={tGUserStore.user$.isLoading}
                            leftIcon={<TgIcon color="constant.white" />}
                            onClick={tGUserStore.login}
                            variant="primary"
                        >
                            Connect and try
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
                <H3 mb="7">Pricing</H3>
                <TonApiPricing
                    as={SlideFadeTransition}
                    w="100%"
                    in={isOpen}
                    offsetY="-10px"
                    mb={{ base: 8, md: 14, lg: 16 }}
                    px={{ base: 0, md: 10 }}
                />
                <Footer gap="6" />
            </Flex>
        </Overlay>
    );
};

export default observer(LandingPage);
