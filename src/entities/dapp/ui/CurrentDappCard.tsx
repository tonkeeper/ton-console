import { FC } from 'react';
import { CardProps } from '@chakra-ui/react';
import { DappCard } from 'src/entities';
import { useDappsQuery } from '../model/queries';

const CurrentDappCard: FC<CardProps & { withMenu?: boolean }> = props => {
    const { data: dapps } = useDappsQuery();
    const dapp = dapps?.[0];

    if (!dapp) {
        return null;
    }

    return <DappCard {...props} dapp={dapp} />;
};

export default CurrentDappCard;
