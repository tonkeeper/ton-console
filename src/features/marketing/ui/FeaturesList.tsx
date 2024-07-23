import { ComponentProps, FunctionComponent } from 'react';
import { Box, Button, SimpleGrid } from '@chakra-ui/react';
import { FeatureCard } from './FeatureCard';
import { ButtonLink, EXTERNAL_LINKS } from 'src/shared';
import { userStore } from 'src/entities';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

const FeaturesList: FunctionComponent<
    ComponentProps<typeof Box> & { onTonapiClick?: () => void; isContrast?: boolean }
> = ({ onTonapiClick, isContrast, ...rest }) => {
    const navigate = useNavigate();

    const loginAndNavigateTo = async (path: string): Promise<void> => {
        if (userStore.user$.value) {
            return navigate(path);
        }

        const result = await userStore.login();

        if (result) {
            navigate(path);
        }
    };

    const buttonVariant = isContrast ? 'secondary' : 'overlay';

    return (
        <SimpleGrid
            gridTemplateColumns="repeat(auto-fit, minmax(min(100%/1, max(450px, 100%/3)), 1fr))"
            spacing="4"
            {...rest}
        >
            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-on-ramp.webp"
                heading="On-Ramp"
                description="Put your exchange, payment solution, or DEX under the Buy button on Tonkeeper and get over a million new customers for your service."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become Partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                src="/assets/images/tonkeeper-browser.webp"
                heading="Tonkeeper Browser"
                description="Over 500K click a month via the Tonkeeper app catalog and monthly payments."
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
                heading="NFT Themes"
                description="Customize Tonkeeper with your NFTs."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become Partner
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
                    Become Partner
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
                    Become Partner
                </ButtonLink>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                src="/assets/images/tonkeeper-activity.webp"
                heading="Tonkeeper Messages"
                description="You can significantly increase the user retention and conversion rate for your decentralized applications. Tonkeeper Messages is a convenient and trusted way to message the highly motivated audience of Tonkeeper."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button
                    isLoading={userStore.user$.isLoading}
                    onClick={() => loginAndNavigateTo('/tonkeeper-messages')}
                    variant={buttonVariant}
                >
                    {userStore.user$.value ? 'Open' : 'Connect and Try'}
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
                    isLoading={userStore.user$.isLoading}
                    onClick={() => loginAndNavigateTo('/invoices')}
                    variant={buttonVariant}
                >
                    {userStore.user$.value ? 'Open' : 'Connect and Try'}
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
                description="Build on TON. Easy."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button
                    isLoading={userStore.user$.isLoading}
                    onClick={() => loginAndNavigateTo('/tonapi')}
                    variant={buttonVariant}
                >
                    {userStore.user$.value ? 'Open' : 'Connect and Try'}
                </Button>
                {!userStore.user$.value && (
                    <Button onClick={onTonapiClick} variant={buttonVariant}>
                        See Prices
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
                heading="Custom Pages"
                description="Promote your own project through most convenient blockchain explorer in the TON ecosystem."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become Partner
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
                description="Add a custom widget with stats and actions to your decentralized app."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become Partner
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
                heading="Premium Partnership"
                description="Get unique offers for your project: Ton Apps provides exclusive terms for a limited number of partners."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <ButtonLink variant={buttonVariant} href={EXTERNAL_LINKS.SUPPORT} isExternal>
                    Become Partner
                </ButtonLink>
            </FeatureCard>
        </SimpleGrid>
    );
};

export default observer(FeaturesList);
