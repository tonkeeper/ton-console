import { FC } from 'react';
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

export default TonApiTiers;
