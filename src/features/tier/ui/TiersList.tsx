import { FunctionComponent } from 'react';
import { observer } from 'mobx-react-lite';
import { TierCard, tiersStore } from 'src/entities';
import { Button, Flex } from '@chakra-ui/react';

const TiersList_: FunctionComponent = () => {
    if (tiersStore.isLoading) {
        return null;
    }

    return (
        <Flex gap="4">
            {tiersStore.tiers.map(tier => (
                <TierCard
                    key={tier.id}
                    tier={tier}
                    flex="1"
                    button={
                        <Button w="100%" variant={tier.name === 'Pro' ? 'primary' : 'secondary'}>
                            Choose {tier.name}
                        </Button>
                    }
                />
            ))}
        </Flex>
    );
};

export const TiersList = observer(TiersList_);
