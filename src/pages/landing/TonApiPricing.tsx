import { forwardRef } from 'react';
import { Box, BoxProps, Divider } from '@chakra-ui/react';  
import { H3 } from 'src/shared';
import { RestApiTiersSection, LiteserversTiersSection, WebhooksPricingSection } from 'src/features/tonapi/pricing';

const TonApiPricing = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    return (
        <Box {...props} ref={ref}>
            <H3 mb={{ base: '5', md: '7' }} textAlign={{ base: 'left', md: 'center' }}>
                TON API Pricing
            </H3>
            
            <Box maxW="960px" mx="auto">
                <RestApiTiersSection />
                <Divider my="8" />
                <LiteserversTiersSection />
                <Divider my="8" />
                <WebhooksPricingSection />
            </Box>
        </Box>
    );
});

TonApiPricing.displayName = 'TonApiPricing';

export default TonApiPricing;
