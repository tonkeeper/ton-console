import { FC } from 'react';
import { CardProps } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { DappCard } from 'src/entities';
import { dappStore } from 'src/shared/stores';

const CurrentDappCard: FC<
    CardProps & { withMenu?: boolean }
> = props => {
    const dapp = dappStore.dapps$.value[0];

    if (!dapp) {
        return null;
    }

    return <DappCard {...props} dapp={dapp} />;
};

export default observer(CurrentDappCard);
