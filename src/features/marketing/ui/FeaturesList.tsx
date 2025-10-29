import { FC } from 'react';
import { BoxProps, Button, SimpleGrid } from '@chakra-ui/react';
import { FeatureCard } from './FeatureCard';
import { userStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { openFeedbackModal } from 'src/features/feedback/model/feedback';

const FeaturesList: FC<BoxProps & { onTonapiClick?: () => void; isContrast?: boolean }> = ({
    onTonapiClick,
    isContrast,
    ...rest
}) => {
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
            columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
            spacing="3"
            {...rest}
        >
            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-on-ramp.webp"
                heading="On-Ramp"
                description="Place your exchange, payment solution, or DEX under Tonkeeper’s Buy button and reach 1M+ buyers"
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button onClick={openFeedbackModal('on-ramp')} variant={buttonVariant}>
                    Become Partner
                </Button>
            </FeatureCard>

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                src="/assets/images/tonkeeper-browser.webp"
                heading="Tonkeeper Browser"
                description="Get 500K+ monthly clicks from Tonkeeper’s app catalog and turn subscribers into repeat revenue."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button onClick={openFeedbackModal('tonkeeper-browser')} variant={buttonVariant}>
                    Request Slot
                </Button>
            </FeatureCard>

            {/* <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #5C92FF 0%, #3D7EFF 100%)"
                src="/assets/images/tonkeeper-NFT.webp"
                heading="NFT Themes"
                description="Customize Tonkeeper with your NFTs."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button onClick={openFeedbackModal('nft-themes')} variant={buttonVariant}>
                    Become Partner
                </Button>
            </FeatureCard> */}

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-swap.webp"
                heading="Swap"
                description="Feature your DEX inside Tonkeeper Swap and convert wallet traffic directly into trades"
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button onClick={openFeedbackModal('swap')} variant={buttonVariant}>
                    Become Partner
                </Button>
            </FeatureCard>

            {/* <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2E3847 0%, #28303D 100%)"
                src="/assets/images/tonkeeper-price-graph.webp"
                heading="Token Stats & Prices"
                description="Add a chart for your token on Tonkeeper: unlock exclusive customization for your holders' UX."
                imgBorder
                imgHeight="100%"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button onClick={openFeedbackModal('token-stats')} variant={buttonVariant}>
                    Become Partner
                </Button>
            </FeatureCard> */}

            <FeatureCard
                h="100%"
                background="linear-gradient(104deg, #2EA5FF 0%, #0F97FF 100%)"
                src="/assets/images/tonkeeper-activity.webp"
                heading="Tonkeeper Messages"
                description="Send trusted in-wallet messages to Tonkeeper’s high-intent users to boost retention and conversion"
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
                description="Track and manage TON transactions with a simple, powerful payments service built for reliability"
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
                description="Build on TON with a clean, scalable API that’s fast, reliable, and developer-friendly"
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

            {/* <FeatureCard
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
                description="Promote your own project through most convenient blockchain&nbsp;explorer in the TON ecosystem."
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button
                    onClick={openFeedbackModal('tonviewer-custom-pages')}
                    variant={buttonVariant}
                >
                    Become Partner
                </Button>
            </FeatureCard> */}

            {/* <FeatureCard
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
                <Button onClick={openFeedbackModal('tonviewer-app-widget')} variant={buttonVariant}>
                    Become Partner
                </Button>
            </FeatureCard> */}

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
                description="Access exclusive terms and co-marketing—Ton Apps supports a limited set of high-potential partners"
                {...(isContrast && { backgroundColor: 'background.content' })}
            >
                <Button onClick={openFeedbackModal('premium-partnership')} variant={buttonVariant}>
                    Request Partnership
                </Button>
            </FeatureCard>
        </SimpleGrid>
    );
};

export default observer(FeaturesList);
