import { ComponentProps, FunctionComponent } from 'react';
import { Box, Center, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { DashboardTierCard } from '../../tonapi';
import { tonApiTiersStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';

const DashboardCardsList: FunctionComponent<ComponentProps<typeof Box>> = props => {
    if (!tonApiTiersStore.selectedTier$.isResolved) {
        return (
            <Center h="78px" {...props}>
                <Spinner />
            </Center>
        );
    }

    return (
        <Grid gridTemplate="1fr / repeat(4, 1fr)" {...props}>
            {tonApiTiersStore.selectedTier$.value && (
                <GridItem
                    gridColumn={
                        tonApiTiersStore.selectedTier$.value?.price.amount.isZero()
                            ? 'unset'
                            : 'span 2'
                    }
                >
                    <DashboardTierCard tier={tonApiTiersStore.selectedTier$.value} />
                </GridItem>
            )}
        </Grid>
    );
};

export default observer(DashboardCardsList);
