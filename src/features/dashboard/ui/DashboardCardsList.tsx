import { ComponentProps, FunctionComponent } from 'react';
import { Box, Center, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { DashboardTierCard } from '../../tonapi';
import { tonApiTiersStore } from 'src/features';
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
            <GridItem gridColumn={tonApiTiersStore.selectedTier$.value ? 'span 2' : 'unset'}>
                <DashboardTierCard tier={tonApiTiersStore.selectedTier$.value} />
            </GridItem>
        </Grid>
    );
};

export default observer(DashboardCardsList);
