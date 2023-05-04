import { ComponentProps, FunctionComponent } from 'react';
import { Grid } from '@chakra-ui/react';
import { TonApiTierCard, tonApiTiersStore } from 'src/features';
import { observer } from 'mobx-react-lite';
import { H3Thin } from 'src/shared';

const TonApiPricing: FunctionComponent<ComponentProps<typeof Grid>> = props => {
    return (
        <Grid
            gap="4"
            {...props}
            justify="center"
            templateColumns="repeat(4, 1fr)"
            w="100%"
            gridTemplate={{
                base: 'auto / 1fr',
                lg: '1fr 1fr / 1fr 1fr',
                xl: '1fr / repeat(4, 1fr)'
            }}
        >
            {tonApiTiersStore.tiers$.value.map(tier => (
                <TonApiTierCard
                    tier={tier}
                    key={tier.id}
                    variant="elevated"
                    tonPriceStyles={{ mt: '1', mb: '6', textStyle: 'h3Thin' }}
                    zeroTonPricePlaceholder={
                        <H3Thin mb="6" mt="1" color="text.secondary">
                            Forever
                        </H3Thin>
                    }
                />
            ))}
        </Grid>
    );
};

export default observer(TonApiPricing);
