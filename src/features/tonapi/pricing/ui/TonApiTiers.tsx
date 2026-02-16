import { FC } from 'react';
import { Divider, Show } from '@chakra-ui/react';
import { RestApiTiersSection } from './RestApiTiersSection';
import { LiteserversTiersSection } from './LiteserversTiersSection';
import { WebhooksPricingSection } from './WebhooksPricingSection';

const TonApiTiers: FC = () => {
    return (
        <>
            <RestApiTiersSection />
            <Show below="md">
                <Divider my="4" />
            </Show>
            <LiteserversTiersSection />
            <Show below="md">
                <Divider my="4" />
            </Show>
            <WebhooksPricingSection />
        </>
    );
};

export default TonApiTiers;
