import { FunctionComponent, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Flex } from '@chakra-ui/react';
import { TonApiPaymentDetailsModal } from './TonApiPaymentDetailsModal';
import { TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';

const TonApiTiersList: FunctionComponent = () => {
    const [selectedTier, setSelectedTier] = useState<TonApiTier | undefined>(undefined);

    const onClose = useCallback((confirm?: boolean) => {
        setSelectedTier(undefined);
        console.log(confirm);
    }, []);

    if (tonApiTiersStore.tiers.isLoading) {
        return null;
    }

    return (
        <>
            <Flex gap="4">
                {tonApiTiersStore.tiers.value.map(tier => {
                    const isCurrentSubscription =
                        tonApiTiersStore.selectedTier.value?.id === tier.id;

                    return (
                        <TonApiTierCard
                            key={tier.id}
                            tier={
                                isCurrentSubscription ? tonApiTiersStore.selectedTier.value! : tier
                            }
                            flex="1"
                            button={
                                isCurrentSubscription ? (
                                    <Button w="100%" variant="secondary">
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button
                                        w="100%"
                                        onClick={() => setSelectedTier(tier)}
                                        variant={tier.name === 'Pro' ? 'primary' : 'secondary'}
                                    >
                                        Choose {tier.name}
                                    </Button>
                                )
                            }
                        />
                    );
                })}
            </Flex>
            <TonApiPaymentDetailsModal
                isOpen={!!selectedTier}
                onClose={onClose}
                tier={selectedTier}
            />
        </>
    );
};

export default observer(TonApiTiersList);
