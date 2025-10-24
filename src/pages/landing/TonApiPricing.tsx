import { ComponentProps, FC } from 'react';
import { Box, forwardRef, Grid } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { H3 } from 'src/shared';
import { restApiTiersStore } from 'src/shared/stores';
import { RestApiTierCard, RestApiUnlimitedTierCard } from 'src/features/tonapi/pricing';

const TonApiPricing: FC<ComponentProps<typeof Box>> = forwardRef((props, ref) => {
    if (!restApiTiersStore?.tiers$.isResolved) {
        return null;
    }

    return (
        <Box {...props} ref={ref}>
            <H3 mb={{ base: '5', md: '7' }} textAlign={{ base: 'left', md: 'center' }}>
                TON API Pricing
            </H3>
            <Grid gap="4" templateColumns="repeat(auto-fit, minmax(300px, 1fr))" w="100%">
                {restApiTiersStore.tiers$.value.map(tier => (
                    <RestApiTierCard
                        tier={tier}
                        key={tier.id}
                        variant="elevated"
                        tonPriceStyles={{ mt: '1', mb: '6' }}
                    />
                ))}

                <RestApiUnlimitedTierCard h="100%" variant="elevated" />
            </Grid>
        </Box>
    );
});

export default observer(TonApiPricing);
