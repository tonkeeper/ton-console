import { FC } from 'react';
import { BoxProps, Center, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { DashboardTierCard } from '../../tonapi';
import { restApiTiersStore } from 'src/shared/stores';
import { observer } from 'mobx-react-lite';

const DashboardCardsList: FC<BoxProps> = props => {
    if (!restApiTiersStore.selectedTier$.isResolved) {
        return (
            <Center h="78px" {...props}>
                <Spinner />
            </Center>
        );
    }

    return (
        <Grid gridTemplate="1fr / repeat(4, 1fr)" {...props}>
            {restApiTiersStore.selectedTier$.value && (
                <GridItem
                    gridColumn={
                        restApiTiersStore.selectedTier$.value?.price.amount.isZero()
                            ? 'unset'
                            : 'span 2'
                    }
                >
                    <DashboardTierCard tier={restApiTiersStore.selectedTier$.value} />
                </GridItem>
            )}
        </Grid>
    );
};

export default observer(DashboardCardsList);
