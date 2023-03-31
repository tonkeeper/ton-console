import { FunctionComponent, useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Flex } from '@chakra-ui/react';
import { TonApiPaymentDetailsModal } from './TonApiPaymentDetailsModal';
import { ITonApiSubscription, TonApiTier, tonApiTiersStore } from '../model';
import { TonApiTierCard } from './TonApiTierCard';
import { projectsStore, SERVICE } from 'src/entities';

const TonApiTiersList: FunctionComponent = () => {
    const [selectedTier, setSelectedTier] = useState<TonApiTier | undefined>(undefined);

    const onClose = useCallback((confirm?: boolean) => {
        setSelectedTier(undefined);
        console.log(confirm);
    }, []);

    const currentSubscription = useMemo(() => {
        return projectsStore.selectedProject!.subscriptions.find(
            item => item.details.service === SERVICE.TONAPI
        ) as ITonApiSubscription | undefined;
    }, [projectsStore.selectedProject]);

    if (tonApiTiersStore.isLoading) {
        return null;
    }

    return (
        <>
            <Flex gap="4">
                {tonApiTiersStore.tiers.map(tier => {
                    const isCurrentSubscription = currentSubscription?.details.tierId === tier.id;

                    return (
                        <TonApiTierCard
                            key={tier.id}
                            tier={tier}
                            subscription={isCurrentSubscription ? currentSubscription : undefined}
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
