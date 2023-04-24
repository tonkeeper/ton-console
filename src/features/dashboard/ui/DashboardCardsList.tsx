import { ComponentProps, FunctionComponent } from 'react';
import { Box, Grid, GridItem } from '@chakra-ui/react';
import { DashboardTierCard } from './DashboardTierCard';
import { tonApiTiersStore } from 'src/features';
import { observer } from 'mobx-react-lite';

const DashboardCardsList: FunctionComponent<ComponentProps<typeof Box>> = props => {
    return (
        <Grid gridTemplate="1fr / repeat(4, 1fr)" {...props}>
            <GridItem gridColumn={tonApiTiersStore.selectedTier$.value ? 'span 2' : 'unset'}>
                <DashboardTierCard tier={tonApiTiersStore.selectedTier$.value} />
            </GridItem>
        </Grid>
    );
};

export default observer(DashboardCardsList);
