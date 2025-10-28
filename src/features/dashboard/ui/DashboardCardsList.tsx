import { FC } from 'react';
import { BoxProps, Center, Grid, GridItem, Spinner } from '@chakra-ui/react';
import { DashboardTierCard } from '../../tonapi';
import { useSelectedRestApiTier } from 'src/features/tonapi/pricing/model/queries';

const DashboardCardsList: FC<BoxProps> = props => {
    const { data: selectedTier, isLoading } = useSelectedRestApiTier();

    if (isLoading) {
        return (
            <Center h="78px" {...props}>
                <Spinner />
            </Center>
        );
    }

    return (
        <Grid gridTemplate="1fr / repeat(4, 1fr)" {...props}>
            {selectedTier && (
                <GridItem
                    gridColumn={
                        selectedTier.price.amount.isZero()
                            ? 'unset'
                            : 'span 2'
                    }
                >
                    <DashboardTierCard tier={selectedTier} />
                </GridItem>
            )}
        </Grid>
    );
};

export default DashboardCardsList;
