import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { RestApiTiersSection } from './RestApiTiersSection';
import { LiteserversTiersSection } from './LiteserversTiersSection';
import { WebhooksPricingSection } from './WebhooksPricingSection';

const TonApiTiers: FC = () => {
    return (
        <>
            <RestApiTiersSection />
            <LiteserversTiersSection />
            <WebhooksPricingSection />
        </>
    );
};

export default observer(TonApiTiers);
