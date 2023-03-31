import { FunctionComponent, useMemo } from 'react';
import { ITonApiSubscriptionDetails, tonApiTiersStore } from '../model/';
import { chakra } from '@chakra-ui/react';
import type { SystemProps } from '@chakra-ui/styled-system';
import { observer } from 'mobx-react-lite';

const TonApiSubscriptionDetails: FunctionComponent<
    {
        details: ITonApiSubscriptionDetails;
    } & SystemProps
> = ({ details, ...rest }) => {
    const tierName = useMemo(() => {
        const tier = tonApiTiersStore.tiers.find(item => item.id === details.tierId);
        return tier?.name || '';
    }, [tonApiTiersStore.tiers, details]);

    return <chakra.span {...rest}>TON API{tierName ? ` «${tierName}»` : ''}</chakra.span>;
};

export default observer(TonApiSubscriptionDetails);
