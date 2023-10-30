import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import { FeatureCard } from './FeatureCard';
import { ButtonLink, EXTERNAL_LINKS } from 'src/shared';
import { tGUserStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const FeaturesList: FunctionComponent<
    ComponentProps<typeof Box> & { onTonapiClick?: () => void; isContrast?: boolean }
> = ({ onTonapiClick, isContrast, ...rest }) => {
    const navigate = useNavigate();

    const loginAndNavigateTo = async (path: string): Promise<void> => {
        if (tGUserStore.user$.value) {
            return navigate(path);
        }

        const result = await tGUserStore.login();

        if (result) {
            navigate(path);
        }
    };

    const buttonVariant = isContrast ? 'secondary' : 'overlay';

    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="4" {...rest}>
            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-on-ramp.webp"
                heading="On-Ramp"
                description="Put your exchange, payment solution, or DEX under the Buy button in Tonkeeper and get over a million new customers for your service."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                src="/assets/images/tonkeeper-browser.webp"
                heading="Tonkeeper Browser"
                description="Over 500K clicks per month through the Tonkeeper built-in app catalog. Monthly payments."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Request Slot
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #5C92FF 0%, #3D7EFF 100%)"
                src="/assets/images/tonkeeper-NFT.webp"
                heading="NFT Theme NFTs"
                description="Customize Tonkeeper with your NFTs."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-swap.webp"
                heading="Swap"
                description="Feature your DEX on Tonkeeper."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-price-graph.webp"
                heading="Token Stats & Prices"
                description="Add a chart for your token on Tonkeeper: unlock exclusive customization for your holders' UX."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                src="/assets/images/tonkeeper-activity.webp"
                heading="Tonkeeper Messages"
                description="You can significantly increase the user retention and conversion rate for your decentralized applications. Tonkeeper Messages is designed like a convenient and trusted way to message the highly motivated audience of Tonkeeper."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button
                    isLoading={tGUserStore.user$.isLoading}
                    onClick={() => loginAndNavigateTo('/tonkeeper-messages')}
                    variant={buttonVariant}
                >
                    {tGUserStore.user$.value ? 'Open' : 'Connect and try'}
                </Button>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                imgSources={[
                    {
                        media: '(max-width: 490px)',
                        srcSet: '/assets/images/invoices-m.webp'
                    }
                ]}
                imgHeight="194px"
                src="/assets/images/invoices.webp"
                heading="TON Payments"
                description="Keep track of your operations with TON Payments: a simple yet powerful service for managing TON transactions."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button
                    isLoading={tGUserStore.user$.isLoading}
                    onClick={() => loginAndNavigateTo('/invoices')}
                    variant={buttonVariant}
                >
                    {tGUserStore.user$.value ? 'Open' : 'Connect and try'}
                </Button>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                imgSources={[
                    {
                        media: '(max-width: 1024px)',
                        srcSet: '/assets/images/tonapi-m.webp'
                    }
                ]}
                imgHeight="186px"
                src="/assets/images/tonapi.webp"
                heading="TON API"
                description="Build on TON with ease."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button
                    isLoading={tGUserStore.user$.isLoading}
                    onClick={() => loginAndNavigateTo('/tonapi')}
                    variant={buttonVariant}
                >
                    {tGUserStore.user$.value ? 'Open' : 'Connect and try'}
                </Button>
                {!tGUserStore.user$.value && (
                    <Button onClick={onTonapiClick} variant={buttonVariant}>
                        Choose Plan
                    </Button>
                )}
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                imgSources={[
                    {
                        media: '(max-width: 490px)',
                        srcSet: '/assets/images/tonviewer-pages-m.webp'
                    }
                ]}
                imgHeight="142px"
                src="/assets/images/tonviewer-pages.webp"
                heading="Customized Pages"
                description="Promote your own project through most convenient blockchain explorer in the TON ecosystem."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%);"
                imgSources={[
                    {
                        media: '(max-width: 490px)',
                        srcSet: '/assets/images/tonviewer-widget-m.webp'
                    }
                ]}
                imgHeight="194px"
                src="/assets/images/tonviewer-widget.webp"
                heading="App Widget on Tonviewer"
                description="Add custom widget with stats and actions to your decentralized app."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%);"
                imgSources={[
                    {
                        media: '(max-width: 490px)',
                        srcSet: '/assets/images/partnerships-m.webp'
                    }
                ]}
                imgHeight={{ base: '184px', md: '84px' }}
                src="/assets/images/partnerships.webp"
                heading="Premium Partnerships"
                description="Get unique offers specifically for your project — Ton Apps provides exclusive terms for a limited circle of partners."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become a partner
                </ButtonLink>
            </FeatureCard>
        </SimpleGrid>
    );
};

export default observer(FeaturesList);
