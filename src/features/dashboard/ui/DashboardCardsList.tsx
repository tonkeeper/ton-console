import { FC } from 'react';
import { BoxProps, Center, Flex, Spinner } from '@chakra-ui/react';
import { DashboardTierCard } from '../../tonapi';
import { useSelectedRestApiTier } from 'src/features/tonapi/pricing/model/queries';
import { useSelectedLiteproxyTier } from 'src/features/tonapi/liteproxy/model/queries';

const DashboardCardsList: FC<BoxProps> = props => {
    const { data: selectedRestApiTier, isLoading: isRestApiLoading } = useSelectedRestApiTier();
    const { data: selectedLiteproxyTier, isLoading: isLiteproxyLoading } =
        useSelectedLiteproxyTier();

    const isLoading = isRestApiLoading || isLiteproxyLoading;

    if (isLoading) {
        return (
            <Center h="78px" {...props}>
                <Spinner />
            </Center>
        );
    }

    return (
        <Flex wrap="wrap" gap="4" {...props}>
            {selectedRestApiTier && <DashboardTierCard tier={selectedRestApiTier} service="REST API" />}
            {selectedLiteproxyTier && (
                <DashboardTierCard
                    tier={{
                        name: selectedLiteproxyTier.name,
                        rps: selectedLiteproxyTier.rps,
                        renewsDate:
                            selectedLiteproxyTier.usd_price && selectedLiteproxyTier.next_payment
                                ? selectedLiteproxyTier.next_payment
                                : undefined
                    }}
                    service="Liteservers"
                />
            )}
        </Flex>
    );
};

export default DashboardCardsList;
