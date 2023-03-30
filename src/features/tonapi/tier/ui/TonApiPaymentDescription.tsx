import { FunctionComponent, useMemo } from 'react';
import { ITonApiPaymentDescription, tonApiTiersStore } from '../model/';
import { chakra } from '@chakra-ui/react';
import type { SystemProps } from '@chakra-ui/styled-system';
import { observer } from 'mobx-react-lite';

const TonApiPaymentDescription: FunctionComponent<
    {
        description: ITonApiPaymentDescription;
    } & SystemProps
> = ({ description, ...rest }) => {
    const tierName = useMemo(() => {
        const tier = tonApiTiersStore.tiers.find(item => item.id === description.tierId);
        return tier?.name || '';
    }, [tonApiTiersStore.tiers, description]);

    return <chakra.span {...rest}>TON API{tierName ? ` «${tierName}»` : ''}</chakra.span>;
};

export default observer(TonApiPaymentDescription);
