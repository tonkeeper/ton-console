import { FunctionComponent, useCallback, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Tier, TierCard, tiersStore } from 'src/entities';
import { Button, Flex } from '@chakra-ui/react';
import { PaymentDetailsModal } from './PaymentDetailsModal';

const TiersList_: FunctionComponent = () => {
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

    const onClose = useCallback((confirm?: boolean) => {
        setSelectedTier(null);
        console.log(confirm);
    }, []);

    if (tiersStore.isLoading) {
        return null;
    }

    return (
        <>
            <Flex gap="4">
                {tiersStore.tiers.map(tier => (
                    <TierCard
                        key={tier.id}
                        tier={tier}
                        flex="1"
                        button={
                            <Button
                                w="100%"
                                onClick={() => setSelectedTier(tier)}
                                variant={tier.name === 'Pro' ? 'primary' : 'secondary'}
                            >
                                Choose {tier.name}
                            </Button>
                        }
                    />
                ))}
            </Flex>
            {selectedTier && (
                <PaymentDetailsModal
                    isOpen={!!selectedTier}
                    onClose={onClose}
                    tier={selectedTier}
                />
            )}
        </>
    );
};

export const TiersList = observer(TiersList_);
