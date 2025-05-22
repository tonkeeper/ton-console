import { ComponentProps, FunctionComponent } from 'react';
import { Card } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { DappCard } from 'src/entities';
import { dappStore } from 'src/shared/stores';

const CurrentDappCard: FunctionComponent<
    ComponentProps<typeof Card> & { withMenu?: boolean }
> = props => {
    const dapp = dappStore.dapps$.value[0];

    if (!dapp) {
        return null;
    }

    return <DappCard {...props} dapp={dapp} />;
};

export default observer(CurrentDappCard);
