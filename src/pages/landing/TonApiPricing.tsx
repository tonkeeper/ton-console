import { ComponentProps, FunctionComponent } from 'react';
import { Box, forwardRef, Grid } from '@chakra-ui/react';
import { TonApiTierCard, tonApiTiersStore, TonApiUnlimitedTierCard } from 'src/features';
import { observer } from 'mobx-react-lite';
import { H3, H3Thin } from 'src/shared';

const TonApiPricing: FunctionComponent<ComponentProps<typeof Box>> = forwardRef((props, ref) => {
    if (!tonApiTiersStore.tiers$.isResolved) {
        return null;
    }

    return (
        <Box {...props} ref={ref}>
            <H3 mb={{ base: '5', md: '7' }} textAlign={{ base: 'left', md: 'center' }}>
                TON API Pricing
            </H3>
            <Grid
                gap="4"
                autoRows="1fr"
                templateColumns="repeat(auto-fit, minmax(300px, 1fr))"
                w="100%"
            >
                {tonApiTiersStore.tiers$.value.map(tier => (
                    <TonApiTierCard
                        tier={tier}
                        key={tier.id}
                        variant="elevated"
                        tonPriceStyles={{ mt: '1', mb: '6', textStyle: 'h3Thin' }}
                        zeroTonPricePlaceholder={<H3Thin mb="6" mt="1" color="text.secondary" />}
                    />
                ))}

                <TonApiUnlimitedTierCard
                    h="100%"
                    variant="elevated"
                    buttonProps={{ variant: 'contrast' }}
                />
            </Grid>
        </Box>
    );
});

export default observer(TonApiPricing);
